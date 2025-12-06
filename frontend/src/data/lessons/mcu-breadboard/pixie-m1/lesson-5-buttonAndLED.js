const REQUIRED_MODULES = ['AX22-0006', 'AX22-0007', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
    id: "buttonandLED",
    title: "Combining Modules - Button + LED",
    board: "pixie-m1",
    type: "mcu-breadboard",
    xp_reward: 150,
    requiredModules: REQUIRED_MODULES,
    thumbnail: "/images/lessons/pixie-m1/lesson-5/thumbnail.png",

    steps: [
        // ========================================
        // 1: Welcome
        // ========================================
        {
            id: "welcome",
            type: "info",
            title: "Reading Inputs",
            content: `In the last lesson, you controlled an LED with code. But real devices respond to the world around them.

In this lesson, you'll read a button press and use it to control an LED.

This is the foundation of all interactive electronics - from keyboards to game controllers.`
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
            instruction: `Insert the button and the LED module into the breadboard.`,
            kitItemIds: ["AX22-0007", "AX22-0006"],
            image: "/images/lessons/pixie-m1/lesson-5/bb-pixie-s2.gif",
            stepNumber: 3,
            totalSteps: 7
        },

        // ========================================
        // 8: Connect Grounds
        // ========================================
        {
            id: "wiring-4",
            type: "wiring-step",
            title: "Connect all grounds",
            instruction: `Connect the LED module's, and Button GND pin to GND on the PIXIE.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-5/bb-pixie-s3.gif",
            stepNumber: 4,
            totalSteps: 7
        },

        // ========================================
        // 7: Connect Power
        // ========================================
        {
            id: "wiring-5",
            type: "wiring-step",
            title: "Connect power for push button",
            instruction: `Connect the a push buttons Vin pin to PIXIEs 3.3V pin`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-5/bb-pixie-s4.gif",
            stepNumber: 5,
            totalSteps: 7
        },

        // ========================================
        // 7: Connect Signals
        // ========================================
        {
            id: "wiring-6",
            type: "wiring-step",
            title: "Connect module signals",
            instruction: `Connect the LED module's B Pin to Pin 1. And Connect Push Button S Pin to Pixies Pin 3`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-5/bb-pixie-s5.gif",
            stepNumber: 6,
            totalSteps: 7
        },

        // ========================================
        // 12: Final Circuit
        // ========================================
        {
            id: "wiring-final",
            type: "wiring-step",
            title: "Final Circuit",
            instruction: `Your circuit should look like this!

You now have an input (button) and an output (LED) connected.`,
            image: "/images/lessons/pixie-m1/lesson-5/bb-pixie-final.png",
            stepNumber: 7,
            totalSteps: 7
        },

        // ========================================
        // 13: Code Explanation
        // ========================================
        {
            id: "code-intro",
            type: "code-explanation",
            title: "Understanding the Code",
            code: `#define LED_PIN 1
#define BUTTON_PIN 3

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
            explanations: [
                {
                    line: 0,
                    highlight: "#define LED_PIN 1",
                    explanation: "Names pin 1 as our LED output."
                },
                {
                    line: 1,
                    highlight: "#define BUTTON_PIN 3",
                    explanation: "Names pin 3 as our button input."
                },
                {
                    line: 5,
                    highlight: "pinMode(BUTTON_PIN, INPUT);",
                    explanation: "Configures pin 3 as an input."
                },
                {
                    line: 9,
                    highlight: "int buttonState = digitalRead(BUTTON_PIN);",
                    explanation: "Reads the current state of the button (HIGH or LOW) and stores it."
                },
                {
                    line: 11,
                    highlight: "if (buttonState == LOW) {",
                    explanation: "Checks if button is pressed. Remember: pressed = LOW because of pull-up."
                },
                {
                    line: 12,
                    highlight: "digitalWrite(LED_PIN, HIGH);",
                    explanation: "If button is pressed, turn LED on."
                },
                {
                    line: 14,
                    highlight: "digitalWrite(LED_PIN, LOW);",
                    explanation: "If button is not pressed, turn LED off."
                }
            ]
        },

        // ========================================
        // 14: Upload
        // ========================================
        {
            id: "upload",
            type: "upload",
            title: "1. Upload Your Code - On/Off",
            instruction: `Click 'Upload Code' to flash your PIXIE M1.

Then press the button and watch the LED!`,
            code: `#define LED_PIN 1
#define BUTTON_PIN 3

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`
        },

        // ========================================
        // 15: Verify
        // ========================================
        {
            id: "verify-button-1",
            type: "verification",
            title: "Does the Button Control the LED?",
            instruction: `Press and hold the button - the LED should light up. Release the button - the LED should turn off.`,
            image: "/images/lessons/pixie-m1/lesson-5/bb-pixie-demo.gif",
            confirmText: "Yes, it works!",
            troubleshootText: "It's not working"
        },


        // ========================================
        // 21: Complete
        // ========================================
        {
            id: "complete",
            type: "completion",
            title: "Button Control Complete!",
            content: `You've learned to read inputs and respond to the physical world!`,
            nextLesson: 6
        }
    ]
};