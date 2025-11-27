const REQUIRED_MODULES = ['AX22-0007', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-button",
  title: "Button - Digital Input Control",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/pixie-m1/lesson-3/thumbnail.png",
  
  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Reading Digital Inputs",
      content: "You've learned to control outputs. Now learn to read inputs.\n\nButtons are the simplest form of user interaction. They teach you digital input pins, pull-up resistors, and how to respond to the physical world in code.\n\nBy the end, you'll read button presses and display the data on your computer."
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
      kitItemId: "MTA0007",  // PIXIE M1
      image: "/images/lessons/pixie-m1/universal-images/bb-pixie-s1.gif",
      stepNumber: 1,
      totalSteps: 5
    },
    {
      id: "wiring-2",
      type: "wiring-step",
      title: "Step 2: Connect Power Rails",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      kitItemId: "TOOL-JW-001",  // Jumper Wires
      image: "/images/lessons/lesson-3/pixie-m1/bb-pixie-s2.png",
      stepNumber: 2,
      totalSteps: 5
    },
    // ========================================
    // Connection Check (NEW!)
    // ========================================
    {
      id: "connection-check",
      type: "connection-check",
      title: "Verify Connection",
      instruction: `Let's make sure your PIXIE is properly connected to your computer.

Click the button below to establish a serial connection. This is required to upload code and see Serial Monitor output.`
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Add Button Module",
      instruction: "Insert the button module into the breadboard.",
      kitItemId: "AX22-0007",  // Button Module from Shopify
      image: "/images/lessons/lesson-3/pixie-m1/bb-pixie-s3.png",
      stepNumber: 3,
      totalSteps: 5
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Connect Button",
      instruction: "Connect the button's SIG pin to GPIO 1. Connect VCC and GND to the power rails.",
      kitItemId: "TOOL-JW-001",  // Jumper Wires
      image: "/images/lessons/lesson-3/pixie-m1/bb-pixie-s4.png",
      stepNumber: 4,
      totalSteps: 5
    },
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Step 5: Complete",
      instruction: "Circuit complete. Let's understand how button inputs work.",
      image: "/images/lessons/lesson-3/pixie-m1/bb-pixie-s4.png",
      stepNumber: 5,
      totalSteps: 5
    },
    {
      id: "button-concept",
      type: "interactive-concept",
      title: "Understanding Button Inputs",
      description: "Buttons change voltage on a pin.\n\nWith INPUT_PULLUP mode:\nReleased → Internal pullup resistor keeps pin at HIGH (3.3V)\nPressed → Button connects pin to GND, making it LOW (0V)\n\nTry pressing the virtual button to see the voltage change.",
      component: "button-press-visualizer",
      config: {
        highVoltage: 3.3,
        lowVoltage: 0,
        title: "Button Press Detection",
        explanation: "Watch how pressing the button instantly changes the voltage from HIGH to LOW. This is what digitalRead() detects.",
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
          explanation: "Set pin 1 as an INPUT with internal pullup resistor. This keeps the pin HIGH (3.3V) when the button is not pressed, preventing floating random values."
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
      instruction: "Upload this code and watch the Serial Monitor below. Try pressing your button and watch the values change from 1 (released) to 0 (pressed).",
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
      title: "Input Reading Complete",
      content: "You've learned to read digital inputs.\n\nYou learned:\n\nHow to read digital inputs with digitalRead()\nWhat INPUT_PULLUP does and why we need it\nHow button presses change voltage from HIGH to LOW\nHow to display sensor data over Serial Monitor\n\nYou earned 100 XP.\n\nNext: Learn about analog inputs with potentiometers.",
      nextLesson: 4
    }
  ]
};