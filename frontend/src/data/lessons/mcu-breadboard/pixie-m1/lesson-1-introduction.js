const REQUIRED_MODULES = [];

export const lesson = {
  id: "electronics-introduction",
  title: "Introduction to Electronics",
  board: "pixie-m1",
  type: "simple",
  xp_reward: 75,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/pixie-m1/lesson-1/thumbnail.png",

  steps: [
    // ========================================
    // 1: Voltage
    // ========================================
    {
      id: "voltage",
      type: "interactive-concept",
      title: "Voltage",
      description: `Electrical pressure. Higher voltage = more push.`,
      component: "power-ground-visualizer",
      config: {},
      showControls: true,
      autoPlay: true
    },

    // ========================================
    // 2: Resistors
    // ========================================
    {
      id: "resistors",
      type: "interactive-concept",
      title: "Resistors",
      description: `Limit current flow. More resistance = less current.`,
      component: "resistor-visualizer",
      config: {},
      showControls: true,
      autoPlay: true
    },

    // ========================================
    // 3: Ohm's Law
    // ========================================
    {
      id: "ohms-law",
      type: "interactive-concept",
      title: "Ohm's Law",
      description: `V ÷ R = I. Voltage divided by resistance equals current.`,
      component: "ohms-law-circuit",
      config: {
        maxCurrent: 0.025
      },
      showControls: true,
      autoPlay: true
    },

    // ========================================
    // 4: Capacitors
    // ========================================
    {
      id: "capacitors",
      type: "interactive-concept",
      title: "Capacitors",
      description: `Store energy. Charge up, release quickly.`,
      component: "capacitor-visualizer",
      config: {},
      showControls: true,
      autoPlay: false
    },

    // ========================================
    // 5: Inductors
    // ========================================
    {
      id: "inductors",
      type: "interactive-concept",
      title: "Inductors",
      description: `Store energy in magnetic fields. Resist sudden changes.`,
      component: "inductor-visualizer",
      config: {},
      showControls: true,
      autoPlay: false
    },

    // ========================================
    // 6: Transistors
    // ========================================
    {
      id: "transistors",
      type: "interactive-concept",
      title: "Transistors",
      description: `Electronic switches. Small current controls big current.`,
      component: "transistor-visualizer",
      config: {},
      showControls: true,
      autoPlay: false
    },

    // ========================================
    // 7: Let's Build!
    // ========================================
    {
      id: "lets-build",
      type: "info",
      title: "Let's Build!",
      content: `Theory done. Time to build real circuits.

First, you need to know how a breadboard works - it's where you'll prototype all your projects.`
    },

    // ========================================
    // 8: Breadboard - Power Rails
    // ========================================
    {
      id: "breadboard-power",
      type: "wiring-step",
      title: "Breadboard: Power Rails",
      instruction: `Edge strips run horizontally.

Red (+) = Power
Blue (-) = Ground`,
      image: "/GIFs/Breadboard Basics/Breadboard-Power-Rails.gif",
      stepNumber: 1,
      totalSteps: 3
    },

    // ========================================
    // 9: Breadboard - Terminal Strips
    // ========================================
    {
      id: "breadboard-terminals",
      type: "wiring-step",
      title: "Breadboard: Terminals",
      instruction: `Center columns run vertically (5 holes each).

The gap in the middle separates top from bottom.`,
      image: "/GIFs/Breadboard Basics/Breadboard-Main-Rails.gif",
      stepNumber: 2,
      totalSteps: 3
    },

    // ========================================
    // 10: Breadboard - Connections
    // ========================================
    {
      id: "breadboard-wiring",
      type: "wiring-step",
      title: "Breadboard: Wiring",
      instruction: `Jumper wires connect different columns.

Components in columns, wires between them.`,
      image: "/GIFs/Breadboard Basics/Breadboard-Connecting-Rails.gif",
      stepNumber: 3,
      totalSteps: 3
    },

    // ========================================
    // 11: Your First Circuit!
    // ========================================
    {
      id: "first-circuit-intro",
      type: "info",
      title: "Your First Circuit! 💡",
      content: `Now let's put it all together.

You'll build a simple LED circuit using your PIXIE board - no code required, just wiring!`
    },

    // ========================================
    // 12: Insert PIXIE
    // ========================================
    {
      id: "insert-pixie",
      type: "wiring-step",
      title: "Insert PIXIE",
      instruction: `Place your PIXIE M1 across the center gap of the breadboard.

The USB port should face outward for easy access.`,
      kitItemId: "MTA0007",  // PIXIE M1 from modules
      image: "/images/lessons/pixie-m1/universal-images/bb-pixie-s1.gif",
      stepNumber: 1,
      totalSteps: 6
    },

    // ========================================
    // 13: Connect USB
    // ========================================
    {
      id: "connect-usb",
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
    // 14: Wire 3.3V
    // ========================================
    {
      id: "wire-3v3",
      type: "wiring-step",
      title: "Connect 3.3V Power",
      instruction: `Insert a jumper wire from the 3.3V pin to a free column on the breadboard.

This will be our power source for the LED.`,
      kitItemId: "TOOL-JW-001",  // Jumper Wires from static modules
      image: "/images/lessons/pixie-m1/lesson-1/bb-pixie-s2.gif",
      stepNumber: 3,
      totalSteps: 6
    },

    // ========================================
    // 15: Add Resistor
    // ========================================
    {
      id: "add-resistor",
      type: "wiring-step",
      title: "Add 220Ω Resistor",
      instruction: `Insert a 220Ω resistor connecting the power wire column to another column.

The resistor protects the LED from too much current.`,
      kitItemId: "RESISTOR",
      image: "/images/lessons/pixie-m1/lesson-1/bb-pixie-s3.gif",
      stepNumber: 4,
      totalSteps: 6
    },

    // ========================================
    // 16: Insert LED
    // ========================================
    {
      id: "insert-led",
      type: "wiring-step",
      title: "Insert LED",
      instruction: `Insert the LED into the breadboard.

⚠️ Polarity matters!
• Long leg (anode +) → connects to the resistor
• Short leg (cathode -) → goes to a new column`,
      kitItemId: "LEDs",
      image: "/images/lessons/pixie-m1/lesson-1/bb-pixie-s4.gif",
      stepNumber: 5,
      totalSteps: 6
    },

    // ========================================
    // 17: Connect Ground
    // ========================================
    {
      id: "connect-ground",
      type: "wiring-step",
      title: "Connect Ground",
      instruction: `Insert a jumper wire from the LED's short leg column to GND on the PIXIE.

This completes the circuit!`,
      kitItemId: "TOOL-JW-001",  // Jumper Wires
      image: "/images/lessons/pixie-m1/lesson-1/bb-pixie-s5.gif",
      stepNumber: 6,
      totalSteps: 6
    },

    // ========================================
    // 18: Verify Circuit
    // ========================================
    {
      id: "verify-circuit",
      type: "verification",
      title: "Is Your LED On?",
      instruction: `Your circuit should look like this with the LED glowing.

If it's not lighting up, check:
• LED direction (long leg to resistor)
• All connections are secure
• USB is plugged in`,
      image: "/images/lessons/pixie-m1/lesson-1/bb-pixie-s6.gif",
      confirmText: "Yes, it's on! 💡",
      troubleshootText: "It's not working"
    },

    // ========================================
    // 19: Done!
    // ========================================
    {
      id: "complete",
      type: "completion",
      title: "Circuit Complete! 🎉",
      content: `You built your first circuit!

Current flows from 3.3V → resistor → LED → GND.

Next lesson: Control the LED with code.`,
      nextLesson: 2
    }
  ]
};