/**
 * ============================================================================
 * FRONTEND TO BACKEND MAPPINGS
 * ============================================================================
 */

import { Product, ProductMapping } from './types';
import { PRODUCTS } from './data/products';

// ============================================================================
// MAPPING OBJECTS
// ============================================================================

/**
 * Frontend Name → Backend ID
 */
export const FRONTEND_TO_BACKEND: Record<string, string> = {};

/**
 * Backend ID → Product
 */
export const BACKEND_TO_PRODUCT: Record<string, Product> = {};

/**
 * Backend ID → Printful ID
 */
export const BACKEND_TO_PRINTFUL: Record<string, string> = {};

/**
 * Product ID → Product
 */
export const ID_TO_PRODUCT: Record<string, Product> = {};

// Initialize all mappings
Object.values(PRODUCTS).forEach(product => {
  FRONTEND_TO_BACKEND[product.frontendName] = product.backendId;
  BACKEND_TO_PRODUCT[product.backendId] = product;
  BACKEND_TO_PRINTFUL[product.backendId] = product.printfulId;
  ID_TO_PRODUCT[product.id] = product;
});

// ============================================================================
// CATEGORY GROUPINGS
// ============================================================================

export const CATEGORIES = {
  "Women's Apparel": Object.values(PRODUCTS)
    .filter(p => p.category === 'womens_apparel')
    .map(p => p.id),
  
  "Men's Apparel": Object.values(PRODUCTS)
    .filter(p => p.category === 'mens_apparel')
    .map(p => p.id),
  
  "Kids' Apparel": Object.values(PRODUCTS)
    .filter(p => p.category === 'kids_apparel')
    .map(p => p.id),
  
  "Accessories": Object.values(PRODUCTS)
    .filter(p => p.category === 'accessories')
    .map(p => p.id),
  
  "Home & Living": Object.values(PRODUCTS)
    .filter(p => p.category === 'home_living')
    .map(p => p.id),
};

// ============================================================================
// FLAT MAPPING TABLE (For quick reference)
// ============================================================================

export const PRODUCT_MAPPING_TABLE: Record<string, ProductMapping> = {};

Object.values(PRODUCTS).forEach(product => {
  PRODUCT_MAPPING_TABLE[product.frontendName] = {
    frontendName: product.frontendName,
    backendId: product.backendId,
    printfulId: product.printfulId,
    category: product.category,
    printMethod: product.printMethod,
    printAreaPx: {
      width: product.printAreas[0]?.widthPixels || 0,
      height: product.printAreas[0]?.heightPixels || 0,
    },
  };
});

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  FRONTEND_TO_BACKEND,
  BACKEND_TO_PRODUCT,
  BACKEND_TO_PRINTFUL,
  ID_TO_PRODUCT,
  CATEGORIES,
  PRODUCT_MAPPING_TABLE,
};
