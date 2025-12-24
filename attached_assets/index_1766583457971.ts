/**
 * ============================================================================
 * MOCKUP PRODUCT CATALOG
 * ============================================================================
 * 
 * 51 Products | 5 Categories | POD Industry Standard Specs
 * 
 * Usage:
 *   import { PRODUCTS, getProduct, getBackendId } from 'mockup-product-catalog';
 * 
 *   // Get a product by ID, name, or backend ID
 *   const tshirt = getProduct('mens-tshirt');
 *   const hoodie = getProduct('Hoodie');
 *   const mug = getProduct('MUG_11');
 * 
 *   // Get backend ID from frontend name
 *   const backendId = getBackendId('T-Shirt'); // 'MENS_TSHIRT'
 * 
 *   // Get print area pixels
 *   const pixels = getPrintAreaPixels('mug-11oz'); // { width: 2550, height: 900 }
 */

// Types
export * from './types';

// Data
export { COLORS } from './data/colors';
export { SIZES } from './data/sizes';
export { PRODUCTS } from './data/products';

// Mappings
export {
  FRONTEND_TO_BACKEND,
  BACKEND_TO_PRODUCT,
  BACKEND_TO_PRINTFUL,
  ID_TO_PRODUCT,
  CATEGORIES,
  PRODUCT_MAPPING_TABLE,
} from './mappings';

// Utility functions
export {
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
} from './utils';

// Default export
import { PRODUCTS } from './data/products';
export default PRODUCTS;
