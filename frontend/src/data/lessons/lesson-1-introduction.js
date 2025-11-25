// No modules required for this introductory lesson
const REQUIRED_MODULES = [];

export const lesson = {
  id: "electronics-introduction",
  title: "Introduction to Electronics",
  board: "universal", // Works with any board
  type: "simple",
  xp_reward: 50,
  requiredModules: REQUIRED_MODULES,
  thumbnail: "/images/lessons/lesson-1/thumbnail-lesson-1.png",

  steps: [
    {
      id: "welcome",
      type: "info",
      title: "Welcome to Electronics",
      content: "Before we start building circuits, let's understand what electronics actually is.\n\nElectronics is the science of controlling electricity to do useful work. Everything from your phone to spacecraft relies on the same fundamental principles you're about to learn.\n\nThis lesson will give you the foundation you need to understand how circuits work."
    },
    {
      id: "what-is-circuit",
      type: "interactive-concept",
      title: "What is a Circuit?",
      description: "A circuit is a closed loop that allows electricity to flow. Think of it like a race track - the cars (electrons) need a complete path to keep moving.\n\nWithout a complete loop, electricity cannot flow. This is why switches work - they break the circuit to stop the flow.",
      component: "circuit-flow",
      config: {
        title: "The Complete Loop",
        explanation: "Watch the electrons (teal dots) flow in a complete circle. Try breaking the circuit to see what happens."
      },
      showControls: true,
      autoPlay: true
    },
    {
      id: "electricity-basics",
      type: "info",
      title: "Understanding Electricity",
      content: "Electricity has three fundamental properties:\n\nVoltage (V) - The electrical pressure that pushes electrons. Measured in volts. Like water pressure in a pipe.\n\nCurrent (A) - The flow rate of electrons. Measured in amperes (amps). Like the amount of water flowing per second.\n\nResistance (Ω) - Opposition to current flow. Measured in ohms. Like friction in a pipe that slows water down.\n\nThese three properties are related by Ohm's Law: V = I × R"
    },
    {
      id: "components-intro",
      type: "info",
      title: "Electronic Components",
      content: "Circuits are built from components - each with a specific job.\n\nYou'll learn about the four fundamental building blocks:\n\nResistors - Control current flow\nCapacitors - Store electrical energy\nInductors - Store magnetic energy\nTransistors - Act as switches or amplifiers\n\nLet's explore each one using a water flow analogy to make them easier to understand."
    },
    {
      id: "components-water-analogy",
      type: "interactive-concept",
      title: "Components - Water Flow Analogy",
      description: "Understanding electronics is easier when you compare it to something familiar like water flowing through pipes.\n\nClick through each component to see how it behaves in both water and electrical systems.",
      component: "water-flow-analogy",
      config: {},
      showControls: true,
      autoPlay: true
    },
    {
      id: "power-and-ground",
      type: "info",
      title: "Power and Ground",
      content: "Every circuit needs two connections:\n\nPower (VCC/+) - Provides the electrical pressure (voltage). For the PIXIE M1, this is 3.3V.\n\nGround (GND/-) - The reference point where voltage is zero. Electrons flow back to ground to complete the circuit.\n\nThink of it like a water fountain - water is pumped up (power) and flows back down (ground) in a continuous loop.\n\nThe PIXIE M1 operates at 3.3V, which is the standard voltage for modern microcontrollers. Never apply more than 3.6V to any pin - higher voltages can permanently damage the board."
    },
    {
      id: "breadboard-explanation",
      type: "info",
      title: "The Breadboard - Your Building Platform",
      content: "A breadboard lets you build circuits without soldering. It has hidden metal strips inside that connect components together.\n\nKey features:\n\nPower Rails (Red/Blue lines) - Run along the sides. The red line is typically for power (+), blue for ground (-). All holes in the same rail are connected.\n\nTerminal Rows - The main grid in the center. Each row of 5 holes is connected horizontally. The center gap separates the two sides.\n\nCenter Gap - This gap is specifically designed for chips like your PIXIE M1. One side of the chip connects to the left rows, the other side to the right rows.\n\nIn the next lesson, you'll use a breadboard to build your first real circuit. Here's a preview of how it works:"
    },
    {
      id: "breadboard-visual",
      type: "info",
      title: "How Breadboards Work",
      content: "Imagine the breadboard as a grid of connection points:\n\nHorizontal rows in the center are connected in groups of 5\nThe center gap separates left from right\nVertical power rails run the full length of the board\nNo holes are connected across the center gap\n\nWhen you plug a component's legs into the same row, they're electrically connected. When you plug them into different rows, you can connect them with a wire.\n\nNote: We'll include a detailed animated guide in the next lesson when you actually use the breadboard."
    },
    {
      id: "safety",
      type: "info",
      title: "Safety First",
      content: "Electronics is safe when you follow basic rules:\n\n3.3V Maximum - The PIXIE M1 operates at 3.3V. Never apply more than 3.6V to any pin. Higher voltages will permanently damage the board.\n\nPolarity Matters - Power and ground are not interchangeable. Connecting them backwards (called reverse polarity) can damage components.\n\nShort Circuits - Never connect power directly to ground without a component in between. This creates a short circuit that can damage the board or power supply.\n\nUSB Safety - When programming, the USB connection provides both power and data. Don't disconnect during uploads.\n\nStatic Electricity - Touch a grounded metal object before handling the board to discharge static electricity.\n\nThe good news: at 3.3V, you cannot hurt yourself. The voltage is too low to feel. But you can damage components, so handle with care."
    },
    {
      id: "whats-next",
      type: "info",
      title: "What's Next?",
      content: "You now understand the fundamental concepts of electronics:\n\nCircuits need a complete loop for electricity to flow\nComponents control electricity in different ways\nVoltage, current, and resistance work together\nPower and ground complete the circuit\nBreadboards let you build without soldering\n\nIn the next lesson, you'll put this knowledge into practice by building your first circuit - a blinking LED. You'll write real code, upload it to your PIXIE M1, and see your creation come to life.\n\nThe journey from beginner to maker starts with these basics. Everything you build will use these same principles, just combined in more creative ways."
    },
    {
      id: "complete",
      type: "completion",
      title: "Foundation Complete",
      content: "You've completed the introduction to electronics.\n\nYou learned:\n\nWhat circuits are and why they need complete loops\nThe fundamental properties of electricity\nHow basic components work\nThe importance of power and ground\nHow breadboards enable prototyping\nSafety guidelines for working with electronics\n\nYou earned 50 XP.\n\nReady to build your first circuit? Let's move on to Lesson 2.",
      nextLesson: 2
    }
  ]
};