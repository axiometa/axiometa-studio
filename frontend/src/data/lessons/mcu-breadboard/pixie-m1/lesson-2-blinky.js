const REQUIRED_MODULES = ['AX22-0006', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-blinky",
  title: "Blinky - Your First LED",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/pixie-m1/lesson-2/thumbnail.png",

  steps: [
    // ========================================
    // 1: Welcome
    // ======================================== 
    {
      id: "welcome",
      type: "info",
      title: "Your First Program",
      content: `Now that you understand the basics, let's build something real.

You'll control an LED using code - the foundation of all hardware programming.

By the end, you'll have written and uploaded your first program to control hardware.`
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
      kitItemId: "MTA0007",  // PIXIE M1
      image: "/images/lessons/pixie-m1/lesson-2/bb-pixie-s1.gif",
      stepNumber: 1,
      totalSteps: 4
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
      totalSteps: 4
    },

    // ========================================
    // 5: Insert LED Module
    // ========================================
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Insert LED Module",
      instruction: `Insert the LED module into the breadboard.

Connect the signal pin to GPIO 1.`,
      kitItemId: "AX22-0006",  // LED Module from Shopify
      image: "/images/lessons/pixie-m1/lesson-2/bb-pixie-s2.gif",
      stepNumber: 3,
      totalSteps: 4
    },

    // ========================================
    // 6: Connect Ground
    // ========================================
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Connect Ground",
      instruction: `Connect the LED module's GND pin to GND on the PIXIE.

Circuit complete! Now let's program it.`,
      kitItemId: "TOOL-JW-001",  // Jumper Wires
      image: "/images/lessons/pixie-m1/lesson-2/bb-pixie-s3.gif",
      stepNumber: 4,
      totalSteps: 4
    },

    // ========================================
    // 8: Understanding Digital Output
    // ========================================
    {
      id: "voltage-visualization",
      type: "interactive-concept",
      title: "Understanding Digital Output",
      description: `A digital pin has two states:

HIGH (3.3V) → LED ON
LOW (0V) → LED OFF

Watch the signal switch back and forth.`,
      component: "voltage-graph",
      config: {
        highVoltage: 3.3,
        lowVoltage: 0,
        delayHigh: 1000,
        delayLow: 1000,
        showAnnotations: true
      },
      showControls: true,
      autoPlay: true
    },

    // ========================================
    // 9: Code Explanation
    // ========================================
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define LED_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`,
      explanations: [
        {
          line: 0,
          highlight: "#define LED_PIN 1",
          explanation: "Creates a name 'LED_PIN' for pin 1. Makes code readable and easy to change."
        },
        {
          line: 3,
          highlight: "pinMode(LED_PIN, OUTPUT);",
          explanation: "Configures pin 1 as an output. This pin will send voltage out."
        },
        {
          line: 7,
          highlight: "digitalWrite(LED_PIN, HIGH);",
          explanation: "Sets pin 1 to HIGH (3.3V). Current flows, LED turns ON."
        },
        {
          line: 8,
          highlight: "delay(1000);",
          explanation: "Pauses for 1000ms (1 second). LED stays ON."
        },
        {
          line: 9,
          highlight: "digitalWrite(LED_PIN, LOW);",
          explanation: "Sets pin 1 to LOW (0V). No current, LED turns OFF."
        }
      ]
    },

    // ========================================
    // 10: Upload
    // ========================================
    {
      id: "upload",
      type: "upload",
      title: "Upload Your Code",
      instruction: `Click 'Upload Code' to flash your PIXIE M1.

Watch your LED blink!`,
      code: `#define LED_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`
    },

    // ========================================
    // 11: Verify
    // ========================================
    {
      id: "verify-blink",
      type: "verification",
      title: "Is Your LED Blinking?",
      instruction: `Your LED should be blinking on and off every second.

If it's not working, check:
• All wiring connections
• LED direction (long leg to resistor)
• Code uploaded successfully`,
      image: "/images/lessons/pixie-m1/lesson-2/led-blinking.gif",
      confirmText: "Yes, it's blinking! 💡",
      troubleshootText: "It's not working"
    },

    // ========================================
    // 12: Challenge 1
    // ========================================
    {
      id: "challenge-1",
      type: "challenge",
      title: "Challenge: Make it Faster",
      instruction: `Make the LED blink faster by changing the delay to 500ms.`,
      hints: [
        "Find the delay() function calls",
        "1000 milliseconds = 1 second, so 500 = half a second",
        "Change both delay() calls"
      ],
      code: `#define LED_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`
    },

    // ========================================
    // 13: Challenge 2
    // ========================================
    {
      id: "challenge-2",
      type: "challenge",
      title: "Challenge: Quick Flash",
      instruction: `Create a rapid flash pattern - 100ms on, 100ms off.`,
      hints: [
        "100 milliseconds is 0.1 seconds",
        "Change both delays to 100"
      ],
      code: `#define LED_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`
    },

    // ========================================
    // 14: Challenge 3
    // ========================================
    {
      id: "challenge-3",
      type: "challenge",
      title: "Challenge: SOS Pattern",
      instruction: `Create an SOS pattern in Morse code:
• • • — — — • • •
(3 short, 3 long, 3 short)`,
      hints: [
        "Short blink = 200ms ON, 200ms OFF",
        "Long blink = 600ms ON, 200ms OFF",
        "You'll need multiple digitalWrite() and delay() lines"
      ],
      code: `#define LED_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);
  delay(100);
}`
    },

    // ========================================
    // 15: Complete
    // ========================================
    {
      id: "complete",
      type: "completion",
      title: "Blinky Complete! 🎉",
      content: `You've built and programmed your first circuit!

You learned:
• Digital output pins (HIGH/LOW)
• Timing with delay()
• Creating patterns with code

Next: Learn how to read inputs from buttons.`,
      nextLesson: 3
    }
  ]
};