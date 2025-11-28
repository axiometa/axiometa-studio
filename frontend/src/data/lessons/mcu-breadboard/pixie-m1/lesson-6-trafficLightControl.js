const REQUIRED_MODULES = ['AX22-0007', 'AX22-0024', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
    id: "trafficLightControl",
    title: "Traffic Light Controller",
    board: "pixie-m1",
    type: "mcu-breadboard",
    xp_reward: 200,
    requiredModules: REQUIRED_MODULES,
    thumbnail: "/images/lessons/pixie-m1/lesson-6/thumbnail.png",

    steps: [
        // ========================================
        // 1: Welcome
        // ========================================
        {
            id: "welcome",
            type: "info",
            title: "Building a Pedestrian Crossing",
            content: `You've learned to read a button and control a single LED. Now let's build something real.

In this lesson, you'll create a pedestrian crossing controller. The light stays red until someone presses the button to cross.

This is exactly how real crosswalk buttons work!`
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
            totalSteps: 8
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
            totalSteps: 8
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
            instruction: `Insert the button module and the traffic light module into the breadboard.`,
            kitItemIds: ["AX22-0007", "AX22-0024"],
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-s2.gif",
            stepNumber: 3,
            totalSteps: 8
        },

        // ========================================
        // 7: Connect Grounds
        // ========================================
        {
            id: "wiring-4",
            type: "wiring-step",
            title: "Connect all grounds",
            instruction: `Connect the traffic light module's GND pin and the button's GND pin to GND on the PIXIE.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-s3.gif",
            stepNumber: 4,
            totalSteps: 8
        },

        // ========================================
        // 8: Connect Power
        // ========================================
        {
            id: "wiring-5",
            type: "wiring-step",
            title: "Connect power for push button",
            instruction: `Connect the push button's Vin pin to PIXIE's 3.3V pin.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-s4.gif",
            stepNumber: 5,
            totalSteps: 8
        },

        // ========================================
        // 9: Connect Signals
        // ========================================
        {
            id: "wiring-6",
            type: "wiring-step",
            title: "Connect module signals",
            instruction: `Connect the push button's S pin to PIXIE's Pin 5`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-s5.gif",
            stepNumber: 6,
            totalSteps: 8
        },

        // ========================================
        // 9: Connect Signals
        // ========================================
        {
            id: "wiring-6",
            type: "wiring-step",
            title: "Connect module signals",
            instruction: `Connect the traffic light module signals
• R (Red) pin to Pin 3
• Y (Yellow) pin to Pin 1
• G (Green) pin to Pin 2`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-s6.gif",
            stepNumber: 7,
            totalSteps: 8
        },

        // ========================================
        // 10: Final Circuit
        // ========================================
        {
            id: "wiring-final",
            type: "wiring-step",
            title: "Final Circuit",
            instruction: `Your circuit should look like this!

You now have a pedestrian button and traffic lights ready to go.`,
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-final.png",
            stepNumber: 8,
            totalSteps: 8
        },

        // ========================================
        // 11: Code Explanation
        // ========================================
        {
            id: "code-intro",
            type: "code-explanation",
            title: "Understanding the Code",
            code: `#define RED_PIN 3
#define YELLOW_PIN 1
#define GREEN_PIN 2
#define BUTTON_PIN 5

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
  
  // Start with red light on
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
}

void loop() {
  // Check if button is pressed
  if (digitalRead(BUTTON_PIN) == LOW) {
    
    // Red to Yellow
    digitalWrite(RED_PIN, LOW);
    digitalWrite(YELLOW_PIN, HIGH);
    delay(2000);
    
    // Yellow to Green
    digitalWrite(YELLOW_PIN, LOW);
    digitalWrite(GREEN_PIN, HIGH);
    delay(3000);
    
    // Flash green 5 times
    for (int i = 0; i < 5; i++) {
      digitalWrite(GREEN_PIN, LOW);
      delay(500);
      digitalWrite(GREEN_PIN, HIGH);
      delay(500);
    }
    
    // Green to Yellow
    digitalWrite(GREEN_PIN, LOW);
    digitalWrite(YELLOW_PIN, HIGH);
    delay(2000);
    
    // Yellow to Red
    digitalWrite(YELLOW_PIN, LOW);
    digitalWrite(RED_PIN, HIGH);
  }
}`,
            explanations: [
                {
                    line: 0,
                    highlight: "#define RED_PIN 3",
                    explanation: "Names pin 3 as our red LED output."
                },
                {
                    line: 1,
                    highlight: "#define YELLOW_PIN 1",
                    explanation: "Names pin 1 as our yellow LED output."
                },
                {
                    line: 2,
                    highlight: "#define GREEN_PIN 2",
                    explanation: "Names pin 2 as our green LED output."
                },
                {
                    line: 3,
                    highlight: "#define BUTTON_PIN 5",
                    explanation: "Names pin 5 as our button input."
                },
                {
                    line: 12,
                    highlight: "digitalWrite(RED_PIN, HIGH);",
                    explanation: "Starts with red light on - the default state."
                },
                {
                    line: 19,
                    highlight: "if (digitalRead(BUTTON_PIN) == LOW) {",
                    explanation: "Checks if button is pressed to start the crossing sequence."
                },
                {
                    line: 31,
                    highlight: "for (int i = 0; i < 5; i++) {",
                    explanation: "A loop that flashes the green light 5 times to warn pedestrians."
                },
                {
                    line: 32,
                    highlight: "digitalWrite(GREEN_PIN, LOW);",
                    explanation: "Turns green off for the flash effect."
                },
                {
                    line: 34,
                    highlight: "digitalWrite(GREEN_PIN, HIGH);",
                    explanation: "Turns green back on to complete one flash."
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
            instruction: `Click 'Upload Code' to flash your PIXIE M1.

Press the button and watch the full crossing sequence!`,
            code: `#define RED_PIN 3
#define YELLOW_PIN 1
#define GREEN_PIN 2
#define BUTTON_PIN 5

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
  
  // Start with red light on
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
}

void loop() {
  // Check if button is pressed
  if (digitalRead(BUTTON_PIN) == LOW) {
    
    // Red to Yellow
    digitalWrite(RED_PIN, LOW);
    digitalWrite(YELLOW_PIN, HIGH);
    delay(2000);
    
    // Yellow to Green
    digitalWrite(YELLOW_PIN, LOW);
    digitalWrite(GREEN_PIN, HIGH);
    delay(3000);
    
    // Flash green 5 times
    for (int i = 0; i < 5; i++) {
      digitalWrite(GREEN_PIN, LOW);
      delay(500);
      digitalWrite(GREEN_PIN, HIGH);
      delay(500);
    }
    
    // Green to Yellow
    digitalWrite(GREEN_PIN, LOW);
    digitalWrite(YELLOW_PIN, HIGH);
    delay(2000);
    
    // Yellow to Red
    digitalWrite(YELLOW_PIN, LOW);
    digitalWrite(RED_PIN, HIGH);
  }
}`
        },

        // ========================================
        // 13: Verify
        // ========================================
        {
            id: "verify",
            type: "verification",
            title: "Does the Crossing Work?",
            instruction: `Press the button - the sequence should be:

Red → Yellow (2s) → Green (3s) → Flashing Green → Yellow (2s) → Red`,
            image: "/images/lessons/pixie-m1/lesson-6/bb-pixie-demo.gif",
            confirmText: "Yes, it works!",
            troubleshootText: "It's not working"
        },

        // ========================================
        // 14: Complete
        // ========================================
        {
            id: "complete",
            type: "completion",
            title: "Traffic Light Controller Complete!",
            content: `You've built a real pedestrian crossing controller!`,
            nextLesson: 7
        }
    ]
};