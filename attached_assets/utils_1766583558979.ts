/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

import { Product, ProductCategory, PrintMethod } from './types';
import { PRODUCTS } from './data/products';
import { 
  FRONTEND_TO_BACKEND, 
  BACKEND_TO_PRODUCT, 
  BACKEND_TO_PRINTFUL,
  ID_TO_PRODUCT,
  CATEGORIES 
} from './mappings';

// ============================================================================
// PRODUCT LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get a product by ID, frontend name, or backend ID
 */
export function getProduct(identifier: string): Product | undefined {
  // Try by ID first
  if (PRODUCTS[identifier]) {
    return PRODUCTS[identifier];
  }
  
  // Try by backend ID
  if (BACKEND_TO_PRODUCT[identifier]) {
    return BACKEND_TO_PRODUCT[identifier];
  }
  
  // Try by frontend name
  const backendId = FRONTEND_TO_BACKEND[identifier];
  if (backendId) {
    return BACKEND_TO_PRODUCT[backendId];
  }
  
  return undefined;
}

/**
 * Get backend ID from frontend name
 */
export function getBackendId(frontendName: string): string | null {
  return FRONTEND_TO_BACKEND[frontendName] || null;
}

/**
 * Get Printful ID from backend ID
 */
export function getPrintfulId(backendId: string): string | null {
  return BACKEND_TO_PRINTFUL[backendId] || null;
}

/**
 * Get Printful ID directly from frontend name
 */
export function getPrintfulIdByName(frontendName: string): string | null {
  const backendId = getBackendId(frontendName);
  if (!backendId) return null;
  return getPrintfulId(backendId);
}

// ============================================================================
// PRINT AREA FUNCTIONS
// ============================================================================

/**
 * Get print area dimensions in pixels for a product
 */
export function getPrintAreaPixels(productId: string): { width: number; height: number } | null {
  const product = getProduct(productId);
  if (!product || !product.printAreas[0]) return null;
  
  return {
    width: product.printAreas[0].widthPixels,
    height: product.printAreas[0].heightPixels
  };
}

/**
 * Get print area dimensions in inches for a product
 */
export function getPrintAreaInches(productId: string): { width: number; height: number } | null {
  const product = getProduct(productId);
  if (!product || !product.printAreas[0]) return null;
  
  return {
    width: product.printAreas[0].widthInches,
    height: product.printAreas[0].heightInches
  };
}

/**
 * Get all print areas for a product
 */
export function getAllPrintAreas(productId: string) {
  const product = getProduct(productId);
  if (!product) return null;
  
  return product.printAreas.map(area => ({
    name: area.name,
    inches: { width: area.widthInches, height: area.heightInches },
    pixels: { width: area.widthPixels, height: area.heightPixels },
    position: area.position
  }));
}

// ============================================================================
// CATEGORY & FILTER FUNCTIONS
// ============================================================================

/**
 * Get all products in a category
 */
export function getProductsByCategory(category: keyof typeof CATEGORIES): Product[] {
  const ids = CATEGORIES[category] || [];
  return ids.map(id => PRODUCTS[id]).filter(Boolean);
}

/**
 * Get all products by print method
 */
export function getProductsByPrintMethod(method: PrintMethod): Product[] {
  return Object.values(PRODUCTS).filter(p => p.printMethod === method);
}

/**
 * Get all products matching a subcategory
 */
export function getProductsBySubcategory(subcategory: string): Product[] {
  return Object.values(PRODUCTS).filter(
    p => p.subcategory.toLowerCase() === subcategory.toLowerCase()
  );
}

/**
 * Search products by keyword
 */
export function searchProducts(keyword: string): Product[] {
  const lowerKeyword = keyword.toLowerCase();
  
  return Object.values(PRODUCTS).filter(product => 
    product.frontendName.toLowerCase().includes(lowerKeyword) ||
    product.subcategory.toLowerCase().includes(lowerKeyword) ||
    product.promptKeywords.some(k => k.toLowerCase().includes(lowerKeyword))
  );
}

// ============================================================================
// LISTING FUNCTIONS
// ============================================================================

/**
 * Get all frontend product names
 */
export function getAllFrontendNames(): string[] {
  return Object.values(PRODUCTS).map(p => p.frontendName);
}

/**
 * Get all backend IDs
 */
export function getAllBackendIds(): string[] {
  return Object.values(PRODUCTS).map(p => p.backendId);
}

/**
 * Get all product IDs
 */
export function getAllProductIds(): string[] {
  return Object.keys(PRODUCTS);
}

/**
 * Get products grouped by category
 */
export function getProductsGroupedByCategory(): Record<string, Product[]> {
  const result: Record<string, Product[]> = {};
  
  Object.entries(CATEGORIES).forEach(([category, ids]) => {
    result[category] = ids.map(id => PRODUCTS[id]).filter(Boolean);
  });
  
  return result;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if a product ID exists
 */
export function isValidProductId(id: string): boolean {
  return id in PRODUCTS;
}

/**
 * Check if a backend ID exists
 */
export function isValidBackendId(backendId: string): boolean {
  return backendId in BACKEND_TO_PRODUCT;
}

/**
 * Check if a frontend name exists
 */
export function isValidFrontendName(frontendName: string): boolean {
  return frontendName in FRONTEND_TO_BACKEND;
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get catalog statistics
 */
export function getCatalogStats() {
  const products = Object.values(PRODUCTS);
  
  return {
    total: products.length,
    byCategory: {
      womensApparel: products.filter(p => p.category === 'womens_apparel').length,
      mensApparel: products.filter(p => p.category === 'mens_apparel').length,
      kidsApparel: products.filter(p => p.category === 'kids_apparel').length,
      accessories: products.filter(p => p.category === 'accessories').length,
      homeLiving: products.filter(p => p.category === 'home_living').length,
    },
    byPrintMethod: {
      dtg: products.filter(p => p.printMethod === 'dtg').length,
      sublimation: products.filter(p => p.printMethod === 'sublimation').length,
      aop: products.filter(p => p.printMethod === 'aop').length,
      embroidery: products.filter(p => p.printMethod === 'embroidery').length,
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getProduct,
  getBackendId,
  getPrintfulId,
  getPrintfulIdByName,
  getPrintAreaPixels,
  getPrintAreaInches,
  getAllPrintAreas,
  getProductsByCategory,
  getProductsByPrintMethod,
  getProductsBySubcategory,
  searchProducts,
  getAllFrontendNames,
  getAllBackendIds,
  getAllProductIds,
  getProductsGroupedByCategory,
  isValidProductId,
  isValidBackendId,
  isValidFrontendName,
  getCatalogStats,
};
