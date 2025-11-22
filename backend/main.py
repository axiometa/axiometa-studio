import os
import sys
import asyncio
from pathlib import Path

# Load environment variables for local development
from dotenv import load_dotenv
if os.path.exists('.env.local'):
    load_dotenv('.env.local')
    print("🔧 Loaded .env.local for local development")

# Add Arduino CLI to PATH FIRST (before any other imports)
ARDUINO_BIN = "/app/.arduino/bin"
os.environ['PATH'] = f"{ARDUINO_BIN}:{os.environ.get('PATH', '')}"
os.environ['ARDUINO_DATA_DIR'] = "/app/.arduino/data"
os.environ['ARDUINO_SKETCHBOOK_DIR'] = "/app/.arduino/sketchbook"

print("🚀 Starting ESP32 Academy API...")
print(f"🔍 Python executable: {sys.executable}")
print(f"🔧 PATH: {os.environ['PATH'][:200]}...")
print(f"🎯 PORT: {os.getenv('PORT', '8080')}")

# Check if API key is loaded (for debugging)
api_key_status = "✅ Loaded" if os.getenv("ANTHROPIC_API_KEY") else "❌ Missing"
print(f"🔑 ANTHROPIC_API_KEY: {api_key_status}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import shutil
import base64

# Import anthropic for AI chat
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("⚠️  anthropic package not installed - AI features disabled")

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
                
                # Check if config exists first
                config_check = subprocess.run(
                    ['arduino-cli', 'config', 'dump'],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                # Only init if config doesn't exist
                if config_check.returncode != 0:
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

class AIChatRequest(BaseModel):
    system: str = ""
    messages: list

@app.get("/")
async def root():
    return {
        "message": "ESP32 Academy API",
        "status": "running" if ARDUINO_CLI_READY else "initializing",
        "arduino_cli": "ready" if ARDUINO_CLI_READY else "not ready",
        "ai_chat": "available" if ANTHROPIC_AVAILABLE else "disabled",
        "error": ARDUINO_CLI_ERROR,
        "version": "1.2"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "arduino_ready": ARDUINO_CLI_READY,
        "ai_ready": ANTHROPIC_AVAILABLE
    }

@app.post("/api/validate-code")
async def validate_code(request: dict):
    """AI-powered code validation before compilation"""
    
    print(f"🔍 Code validation request received")
    
    if not ANTHROPIC_AVAILABLE:
        # If AI not available, just return success to allow compilation
        return {"success": True, "is_valid": True, "message": ""}
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        # If no API key, just allow compilation
        return {"success": True, "is_valid": True, "message": ""}
    
    user_code = request.get("code", "")
    expected_code = request.get("expected_code", "")
    step_instruction = request.get("instruction", "")
    
    try:
        client = anthropic.Anthropic(api_key=api_key)
        
        validation_prompt = f"""You are an ESP32 code validator. Analyze this code for SIMPLE, OBVIOUS mistakes that would prevent compilation or cause immediate runtime errors.

USER'S CODE:
```cpp
{user_code}
```

{f'''EXPECTED/REFERENCE CODE:
```cpp
{expected_code}
```
''' if expected_code else ''}

{f'CURRENT TASK: {step_instruction}' if step_instruction else ''}

Check for:
1. Missing semicolons
2. Unclosed braces or parentheses
3. Typos in function names (digitalWrite vs digitalwrite)
4. Missing #define or variable declarations
5. Obvious logic errors compared to the reference

RESPOND IN THIS EXACT FORMAT:
STATUS: [VALID or INVALID]
ISSUE: [brief description of the problem, or "None" if valid]
GUIDANCE: [friendly hint to fix it, or empty if valid]

Be encouraging! Only flag OBVIOUS mistakes. If the code looks reasonable, mark it VALID even if it's not perfect."""

        system_param = [{"type": "text", "text": "You are a helpful ESP32 code validator. Be concise and encouraging."}]
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            system=system_param,
            messages=[{"role": "user", "content": validation_prompt}]
        )
        
        result = response.content[0].text
        print(f"🤖 Validation result: {result}")
        
        # Parse the response
        is_valid = "STATUS: VALID" in result
        
        if is_valid:
            return {
                "success": True,
                "is_valid": True,
                "message": ""
            }
        else:
            # Extract the guidance message
            lines = result.split('\n')
            issue = ""
            guidance = ""
            
            for line in lines:
                if line.startswith("ISSUE:"):
                    issue = line.replace("ISSUE:", "").strip()
                elif line.startswith("GUIDANCE:"):
                    guidance = line.replace("GUIDANCE:", "").strip()
            
            message = f"{issue}\n\n{guidance}".strip()
            
            return {
                "success": True,
                "is_valid": False,
                "message": message or "There might be an issue with your code. Please review it."
            }
        
    except Exception as e:
        print(f"❌ Validation error: {str(e)}")
        # If validation fails, allow compilation anyway
        return {"success": True, "is_valid": True, "message": ""}
    
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

@app.post("/api/ai-chat")
async def ai_chat(request: AIChatRequest):
    """Proxy endpoint for AI chat - keeps API key secure on backend"""
    
    print(f"📨 AI Chat request received")
    
    if not ANTHROPIC_AVAILABLE:
        print("❌ Anthropic package not available")
        raise HTTPException(
            status_code=503,
            detail="AI chat not available - anthropic package not installed"
        )
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    print(f"🔑 API Key loaded: {bool(api_key)}")
    
    if not api_key:
        print("❌ No API key found in environment")
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured on server"
        )
    
    try:
        print(f"🤖 Creating Anthropic client...")
        client = anthropic.Anthropic(api_key=api_key)
        
        print(f"📤 Sending request to Claude API...")
        # Build system parameter correctly
        system_param = None
        if request.system:
            system_param = [{"type": "text", "text": request.system}]
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            system=system_param,
            messages=request.messages
        )
        
        print(f"✅ Got response from Claude API")
        return {
            "success": True,
            "message": response.content[0].text
        }
        
    except Exception as e:
        print(f"❌ AI Chat error: {str(e)}")
        print(f"❌ Error type: {type(e).__name__}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"AI chat failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🌐 Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)