import os
import sys
import asyncio
from pathlib import Path

# Add Arduino CLI to PATH FIRST (before any other imports)
ARDUINO_BIN = "/app/.arduino/bin"
os.environ['PATH'] = f"{ARDUINO_BIN}:{os.environ.get('PATH', '')}"
os.environ['ARDUINO_DATA_DIR'] = "/app/.arduino/data"
os.environ['ARDUINO_SKETCHBOOK_DIR'] = "/app/.arduino/sketchbook"

print("🚀 Starting ESP32 Academy API...")
print(f"🔍 Python executable: {sys.executable}")
print(f"🔧 PATH: {os.environ['PATH'][:200]}...")
print(f"🎯 PORT: {os.getenv('PORT', '8000')}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import shutil
import base64

app = FastAPI(title="ESP32 Academy API")

# Global flag for Arduino CLI status
ARDUINO_CLI_READY = False
ARDUINO_CLI_ERROR = None

async def check_arduino_cli():
    """Check if Arduino CLI is ready, install ESP32 on first use"""
    global ARDUINO_CLI_READY, ARDUINO_CLI_ERROR
    
    try:
        result = subprocess.run(
            ['arduino-cli', 'version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"✅ Arduino CLI found: {result.stdout.strip()}")
            
            # Check if ESP32 is installed
            boards_result = subprocess.run(
                ['arduino-cli', 'core', 'list'],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if 'esp32:esp32' in boards_result.stdout:
                ARDUINO_CLI_READY = True
                print("✅ ESP32 support confirmed")
            else:
                # Install ESP32 on first use
                print("📦 Installing ESP32 core (first time only, 2-3 min)...")
                subprocess.run([
                    'arduino-cli', 'config', 'init',
                    '--additional-urls', 'https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json'
                ], check=True, timeout=30)
                subprocess.run(['arduino-cli', 'core', 'update-index'], check=True, timeout=60)
                subprocess.run(['arduino-cli', 'core', 'install', 'esp32:esp32'], check=True, timeout=300)
                ARDUINO_CLI_READY = True
                print("✅ ESP32 installed")
        else:
            ARDUINO_CLI_ERROR = "Arduino CLI not responding"
            
    except FileNotFoundError:
        ARDUINO_CLI_ERROR = "Arduino CLI not found - attempting installation..."
        print(f"⚠️ {ARDUINO_CLI_ERROR}")
        
        # Try to install in background
        try:
            install_script = Path("install-arduino-cli.sh")
            if install_script.exists():
                print("📦 Running Arduino CLI installation...")
                subprocess.Popen(
                    ['bash', str(install_script)],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
        except Exception as e:
            print(f"❌ Could not start installation: {e}")
            
    except Exception as e:
        ARDUINO_CLI_ERROR = f"Arduino CLI check failed: {e}"
        print(f"❌ {ARDUINO_CLI_ERROR}")

# Check Arduino CLI on startup (non-blocking)
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(check_arduino_cli())

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
        "status": "running" if ARDUINO_CLI_READY else "initializing",
        "arduino_cli": "ready" if ARDUINO_CLI_READY else "not ready",
        "error": ARDUINO_CLI_ERROR,
        "version": "1.1"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "arduino_ready": ARDUINO_CLI_READY
    }

@app.post("/api/compile")
async def compile_code(request: CompileRequest):
    """Compile Arduino code and return binary files as base64"""
    
    # Check if Arduino CLI is ready
    if not ARDUINO_CLI_READY:
        raise HTTPException(
            status_code=503,
            detail=f"Arduino CLI not ready. {ARDUINO_CLI_ERROR or 'Please wait for initialization.'}"
        )
    
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
        
        print(f"🔨 Compiling: {compile_cmd}")
        
        result = subprocess.run(
            compile_cmd,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode != 0:
            print(f"❌ Compilation failed:\n{result.stderr}")
            raise HTTPException(
                status_code=400,
                detail=f"Compilation failed: {result.stderr}"
            )
        
        print(f"✅ Compilation successful")
        
        # Find and encode binary files
        binaries = {}
        
        # Look for merged binary first (easiest - contains everything)
        merged_bin = Path(sketch_dir) / f"{folder_name}.ino.merged.bin"
        if merged_bin.exists():
            print(f"📦 Found merged binary: {merged_bin}")
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
                print(f"📦 Found bootloader: {bootloader}")
                with open(bootloader, "rb") as f:
                    binaries["bootloader"] = {
                        "data": base64.b64encode(f.read()).decode(),
                        "offset": "0x0"
                    }
            
            if partitions.exists():
                print(f"📦 Found partitions: {partitions}")
                with open(partitions, "rb") as f:
                    binaries["partitions"] = {
                        "data": base64.b64encode(f.read()).decode(),
                        "offset": "0x8000"
                    }
            
            if app_bin.exists():
                print(f"📦 Found application: {app_bin}")
                with open(app_bin, "rb") as f:
                    binaries["application"] = {
                        "data": base64.b64encode(f.read()).decode(),
                        "offset": "0x10000"
                    }
        
        # Cleanup
        shutil.rmtree(sketch_dir, ignore_errors=True)
        
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
            detail="Compilation timed out after 120 seconds"
        )
    except HTTPException:
        raise
    except Exception as e:
        shutil.rmtree(sketch_dir, ignore_errors=True)
        print(f"❌ Error during compilation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🌐 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
