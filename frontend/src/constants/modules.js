export const MODULE_CATEGORIES = {
  MODULES: 'Modules',
  TOOLS: 'Tools'
};

// Only define non-Shopify items here (like generic tools)
export const STATIC_MODULES = [
  {
    id: 'BREADBOARD',
    name: 'Breadboard',
    image: '/images/misc/breadboard.png',
    description: 'Solderless Prototyping Board',
    category: MODULE_CATEGORIES.TOOLS,
    purchaseUrl: 'https://www.amazon.com/s?k=breadboard'
  },
  {
    id: 'JUMPER_WIRES',
    name: 'Jumper Wires',
    image: '/images/misc/jumper-wires.png',
    description: 'Connection Wires',
    category: MODULE_CATEGORIES.TOOLS,
    purchaseUrl: 'https://www.amazon.com/s?k=jumper+wires'
  }
];

// Will be populated from Shopify
export let ALL_MODULES = [...STATIC_MODULES];

export function setModules(modules) {
  ALL_MODULES = [...STATIC_MODULES, ...modules];
}

export const getModulesByCategory = (category) => 
  ALL_MODULES.filter(m => m.category === category);

export const getModuleById = (id) => 
  ALL_MODULES.find(m => m.id === id);

export const getModuleUsageCount = (moduleId, lessons) => {
  return lessons.filter(lesson => 
    lesson.requiredModules && lesson.requiredModules.includes(moduleId)
  ).length;
};