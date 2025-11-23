const REQUIRED_MODULES = ['AX22-0007', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-button",
  title: "Button - Digital Input Control",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/lesson-2/pixie-m1/thumbnail-lesson-2.png",
  
  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Welcome to Digital Inputs!",
      content: "You're about to learn how to read button presses using digital input pins.\n\nBy the end of this lesson, you'll understand:\n• Digital input pins (vs output pins)\n• What INPUT_PULLUP means and why we need it\n• How to read button states with digitalRead()\n• How to display sensor data over Serial Monitor"
    },
    {
      id: "hardware",
      type: "hardware",
      title: "What You'll Need",
      moduleIds: ['AX22-0007', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007']
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
      title: "Step 2: Connect Power Rails",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s2.png",
      stepNumber: 2,
      totalSteps: 5
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Add Button Module",
      instruction: "Insert the button module into the breadboard.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s3.png",
      stepNumber: 3,
      totalSteps: 5
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Connect Button",
      instruction: "Connect the button's SIG pin to GPIO 1. Connect VCC and GND to the power rails.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s4.png",
      stepNumber: 4,
      totalSteps: 5
    },
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Step 5: Complete!",
      instruction: "Done! Your circuit is ready. Let's understand how button inputs work.",
      image: "/images/lessons/lesson-2/pixie-m1/bb-pixie-l2s4.png",
      stepNumber: 5,
      totalSteps: 5
    },
    {
      id: "button-concept",
      type: "interactive-concept",
      title: "Understanding Button Inputs",
      description: "Before we code, let's understand what happens electrically when you press a button.\n\nWhen using INPUT_PULLUP mode:\n• Button RELEASED → Internal pullup resistor keeps pin at HIGH (3.3V)\n• Button PRESSED → Button connects pin to GND, making it LOW (0V)\n\nTry pressing the virtual button below and watch the voltage change!",
      component: "button-press-visualizer",
      config: {
        highVoltage: 3.3,
        lowVoltage: 0,
        title: "Button Press Detection",
        explanation: "Watch how pressing the button instantly changes the voltage from HIGH to LOW. This is what digitalRead() detects!",
        showLED: false
      },
      showControls: true,
      autoPlay: false
    },
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define BUTTON_PIN 1

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  Serial.print("Button: ");
  Serial.println(buttonState);
  
  delay(100);
}`,
      explanations: [
        {
          line: 0,
          highlight: "#define BUTTON_PIN 1",
          explanation: "Define GPIO pin 1 for our button input."
        },
        {
          line: 3,
          highlight: "Serial.begin(9600);",
          explanation: "Start serial communication so we can see the button state on our computer."
        },
        {
          line: 4,
          highlight: "pinMode(BUTTON_PIN, INPUT_PULLUP);",
          explanation: "Set pin 1 as an INPUT with internal pullup resistor. This keeps the pin HIGH (3.3V) when the button is not pressed, preventing 'floating' random values."
        },
        {
          line: 8,
          highlight: "int buttonState = digitalRead(BUTTON_PIN);",
          explanation: "Read the button state. With INPUT_PULLUP, it returns HIGH (1) when released, LOW (0) when pressed."
        },
        {
          line: 10,
          highlight: 'Serial.print("Button: ");',
          explanation: "Print a label to the serial monitor."
        },
        {
          line: 11,
          highlight: "Serial.println(buttonState);",
          explanation: "Print the button state (1 = released, 0 = pressed) and move to the next line."
        },
        {
          line: 13,
          highlight: "delay(100);",
          explanation: "Wait 100ms before reading again (10 readings per second)."
        }
      ]
    },
    {
      id: "upload",
      type: "upload",
      title: "Upload and Test",
      instruction: "Upload this code and watch the Serial Monitor below. Try pressing your button and watch the values change from 1 (released) to 0 (pressed)!",
      code: `#define BUTTON_PIN 1

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  Serial.print("Button: ");
  Serial.println(buttonState);
  
  delay(100);
}`
    },
    {
      id: "complete",
      type: "completion",
      title: "🎉 Lesson Complete!",
      content: "Congratulations! You've learned:\n• How to read digital inputs with digitalRead()\n• What INPUT_PULLUP does and why we need it\n• How button presses change voltage from HIGH to LOW\n• How to display sensor data over Serial Monitor\n\nYou earned 100 XP!",
      nextLesson: 3
    }
  ]
};