export const lesson = {
  id: "mcu-breadboard-button",
  title: "Button - Use a button!",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: ['LED', 'BUTTON', 'BREADBOARD', 'JUMPER_WIRES'],
  
  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Welcome to Your Second Lesson!",
      content: "You're about to learn how to use a button to control an LED.\n\nBy the end of this lesson, you'll understand:\n• Digital input pins\n• Reading button states\n• Controlling outputs based on inputs"
    },
    {
      id: "hardware",
      type: "hardware",
      title: "What You'll Need",
      moduleIds: ['LED', 'BUTTON', 'BREADBOARD', 'JUMPER_WIRES']
    },
    {
      id: "wiring-1",
      type: "wiring-step",
      title: "Step 1: Insert Pixie M1",
      instruction: "Place your Pixie M1 on the breadboard, straddling the center gap.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s1.png", 
      stepNumber: 1,
      totalSteps: 5
    },
    {
      id: "wiring-2",
      type: "wiring-step",
      title: "Step 2: Connect Power",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s2.png",
      stepNumber: 2,
      totalSteps: 5
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Add Button and LED",
      instruction: "Insert the button and LED modules into the breadboard.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s3.png",
      stepNumber: 3,
      totalSteps: 5
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Connect Components",
      instruction: "Connect button to GPIO 14 and LED to GPIO 12.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s4.png",
      stepNumber: 4,
      totalSteps: 5
    },
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Step 5: Complete!",
      instruction: "Done! Your circuit is complete. Let's move on to the code.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s4.png",
      stepNumber: 5,
      totalSteps: 5
    },
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define LED_PIN 12
#define BUTTON_PIN 14

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
      explanations: [
        {
          line: 0,
          highlight: "#define BUTTON_PIN 14",
          explanation: "Define pin 14 for our button input."
        },
        {
          line: 5,
          highlight: "pinMode(BUTTON_PIN, INPUT_PULLUP);",
          explanation: "Set pin 14 as input with internal pullup resistor."
        },
        {
          line: 9,
          highlight: "digitalRead(BUTTON_PIN) == LOW",
          explanation: "Read button state - LOW means pressed (pullup makes it LOW when pressed)."
        },
        {
          line: 10,
          highlight: "digitalWrite(LED_PIN, HIGH);",
          explanation: "Turn LED ON when button is pressed."
        }
      ]
    },
    {
      id: "upload",
      type: "upload",
      title: "Upload Your Code",
      instruction: "Upload this code and try pressing the button!",
      code: `#define LED_PIN 12
#define BUTTON_PIN 14

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`
    },
    {
      id: "complete",
      type: "completion",
      title: "🎉 Lesson Complete!",
      content: "Congratulations! You've learned:\n• How to read digital inputs\n• How to use buttons with pullup resistors\n• How to control outputs based on inputs\n\nYou earned 100 XP!",
      nextLesson: 3
    }
  ]
};