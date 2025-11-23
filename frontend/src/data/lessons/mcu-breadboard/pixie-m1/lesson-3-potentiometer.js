const REQUIRED_MODULES = ['AX22-0004-H1', 'TOOL-BB-001', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "mcu-breadboard-potentiometer",
  title: "Potentiometer - Read Analog Values",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 150,
  requiredModules: REQUIRED_MODULES,
  
  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Welcome to Analog Inputs!",
      content: "You're about to learn how to read analog sensors - values that can be anything between 0 and 3.3V, not just ON/OFF!\n\nBy the end of this lesson, you'll understand:\n• Analog vs Digital signals\n• How voltage dividers work\n• How potentiometers are adjustable voltage dividers\n• Reading analog values with analogRead()"
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
      image: "/images/lessons/lesson-pot/pixie-m1/bb-pixie-pot-s1.png", 
      stepNumber: 1,
      totalSteps: 4
    },
    {
      id: "wiring-2",
      type: "wiring-step",
      title: "Step 2: Connect Power Rails",
      instruction: "Connect 3.3V and GND from Pixie M1 to the power rails.",
      image: "/images/lessons/lesson-pot/pixie-m1/bb-pixie-pot-s2.png",
      stepNumber: 2,
      totalSteps: 4
    },
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Step 3: Insert Potentiometer",
      instruction: "Insert the potentiometer module. Connect VCC to 3.3V, GND to ground, and SIG to GPIO 34 (analog pin).",
      image: "/images/lessons/lesson-pot/pixie-m1/bb-pixie-pot-s3.png",
      stepNumber: 3,
      totalSteps: 4
    },
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Step 4: Complete!",
      instruction: "Done! Your circuit is ready. Let's understand how this works.",
      image: "/images/lessons/lesson-pot/pixie-m1/bb-pixie-pot-s4.png",
      stepNumber: 4,
      totalSteps: 4
    },
    {
      id: "voltage-divider-concept",
      type: "interactive-concept",
      title: "First: Understanding Voltage Dividers",
      description: "Before we learn about potentiometers, we need to understand voltage dividers - a fundamental circuit in electronics.\n\nA voltage divider uses TWO resistors to reduce voltage. The output voltage depends on the ratio of the resistances.\n\nTry adjusting the resistor values below and watch how the output voltage changes:",
      component: "voltage-divider",
      config: {
        vcc: 3.3,
        title: "Voltage Dividers - The Foundation",
        explanation: "This is the principle behind many sensors! By changing resistance, we can create different voltages that the ESP32 can measure."
      },
      showControls: false,
      autoPlay: true
    },
    {
      id: "potentiometer-concept",
      type: "interactive-concept",
      title: "Now: Meet the Potentiometer!",
      description: "A potentiometer is simply an ADJUSTABLE voltage divider!\n\nInside the potentiometer is a resistive track. When you turn the knob, you move a 'wiper' that splits the total resistance into R1 and R2.\n\nRotate the virtual knob below and watch the internal resistances change:",
      component: "potentiometer-knob",
      config: {
        vcc: 3.3,
        totalResistance: 10000,
        title: "Potentiometer - Adjustable Voltage Divider",
        explanation: "See how rotating the knob changes R1 and R2? This changes the output voltage from 0V to 3.3V!"
      },
      showControls: false,
      autoPlay: true
    },
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define POT_PIN 34

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
          highlight: "#define POT_PIN 34",
          explanation: "Pin 34 is an analog input pin on the ESP32. It can read voltages from 0V to 3.3V."
        },
        {
          line: 3,
          highlight: "Serial.begin(9600);",
          explanation: "Starts serial communication so we can see the values on our computer."
        },
        {
          line: 7,
          highlight: "int potValue = analogRead(POT_PIN);",
          explanation: "Reads the voltage on pin 34 and converts it to a number from 0 (0V) to 4095 (3.3V) using the ADC."
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
      instruction: "Upload this code and watch the Serial Monitor below. Try rotating your potentiometer and watch the values change from 0 to 4095!",
      code: `#define POT_PIN 34

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
      id: "challenge-1",
      type: "challenge",
      title: "Challenge 1: Show Voltage",
      instruction: "Instead of showing the raw ADC value (0-4095), convert it to actual voltage (0.0-3.3V) and print that!\n\nHint: voltage = (potValue / 4095.0) * 3.3",
      hints: [
        "You need to do math to convert the value",
        "Divide potValue by 4095.0 to get a number between 0 and 1",
        "Multiply by 3.3 to get the voltage",
        "Use Serial.println(voltage, 2); to show 2 decimal places"
      ],
      code: `#define POT_PIN 34

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
      id: "challenge-2",
      type: "challenge",
      title: "Challenge 2: Percentage Display",
      instruction: "Show the potentiometer position as a percentage (0% to 100%)!\n\nHint: percentage = (potValue / 4095.0) * 100",
      hints: [
        "Similar to voltage conversion but multiply by 100 instead of 3.3",
        "Use (potValue / 4095.0) * 100",
        "You can use map() function: map(potValue, 0, 4095, 0, 100)"
      ],
      code: `#define POT_PIN 34

void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  float voltage = (potValue / 4095.0) * 3.3;
  
  Serial.print("Voltage: ");
  Serial.println(voltage, 2);
  
  delay(100);
}`
    },
    {
      id: "challenge-3",
      type: "challenge",
      title: "Challenge 3: LED Brightness Control",
      instruction: "Use the potentiometer to control LED brightness! Connect an LED to pin 12 and use the pot value to set PWM brightness.\n\nHint: Use ledcWrite() or analogWrite() with a value from 0-255",
      hints: [
        "You need to map 0-4095 to 0-255 for LED brightness",
        "Use: int brightness = map(potValue, 0, 4095, 0, 255);",
        "Set up PWM with ledcSetup() and ledcAttachPin() in setup()",
        "Use ledcWrite(channel, brightness) in loop()"
      ],
      code: `#define POT_PIN 34

void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  int percentage = map(potValue, 0, 4095, 0, 100);
  
  Serial.print("Position: ");
  Serial.print(percentage);
  Serial.println("%");
  
  delay(100);
}`
    },
    {
      id: "complete",
      type: "completion",
      title: "🎉 Lesson Complete!",
      content: "Congratulations! You've learned:\n• How voltage dividers work and why we need them\n• How potentiometers are adjustable voltage dividers\n• How to read analog values with analogRead()\n• How the ADC converts voltage to numbers\n• How to process and display sensor data\n\nYou earned 150 XP!",
      nextLesson: 4
    }
  ]
};