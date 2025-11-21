from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import subprocess
import tempfile
import os
import shutil
from pathlib import Path

app = FastAPI(title="ESP32 Academy API")

# CORS
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

class UploadRequest(BaseModel):
    build_folder: str

@app.get("/")
async def root():
    return {"message": "ESP32 Academy API", "status": "running"}

@app.post("/api/compile")
async def compile_code(request: CompileRequest):
    """Compile Arduino code and return binary files for browser flashing"""
    
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
        
        # Compile
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
        import base64
        binaries = {}
        
        # Look for merged binary first (easiest)
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
        raise HTTPException(
            status_code=500,
            detail="Compilation timed out"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )
    finally:
        # Cleanup after a delay
        pass
            f.write(request.code)
        
        # Compile using Arduino CLI
        # Using Axiometa PIXIE M1 with USB CDC enabled
        fqbn = "esp32:esp32:axiometa_pixie_m1:CDCOnBoot=cdc"
        
        compile_cmd = [
            "arduino-cli", "compile",
            "--fqbn", fqbn,
            "--output-dir", sketch_dir,
            sketch_dir
        ]
        
        result = subprocess.run(
            compile_cmd,
            check=True,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        # Find .bin files
        bin_files = []
        for root, dirs, files in os.walk(sketch_dir):
            for file in files:
                if file.endswith(".bin"):
                    bin_files.append(file)
        
        return {
            "success": True,
            "build_folder": folder_name,
            "bin_files": bin_files,
            "compiler_output": result.stdout
        }
        
    except subprocess.CalledProcessError as e:
        # Clean up on failure
        shutil.rmtree(sketch_dir, ignore_errors=True)
        raise HTTPException(
            status_code=400,
            detail=f"Compilation failed: {e.stderr}"
        )
    except subprocess.TimeoutExpired:
        shutil.rmtree(sketch_dir, ignore_errors=True)
        raise HTTPException(
            status_code=408,
            detail="Compilation timed out after 2 minutes"
        )
    except Exception as e:
        shutil.rmtree(sketch_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

def find_esp32_port():
    """Auto-detect ESP32-S3 port (VID:PID 0x303a:0x1001)"""
    import serial.tools.list_ports
    
    for port in serial.tools.list_ports.comports():
        # ESP32-S3 native USB (Axiometa PIXIE M1)
        if port.vid == 0x303a and port.pid == 0x1001:
            return port.device
        # Also check for common USB-UART bridges
        if port.vid == 0x10c4 and port.pid == 0xea60:  # CP2102
            return port.device
        if port.vid == 0x1a86 and port.pid == 0x7523:  # CH340
            return port.device
    return None

@app.post("/api/upload")
async def upload_firmware(request: UploadRequest):
    """Upload firmware using esptool"""
    
    build_path = BUILD_DIR / request.build_folder
    
    if not build_path.exists():
        raise HTTPException(status_code=404, detail="Build folder not found")
    
    try:
        # Find ESP32 port
        port = find_esp32_port()
        
        if not port:
            raise HTTPException(
                status_code=404, 
                detail="ESP32 not found. Please connect your PIXIE M1."
            )
        
        # Find binary files
        merged_bin = build_path / f"{request.build_folder}.ino.merged.bin"
        
        if merged_bin.exists():
            flash_args = ["0x0", str(merged_bin)]
        else:
            # Use individual files
            bootloader = build_path / f"{request.build_folder}.ino.bootloader.bin"
            partitions = build_path / f"{request.build_folder}.ino.partitions.bin"
            app_bin = build_path / f"{request.build_folder}.ino.bin"
            
            if not all([bootloader.exists(), partitions.exists(), app_bin.exists()]):
                raise HTTPException(
                    status_code=404,
                    detail="Binary files not found"
                )
            
            flash_args = [
                "0x0", str(bootloader),
                "0x8000", str(partitions),
                "0x10000", str(app_bin)
            ]
        
        # Build esptool command with proper settings for ESP32-S3
        cmd = [
            "python", "-m", "esptool",
            "--chip", "esp32s3",
            "--port", port,
            "--baud", "921600",
            "--before", "default_reset",  # This is the official esptool option
            "--after", "hard_reset",
            "write_flash",
            "-z",
            "--flash_mode", "dio",
            "--flash_freq", "80m",
            "--flash_size", "4MB"
        ] + flash_args
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode == 0:
            return {
                "success": True,
                "message": "Upload successful!",
                "output": result.stdout,
                "port": port
            }
        else:
            error_msg = result.stderr or result.stdout
            
            # Provide helpful error messages
            if "Failed to connect" in error_msg:
                error_msg += "\n\nTip: Hold BOOT button, click upload, release when connecting..."
            
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Upload timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
