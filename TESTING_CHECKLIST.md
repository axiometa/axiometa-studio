# Testing Checklist

## Pre-Launch Testing Guide

Use this checklist to verify everything works before deploying to production.

---

## ✅ Local Setup Testing

### Prerequisites
- [ ] Node.js v18+ installed (`node --version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Arduino CLI installed (`arduino-cli version`)
- [ ] ESP32 board support installed (`arduino-cli core list | grep esp32`)

### Installation
- [ ] `npm install` completes without errors
- [ ] `cd backend && pip install -r requirements.txt` works
- [ ] No missing dependencies reported

---

## ✅ Backend Testing

### Server Startup
- [ ] `python backend/main.py` starts without errors
- [ ] Server shows: "Uvicorn running on http://0.0.0.0:8000"
- [ ] Can access http://localhost:8000 in browser
- [ ] Health check returns: `{"message": "ESP32 Academy API", "status": "running"}`

### Compilation Endpoint
```bash
# Test with curl:
curl -X POST http://localhost:8000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"void setup(){Serial.begin(9600);} void loop(){Serial.println(\"test\");}"}'
```

- [ ] Returns `{"success": true, "build_folder": "...", ...}`
- [ ] Build folder created in `backend/builds/`
- [ ] `.bin` files exist in build folder

### Error Handling
- [ ] Empty code returns 400 error
- [ ] Invalid code shows compilation error
- [ ] Missing build folder returns 404

---

## ✅ Frontend Testing

### Server Startup
- [ ] `npm run dev` starts without errors
- [ ] Frontend accessible at http://localhost:3000
- [ ] No console errors on page load
- [ ] Monaco Editor loads properly

### Dashboard
- [ ] Dashboard shows "ESP32 Academy" title
- [ ] Level shows: "Level 1"
- [ ] XP shows: "0 / 500"
- [ ] Progress bar at 0%
- [ ] "Start Learning Now" button visible
- [ ] Lesson 1 card displays correctly
- [ ] Locked lessons show 🔒 icon

### Navigation
- [ ] Click "Start Learning Now" → goes to Lesson 1
- [ ] Intro slides appear
- [ ] Can click "Next" to progress slides
- [ ] Can click "Skip Introduction"
- [ ] "Back to Dashboard" returns to home

---

## ✅ Lesson View Testing

### UI Elements
- [ ] Lesson title displays: "Lesson 1: Blinky"
- [ ] Challenge 1 shows: "Upload the code as-is..."
- [ ] Code editor shows starter code
- [ ] Wiring diagram displays
- [ ] Hardware list shows LED, resistor, etc.
- [ ] Serial monitor section exists

### Code Editor
- [ ] Can type in Monaco Editor
- [ ] Syntax highlighting works
- [ ] Line numbers visible
- [ ] Can select/copy/paste code
- [ ] Code changes are retained while on page

### Buttons
- [ ] "Connect ESP32" button visible
- [ ] "Upload Code" button visible
- [ ] "💡 Show Hint" button visible
- [ ] "✅ Mark as Complete" button visible

---

## ✅ ESP32 Connection Testing

### Web Serial API
- [ ] Browser is Chrome or Edge (not Firefox/Safari)
- [ ] Click "Connect ESP32" opens port selection dialog
- [ ] ESP32 appears in port list
- [ ] Can select ESP32 port
- [ ] Button changes to "✅ Connected"
- [ ] No console errors during connection

### Troubleshooting
If ESP32 not detected:
- [ ] ESP32 plugged into USB
- [ ] Using data cable (not charge-only)
- [ ] Drivers installed (CP210x/CH340)
- [ ] ESP32 shows in Device Manager/System Info
- [ ] No other software using the port (close Arduino IDE)

---

## ✅ Code Upload Testing

### Upload Process
- [ ] Click "Upload Code"
- [ ] Upload logs section appears
- [ ] Shows "⏳ Compiling code..."
- [ ] Shows "🔌 Disconnected Web Serial"
- [ ] Shows "✅ Compilation successful!"
- [ ] Shows "📡 Uploading to ESP32..."
- [ ] Shows "✅ Upload complete!"
- [ ] Shows "⏳ Waiting for ESP32 to boot..."
- [ ] Shows "🔌 Reconnecting..."
- [ ] Shows "✅ Connected! Your project is running!"

### Expected Timeline
- [ ] Compilation: 10-20 seconds
- [ ] Upload: 5-10 seconds
- [ ] Boot wait: 3 seconds
- [ ] Reconnect: 1-2 seconds
- [ ] Total: ~20-35 seconds

### Error Cases
- [ ] Empty code shows error
- [ ] Syntax error shows compilation error
- [ ] Disconnected ESP32 shows "ESP32 not found"
- [ ] Port busy shows helpful error message

---

## ✅ Serial Monitor Testing

### Data Display
- [ ] After upload, serial monitor shows data
- [ ] Shows "LED ON" messages
- [ ] Shows "LED OFF" messages
- [ ] Messages appear in real-time
- [ ] Scrolls automatically to latest message
- [ ] No duplicate messages

### Physical LED
- [ ] LED blinks on ESP32 board
- [ ] Blink rate matches delay() in code
- [ ] LED stays on for 1 second
- [ ] LED stays off for 1 second

---

## ✅ Challenge System Testing

### Challenge 1: Upload and Verify
- [ ] Upload default code
- [ ] LED blinks
- [ ] Click "✅ Mark as Complete"
- [ ] Challenge marked complete with ✅
- [ ] Moves to Challenge 2

### Challenge 2: Faster Blink
- [ ] Challenge 2 prompt shows
- [ ] Click "💡 Show Hint" reveals Hint 1
- [ ] Click again reveals Hint 2
- [ ] Click again reveals Hint 3
- [ ] Edit code: change `delay(1000)` to `delay(500)`
- [ ] Upload modified code
- [ ] LED blinks faster
- [ ] Complete challenge
- [ ] +50 XP bonus awarded

### Challenge 3: SOS Pattern
- [ ] Challenge 3 prompt shows
- [ ] Can view hints
- [ ] Can modify code for SOS pattern
- [ ] Upload works
- [ ] Can complete challenge

### Completion
- [ ] After completing all 3 challenges
- [ ] Shows "🎉 All challenges complete!"
- [ ] Returns to Dashboard after 2 seconds
- [ ] XP updated (0 → 100)
- [ ] Progress bar updated
- [ ] Level unchanged (need 500 XP for Level 2)

---

## ✅ XP and Leveling Testing

### XP Accumulation
- [ ] Start at 0 XP
- [ ] Complete Lesson 1 → +100 XP
- [ ] XP shows: "100 / 500"
- [ ] Progress bar shows ~20%
- [ ] Level still 1 (need 500 XP)

### Future Leveling (Not Yet Implemented)
- [ ] At 500 XP → Level 2
- [ ] Next level requires 1000 XP
- [ ] Progress resets for new level

---

## ✅ Edge Cases & Error Handling

### Browser Compatibility
- [ ] Works in Chrome (latest)
- [ ] Works in Edge (latest)
- [ ] Firefox shows "Web Serial not supported" message
- [ ] Safari shows "Web Serial not supported" message

### Connection Issues
- [ ] Disconnect ESP32 → shows error
- [ ] Reconnect ESP32 → can reconnect
- [ ] Upload without ESP32 → shows helpful error
- [ ] Multiple quick connects → no crashes

### Code Issues
- [ ] Very long code → uploads successfully
- [ ] Code with syntax errors → shows compiler errors
- [ ] Empty code → shows error message
- [ ] Special characters in code → handles correctly

### Network Issues
- [ ] Backend offline → shows connection error
- [ ] Slow connection → shows loading state
- [ ] Timeout → shows timeout message

---

## ✅ Shopify Integration Testing

### Button Display
- [ ] Open `shopify-button.html` in browser
- [ ] Button displays correctly
- [ ] Gradient background shows
- [ ] Hover effect works
- [ ] Text is readable

### Integration
- [ ] Add to Shopify test store
- [ ] Button appears on product page
- [ ] Click button → opens learning platform
- [ ] URL correct (localhost or deployed URL)

---

## ✅ Performance Testing

### Load Times
- [ ] Dashboard loads in < 2 seconds
- [ ] Lesson view loads in < 2 seconds
- [ ] Monaco Editor loads in < 3 seconds
- [ ] Code upload completes in < 35 seconds

### Memory Usage
- [ ] No memory leaks after multiple uploads
- [ ] Browser doesn't slow down
- [ ] Backend memory stays stable

### Build Size
- [ ] `npm run build` completes
- [ ] Build size < 1 MB (reasonable)
- [ ] No warnings about large chunks

---

## ✅ Deployment Testing

### Vercel Frontend
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Deployment succeeds
- [ ] Can access deployed URL
- [ ] All pages load correctly
- [ ] Set `VITE_API_URL` environment variable
- [ ] Frontend can connect to backend

### Railway Backend
- [ ] Connect to Railway
- [ ] Deployment succeeds
- [ ] Backend starts successfully
- [ ] API endpoints accessible
- [ ] `/api/compile` works
- [ ] Arduino CLI available
- [ ] ESP32 board support installed

### Production End-to-End
- [ ] Access deployed frontend URL
- [ ] Complete full user flow
- [ ] Code compilation works
- [ ] Upload works (if backend has USB)
- [ ] Serial monitor works
- [ ] Challenge completion works
- [ ] XP updates correctly

---

## ✅ Documentation Testing

### README.md
- [ ] Setup instructions clear
- [ ] All commands work
- [ ] Links not broken
- [ ] Code examples correct

### Other Docs
- [ ] DEPLOYMENT.md has correct steps
- [ ] TROUBLESHOOTING.md covers common issues
- [ ] PROJECT_OVERVIEW.md is accurate
- [ ] START_HERE.md is beginner-friendly

---

## ✅ User Experience Testing

### First-Time User
- [ ] Can understand what to do
- [ ] Dashboard is clear
- [ ] Instructions are helpful
- [ ] Errors are understandable
- [ ] Success messages are encouraging

### Learning Flow
- [ ] Lessons are engaging
- [ ] Challenges are clear
- [ ] Hints are helpful
- [ ] Progress is visible
- [ ] Achievements feel rewarding

### Visual Design
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Buttons are obvious
- [ ] Layout is clean
- [ ] Mobile responsive (basic)

---

## 🚀 Ready to Launch?

✅ All checkboxes checked? You're ready to deploy!

### Pre-Launch Final Checks:
1. [ ] All tests pass
2. [ ] Documentation updated
3. [ ] Environment variables set
4. [ ] Shopify button updated with real URL
5. [ ] Backend deployed and running
6. [ ] Frontend deployed and accessible
7. [ ] End-to-end test completed
8. [ ] Error monitoring set up (optional)
9. [ ] Analytics added (optional)
10. [ ] Beta testers invited

### Post-Launch Monitoring:
- [ ] Check for errors in first 24 hours
- [ ] Monitor server performance
- [ ] Collect user feedback
- [ ] Track completion rates
- [ ] Plan improvements based on feedback

---

**Testing complete! Time to launch! 🎉**
