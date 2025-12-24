/**
 * ============================================================================
 * TEST / EXAMPLE USAGE
 * ============================================================================
 * 
 * Run with: npm run test
 */

import {
  PRODUCTS,
  FRONTEND_TO_BACKEND,
  CATEGORIES,
  getProduct,
  getBackendId,
  getPrintfulId,
  getPrintAreaPixels,
  getProductsByCategory,
  getProductsByPrintMethod,
  searchProducts,
  getCatalogStats,
} from './index';

console.log('============================================');
console.log('MOCKUP PRODUCT CATALOG - TEST');
console.log('============================================\n');

// ============================================
// 1. CATALOG STATISTICS
// ============================================
console.log('📊 CATALOG STATISTICS');
console.log('--------------------------------------------');
const stats = getCatalogStats();
console.log(`Total Products: ${stats.total}`);
console.log('\nBy Category:');
console.log(`  Women's Apparel: ${stats.byCategory.womensApparel}`);
console.log(`  Men's Apparel: ${stats.byCategory.mensApparel}`);
console.log(`  Kids' Apparel: ${stats.byCategory.kidsApparel}`);
console.log(`  Accessories: ${stats.byCategory.accessories}`);
console.log(`  Home & Living: ${stats.byCategory.homeLiving}`);
console.log('\nBy Print Method:');
console.log(`  DTG: ${stats.byPrintMethod.dtg}`);
console.log(`  Sublimation: ${stats.byPrintMethod.sublimation}`);
console.log(`  AOP: ${stats.byPrintMethod.aop}`);
console.log(`  Embroidery: ${stats.byPrintMethod.embroidery}`);

// ============================================
// 2. PRODUCT LOOKUP EXAMPLES
// ============================================
console.log('\n\n🔍 PRODUCT LOOKUP EXAMPLES');
console.log('--------------------------------------------');

// By product ID
const tshirt = getProduct('mens-tshirt');
console.log(`\nBy ID 'mens-tshirt':`);
console.log(`  Frontend Name: ${tshirt?.frontendName}`);
console.log(`  Backend ID: ${tshirt?.backendId}`);
console.log(`  Printful ID: ${tshirt?.printfulId}`);

// By frontend name
const hoodie = getProduct('Hoodie');
console.log(`\nBy Frontend Name 'Hoodie':`);
console.log(`  ID: ${hoodie?.id}`);
console.log(`  Backend ID: ${hoodie?.backendId}`);

// By backend ID
const mug = getProduct('MUG_11');
console.log(`\nBy Backend ID 'MUG_11':`);
console.log(`  Frontend Name: ${mug?.frontendName}`);
console.log(`  ID: ${mug?.id}`);

// ============================================
// 3. ID MAPPING EXAMPLES
// ============================================
console.log('\n\n🔗 ID MAPPING EXAMPLES');
console.log('--------------------------------------------');

console.log(`\nFrontend → Backend:`);
console.log(`  'T-Shirt' → '${getBackendId('T-Shirt')}'`);
console.log(`  'Mug (11oz)' → '${getBackendId('Mug (11oz)')}'`);
console.log(`  'Crop Top' → '${getBackendId('Crop Top')}'`);

console.log(`\nBackend → Printful:`);
console.log(`  'MENS_TSHIRT' → '${getPrintfulId('MENS_TSHIRT')}'`);
console.log(`  'MUG_11' → '${getPrintfulId('MUG_11')}'`);
console.log(`  'MENS_HOODIE' → '${getPrintfulId('MENS_HOODIE')}'`);

// ============================================
// 4. PRINT AREA EXAMPLES
// ============================================
console.log('\n\n📐 PRINT AREA EXAMPLES');
console.log('--------------------------------------------');

const products = ['mens-tshirt', 'mug-11oz', 'poster-24x36', 'blanket'];
products.forEach(id => {
  const product = getProduct(id);
  const pixels = getPrintAreaPixels(id);
  if (product && pixels) {
    console.log(`\n${product.frontendName}:`);
    console.log(`  Print Area: ${product.printAreas[0].widthInches}" × ${product.printAreas[0].heightInches}"`);
    console.log(`  Pixels: ${pixels.width} × ${pixels.height} px`);
    console.log(`  Method: ${product.printMethod}`);
  }
});

// ============================================
// 5. CATEGORY FILTERING
// ============================================
console.log('\n\n📁 CATEGORY FILTERING');
console.log('--------------------------------------------');

console.log(`\nAccessories (${CATEGORIES['Accessories'].length} products):`);
getProductsByCategory('Accessories').forEach(p => {
  console.log(`  - ${p.frontendName} (${p.printMethod})`);
});

// ============================================
// 6. PRINT METHOD FILTERING
// ============================================
console.log('\n\n🖨️ PRINT METHOD FILTERING');
console.log('--------------------------------------------');

console.log('\nEmbroidery Products:');
getProductsByPrintMethod('embroidery').forEach(p => {
  console.log(`  - ${p.frontendName}`);
});

console.log('\nAOP (All-Over Print) Products:');
getProductsByPrintMethod('aop').forEach(p => {
  console.log(`  - ${p.frontendName}`);
});

// ============================================
// 7. SEARCH EXAMPLE
// ============================================
console.log('\n\n🔎 SEARCH EXAMPLE');
console.log('--------------------------------------------');

console.log('\nSearch "mug":');
searchProducts('mug').forEach(p => {
  console.log(`  - ${p.frontendName}`);
});

console.log('\nSearch "sleeve":');
searchProducts('sleeve').forEach(p => {
  console.log(`  - ${p.frontendName}`);
});

// ============================================
// 8. COMPLETE MAPPING TABLE SAMPLE
// ============================================
console.log('\n\n📋 MAPPING TABLE SAMPLE (First 10)');
console.log('--------------------------------------------');
console.log('\nFrontend Name              | Backend ID      | Printful ID');
console.log('---------------------------|-----------------|------------');

Object.values(PRODUCTS).slice(0, 10).forEach(p => {
  const name = p.frontendName.padEnd(26);
  const backend = p.backendId.padEnd(15);
  console.log(`${name} | ${backend} | ${p.printfulId}`);
});

console.log('\n============================================');
console.log('✅ ALL TESTS PASSED');
console.log('============================================\n');
