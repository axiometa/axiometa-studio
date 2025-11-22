/**
 * Fetch ALL modules from Shopify collection
 * Uses Shopify's Collection JSON API with pagination
 * Uses SKU as the module ID (no mappings needed!)
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
    
    let allProducts = [];
    let page = 1;
    let hasMorePages = true;
    
    // Fetch all pages
    while (hasMorePages) {
      console.log(`Fetching page ${page}...`);
      
      const response = await fetch(`${COLLECTION_URL}/products.json?page=${page}&limit=250`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        allProducts = [...allProducts, ...data.products];
        console.log(`✓ Page ${page}: ${data.products.length} products (Total: ${allProducts.length})`);
        page++;
        
        // If we got fewer than 250, we're done
        if (data.products.length < 250) {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
      }
      
      // Safety limit - stop after 10 pages (2500 products max)
      if (page > 10) {
        console.warn('⚠️ Reached page limit (10 pages)');
        hasMorePages = false;
      }
    }
    
    console.log(`✓ Fetched ${allProducts.length} total products from Shopify`);
    
    // Transform Shopify products into our module format
    const modules = allProducts.map(product => {
      // Use SKU as the module ID - simple and clean!
      const sku = product.variants?.[0]?.sku || '';
      
      if (!sku) {
        console.warn(`⚠️ Product "${product.title}" has no SKU - using handle as fallback`);
      }
      
      const moduleId = sku || product.handle.toUpperCase().replace(/-/g, '_');
      
      // Determine category based on product type or tags
      let category = 'Modules'; // Default - everything is a Module unless proven otherwise
      
      // Parse tags (could be string or array)
      const tags = Array.isArray(product.tags) ? product.tags : 
                   typeof product.tags === 'string' ? product.tags.toLowerCase().split(',').map(t => t.trim()) : 
                   [];
      
      const productType = (product.product_type || '').toLowerCase();
      
      // Only mark as Tools if explicitly tagged or typed as tool/accessory
      if (tags.some(t => t.includes('tool') || t.includes('accessory')) ||
          productType.includes('tool') || productType.includes('accessory')) {
        category = 'Tools';
      }
      
      const module = {
        id: moduleId,
        name: product.title,
        image: product.images?.[0]?.src ? `${product.images[0].src}?width=600` : null,
        description: stripHtml(product.body_html) || product.vendor || '',
        category: category,
        productUrl: `https://www.axiometa.io/products/${product.handle}`,
        sku: sku,
        price: product.variants?.[0]?.price || null,
        handle: product.handle
      };
      
      console.log(`✓ Loaded: ${product.title} (SKU: ${moduleId}, Category: ${category})`);
      return module;
    });
    
    // Cache the results
    cacheModules(modules);
    
    console.log(`✓ Loaded ${modules.length} modules from Shopify`);
    console.log('📦 Module SKUs:', modules.map(m => m.id).join(', '));
    
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