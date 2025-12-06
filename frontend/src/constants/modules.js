/**
 * Module registry and helper functions
 * This file manages both static modules (tools) and Shopify modules
 */

// Static modules that aren't in Shopify (tools, accessories)
// Static modules that aren't in Shopify (tools, accessories)
export const STATIC_MODULES = [
  {
    id: 'TOOL-BB-001',
    name: 'Breadboard',
    image: '/images/misc/tools/breadboard.png',  // ← FIXED
    description: 'Solderless prototyping breadboard for building circuits',
    category: 'Tools',
    purchaseUrl: 'https://www.amazon.com/s?k=breadboard'
  },
  {
    id: 'TOOL-JW-001',
    name: 'Jumper Wires',
    image: '/images/misc/tools/jumper-wires.png',  // ← FIXED
    description: 'Male-to-male jumper wires for connecting components',
    category: 'Tools',
    purchaseUrl: 'https://www.amazon.com/s?k=jumper+wires'
  },
  {
    id: 'MTA0007',
    name: 'PIXIE M1',
    image: '/images/dev-boards/pixie-m1.png',
    description: 'The Axiometa PIXIE M1 is a small but capable development board...',
    category: 'Dev Boards',
    purchaseUrl: 'https://www.axiometa.io/products/axiometa-pixie-m1'
  },
  {
    id: 'RESISTOR',
    name: 'Resistor',
    image: '/images/misc/passives/resistors.png',  // ← FIXED
    description: 'A pack of resistors',
    category: 'Passives',
  },
  {
    id: 'LEDs',
    name: 'LED',
    image: '/images/misc/passives/red-led.png',
    description: 'Light Emitting Diodes - LEDs',
    category: 'Passives',
  },
  {
    id: 'THERMISTOR',
    name: 'Thermistor',
    image: '/images/misc/passives/thermistor.png',
    description: 'Thermistor - Variable temperature resistor',
    category: 'Passives',
  }
];

// All modules combined (static + Shopify)
export let ALL_MODULES = [...STATIC_MODULES];

// Module categories for organization
export const MODULE_CATEGORIES = {
  MODULES: 'Modules',
  TOOLS: 'Tools',
  DEVBOARD: 'Dev Boards',
  PASSIVES: 'Passives'
};

/**
 * Get a module by its ID
 * @param {string} id - Module ID (SKU)
 * @returns {object|null} Module object or null if not found
 */
export function getModuleById(id) {
  if (!id) return null;

  const module = ALL_MODULES.find(m => m.id === id || m.sku === id);

  if (!module) {
    console.warn(`⚠️ Module not found: ${id}`);
    console.log(`Available modules:`, ALL_MODULES.map(m => m.id).join(', '));
  }

  return module || null;
}

/**
 * Get modules by category
 * @param {string} category - Category name
 * @returns {array} Array of modules in that category
 */
export function getModulesByCategory(category) {
  return ALL_MODULES.filter(m => m.category === category);
}

/**
 * Set/update the modules list (called when Shopify modules are loaded)
 * @param {array} shopifyModules - Modules fetched from Shopify
 */
export function setModules(shopifyModules) {
  // Combine static modules with Shopify modules
  ALL_MODULES = [...STATIC_MODULES, ...shopifyModules];

  console.log(`✓ Updated ALL_MODULES with ${ALL_MODULES.length} total modules`);
  console.log(`  - Static: ${STATIC_MODULES.length}`);
  console.log(`  - Shopify: ${shopifyModules.length}`);
  console.log(`📦 All module IDs:`, ALL_MODULES.map(m => m.id).join(', '));

  // Make globally accessible for debugging
  if (typeof window !== 'undefined') {
    window.ALL_MODULES = ALL_MODULES;
    window.getModuleById = getModuleById;
    window.STATIC_MODULES = STATIC_MODULES;
  }
}

/**
 * Get multiple modules by their IDs
 * @param {array} ids - Array of module IDs
 * @returns {array} Array of module objects (nulls for not found)
 */
export function getModulesByIds(ids) {
  if (!Array.isArray(ids)) return [];

  const modules = ids.map(id => getModuleById(id)).filter(Boolean);

  if (modules.length !== ids.length) {
    console.warn(`⚠️ Some modules not found. Requested: ${ids.length}, Found: ${modules.length}`);
    const foundIds = modules.map(m => m.id);
    const missingIds = ids.filter(id => !foundIds.includes(id));
    console.warn(`Missing modules:`, missingIds);
  }

  return modules;
}

/**
 * Check if user has required modules
 * @param {array} requiredIds - Required module IDs
 * @param {array} ownedIds - User's owned module IDs
 * @returns {object} { hasAll, missing }
 */
export function checkRequiredModules(requiredIds, ownedIds) {
  const missing = requiredIds.filter(id => !ownedIds.includes(id));

  return {
    hasAll: missing.length === 0,
    missing: missing
  };
}

/**
 * Get usage count for a module across all lessons
 * @param {string} moduleId - Module ID
 * @param {array} lessons - Array of lesson objects
 * @returns {number} Number of lessons using this module
 */
export function getModuleUsageCount(moduleId, lessons = []) {
  if (!lessons || lessons.length === 0) return 0;

  return lessons.filter(lesson =>
    lesson.requiredModules && lesson.requiredModules.includes(moduleId)
  ).length;
}

// Export for global access
if (typeof window !== 'undefined') {
  window.ALL_MODULES = ALL_MODULES;
  window.STATIC_MODULES = STATIC_MODULES;
  window.getModuleById = getModuleById;
  window.getModulesByCategory = getModulesByCategory;
  window.getModulesByIds = getModulesByIds;
  window.getModuleUsageCount = getModuleUsageCount;
  window.MODULE_CATEGORIES = MODULE_CATEGORIES;
}