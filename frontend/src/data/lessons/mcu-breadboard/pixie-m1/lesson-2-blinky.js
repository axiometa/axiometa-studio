const REQUIRED_MODULES = ['AX22-0006', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-blinky",
  title: "Blinky - Your First LED",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/lesson-2/pixie-m1/thumbnail-lesson-2.png",


  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Your First Circuit",
      content: "Now that you understand the basics, let's build something real.\n\nYou'll control an LED using code - the foundation of all hardware programming. This simple circuit teaches you digital output pins, timing, and how microcontrollers interact with the physical world.\n\nBy the end, you'll have written and uploaded your first program to control hardware."
    },
    {
      id: "hardware",
      type: "hardware",
      title: "What You'll Need",
      moduleIds: REQUIRED_MODULES
    },
    {
      id: "wiring-1",
      type: "wiring-step",
      title: "Step 1: Insert Pixie M1",
      instruction: "Place your Pixie M1 on the breadboard, straddling the center gap.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-s1.png", 
      stepNumber: 1,
      totalSteps: 5
    },
    {
      id: "wiring-2",
      type: "wiring-step",
      title: "Step 2: Connect Power",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-s2.png",
      stepNumber: 2,
      totalSteps: 5
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Place LED Module",
      instruction: "Insert the LED module into the breadboard and connect to GPIO 1.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-s3.png",
      stepNumber: 3,
      totalSteps: 5
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Connect Ground",
      instruction: "Connect the LED module's GND to the ground rail.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-s4.png",
      stepNumber: 4,
      totalSteps: 5
    },
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Step 5: Complete",
      instruction: "Circuit complete. Let's understand what happens electrically when we blink the LED.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-s4.png",
      stepNumber: 5,
      totalSteps: 5
    },
    {
      id: "voltage-visualization",
      type: "interactive-concept",
      title: "Understanding Digital Output",
      description: "A digital pin can only be in two states:\n\nHIGH (3.3V) - Electricity flows, LED turns ON\nLOW (0V) - No electricity, LED turns OFF\n\nWatch the voltage graph to see how the signal switches back and forth.",
      component: "voltage-graph",
      config: {
        highVoltage: 3.3,
        lowVoltage: 0,
        delayHigh: 1000,
        delayLow: 1000,
        showAnnotations: true,
        title: "Digital Signal - Square Wave Pattern",
        explanation: "This is what the voltage on GPIO pin 1 looks like. The sharp transitions between HIGH and LOW make the LED blink."
      },
      showControls: true,
      autoPlay: true
    },
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
          explanation: "Creates a name 'LED_PIN' for pin 1. This makes code more readable and easier to change later."
        },
        {
          line: 3,
          highlight: "pinMode(LED_PIN, OUTPUT);",
          explanation: "Configures pin 1 as an output. This tells the PIXIE M1 that this pin will send voltage out to control something."
        },
        {
          line: 7,
          highlight: "digitalWrite(LED_PIN, HIGH);",
          explanation: "Turns the LED ON by setting pin 1 to HIGH (3.3V). Current flows through the LED, making it light up."
        },
        {
          line: 8,
          highlight: "delay(1000);",
          explanation: "Pauses execution for 1000 milliseconds (1 second). The LED stays ON during this time."
        },
        {
          line: 9,
          highlight: "digitalWrite(LED_PIN, LOW);",
          explanation: "Turns the LED OFF by setting pin 1 to LOW (0V). No current flows, so the LED goes dark."
        }
      ]
    },
    {
      id: "upload",
      type: "upload",
      title: "Upload Your Code",
      instruction: "Click 'Upload Code' to flash your PIXIE M1. Watch your LED blink.",
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
    {
      id: "challenge-1",
      type: "challenge",
      title: "Challenge 1: Make it Faster",
      instruction: "Make the LED blink faster by changing the delay to 500ms.",
      hints: [
        "Find the delay() function calls",
        "1000 milliseconds = 1 second, so 500 = half a second",
        "Change both delay() calls - one for ON time, one for OFF time"
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
    {
      id: "challenge-2",
      type: "challenge",
      title: "Challenge 2: Quick Flash",
      instruction: "Create a rapid flash pattern - 100ms on, 100ms off.",
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
    {
      id: "challenge-3",
      type: "challenge",
      title: "Challenge 3: SOS Pattern",
      instruction: "Create an SOS pattern in Morse code: • • • — — — • • • (3 short, 3 long, 3 short)",
      hints: [
        "Short blink = 200ms ON, 200ms OFF",
        "Long blink = 600ms ON, 200ms OFF",
        "You'll need multiple digitalWrite() and delay() lines in sequence"
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
    {
      id: "complete",
      type: "completion",
      title: "First Circuit Complete",
      content: "You've built and programmed your first circuit.\n\nYou learned:\n\nHow to use digital output pins\nHow to control timing with delay()\nHow to create patterns with code\nWhat digital signals look like electrically\n\nYou earned 100 XP.\n\nNext: Learn how to read inputs from buttons.",
      nextLesson: 3
    }
  ]
};