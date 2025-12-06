const REQUIRED_MODULES = ['AX22-0005', 'AX22-0023', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
    id: "streetLightControl",
    title: "Automatic Street Light",
    board: "pixie-m1",
    type: "mcu-breadboard",
    xp_reward: 200,
    requiredModules: REQUIRED_MODULES,
    thumbnail: "/images/lessons/pixie-m1/lesson-7/thumbnail.png",

    steps: [
        // ========================================
        // 1: Welcome
        // ========================================
        {
            id: "welcome",
            type: "info",
            title: "Building an Automatic Street Light",
            content: `Have you ever noticed how street lights turn on automatically when it gets dark?

In this lesson, you'll build your own automatic street light using a Light Dependent Resistor (LDR). The LED will turn on when it's dark and off when it's bright.

This is exactly how real street lights and outdoor lighting systems work!`
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
            instruction: `Insert the LDR module and the Street Light into the breadboard.`,
            kitItemIds: ["AX22-0005", "AX22-0023"],
            image: "/images/lessons/pixie-m1/lesson-7/bb-pixie-s2.gif",
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
            instruction: `Connect the Street Light's GND pin and the LDR's GND pin to GND on the PIXIE.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-7/bb-pixie-s3.gif",
            stepNumber: 4,
            totalSteps: 7
        },

        // ========================================
        // 8: Connect Power
        // ========================================
        {
            id: "wiring-5",
            type: "wiring-step",
            title: "Connect power for LDR",
            instruction: `Connect the LDR module's VCC pin to PIXIE's 3.3V pin.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-7/bb-pixie-s4.gif",
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
• LDR's analog output A pin to Pin 1
• Street Light's module's signal pin to Pin 3`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-7/bb-pixie-s5.gif",
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

You now have a light sensor and street light ready to go.`,
            image: "/images/lessons/pixie-m1/lesson-7/bb-pixie-final.png",
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
            code: `#define LED_PIN 3
#define LDR_PIN 1

// Threshold for darkness (adjust as needed)
// Lower values = darker, Higher values = brighter
#define DARK_THRESHOLD 1000

void setup() {
  pinMode(LED_PIN, OUTPUT);
  // Analog pins don't need pinMode
  
  // Start with LED off
  digitalWrite(LED_PIN, LOW);
}

void loop() {
  // Read the light level (0-4095)
  int lightLevel = analogRead(LDR_PIN);
  
  // Check if it's dark
  if (lightLevel < DARK_THRESHOLD) {
    // It's dark - turn on the street light
    digitalWrite(LED_PIN, HIGH);
  } else {
    // It's bright - turn off the street light
    digitalWrite(LED_PIN, LOW);
  }
  
  // Small delay to stabilize readings
  delay(100);
}`,
            explanations: [
                {
                    line: 0,
                    highlight: "#define LED_PIN 3",
                    explanation: "Names pin 3 as our LED (street light) output."
                },
                {
                    line: 1,
                    highlight: "#define LDR_PIN 1",
                    explanation: "Names pin 1 as our LDR analog input."
                },
                {
                    line: 5,
                    highlight: "#define DARK_THRESHOLD 1000",
                    explanation: "Sets the light level below which we consider it 'dark'. The ESP32 ADC reads 0-4095, where lower values mean less light."
                },
                {
                    line: 8,
                    highlight: "pinMode(LED_PIN, OUTPUT);",
                    explanation: "Sets the LED pin as an output so we can control the light."
                },
                {
                    line: 17,
                    highlight: "int lightLevel = analogRead(LDR_PIN);",
                    explanation: "Reads the analog value from the LDR. Returns 0-4095 based on light intensity."
                },
                {
                    line: 20,
                    highlight: "if (lightLevel < DARK_THRESHOLD) {",
                    explanation: "Checks if the light level is below our threshold - meaning it's dark outside."
                },
                {
                    line: 22,
                    highlight: "digitalWrite(LED_PIN, HIGH);",
                    explanation: "Turns on the street light when it's dark."
                },
                {
                    line: 25,
                    highlight: "digitalWrite(LED_PIN, LOW);",
                    explanation: "Turns off the street light when there's enough ambient light."
                },
                {
                    line: 29,
                    highlight: "delay(100);",
                    explanation: "A short delay to prevent the light from flickering due to rapid sensor readings."
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
            code: `#define LED_PIN 3
#define LDR_PIN 1

// Threshold for darkness (adjust as needed)
// Lower values = darker, Higher values = brighter
#define DARK_THRESHOLD 1000

void setup() {
  pinMode(LED_PIN, OUTPUT);
  // Analog pins don't need pinMode
  
  // Start with LED off
  digitalWrite(LED_PIN, LOW);
}

void loop() {
  // Read the light level (0-4095)
  int lightLevel = analogRead(LDR_PIN);
  
  // Check if it's dark
  if (lightLevel < DARK_THRESHOLD) {
    // It's dark - turn on the street light
    digitalWrite(LED_PIN, HIGH);
  } else {
    // It's bright - turn off the street light
    digitalWrite(LED_PIN, LOW);
  }
  
  // Small delay to stabilize readings
  delay(100);
}`
        },

        // ========================================
        // 13: Verify
        // ========================================
        {
            id: "verify",
            type: "verification",
            title: "Does the Street Light Work?",
            instruction: `Cover the LDR with your hand or turn off the room lights.

The LED should turn ON when it's dark and OFF when it's bright.`,
            image: "/images/lessons/pixie-m1/lesson-7/bb-pixie-demo.gif",
            confirmText: "Yes, it works!",
            troubleshootText: "It's not working"
        },

        // ========================================
        // 14: Complete
        // ========================================
        {
            id: "complete",
            type: "completion",
            title: "Automatic Street Light Complete!",
            content: `You've built your own automatic street light!

You learned how to:
• Read analog values from an LDR sensor
• Use thresholds to make decisions
• Control an LED based on light conditions

This same principle is used in outdoor lights, car headlights, and phone screen brightness!`,
            nextLesson: 8
        }
    ]
};