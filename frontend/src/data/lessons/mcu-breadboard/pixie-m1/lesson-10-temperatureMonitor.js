const REQUIRED_MODULES = ['AX22-0011', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
  id: "thermistorTemperature",
  title: "Temperature Sensor with Thermistor",
  board: "pixie-m1",
  type: "mcu-breadboard",
  xp_reward: 200,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/pixie-m1/lesson-10/thumbnail.png",

  steps: [
    // ========================================
    // 1: Welcome
    // ========================================
    {
      id: "welcome",
      type: "info",
      title: "Measuring Temperature",
      content: `Temperature sensors are everywhere - in your phone, your fridge, your car, and weather stations.

In this lesson, you'll use a thermistor to measure temperature and display it on your computer in real-time.

A thermistor is a resistor that changes its resistance based on temperature!`
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

Click the button below to establish a serial connection.`
    },

    // ========================================
    // 6: Insert Thermistor Module
    // ========================================
    {
      id: "wiring-3",
      type: "wiring-step",
      title: "Insert Thermistor Module",
      instruction: `Insert the thermistor module into the breadboard.`,
      kitItemId: "AX22-0018",
      image: "/images/lessons/pixie-m1/lesson-10/bb-pixie-s2.gif",
      stepNumber: 3,
      totalSteps: 6
    },

    // ========================================
    // 7: Connect Ground
    // ========================================
    {
      id: "wiring-4",
      type: "wiring-step",
      title: "Connect Ground",
      instruction: `Connect the thermistor module's GND pin to GND on the PIXIE.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-10/bb-pixie-s3.gif",
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
      instruction: `Connect the thermistor module's VCC pin to 3.3V on the PIXIE.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-10/bb-pixie-s4.gif",
      stepNumber: 5,
      totalSteps: 6
    },

    // ========================================
    // 9: Connect Signal
    // ========================================
    {
      id: "wiring-6",
      type: "wiring-step",
      title: "Connect Signal",
      instruction: `Connect the thermistor module's signal (S or AO) pin to Pin 1 on the PIXIE.`,
      kitItemId: "TOOL-JW-001",
      image: "/images/lessons/pixie-m1/lesson-10/bb-pixie-s5.gif",
      stepNumber: 6,
      totalSteps: 6
    },

    // ========================================
    // 10: Final Circuit
    // ========================================
    {
      id: "wiring-final",
      type: "wiring-step",
      title: "Final Circuit",
      instruction: `Your circuit should look like this!

The thermistor module is now ready to measure temperature.`,
      image: "/images/lessons/pixie-m1/lesson-10/bb-pixie-final.png",
      stepNumber: 6,
      totalSteps: 6
    },

    // ========================================
    // 11: Interactive Thermistor Visualization
    // ========================================
    {
      id: "thermistor-visualization",
      type: "interactive-concept",
      title: "How Thermistors Work",
      description: `A thermistor is a special resistor that changes with temperature.

Move the temperature slider to see how heat affects resistance and voltage!`,
      component: "thermistor-visualizer",
      config: {
        vcc: 3.3,
        rFixed: 10000,
        r25: 10000,
        beta: 3950,
        title: "Thermistor Voltage Divider",
        explanation: "The thermistor and a fixed resistor form a voltage divider. As temperature changes, the thermistor's resistance changes, which changes the output voltage!"
      },
      showControls: true
    },

    // ========================================
    // 12: Code Explanation
    // ========================================
    {
      id: "code-intro",
      type: "code-explanation",
      title: "Understanding the Code",
      code: `#define THERMISTOR_PIN 1

// Thermistor parameters
#define R_FIXED 10000.0    // 10kΩ fixed resistor
#define R25 10000.0        // Thermistor resistance at 25°C
#define BETA 3950.0        // Beta coefficient
#define T25 298.15         // 25°C in Kelvin

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Read ADC value (0-4095)
  int adcValue = analogRead(THERMISTOR_PIN);
  
  // Convert to voltage
  float voltage = (adcValue / 4095.0) * 3.3;
  
  // Calculate thermistor resistance
  float rThermistor = R_FIXED * (voltage / (3.3 - voltage));
  
  // Calculate temperature using Beta equation
  float tempK = 1.0 / ((1.0 / T25) + (1.0 / BETA) * log(rThermistor / R25));
  float tempC = tempK - 273.15;
  
  // Print temperature
  Serial.print("Temperature: ");
  Serial.print(tempC, 1);
  Serial.println(" C");
  
  delay(500);
}`,
      explanations: [
        {
          line: 0,
          highlight: "#define THERMISTOR_PIN 1",
          explanation: "The thermistor is connected to analog pin 1."
        },
        {
          line: 3,
          highlight: "#define R_FIXED 10000.0",
          explanation: "The fixed resistor value in the voltage divider (10kΩ)."
        },
        {
          line: 4,
          highlight: "#define R25 10000.0",
          explanation: "The thermistor's resistance at 25°C - this is its rated value."
        },
        {
          line: 5,
          highlight: "#define BETA 3950.0",
          explanation: "The Beta coefficient - determines how resistance changes with temperature."
        },
        {
          line: 14,
          highlight: "int adcValue = analogRead(THERMISTOR_PIN);",
          explanation: "Read the voltage as a 12-bit value (0-4095)."
        },
        {
          line: 17,
          highlight: "float voltage = (adcValue / 4095.0) * 3.3;",
          explanation: "Convert ADC reading to actual voltage (0V to 3.3V)."
        },
        {
          line: 20,
          highlight: "float rThermistor = R_FIXED * (voltage / (3.3 - voltage));",
          explanation: "Calculate the thermistor's current resistance using the voltage divider formula."
        },
        {
          line: 23,
          highlight: "float tempK = 1.0 / ((1.0 / T25) + (1.0 / BETA) * log(rThermistor / R25));",
          explanation: "The Beta equation converts resistance to temperature in Kelvin."
        },
        {
          line: 24,
          highlight: "float tempC = tempK - 273.15;",
          explanation: "Convert from Kelvin to Celsius."
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

Watch the Serial Monitor to see real-time temperature readings!`,
      code: `#define THERMISTOR_PIN 1

// Thermistor parameters
#define R_FIXED 10000.0    // 10kΩ fixed resistor
#define R25 10000.0        // Thermistor resistance at 25°C
#define BETA 3950.0        // Beta coefficient
#define T25 298.15         // 25°C in Kelvin

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Read ADC value (0-4095)
  int adcValue = analogRead(THERMISTOR_PIN);
  
  // Convert to voltage
  float voltage = (adcValue / 4095.0) * 3.3;
  
  // Calculate thermistor resistance
  float rThermistor = R_FIXED * (voltage / (3.3 - voltage));
  
  // Calculate temperature using Beta equation
  float tempK = 1.0 / ((1.0 / T25) + (1.0 / BETA) * log(rThermistor / R25));
  float tempC = tempK - 273.15;
  
  // Print temperature
  Serial.print("Temperature: ");
  Serial.print(tempC, 1);
  Serial.println(" C");
  
  delay(500);
}`
    },

    // ========================================
    // 14: Verify with Visual Temperature Display
    // ========================================
    {
      id: "verify-thermistor",
      type: "verification",
      title: "Is Your Thermistor Working?",
      instruction: `Watch the temperature readings in the Serial Monitor.

Try these tests:
• Touch the thermistor with your finger - temperature should rise
• Blow on it gently - temperature should drop slightly

You should see values between 15°C and 35°C at room temperature.`,
      showSerialMonitor: true,
      serialDisplayMode: "temperature", // Custom display mode for temperature
      troubleshootTips: [
        {
          title: "Reading shows 0 or negative",
          description: "Check that VCC is connected to 3.3V, not GND"
        },
        {
          title: "Reading shows very high values",
          description: "Signal wire may be disconnected - check Pin 1 connection"
        },
        {
          title: "Reading fluctuates wildly",
          description: "Make sure all connections are secure and not loose"
        },
        {
          title: "No readings appearing",
          description: "Re-upload the code and ensure Serial Monitor is open"
        }
      ],
      confirmText: "Yes, I see temperature readings! 🌡️",
      troubleshootText: "It's not working"
    },

    // ========================================
    // 16: Complete
    // ========================================
    {
      id: "complete",
      type: "completion",
      title: "Temperature Sensor Complete! 🌡️",
      content: `You've built your own digital thermometer!

You learned how to:
• Use a thermistor as a temperature sensor
• Understand voltage dividers and how they work
• Convert ADC readings to actual temperature
• Use the Steinhart-Hart Beta equation

This same principle is used in weather stations, thermostats, and industrial temperature monitoring!`,
      nextLesson: 11
    }
  ]
};