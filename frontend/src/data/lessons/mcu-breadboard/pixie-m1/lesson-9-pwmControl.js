const REQUIRED_MODULES = ['AX22-0004-H1', 'AX22-0006', 'TOOL-JW-001', 'MTA0007'];

export const lesson = {
    id: "potLedDimmer",
    title: "LED Dimmer with Potentiometer",
    board: "pixie-m1",
    type: "mcu-breadboard",
    xp_reward: 150,
    requiredModules: REQUIRED_MODULES,
    thumbnail: "/images/lessons/pixie-m1/lesson-9/thumbnail.png",

    steps: [
        // ========================================
        // 1: Welcome
        // ========================================
        {
            id: "welcome",
            type: "info",
            title: "Building an LED Dimmer",
            content: `Want to control how bright a light is? That's exactly what a dimmer does!

In this lesson, you'll use a potentiometer (a twistable knob) to smoothly control an LED's brightness from completely off to fully bright.

This is how volume knobs, lamp dimmers, and fan speed controls work!`
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
            totalSteps: 7
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
            totalSteps: 7
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
        // 6: Insert Modules
        // ========================================
        {
            id: "wiring-3",
            type: "wiring-step",
            title: "Insert Modules",
            instruction: `Insert the potentiometer module and the LED module into the breadboard.`,
            kitItemIds: ["AX22-0012", "AX22-0008"],
            image: "/images/lessons/pixie-m1/lesson-9/bb-pixie-s2.gif",
            stepNumber: 3,
            totalSteps: 7
        },

        // ========================================
        // 7: Connect Grounds
        // ========================================
        {
            id: "wiring-4",
            type: "wiring-step",
            title: "Connect all grounds",
            instruction: `Connect the LED module's GND pin and the potentiometer's GND pin to GND on the PIXIE.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-9/bb-pixie-s3.gif",
            stepNumber: 4,
            totalSteps: 7
        },

        // ========================================
        // 8: Connect Power
        // ========================================
        {
            id: "wiring-5",
            type: "wiring-step",
            title: "Connect power for potentiometer",
            instruction: `Connect the potentiometer's VCC pin to PIXIE's 3.3V pin.`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-9/bb-pixie-s4.gif",
            stepNumber: 5,
            totalSteps: 7
        },

        // ========================================
        // 9: Connect Signals
        // ========================================
        {
            id: "wiring-6",
            type: "wiring-step",
            title: "Connect module signals",
            instruction: `Connect the signal pins:
• Potentiometer's signal (S) pin to Pin 1
• LED module's signal pin to Pin 3`,
            kitItemId: "TOOL-JW-001",
            image: "/images/lessons/pixie-m1/lesson-9/bb-pixie-s5.gif",
            stepNumber: 6,
            totalSteps: 7
        },

        // ========================================
        // 10: Final Circuit
        // ========================================
        {
            id: "wiring-final",
            type: "wiring-step",
            title: "Final Circuit",
            instruction: `Your circuit should look like this!

You now have a potentiometer to control your LED brightness.`,
            image: "/images/lessons/pixie-m1/lesson-9/bb-pixie-final.png",
            stepNumber: 7,
            totalSteps: 7
        },

        {
            id: "pwm-visualization",
            type: "interactive-concept",
            title: "Understanding PWM",
            description: `PWM controls brightness by switching rapidly between ON and OFF.

Adjust the duty cycle to control how long the LED stays ON each cycle.`,
            component: "pwm-visualizer",
            config: {
                title: "PWM - Pulse Width Modulation",
                explanation: "Watch how changing the duty cycle affects the waveform and LED brightness.",
                maxFrequency: 5000,
                defaultDutyCycle: 50,
                defaultFrequency: 1000
            },
            showControls: true
        },

        // ========================================
        // 11: Code Explanation
        // ========================================
        {
            id: "code-intro",
            type: "code-explanation",
            title: "Understanding the Code",
            code: `#define LED_PIN 3
#define POT_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
  // Analog pins don't need pinMode
}

void loop() {
  // Read potentiometer (0-4095)
  int potValue = analogRead(POT_PIN);
  
  // Convert to PWM range (0-255)
  int brightness = potValue / 16;
  
  // Set LED brightness
  analogWrite(LED_PIN, brightness);
  
  // Small delay for stability
  delay(10);
}`,
            explanations: [
                {
                    line: 0,
                    highlight: "#define LED_PIN 3",
                    explanation: "Names pin 3 as our LED output. This pin supports PWM for brightness control."
                },
                {
                    line: 1,
                    highlight: "#define POT_PIN 1",
                    explanation: "Names pin 1 as our potentiometer analog input."
                },
                {
                    line: 4,
                    highlight: "pinMode(LED_PIN, OUTPUT);",
                    explanation: "Sets the LED pin as an output for PWM control."
                },
                {
                    line: 10,
                    highlight: "int potValue = analogRead(POT_PIN);",
                    explanation: "Reads the potentiometer position. Returns 0-4095 based on knob rotation."
                },
                {
                    line: 13,
                    highlight: "int brightness = potValue / 16;",
                    explanation: "Converts the 12-bit ADC value (0-4095) to 8-bit PWM range (0-255). We divide by 16 because 4095 ÷ 16 ≈ 255."
                },
                {
                    line: 16,
                    highlight: "analogWrite(LED_PIN, brightness);",
                    explanation: "Sets the LED brightness using PWM. 0 = off, 255 = fully bright."
                },
                {
                    line: 19,
                    highlight: "delay(10);",
                    explanation: "A short delay to keep readings stable and smooth."
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

Turn the potentiometer knob - the LED should smoothly dim from off to bright!`,
            code: `#define LED_PIN 3
#define POT_PIN 1

void setup() {
  pinMode(LED_PIN, OUTPUT);
  // Analog pins don't need pinMode
}

void loop() {
  // Read potentiometer (0-4095)
  int potValue = analogRead(POT_PIN);
  
  // Convert to PWM range (0-255)
  int brightness = potValue / 16;
  
  // Set LED brightness
  analogWrite(LED_PIN, brightness);
  
  // Small delay for stability
  delay(10);
}`
        },

        // ========================================
        // 13: Verify
        // ========================================
        {
            id: "verify",
            type: "verification",
            title: "Does the Dimmer Work?",
            instruction: `Turn the potentiometer knob slowly from one end to the other.

The LED should smoothly fade from off to fully bright (or bright to off).`,
            image: "/images/lessons/pixie-m1/lesson-9/bb-pixie-demo.gif",
            confirmText: "Yes, it works!",
            troubleshootText: "It's not working"
        },

        // ========================================
        // 14: Complete
        // ========================================
        {
            id: "complete",
            type: "completion",
            title: "LED Dimmer Complete!",
            content: `You've built your own LED dimmer!

You learned how to:
• Read analog values from a potentiometer
• Convert between different value ranges
• Use PWM (analogWrite) to control brightness
• Create smooth, real-time control

This same technique is used in lamp dimmers, motor speed controllers, and audio volume knobs!`,
            nextLesson: 10
        }
    ]
};