import os
import sys

# Add Arduino CLI to PATH FIRST (before any other imports)
ARDUINO_BIN = "/app/.arduino/bin"
os.environ['PATH'] = f"{ARDUINO_BIN}:{os.environ.get('PATH', '')}"
os.environ['ARDUINO_DATA_DIR'] = "/app/.arduino/data"
os.environ['ARDUINO_SKETCHBOOK_DIR'] = "/app/.arduino/sketchbook"

print("🚀 Starting ESP32 Academy API...")
print(f"📍 Python executable: {sys.executable}")
print(f"🔧 PATH: {os.environ['PATH'][:200]}...")
print(f"🎯 PORT: {os.getenv('PORT', '8000')}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import shutil
from pathlib import Path
import base64

app = FastAPI(title="ESP32 Academy API")

# Debug: Check Arduino CLI installation
try:
    result = subprocess.run(['arduino-cli', 'version'], capture_output=True, text=True)
    print(f"✅ Arduino CLI found: {result.stdout.strip()}")
    
    # Check installed boards
    boards_result = subprocess.run(['arduino-cli', 'core', 'list'], capture_output=True, text=True)
    print(f"📦 Installed boards:\n{boards_result.stdout}")
except Exception as e:
    print(f"❌ Arduino CLI check failed: {e}")

# CORS - allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Build directory
BUILD_DIR = Path("builds")
BUILD_DIR.mkdir(exist_ok=True)

class CompileRequest(BaseModel):
    code: str

@app.get("/")
async def root():
    return {
        "message": "ESP32 Academy API",
        "status": "running",
        "version": "1.0"
    }

@app.post("/api/compile")
async def compile_code(request: CompileRequest):
    """Compile Arduino code and return binary files as base64"""
    
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    # Create temporary sketch directory
    sketch_dir = tempfile.mkdtemp(dir=BUILD_DIR)
    folder_name = os.path.basename(sketch_dir)
    ino_path = os.path.join(sketch_dir, f"{folder_name}.ino")
    
    try:
        # Write code to .ino file
        with open(ino_path, "w", encoding="utf-8") as f:
            f.write(request.code)
        
        # Compile using Arduino CLI
        fqbn = "esp32:esp32:axiometa_pixie_m1:CDCOnBoot=cdc"
        compile_cmd = [
            "arduino-cli", "compile",
            "--fqbn", fqbn,
            "--output-dir", sketch_dir,
            sketch_dir
        ]
        
        result = subprocess.run(
            compile_cmd,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Compilation failed: {result.stderr}"
            )
        
        # Find and encode binary files
        binaries = {}
        
        # Look for merged binary first (easiest - contains everything)
        merged_bin = Path(sketch_dir) / f"{folder_name}.ino.merged.bin"
        if merged_bin.exists():
            with open(merged_bin, "rb") as f:
                binaries["merged"] = {
                    "data": base64.b64encode(f.read()).decode(),
                    "offset": "0x0"
                }
        else:
            # Individual files
            bootloader = Path(sketch_dir) / f"{folder_name}.ino.bootloader.bin"
            partitions = Path(sketch_dir) / f"{folder_name}.ino.partitions.bin"
            app_bin = Path(sketch_dir) / f"{folder_name}.ino.bin"
            
            if bootloader.exists():
                with open(bootloader, "rb") as f:
                    binaries["bootloader"] = {
                        "data": base64.b64encode(f.read()).decode(),
                        "offset": "0x0"
                    }
            
            if partitions.exists():
                with open(partitions, "rb") as f:
                    binaries["partitions"] = {
                        "data": base64.b64encode(f.read()).decode(),
                        "offset": "0x8000"
                    }
            
            if app_bin.exists():
                with open(app_bin, "rb") as f:
                    binaries["application"] = {
                        "data": base64.b64encode(f.read()).decode(),
                        "offset": "0x10000"
                    }
        
        if not binaries:
            raise HTTPException(
                status_code=500,
                detail="No binary files generated"
            )
        
        return {
            "success": True,
            "binaries": binaries,
            "message": "Compilation successful"
        }
        
    except subprocess.TimeoutExpired:
        shutil.rmtree(sketch_dir, ignore_errors=True)
        raise HTTPException(
            status_code=408,
            detail="Compilation timed out"
        )
    except Exception as e:
        shutil.rmtree(sketch_dir, ignore_errors=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
