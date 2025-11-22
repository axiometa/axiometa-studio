export const lesson = {
  id: "mcu-breadboard-blinky",
  title: "Blinky - Your First LED",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: ['LED', 'BREADBOARD', 'JUMPER_WIRES'],
  
  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Welcome to Your First Lesson!",
      content: "You're about to learn how to control an LED - the 'Hello World' of hardware programming.\n\nBy the end of this lesson, you'll understand:\n• Digital output pins\n• Timing with delay()\n• How to control LEDs"
    },
    {
      id: "hardware",
      type: "hardware",
      title: "What You'll Need",
      // Use module IDs instead of hardcoded items
      moduleIds: ['LED', 'BREADBOARD', 'JUMPER_WIRES']
      // The HardwareStep component will fetch details from modules.js
    },
    {
      id: "wiring-1",
      type: "wiring-step",
      title: "Step 1: Insert Pixie M1",
      instruction: "Place your Pixie M1 on the breadboard, straddling the center gap.",
      image: "/images/lessons/lesson-1/pixie-m1/bb-pixie-l1s1.png", 
      stepNumber: 1,
      totalSteps: 5
    },
    {
      id: "wiring-2",
      type: "wiring-step",
      title: "Step 2: Connect Power",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      image: "/images/lessons/lesson-1/pixie-m1/bb-pixie-l1s2.png",
      stepNumber: 2,
      totalSteps: 5
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Place LED Module",
      instruction: "Insert the LED module into the breadboard and connect to GPIO 12.",
      image: "/images/lessons/lesson-1/pixie-m1/bb-pixie-l1s3.png",
      stepNumber: 3,
      totalSteps: 5
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Connect Ground",
      instruction: "Connect the LED module's GND to the ground rail.",
      image: "/images/lessons/lesson-1/pixie-m1/bb-pixie-l1s4.png",
      stepNumber: 4,
      totalSteps: 5
    },
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Step 5: Complete!",
      instruction: "Done! Your circuit is complete. Let's move on to understanding the code.",
      image: "/images/lessons/lesson-1/pixie-m1/bb-pixie-l1s4.png",
      stepNumber: 5,
      totalSteps: 5
    },
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define LED_PIN 12

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
          highlight: "#define LED_PIN 12",
          explanation: "This creates a name 'LED_PIN' for pin 12. This is the pin we'll control!"
        },
        {
          line: 3,
          highlight: "pinMode(LED_PIN, OUTPUT);",
          explanation: "Tells the ESP32 that pin 12 will be used to send power OUT."
        },
        {
          line: 7,
          highlight: "digitalWrite(LED_PIN, HIGH);",
          explanation: "Turn the LED ON by sending power (HIGH = 3.3V) to pin 12."
        },
        {
          line: 8,
          highlight: "delay(1000);",
          explanation: "Wait for 1000 milliseconds (1 second) before continuing."
        },
        {
          line: 9,
          highlight: "digitalWrite(LED_PIN, LOW);",
          explanation: "Turn the LED OFF by stopping power (LOW = 0V) to pin 12."
        }
      ]
    },
    {
      id: "upload",
      type: "upload",
      title: "Upload Your Code",
      instruction: "Click the 'Upload Code' button below to flash your ESP32!",
      code: `#define LED_PIN 12

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
      instruction: "Can you make the LED blink faster? Try changing the delay to 500ms instead of 1000ms.",
      hints: [
        "Look for the delay() function calls",
        "1000 milliseconds = 1 second, so 500 = half a second",
        "You need to change BOTH delay() calls - one for ON time, one for OFF time"
      ],
      code: `#define LED_PIN 12

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
      instruction: "Make it blink really fast - 100ms on, 100ms off!",
      hints: [
        "100 milliseconds is 0.1 seconds - that's fast!",
        "Remember to change both delays"
      ],
      code: `#define LED_PIN 12

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
      instruction: "Create an SOS pattern! SOS in Morse code is: • • • — — — • • • (3 short, 3 long, 3 short)",
      hints: [
        "Short blink = 200ms ON, 200ms OFF",
        "Long blink = 600ms ON, 200ms OFF",
        "You'll need to write multiple digitalWrite() and delay() lines in sequence"
      ],
      code: `#define LED_PIN 12

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
      title: "🎉 Lesson Complete!",
      content: "Congratulations! You've learned:\n• How to use digital output pins\n• How to control timing with delay()\n• How to create patterns with code\n\nYou earned 100 XP!",
      nextLesson: 2
    }
  ]
};