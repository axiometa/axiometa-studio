const REQUIRED_MODULES = ['AX22-0004-H1', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-potentiometer",
  title: "Potentiometer - Read Analog Values",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 150,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/lesson-4/pixie-m1/thumbnail-lesson-4.png",

  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Analog Inputs",
      content: "Digital inputs are binary - on or off. Analog inputs read a range of values.\n\nPotentiometers output any voltage between 0V and 3.3V. This teaches you about voltage dividers, analog-to-digital conversion, and how to read sensor data.\n\nBy the end, you'll read continuously varying analog signals."
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
      image: "/images/lessons/lesson-4/pixie-m1/bb-pixie-s1.png", 
      stepNumber: 1,
      totalSteps: 4
    },
    {
      id: "wiring-2",
      type: "wiring-step",
      title: "Step 2: Connect Power Rails",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      image: "/images/lessons/lesson-4/pixie-m1/bb-pixie-s2.png",
      stepNumber: 2,
      totalSteps: 4
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Insert Potentiometer",
      instruction: "Insert the potentiometer module. Connect VCC to 3.3V, GND to ground, and SIG to GPIO 1 (analog pin).",
      image: "/images/lessons/lesson-4/pixie-m1/bb-pixie-s3.png",
      stepNumber: 3,
      totalSteps: 4
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Complete",
      instruction: "Circuit complete. Let's understand voltage dividers and how potentiometers work.",
      image: "/images/lessons/lesson-4/pixie-m1/bb-pixie-s4.png",
      stepNumber: 4,
      totalSteps: 4
    },
    {
      id: "voltage-divider-concept",
      type: "interactive-concept",
      title: "Voltage Dividers",
      description: "A voltage divider uses two resistors to reduce voltage. The output voltage depends on the ratio of the resistances.\n\nTry adjusting the resistor values to see how the output voltage changes.",
      component: "voltage-divider",
      config: {
        vcc: 3.3,
        title: "Voltage Dividers - The Foundation",
        explanation: "This is the principle behind many sensors. By changing resistance, we can create different voltages that the ESP32 can measure."
      },
      showControls: false,
      autoPlay: true
    },
    {
      id: "potentiometer-concept",
      type: "interactive-concept",
      title: "Potentiometers",
      description: "A potentiometer is an adjustable voltage divider.\n\nInside is a resistive track. When you turn the knob, you move a wiper that splits the total resistance into R1 and R2.\n\nRotate the virtual knob to see the internal resistances change.",
      component: "potentiometer-knob",
      config: {
        vcc: 3.3,
        totalResistance: 10000,
        title: "Potentiometer - Adjustable Voltage Divider",
        explanation: "See how rotating the knob changes R1 and R2? This changes the output voltage from 0V to 3.3V."
      },
      showControls: false,
      autoPlay: true
    },
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define POT_PIN 1

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
          highlight: "#define POT_PIN 1",
          explanation: "Pin 1 is an analog input pin on the ESP32-S3. It can read voltages from 0V to 3.3V."
        },
        {
          line: 3,
          highlight: "Serial.begin(9600);",
          explanation: "Starts serial communication so we can see the values on our computer."
        },
        {
          line: 7,
          highlight: "int potValue = analogRead(POT_PIN);",
          explanation: "Reads the voltage on pin 1 and converts it to a number from 0 (0V) to 4095 (3.3V) using the ADC."
        },
        {
          line: 9,
          highlight: 'Serial.print("Potentiometer: ");',
          explanation: "Prints a label to the serial monitor."
        },
        {
          line: 10,
          highlight: "Serial.println(potValue);",
          explanation: "Prints the potentiometer value and moves to the next line."
        },
        {
          line: 12,
          highlight: "delay(100);",
          explanation: "Wait 100ms before reading again (10 readings per second)."
        }
      ]
    },
    {
      id: "upload",
      type: "upload",
      title: "Upload and Test",
      instruction: "Upload this code and watch the Serial Monitor below. Try rotating your potentiometer and watch the values change from 0 to 4095.",
      code: `#define POT_PIN 1

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
    {
      id: "complete",
      type: "completion",
      title: "Analog Reading Complete",
      content: "You've learned to read analog inputs.\n\nYou learned:\n\nHow voltage dividers work and why we need them\nHow potentiometers are adjustable voltage dividers\nHow to read analog values with analogRead()\nHow the ESP32-S3's ADC converts voltage (0-3.3V) to numbers (0-4095)\nHow to display sensor data over Serial Monitor\nThat GPIO1-18 can all read analog values on ESP32-S3\n\nYou earned 150 XP.\n\nNext lesson: Combine inputs and outputs together.",
      nextLesson: 5
    }
  ]
};