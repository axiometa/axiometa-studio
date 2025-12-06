const REQUIRED_MODULES = ['AX22-0009', 'AX22-0006', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
    id: "soundReactiveRGB",
    title: "Sound Reactive RGB Light",
    board: "pixie-m1",
    type: "mcu-breadboard",
    xp_reward: 250,
    requiredModules: REQUIRED_MODULES,
    thumbnail: "/images/lessons/pixie-m1/lesson-8/thumbnail.png",

    steps: [
        // ========================================
        // 1: Welcome
        // ========================================
        {
            id: "welcome",
            type: "info",
            title: "Building a Sound Reactive Light",
            content: `Ever seen lights at a concert that pulse to the music? Let's build one!

In this lesson, you'll create a sound-reactive RGB LED that changes colors when it detects sounds like music, claps, or your voice.

This is the same idea behind LED strips at parties and music visualizers!`
        },

        // ========================================
        // 2: Hardware
        // ========================================
        {
            id: "hardware",
            type: "hardware",
            title: "What You'll Need",
            moduleIds: REQUIRED_MODULES
        },

        // ========================================
        // 3: Insert PIXIE
        // ========================================
        {
            id: "wiring-1",
            type: "wiring-step",
            title: "Insert PIXIE",
            instruction: `Place your PIXIE M1 across the center gap of the breadboard.

The USB port should face outward for easy access.`,
            kitItemId: "MTA0007",
            image: "/images/lessons/pixie-m1/universal-images/bb-pixie-s1.gif",
            stepNumber: 1,
            totalSteps: 7
        },

        // ========================================
        // 4: Connect USB
        // ========================================
        {
            id: "wiring-2",
            type: "wiring-step",
            title: "Connect to PC",
            instruction: `Plug in the USB-C cable to your PIXIE and computer.

The power LED on the board should light up.`,
            images: [
                { src: "/images/lessons/pixie-m1/universal-images/usb-to-pixie.png", label: "USB → PIXIE" },
                { src: "/images/lessons/pixie-m1/universal-images/usb-to-pc.png", label: "USB → PC" }
            ],
            stepNumber: 2,
            totalSteps: 7
        },

        // ========================================
        // 5: Connection Check
        // ========================================
        {
            id: "connection-check",
            type: "connection-check",
            title: "Verify Connection",
            instruction: `Let's make sure your PIXIE is properly connected to your computer.

Click the button below to establish a serial connection.`
        },

        // ========================================
        // 6: Insert Modules
        // ========================================
        {
            id: "wiring-3",
            type: "wiring-step",
            title: "Insert Modules",
            instruction: `Insert the microphone module and the RGB LED module into the breadboard.`,
            kitItemIds: ["AX22-0009", "AX22-0006"],
            image: "/images/lessons/pixie-m1/lesson-8/bb-pixie-s2.gif",
            stepNumber: 3,
            totalSteps: 7
        },

        // ========================================
        // 7: Connect Grounds
        // ========================================
        {
            id: "wiring-4",
            type: "wiring-step",
            title: "Connect all grounds",
            instruction: `Connect the RGB LED module's GND pin and the microphone's GND pin to GND on the PIXIE.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-8/bb-pixie-s3.gif",
            stepNumber: 4,
            totalSteps: 7
        },

        // ========================================
        // 8: Connect Power
        // ========================================
        {
            id: "wiring-5",
            type: "wiring-step",
            title: "Connect power",
            instruction: `Connect the microphone module's Vin pin to PIXIE's 3.3V pin.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-8/bb-pixie-s4.gif",
            stepNumber: 5,
            totalSteps: 7
        },

        // ========================================
        // 9: Connect Signals
        // ========================================
        {
            id: "wiring-6",
            type: "wiring-step",
            title: "Connect module signals",
            instruction: `Connect the signal pins:
• Microphone's analog output (A) pin to Pin 7
• RGB LED's R (Red) pin to Pin 2
• RGB LED's G (Green) pin to Pin 3
• RGB LED's B (Blue) pin to Pin 1`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-8/bb-pixie-s5.gif",
            stepNumber: 6,
            totalSteps: 7
        },

        // ========================================
        // 10: Final Circuit
        // ========================================
        {
            id: "wiring-final",
            type: "wiring-step",
            title: "Final Circuit",
            instruction: `Your circuit should look like this!

You now have a microphone and RGB LED ready to react to sound.`,
            image: "/images/lessons/pixie-m1/lesson-8/bb-pixie-final.png",
            stepNumber: 7,
            totalSteps: 7
        },

        // ========================================
        // 11: Code Explanation
        // ========================================
        {
            id: "code-intro",
            type: "code-explanation",
            title: "Understanding the Code",
            code: `#define RED_PIN 2
#define GREEN_PIN 3
#define BLUE_PIN 1
#define MIC_PIN 7

// Microphone sits at ~1.8V when quiet
// 1.8V = ~2234 on 12-bit ADC (1.8/3.3 * 4095)
#define MIC_BASELINE 2234

// Sound threshold (mic swings ~100mV = ~124 ADC units)
#define SOUND_THRESHOLD 50

// Track current color
int currentColor = 0;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  
  // Start with LED off
  setColor(0, 0, 0);
}

void loop() {
  // Read microphone value
  int micValue = analogRead(MIC_PIN);
  
  // Calculate how far from baseline (absolute value)
  int soundLevel = abs(micValue - MIC_BASELINE);
  
  // Check if sound detected
  if (soundLevel > SOUND_THRESHOLD) {
    // Cycle to next color
    currentColor = (currentColor + 1) % 7;
    showColor(currentColor);
    
    // Wait for sound to settle
    delay(150);
  }
  
  // Small delay for stability
  delay(10);
}

void setColor(int r, int g, int b) {
  digitalWrite(RED_PIN, r);
  digitalWrite(GREEN_PIN, g);
  digitalWrite(BLUE_PIN, b);
}

void showColor(int color) {
  switch (color) {
    case 0: setColor(1, 0, 0); break; // Red
    case 1: setColor(0, 1, 0); break; // Green
    case 2: setColor(0, 0, 1); break; // Blue
    case 3: setColor(1, 1, 0); break; // Yellow
    case 4: setColor(1, 0, 1); break; // Magenta
    case 5: setColor(0, 1, 1); break; // Cyan
    case 6: setColor(1, 1, 1); break; // White
  }
}`,
            explanations: [
                {
                    line: 0,
                    highlight: "#define RED_PIN 2",
                    explanation: "Names pin 2 as our red LED output."
                },
                {
                    line: 1,
                    highlight: "#define GREEN_PIN 3",
                    explanation: "Names pin 3 as our green LED output."
                },
                {
                    line: 2,
                    highlight: "#define BLUE_PIN 1",
                    explanation: "Names pin 1 as our blue LED output."
                },
                {
                    line: 3,
                    highlight: "#define MIC_PIN 7",
                    explanation: "Names pin 7 as our microphone analog input."
                },
                {
                    line: 7,
                    highlight: "#define MIC_BASELINE 2234",
                    explanation: "The ADC reading when the mic is quiet (~1.8V). We calculate this as: 1.8V ÷ 3.3V × 4095 ≈ 2234."
                },
                {
                    line: 10,
                    highlight: "#define SOUND_THRESHOLD 50",
                    explanation: "How much the sound must deviate from baseline to trigger. Adjust this to change sensitivity."
                },
                {
                    line: 27,
                    highlight: "int micValue = analogRead(MIC_PIN);",
                    explanation: "Reads the current voltage from the microphone (0-4095)."
                },
                {
                    line: 30,
                    highlight: "int soundLevel = abs(micValue - MIC_BASELINE);",
                    explanation: "Calculates how far the reading is from quiet. We use abs() because sound waves go both above and below the baseline."
                },
                {
                    line: 33,
                    highlight: "if (soundLevel > SOUND_THRESHOLD) {",
                    explanation: "Checks if the sound is loud enough to react to."
                },
                {
                    line: 35,
                    highlight: "currentColor = (currentColor + 1) % 7;",
                    explanation: "Cycles through 7 colors (0-6). The % operator wraps back to 0 after 6."
                },
                {
                    line: 39,
                    highlight: "delay(150);",
                    explanation: "Waits briefly so one clap doesn't trigger multiple color changes."
                },
                {
                    line: 49,
                    highlight: "void setColor(int r, int g, int b) {",
                    explanation: "Helper function to set all three LED pins at once."
                },
                {
                    line: 55,
                    highlight: "void showColor(int color) {",
                    explanation: "Maps a color number (0-6) to RGB values for different colors."
                }
            ]
        },

        // ========================================
        // 12: Upload
        // ========================================
        {
            id: "upload",
            type: "upload",
            title: "Upload Your Code",
            instruction: `Click 'Upload Code' to flash your PIXIE M1.`,
            code: `#define RED_PIN 2
#define GREEN_PIN 3
#define BLUE_PIN 1
#define MIC_PIN 7

// Microphone sits at ~1.8V when quiet
// 1.8V = ~2234 on 12-bit ADC (1.8/3.3 * 4095)
#define MIC_BASELINE 2234

// Sound threshold (mic swings ~100mV = ~124 ADC units)
#define SOUND_THRESHOLD 50

// Track current color
int currentColor = 0;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  
  // Start with LED off
  setColor(0, 0, 0);
}

void loop() {
  // Read microphone value
  int micValue = analogRead(MIC_PIN);
  
  // Calculate how far from baseline (absolute value)
  int soundLevel = abs(micValue - MIC_BASELINE);
  
  // Check if sound detected
  if (soundLevel > SOUND_THRESHOLD) {
    // Cycle to next color
    currentColor = (currentColor + 1) % 7;
    showColor(currentColor);
    
    // Wait for sound to settle
    delay(150);
  }
  
  // Small delay for stability
  delay(10);
}

void setColor(int r, int g, int b) {
  digitalWrite(RED_PIN, r);
  digitalWrite(GREEN_PIN, g);
  digitalWrite(BLUE_PIN, b);
}

void showColor(int color) {
  switch (color) {
    case 0: setColor(1, 0, 0); break; // Red
    case 1: setColor(0, 1, 0); break; // Green
    case 2: setColor(0, 0, 1); break; // Blue
    case 3: setColor(1, 1, 0); break; // Yellow
    case 4: setColor(1, 0, 1); break; // Magenta
    case 5: setColor(0, 1, 1); break; // Cyan
    case 6: setColor(1, 1, 1); break; // White
  }
}`
        },

        // ========================================
        // 13: Verify
        // ========================================
        {
            id: "verify",
            type: "verification",
            title: "Does the Sound Reactive Light Work?",
            instruction: `Clap your hands or play some music near the microphone.

The RGB LED should change colors with each sound burst!`,
            image: "/images/lessons/pixie-m1/lesson-8/bb-pixie-demo.gif",
            confirmText: "Yes, it works!",
            troubleshootText: "It's not working"
        },

        // ========================================
        // 15: Complete
        // ========================================
        {
            id: "complete",
            type: "completion",
            title: "Sound Reactive RGB Complete!",
            content: `You've built your own sound-reactive light show!

You learned how to:
• Read analog audio signals from a microphone
• Calculate deviation from a baseline voltage
• Control an RGB LED to display multiple colors
• React to real-world sound events

This is the foundation for music visualizers, smart home lighting, and interactive art installations!`,
            nextLesson: 9
        }
    ]
};