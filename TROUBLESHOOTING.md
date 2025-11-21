# Troubleshooting Guide

## Common Issues & Solutions

### Frontend Issues

#### "Cannot connect to backend"
**Symptoms:** 
- Compile button does nothing
- Console shows CORS errors
- API calls fail

**Solutions:**
1. Check backend is running: `curl http://localhost:8000`
2. Verify `VITE_API_URL` in frontend
3. Check CORS settings in `backend/main.py`
4. Clear browser cache and reload

#### "Web Serial API not supported"
**Symptoms:**
- No "Connect ESP32" button
- Error: "Web Serial API not supported"

**Solutions:**
1. Use Chrome or Edge (not Firefox/Safari)
2. Update browser to latest version
3. Check browser flags: `chrome://flags` → enable "Experimental Web Platform features"
4. Use HTTPS (required except on localhost)

#### "Monaco Editor not loading"
**Symptoms:**
- White box where editor should be
- Console errors about Monaco

**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Reinstall: `rm -rf node_modules && npm install`
3. Check network tab for failed CDN requests
4. Disable browser extensions (AdBlock, etc.)

---

### Backend Issues

#### "arduino-cli: command not found"
**Symptoms:**
- Backend starts but compile fails
- Error: "arduino-cli not found"

**Solutions:**
1. Install Arduino CLI:
   ```bash
   # macOS
   brew install arduino-cli
   
   # Linux
   curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
   
   # Windows
   # Download from: https://arduino.github.io/arduino-cli/
   ```

2. Verify installation: `arduino-cli version`

3. Add to PATH if needed:
   ```bash
   export PATH="$PATH:$HOME/bin"
   ```

#### "ESP32 board not installed"
**Symptoms:**
- Compilation fails with "platform not found"
- Error about missing esp32:esp32

**Solutions:**
```bash
arduino-cli config init
arduino-cli config add board_manager.additional_urls \
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
arduino-cli core update-index
arduino-cli core install esp32:esp32
```

Verify: `arduino-cli core list`

#### "Compilation timeout"
**Symptoms:**
- Compile hangs for 2+ minutes
- Eventually fails with timeout

**Solutions:**
1. Increase timeout in `backend/main.py`:
   ```python
   timeout=180  # Change from 120 to 180
   ```

2. Check disk space: `df -h`
3. Clear old builds: `rm -rf backend/builds/*`
4. Check CPU usage during compile

#### "Port busy" during upload
**Symptoms:**
- Upload fails with "Port busy"
- Error: "PermissionError"

**Solutions:**
1. Close Arduino IDE (it locks ports)
2. Close other serial monitors
3. Disconnect/reconnect ESP32
4. Kill stale processes:
   ```bash
   # macOS/Linux
   lsof | grep tty
   kill <PID>
   
   # Windows
   tasklist | findstr python
   taskkill /F /PID <PID>
   ```

---

### Hardware Issues

#### "ESP32 not detected"
**Symptoms:**
- Can't select port in browser
- Device Manager shows "Unknown Device"
- No serial ports available

**Solutions:**
1. **Install drivers:**
   - CP210x: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
   - CH340: http://www.wch.cn/downloads/CH341SER_ZIP.html
   - FTDI: https://ftdichip.com/drivers/

2. **Check cable:**
   - Use data cable (not charge-only)
   - Try different USB port
   - Try different cable

3. **Check device:**
   ```bash
   # macOS/Linux
   ls /dev/tty.*
   ls /dev/cu.*
   
   # Windows
   # Device Manager → Ports (COM & LPT)
   ```

4. **Verify in Arduino IDE:**
   - Tools → Port → Should see ESP32
   - If visible in Arduino but not browser, it's a Web Serial issue

#### "Upload fails at 'Connecting...'"
**Symptoms:**
- Stuck at "Connecting..."
- Timeout after 30 seconds

**Solutions:**
1. **Hold BOOT button:**
   - Hold BOOT button on ESP32
   - Click upload
   - Release BOOT when you see "Connecting..."

2. **Check baud rate:**
   - Try lower baud: Change to 115200 in code
   - ESP32-S3 works best at 115200

3. **Power cycle:**
   - Unplug ESP32
   - Wait 5 seconds
   - Plug back in
   - Try again

#### "Upload succeeds but no serial output"
**Symptoms:**
- Upload completes
- Serial monitor is blank
- LED doesn't blink

**Solutions:**
1. **Check baud rate matches:**
   - Code: `Serial.begin(9600);`
   - Connection: `{ baudRate: 9600 }`

2. **Verify Serial.println() in code:**
   ```cpp
   Serial.begin(9600);
   Serial.println("Starting...");
   ```

3. **Wait for boot:**
   - ESP32 takes 2-3 seconds to boot
   - Serial data starts after setup() runs

4. **Check USB CDC setting:**
   - Should be enabled in board config
   - `CDCOnBoot=cdc` in compile command

---

### Browser Issues

#### "Permission denied" when connecting
**Symptoms:**
- Can't grant USB permission
- Permission dialog doesn't appear

**Solutions:**
1. Check browser permissions:
   - Chrome → Settings → Privacy → Site Settings → USB
   - Allow localhost or your domain

2. Reload page and try again

3. Try incognito mode (tests extensions)

4. Check console for errors

#### "Serial monitor not updating"
**Symptoms:**
- Connected but no new data
- Old data visible

**Solutions:**
1. Check connection indicator is green
2. Refresh page and reconnect
3. Check serial is sending data:
   ```cpp
   Serial.println(millis());  // Print timestamp
   ```
4. Check browser console for JS errors

---

### Deployment Issues

#### "Vercel build fails"
**Symptoms:**
- Build fails on Vercel
- Works locally

**Solutions:**
1. Check Node version matches:
   - Add to `package.json`:
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

2. Clear Vercel cache:
   - Settings → Clear Cache → Redeploy

3. Check build logs for specific errors

#### "Railway backend won't start"
**Symptoms:**
- Deployment succeeds but app crashes
- Logs show errors

**Solutions:**
1. Check Python version:
   - Railway uses Python 3.11 by default
   - Add `runtime.txt` if needed:
   ```
   python-3.11
   ```

2. Check Arduino CLI installation:
   - May need custom Dockerfile
   - Railway might not have arduino-cli by default

3. Check environment variables:
   - Port is set automatically
   - Don't hardcode port 8000

#### "CORS errors in production"
**Symptoms:**
- Works locally, fails in production
- Console: "CORS policy blocked"

**Solutions:**
1. Update CORS in `backend/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",
           "https://your-frontend.vercel.app"
       ],
       ...
   )
   ```

2. Or use wildcard (less secure):
   ```python
   allow_origins=["*"]
   ```

---

### Performance Issues

#### "Slow compilation"
**Symptoms:**
- Takes 30+ seconds to compile
- Users complaining of slow uploads

**Solutions:**
1. Use caching (future enhancement)
2. Reduce build output:
   - Add `--quiet` flag to arduino-cli
3. Use smaller sketches for lessons
4. Consider pre-compiled binaries

#### "High memory usage"
**Symptoms:**
- Backend crashes
- Out of memory errors

**Solutions:**
1. Clean old builds periodically:
   ```python
   # Add to backend
   import shutil
   import time
   
   # Delete builds older than 1 hour
   for folder in BUILD_DIR.iterdir():
       if time.time() - folder.stat().st_mtime > 3600:
           shutil.rmtree(folder)
   ```

2. Limit concurrent compilations:
   - Add queue system
   - Rate limit API

3. Increase server resources

---

## Debug Mode

### Enable Verbose Logging

**Frontend:**
```javascript
// In connection.js
console.log('🔌 Connection state:', this.isConnected);
console.log('📝 Data received:', line);
```

**Backend:**
```python
# In main.py
import logging
logging.basicConfig(level=logging.DEBUG)

@app.post("/api/compile")
async def compile_code(request: CompileRequest):
    logging.debug(f"Received code: {request.code[:100]}")
    # ...
```

### Browser DevTools

**Console:**
- Check for JavaScript errors
- Look for failed network requests
- Monitor WebSocket connections

**Network Tab:**
- Verify API calls succeed
- Check response times
- Look for 404/500 errors

**Application Tab:**
- Check localStorage
- Verify service workers (none in MVP)

---

## Getting Help

### Before Asking for Help

1. Check this guide first
2. Read error messages carefully
3. Check browser console
4. Check backend logs
5. Try in incognito mode
6. Try different browser

### What to Include

When reporting issues:
- Operating system
- Browser and version
- Error messages (full text)
- Console logs
- Steps to reproduce
- Expected vs actual behavior

### Quick Tests

```bash
# Test backend
curl http://localhost:8000

# Test compilation
curl -X POST http://localhost:8000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"void setup(){} void loop(){}"}'

# Check Arduino CLI
arduino-cli version
arduino-cli core list

# Check Python
python --version
pip list | grep fastapi
```

---

## Still Stuck?

1. Check GitHub Issues (when repo is public)
2. Review code comments
3. Compare with working example
4. Start fresh with clean install

Remember: 90% of issues are:
- Missing dependencies
- Port conflicts
- CORS misconfiguration
- Wrong baud rate
- Cable/driver problems
