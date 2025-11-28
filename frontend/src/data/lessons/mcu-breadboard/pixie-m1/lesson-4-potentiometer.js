// LESSON 4 - Potentiometer

const REQUIRED_MODULES = ['AX22-0004-H1', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-potentiometer",
  title: "Potentiometer - Analog Input",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 150,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/pixie-m1/lesson-4/thumbnail.png",

  steps: [
    // ========================================
    // 1: Welcome
    // ========================================
    {
      id: "welcome",
      type: "info",
      title: "Beyond On and Off",
      content: `Digital inputs are binary - on or off. Analog inputs read a range of values.

Potentiometers output any voltage between 0V and 3.3V - like a dimmer switch instead of a light switch.

By the end, you'll read continuously varying analog signals.`
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
    // 6: Insert Potentiometer Module
    // ========================================
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Insert Potentiometer Module",
      instruction: `Insert the potentiometer module into the breadboard.`,
      kitItemId: "AX22-0004",
      image: "/images/lessons/pixie-m1/lesson-4/bb-pixie-s2.gif",
      stepNumber: 3,
      totalSteps: 7
    },

    // ========================================
    // 7: Connect Signal
    // ========================================
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Connect Ground Wire",
      instruction: `Connect potentiometers G to G on the PIXIE.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-4/bb-pixie-s3.gif",
      stepNumber: 4,
      totalSteps: 7
    },

    // ========================================
    // 8: Connect Power
    // ========================================
    {
      id: "wiring-5",
      type: "wiring-step",
      title: "Connect Power",
      instruction: `Connect potentiometers Vin to 3V3 on the PIXIE`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-4/bb-pixie-s4.gif",
      stepNumber: 5,
      totalSteps: 7
    },

    // ========================================
    // 8: Connect Power
    // ========================================
    {
      id: "wiring-6",
      type: "wiring-step",
      title: "Connect Signal",
      instruction: `Connect potentiometers A pin to Pin 3 on the pixie.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-4/bb-pixie-s5.gif",
      stepNumber: 6,
      totalSteps: 7
    },

    // ========================================
    // 9: Final Circuit
    // ========================================
    {
      id: "wiring-7",
      type: "wiring-step",
      title: "Final Circuit",
      instruction: `Your circuit should look like this!`,
      image: "/images/lessons/pixie-m1/lesson-4/bb-pixie-final.png",
      stepNumber: 7,
      totalSteps: 7
    },


    // ========================================
    // 10: Understanding Voltage Dividers
    // ========================================
    {
      id: "voltage-divider-concept",
      type: "interactive-concept",
      title: "Understanding Voltage Dividers",
      description: `A voltage divider uses two resistors to create any voltage between 0V and VCC.

The output voltage depends on the ratio of the resistances.

Adjust the resistor values to see how output voltage changes.`,
      component: "voltage-divider",
      config: {
        vcc: 3.3,
        title: "Voltage Dividers - The Foundation",
        explanation: "This principle is behind many sensors. By changing resistance, we create different voltages."
      },
      showControls: false,
      autoPlay: true
    },

    // ========================================
    // 11: How Potentiometers Work
    // ========================================
    {
      id: "potentiometer-concept",
      type: "interactive-concept",
      title: "How Potentiometers Work",
      description: `A potentiometer is an adjustable voltage divider.

Turn the knob → move the wiper → change R1 and R2 → change output voltage.

Rotate the virtual knob to see inside.`,
      component: "potentiometer-knob",
      config: {
        vcc: 3.3,
        totalResistance: 10000,
        title: "Potentiometer - Adjustable Voltage Divider",
        explanation: "See how rotating changes R1 and R2? This sweeps output from 0V to 3.3V."
      },
      showControls: false,
      autoPlay: true
    },

    // ========================================
    // 12: Code Explanation
    // ========================================
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define POT_PIN 3

void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  
  Serial.print("Potentiometer: ");
  Serial.println(potValue);
  
  delay(100);
}`,
      explanations: [
        {
          line: 0,
          highlight: "#define POT_PIN 3",
          explanation: "Creates a name 'POT_PIN' for pin 3. This pin can read analog voltages."
        },
        {
          line: 3,
          highlight: "Serial.begin(9600);",
          explanation: "Starts serial communication so we can see values on our computer."
        },
        {
          line: 7,
          highlight: "int potValue = analogRead(POT_PIN);",
          explanation: "Reads the voltage and converts it to a number: 0 (0V) to 4095 (3.3V)."
        },
        {
          line: 9,
          highlight: 'Serial.print("Potentiometer: ");',
          explanation: "Prints a label to the serial monitor."
        },
        {
          line: 10,
          highlight: "Serial.println(potValue);",
          explanation: "Prints the value (0-4095) and moves to next line."
        },
        {
          line: 12,
          highlight: "delay(100);",
          explanation: "Wait 100ms before reading again (10 readings per second)."
        }
      ]
    },

    // ========================================
    // 13: Upload
    // ========================================
    {
      id: "upload",
      type: "upload",
      title: "Upload Your Code",
      instruction: `Click 'Upload Code' to flash your PIXIE M1.

Rotate your potentiometer and watch the values change from 0 to 4095!`,
      code: `#define POT_PIN 3

void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  
  Serial.print("Potentiometer: ");
  Serial.println(potValue);
  
  delay(100);
}`
    },

    // ========================================
    // 14: Verify
    // ========================================
    {
      id: "verify-pot",
      type: "verification",
      title: "Is Your Potentiometer Working?",
      instruction: `Rotate your potentiometer and watch the Serial Monitor.

You should see:
- Values near 0 at one end
- Values near 4095 at the other end
- Smooth changes as you rotate`,
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
          title: "Values stuck at 0 or 4095?",
          description: "VCC and GND might be swapped"
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
    // 15: Complete
    // ========================================
    {
      id: "complete",
      type: "completion",
      title: "Potentiometer Complete! 🎉",
      content: `You've learned to read analog inputs!`,
      nextLesson: 5
    }
  ]
};