export const MODULE_CATEGORIES = {
  MODULES: 'Modules',
  TOOLS: 'Tools'
};

export const ALL_MODULES = [
  {
    id: 'LED',
    name: 'LED Module',
    image: '/images/ax22-components/AX22-0006.png',
    description: 'Light Emitting Diode',
    category: MODULE_CATEGORIES.MODULES,
    requiredFor: ['lesson-1'],
    purchaseUrl: 'https://axiometa.com/products/led-module'
  },
  {
    id: 'BUTTON',
    name: 'Button Module',
    image: '/images/ax22-components/button.png',
    description: 'Push Button Sensor',
    category: MODULE_CATEGORIES.MODULES,
    requiredFor: ['lesson-2'],
    purchaseUrl: 'https://axiometa.com/products/button-module'
  },
  {
    id: 'POTENTIOMETER',
    name: 'Potentiometer',
    image: '/images/ax22-components/pot.png',
    description: 'Variable Resistor',
    category: MODULE_CATEGORIES.MODULES,
    requiredFor: ['lesson-3'],
    purchaseUrl: 'https://axiometa.com/products/potentiometer'
  },
  {
    id: 'BREADBOARD',
    name: 'Breadboard',
    image: '/images/misc/breadboard.png',
    description: 'Solderless Prototyping Board',
    category: MODULE_CATEGORIES.TOOLS,
    requiredFor: ['lesson-1'],
    purchaseUrl: 'https://axiometa.com/products/breadboard'
  },
  {
    id: 'JUMPER_WIRES',
    name: 'Jumper Wires',
    image: '/images/misc/jumper-wires.png',
    description: 'Connection Wires',
    category: MODULE_CATEGORIES.TOOLS,
    requiredFor: ['lesson-1'],
    purchaseUrl: 'https://axiometa.com/products/jumper-wires'
  }
];

export const getModulesByCategory = (category) => 
  ALL_MODULES.filter(m => m.category === category);

export const getRequiredModulesForLesson = (lessonId) =>
  ALL_MODULES.filter(m => m.requiredFor.includes(lessonId)).map(m => m.id);
