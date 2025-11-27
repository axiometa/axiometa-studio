// LESSON 3 - Button

const REQUIRED_MODULES = ['AX22-0007', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-button",
  title: "Button - Digital Input",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 100,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/pixie-m1/lesson-3/thumbnail.png",

  steps: [
    // ========================================
    // 1: Welcome
    // ========================================
    {
      id: "welcome",
      type: "info",
      title: "Reading Inputs",
      content: `You've learned to control outputs. Now learn to read inputs.

Buttons are the simplest form of user interaction - they're how your hardware listens to you.

By the end, you'll read button presses and display the data on your computer.`
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
      totalSteps: 6
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
      totalSteps: 6
    },

    // ========================================
    // 5: Connection Check
    // ========================================
    {
      id: "connection-check",
      type: "connection-check",
      title: "Verify Connection",
      instruction: `Let's make sure your PIXIE is properly connected to your computer.

Click the button below to establish a serial connection. This is required to upload code and see Serial Monitor output.`
    },

    // ========================================
    // 6: Insert Button Module
    // ========================================
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Insert Button Module",
      instruction: `Insert the button module into the breadboard.`,
      kitItemId: "AX22-0007",
      image: "/images/lessons/pixie-m1/lesson-3/bb-pixie-s3.gif",
      stepNumber: 3,
      totalSteps: 6
    },

    // ========================================
    // 7: Connect Signal
    // ========================================
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Connect Signal",
      instruction: `Connect the button's SIG pin to Pin 1 on the PIXIE.

This is how the PIXIE will "hear" your button presses.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-3/bb-pixie-s4.gif",
      stepNumber: 4,
      totalSteps: 6
    },

    // ========================================
    // 8: Connect Power
    // ========================================
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Connect Power",
      instruction: `Connect VCC to 3.3V and GND to GND on the PIXIE.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-3/bb-pixie-s5.gif",
      stepNumber: 5,
      totalSteps: 6
    },

    // ========================================
    // 9: Final Circuit
    // ========================================
    {
      id: "wiring-6",
      type: "wiring-step",
      title: "Final Circuit",
      instruction: `Your circuit should look like this!`,
      image: "/images/lessons/pixie-m1/lesson-3/bb-pixie-final.png",
      stepNumber: 6,
      totalSteps: 6
    },

    // ========================================
    // 10: Understanding Digital Input
    // ========================================
    {
      id: "button-visualization",
      type: "interactive-concept",
      title: "Understanding Digital Input",
      description: `With INPUT_PULLUP mode:

Released → Pin reads HIGH (3.3V)
Pressed → Pin reads LOW (0V)

Try pressing the virtual button to see the voltage change.`,
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

    // ========================================
    // 11: Code Explanation
    // ========================================
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
          explanation: "Creates a name 'BUTTON_PIN' for pin 1. Makes code readable and easy to change."
        },
        {
          line: 3,
          highlight: "Serial.begin(9600);",
          explanation: "Starts serial communication so we can see values on our computer."
        },
        {
          line: 4,
          highlight: "pinMode(BUTTON_PIN, INPUT_PULLUP);",
          explanation: "Configures pin 1 as input with internal pullup. Keeps pin HIGH when button is released."
        },
        {
          line: 8,
          highlight: "int buttonState = digitalRead(BUTTON_PIN);",
          explanation: "Reads the pin voltage. Returns 1 (HIGH) when released, 0 (LOW) when pressed."
        },
        {
          line: 10,
          highlight: 'Serial.print("Button: ");',
          explanation: "Prints a label to the serial monitor."
        },
        {
          line: 11,
          highlight: "Serial.println(buttonState);",
          explanation: "Prints the button state (1 or 0) and moves to next line."
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

Watch the Serial Monitor - press your button and see the values change!`,
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

    // ========================================
    // 13: Verify
    // ========================================
    {
      id: "verify-button",
      type: "verification",
      title: "Is Your Button Working?",
      instruction: `Press your button and watch the Serial Monitor.

You should see:
- 1 when released
- 0 when pressed`,
      showSerialMonitor: true,
      troubleshootTips: [
        {
          title: "Check signal wire",
          description: "SIG pin should connect to Pin 1 on PIXIE"
        },
        {
          title: "Verify power connections",
          description: "VCC to 3.3V, GND to GND"
        },
        {
          title: "Check module orientation",
          description: "Make sure the button module is fully inserted"
        },
        {
          title: "Re-upload code",
          description: "Try uploading the code again"
        }
      ],
      confirmText: "Yes, it's working! 🎉",
      troubleshootText: "It's not working"
    },

    // ========================================
    // 14: Complete
    // ========================================
    {
      id: "complete",
      type: "completion",
      title: "Button Complete! 🎉",
      content: `You've learned to read digital inputs!

You learned:
- Digital input pins (HIGH/LOW)
- What INPUT_PULLUP does
- Reading values with digitalRead()
- Displaying data over Serial Monitor

Next: Learn to read analog values with potentiometers.`,
      nextLesson: 4
    }
  ]
};