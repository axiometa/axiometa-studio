/**
 * Fetch ALL modules from Shopify collection
 * Uses Shopify's Collection JSON API
 */

const COLLECTION_URL = 'https://www.axiometa.io/collections/modules-and-sensors-ax22';
const CACHE_KEY = 'axiometa_modules_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function fetchAllModulesFromShopify() {
  try {
    // Check cache first
    const cached = getCachedModules();
    if (cached) {
      console.log('✓ Loaded modules from cache');
      return cached;
    }

    console.log('Fetching modules from Shopify collection...');
    
    // Fetch collection JSON
    const response = await fetch(`${COLLECTION_URL}/products.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Shopify products into our module format
    const modules = data.products.map(product => {
      // Extract SKU from variants
      const sku = product.variants?.[0]?.sku || '';
      
      // Determine category based on product type or tags
      let category = 'Modules'; // Default
      if (product.tags?.includes('tool') || product.tags?.includes('accessory')) {
        category = 'Tools';
      }
      
      return {
        id: sku || product.handle.toUpperCase().replace(/-/g, '_'),
        name: product.title,
        image: product.images?.[0]?.src ? `${product.images[0].src}?width=600` : null,
        description: stripHtml(product.body_html) || product.vendor || '',
        category: category,
        productUrl: `https://www.axiometa.io/products/${product.handle}`,
        sku: sku,
        price: product.variants?.[0]?.price || null
      };
    });
    
    // Cache the results
    cacheModules(modules);
    
    console.log(`✓ Loaded ${modules.length} modules from Shopify`);
    return modules;
    
  } catch (error) {
    console.error('Failed to fetch modules from Shopify:', error);
    // Return empty array or fallback modules
    return [];
  }
}

// Helper to strip HTML tags from description
function stripHtml(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// Cache helpers
function getCachedModules() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache expired
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    return null;
  }
}

function cacheModules(modules) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: modules,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache modules:', error);
  }
}

// Clear cache manually if needed
export function clearModulesCache() {
  localStorage.removeItem(CACHE_KEY);
  console.log('✓ Modules cache cleared');
}