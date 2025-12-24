/**
 * ============================================================================
 * PRODUCT CATALOG - 51 Products
 * ============================================================================
 */

import { Product } from '../types';
import { COLORS } from './colors';
import { SIZES } from './sizes';

export const PRODUCTS: Record<string, Product> = {

  // ==========================================================================
  // WOMEN'S APPAREL (8 products)
  // ==========================================================================

  'womens-crop-top': {
    id: 'womens-crop-top',
    frontendName: 'Crop Top',
    backendId: 'WMNS_CROP',
    category: 'womens_apparel',
    subcategory: 'Crop Tops',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 8, heightInches: 8,
      widthPixels: 2400, heightPixels: 2400,
      position: 'Centered on chest'
    }],
    sizes: SIZES.WOMENS,
    colors: COLORS.WOMENS,
    printfulId: '371',
    promptKeywords: ['crop top', 'cropped tee', 'midriff', 'trendy']
  },

  'womens-tank-top': {
    id: 'womens-tank-top',
    frontendName: 'Tank Top',
    backendId: 'WMNS_TANK',
    category: 'womens_apparel',
    subcategory: 'Tank Tops',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 9, heightInches: 11,
      widthPixels: 2700, heightPixels: 3300,
      position: 'Centered on chest'
    }],
    sizes: SIZES.WOMENS,
    colors: COLORS.WOMENS,
    printfulId: '167',
    promptKeywords: ['tank top', 'sleeveless', 'flowy', 'summer']
  },

  'womens-polo': {
    id: 'womens-polo',
    frontendName: 'Polo Shirt',
    backendId: 'WMNS_POLO',
    category: 'womens_apparel',
    subcategory: 'Polo Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' },
      { name: 'Back', widthInches: 10, heightInches: 12, widthPixels: 3000, heightPixels: 3600, position: 'Upper back' }
    ],
    sizes: SIZES.WOMENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '200',
    promptKeywords: ['polo', 'collared', 'professional', 'golf']
  },

  'womens-dress': {
    id: 'womens-dress',
    frontendName: 'Dress',
    backendId: 'WMNS_DRESS',
    category: 'womens_apparel',
    subcategory: 'Dresses',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 10, heightInches: 14,
      widthPixels: 3000, heightPixels: 4200,
      position: 'Upper front (chest to waist)'
    }],
    sizes: SIZES.WOMENS,
    colors: COLORS.WOMENS,
    printfulId: '486',
    promptKeywords: ['dress', 't-shirt dress', 'casual', 'comfortable']
  },

  'womens-34-sleeve': {
    id: 'womens-34-sleeve',
    frontendName: '3/4 Sleeve Shirt',
    backendId: 'WMNS_34SLV',
    category: 'womens_apparel',
    subcategory: '3/4 Sleeve Shirts',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 10, heightInches: 12,
      widthPixels: 3000, heightPixels: 3600,
      position: 'Centered on chest'
    }],
    sizes: SIZES.WOMENS,
    colors: COLORS.RAGLAN,
    printfulId: '242',
    promptKeywords: ['3/4 sleeve', 'raglan', 'baseball tee']
  },

  'womens-long-sleeve': {
    id: 'womens-long-sleeve',
    frontendName: 'Long Sleeve Shirt',
    backendId: 'WMNS_LS',
    category: 'womens_apparel',
    subcategory: 'Long Sleeve Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 10, heightInches: 12, widthPixels: 3000, heightPixels: 3600, position: 'Centered on chest' },
      { name: 'Back', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Upper back' }
    ],
    sizes: SIZES.WOMENS,
    colors: COLORS.WOMENS,
    printfulId: '246',
    promptKeywords: ['long sleeve', 'fitted', 'layering']
  },

  'womens-knitwear': {
    id: 'womens-knitwear',
    frontendName: 'Knitwear (Sweater)',
    backendId: 'WMNS_KNIT',
    category: 'womens_apparel',
    subcategory: 'Knitwear',
    printMethod: 'embroidery',
    printAreas: [{
      name: 'Left Chest', widthInches: 4, heightInches: 4,
      widthPixels: 1200, heightPixels: 1200,
      position: 'Left chest embroidery'
    }],
    sizes: SIZES.WOMENS,
    colors: COLORS.KNITWEAR,
    printfulId: '458',
    promptKeywords: ['sweater', 'knitwear', 'pullover', 'cozy']
  },

  'womens-jacket': {
    id: 'womens-jacket',
    frontendName: 'Jacket',
    backendId: 'WMNS_JACKET',
    category: 'womens_apparel',
    subcategory: 'Jackets',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' },
      { name: 'Back', widthInches: 12, heightInches: 12, widthPixels: 3600, heightPixels: 3600, position: 'Upper back' }
    ],
    sizes: SIZES.WOMENS,
    colors: COLORS.OUTERWEAR,
    printfulId: '491',
    promptKeywords: ['jacket', 'windbreaker', 'outerwear']
  },

  // ==========================================================================
  // MEN'S APPAREL (11 products)
  // ==========================================================================

  'mens-tshirt': {
    id: 'mens-tshirt',
    frontendName: 'T-Shirt',
    backendId: 'MENS_TSHIRT',
    category: 'mens_apparel',
    subcategory: 'T-Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 12, heightInches: 16, widthPixels: 3600, heightPixels: 4800, position: '3-4" below collar' },
      { name: 'Back', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Upper back' },
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '71',
    promptKeywords: ['t-shirt', 'tee', 'crew neck', 'classic']
  },

  'mens-tank-top': {
    id: 'mens-tank-top',
    frontendName: 'Tank Top',
    backendId: 'MENS_TANK',
    category: 'mens_apparel',
    subcategory: 'Tank Tops',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 10, heightInches: 12, widthPixels: 3000, heightPixels: 3600, position: 'Centered on chest' },
      { name: 'Back', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Upper back' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '163',
    promptKeywords: ['tank top', 'muscle tee', 'sleeveless', 'gym']
  },

  'mens-polo': {
    id: 'mens-polo',
    frontendName: 'Polo Shirt',
    backendId: 'MENS_POLO',
    category: 'mens_apparel',
    subcategory: 'Polo Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' },
      { name: 'Back', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Upper back' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '144',
    promptKeywords: ['polo', 'collared', 'business casual', 'golf']
  },

  'mens-34-sleeve': {
    id: 'mens-34-sleeve',
    frontendName: '3/4 Sleeve Shirt',
    backendId: 'MENS_34SLV',
    category: 'mens_apparel',
    subcategory: '3/4 Sleeve Shirts',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 12, heightInches: 16,
      widthPixels: 3600, heightPixels: 4800,
      position: 'Centered on chest'
    }],
    sizes: SIZES.MENS,
    colors: COLORS.RAGLAN,
    printfulId: '242',
    promptKeywords: ['3/4 sleeve', 'raglan', 'baseball tee', 'vintage']
  },

  'mens-long-sleeve': {
    id: 'mens-long-sleeve',
    frontendName: 'Long Sleeve Shirt',
    backendId: 'MENS_LS',
    category: 'mens_apparel',
    subcategory: 'Long Sleeve Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 12, heightInches: 16, widthPixels: 3600, heightPixels: 4800, position: 'Centered' },
      { name: 'Back', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Upper back' },
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '244',
    promptKeywords: ['long sleeve', 'crew neck', 'layering']
  },

  'mens-embroidered': {
    id: 'mens-embroidered',
    frontendName: 'Embroidered Shirt',
    backendId: 'MENS_EMBROI',
    category: 'mens_apparel',
    subcategory: 'Embroidered Shirts',
    printMethod: 'embroidery',
    printAreas: [
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' },
      { name: 'Right Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Right chest' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '71',
    promptKeywords: ['embroidered', 'stitched', 'logo', 'premium']
  },

  'mens-jacket-vest': {
    id: 'mens-jacket-vest',
    frontendName: 'Jacket & Vest',
    backendId: 'MENS_JACKET',
    category: 'mens_apparel',
    subcategory: 'Jackets & Vests',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' },
      { name: 'Back', widthInches: 14, heightInches: 14, widthPixels: 4200, heightPixels: 4200, position: 'Upper back' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.OUTERWEAR,
    printfulId: '491',
    promptKeywords: ['jacket', 'vest', 'coach jacket', 'outerwear']
  },

  'mens-knitwear': {
    id: 'mens-knitwear',
    frontendName: 'Knitwear',
    backendId: 'MENS_KNIT',
    category: 'mens_apparel',
    subcategory: 'Knitwear',
    printMethod: 'embroidery',
    printAreas: [{
      name: 'Left Chest', widthInches: 4, heightInches: 4,
      widthPixels: 1200, heightPixels: 1200,
      position: 'Left chest embroidery'
    }],
    sizes: SIZES.MENS,
    colors: COLORS.KNITWEAR,
    printfulId: '459',
    promptKeywords: ['sweater', 'knitwear', 'pullover']
  },

  'mens-leggings': {
    id: 'mens-leggings',
    frontendName: 'Leggings',
    backendId: 'MENS_LEGG',
    category: 'mens_apparel',
    subcategory: 'Leggings',
    printMethod: 'aop',
    printAreas: [{
      name: 'Full Coverage', widthInches: 0, heightInches: 0,
      widthPixels: 4800, heightPixels: 8400,
      position: 'Full leg coverage (AOP)'
    }],
    sizes: SIZES.LEGGINGS,
    colors: COLORS.AOP,
    printfulId: '197',
    promptKeywords: ['leggings', 'compression', 'athletic', 'gym']
  },

  'mens-hoodie': {
    id: 'mens-hoodie',
    frontendName: 'Hoodie',
    backendId: 'MENS_HOODIE',
    category: 'mens_apparel',
    subcategory: 'Hoodies',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 12, heightInches: 12, widthPixels: 3600, heightPixels: 3600, position: 'Above kangaroo pocket' },
      { name: 'Back', widthInches: 14, heightInches: 16, widthPixels: 4200, heightPixels: 4800, position: 'Upper back' },
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '146',
    promptKeywords: ['hoodie', 'pullover', 'kangaroo pocket', 'streetwear']
  },

  'mens-sweatshirt': {
    id: 'mens-sweatshirt',
    frontendName: 'Sweatshirt',
    backendId: 'MENS_SWEAT',
    category: 'mens_apparel',
    subcategory: 'Sweatshirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Centered' },
      { name: 'Back', widthInches: 12, heightInches: 14, widthPixels: 3600, heightPixels: 4200, position: 'Upper back' },
      { name: 'Left Chest', widthInches: 4, heightInches: 4, widthPixels: 1200, heightPixels: 1200, position: 'Left chest' }
    ],
    sizes: SIZES.MENS,
    colors: COLORS.APPAREL_FULL,
    printfulId: '148',
    promptKeywords: ['sweatshirt', 'crewneck', 'fleece', 'casual']
  },

  // ==========================================================================
  // KIDS' APPAREL (7 products)
  // ==========================================================================

  'kids-tshirt': {
    id: 'kids-tshirt',
    frontendName: 'T-Shirt',
    backendId: 'KIDS_TSHIRT',
    category: 'kids_apparel',
    subcategory: 'T-Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 9, heightInches: 11, widthPixels: 2700, heightPixels: 3300, position: 'Centered' },
      { name: 'Back', widthInches: 9, heightInches: 10, widthPixels: 2700, heightPixels: 3000, position: 'Upper back' }
    ],
    sizes: SIZES.KIDS,
    colors: COLORS.KIDS,
    printfulId: '384',
    promptKeywords: ['kids tee', 'youth shirt', 'children']
  },

  'kids-hoodie': {
    id: 'kids-hoodie',
    frontendName: 'Hoodie',
    backendId: 'KIDS_HOODIE',
    category: 'kids_apparel',
    subcategory: 'Hoodies',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 10, heightInches: 10, widthPixels: 3000, heightPixels: 3000, position: 'Above pocket' },
      { name: 'Back', widthInches: 11, heightInches: 13, widthPixels: 3300, heightPixels: 3900, position: 'Upper back' }
    ],
    sizes: SIZES.KIDS,
    colors: COLORS.KIDS,
    printfulId: '152',
    promptKeywords: ['kids hoodie', 'youth hoodie', 'cozy']
  },

  'kids-sweatshirt': {
    id: 'kids-sweatshirt',
    frontendName: 'Sweatshirt',
    backendId: 'KIDS_SWEAT',
    category: 'kids_apparel',
    subcategory: 'Sweatshirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 10, heightInches: 11, widthPixels: 3000, heightPixels: 3300, position: 'Centered' },
      { name: 'Back', widthInches: 9, heightInches: 10, widthPixels: 2700, heightPixels: 3000, position: 'Upper back' }
    ],
    sizes: SIZES.KIDS,
    colors: COLORS.KIDS,
    printfulId: '154',
    promptKeywords: ['kids sweatshirt', 'youth crewneck']
  },

  'kids-long-sleeve': {
    id: 'kids-long-sleeve',
    frontendName: 'Long Sleeve Shirt',
    backendId: 'KIDS_LS',
    category: 'kids_apparel',
    subcategory: 'Long Sleeve Shirts',
    printMethod: 'dtg',
    printAreas: [
      { name: 'Front', widthInches: 9, heightInches: 11, widthPixels: 2700, heightPixels: 3300, position: 'Centered' },
      { name: 'Back', widthInches: 9, heightInches: 10, widthPixels: 2700, heightPixels: 3000, position: 'Upper back' }
    ],
    sizes: SIZES.KIDS,
    colors: COLORS.KIDS,
    printfulId: '386',
    promptKeywords: ['kids long sleeve', 'youth shirt']
  },

  'kids-leggings': {
    id: 'kids-leggings',
    frontendName: 'Leggings',
    backendId: 'KIDS_LEGG',
    category: 'kids_apparel',
    subcategory: 'Leggings',
    printMethod: 'aop',
    printAreas: [{
      name: 'Full Coverage', widthInches: 0, heightInches: 0,
      widthPixels: 3600, heightPixels: 6000,
      position: 'Full leg coverage (AOP)'
    }],
    sizes: SIZES.KIDS_LEGGINGS,
    colors: COLORS.AOP,
    printfulId: '198',
    promptKeywords: ['kids leggings', 'youth leggings', 'colorful']
  },

  'baby-bodysuit': {
    id: 'baby-bodysuit',
    frontendName: 'Baby Bodysuit',
    backendId: 'BABY_BODY',
    category: 'kids_apparel',
    subcategory: 'Baby Bodysuits',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 5, heightInches: 5,
      widthPixels: 1500, heightPixels: 1500,
      position: 'Centered on chest'
    }],
    sizes: SIZES.BABY,
    colors: COLORS.BABY,
    printfulId: '309',
    promptKeywords: ['baby onesie', 'bodysuit', 'infant']
  },

  'kids-hat': {
    id: 'kids-hat',
    frontendName: 'Hat',
    backendId: 'KIDS_HAT',
    category: 'kids_apparel',
    subcategory: 'Hats',
    printMethod: 'embroidery',
    printAreas: [{
      name: 'Front Center', widthInches: 4, heightInches: 2.25,
      widthPixels: 1200, heightPixels: 675,
      position: 'Center front panel'
    }],
    sizes: SIZES.YOUTH_HAT,
    colors: COLORS.HATS,
    printfulId: '361',
    promptKeywords: ['kids hat', 'youth cap', 'embroidered']
  },

  // ==========================================================================
  // ACCESSORIES (12 products)
  // ==========================================================================

  'tote-bag': {
    id: 'tote-bag',
    frontendName: 'Tote Bag',
    backendId: 'TOTE_BAG',
    category: 'accessories',
    subcategory: 'Tote Bags',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 10, heightInches: 10,
      widthPixels: 3000, heightPixels: 3000,
      position: 'Centered on front panel'
    }],
    sizes: SIZES.ONE_SIZE,
    colors: COLORS.TOTE,
    printfulId: '378',
    promptKeywords: ['tote bag', 'canvas bag', 'shopping bag', 'eco']
  },

  'drawstring-bag': {
    id: 'drawstring-bag',
    frontendName: 'Drawstring Bag',
    backendId: 'DRAWSTRING',
    category: 'accessories',
    subcategory: 'Drawstring Bags',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 12, heightInches: 14,
      widthPixels: 3600, heightPixels: 4200,
      position: 'Centered on front'
    }],
    sizes: SIZES.ONE_SIZE,
    colors: COLORS.BASIC,
    printfulId: '375',
    promptKeywords: ['drawstring bag', 'cinch sack', 'gym bag']
  },

  'backpack': {
    id: 'backpack',
    frontendName: 'Backpack',
    backendId: 'BACKPACK',
    category: 'accessories',
    subcategory: 'Backpacks',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front Pocket', widthInches: 8, heightInches: 6,
      widthPixels: 2400, heightPixels: 1800,
      position: 'Front pocket panel'
    }],
    sizes: SIZES.ONE_SIZE,
    colors: [{ name: 'Black', hex: '#000000', isPopular: true }],
    printfulId: '434',
    promptKeywords: ['backpack', 'school bag', 'laptop bag']
  },

  'duffle-bag': {
    id: 'duffle-bag',
    frontendName: 'Duffle Bag',
    backendId: 'DUFFLE',
    category: 'accessories',
    subcategory: 'Duffle Bags',
    printMethod: 'aop',
    printAreas: [{
      name: 'All Panels', widthInches: 22, heightInches: 11.5,
      widthPixels: 6600, heightPixels: 3450,
      position: 'Full coverage all panels'
    }],
    sizes: SIZES.DUFFLE,
    colors: COLORS.AOP,
    printfulId: '437',
    promptKeywords: ['duffle bag', 'gym bag', 'travel bag']
  },

  'phone-case-iphone14': {
    id: 'phone-case-iphone14',
    frontendName: 'Phone Case (iPhone 14)',
    backendId: 'PHONE_IP14',
    category: 'accessories',
    subcategory: 'Phone Cases',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Back', widthInches: 3, heightInches: 6,
      widthPixels: 900, heightPixels: 1800,
      position: 'Full back panel'
    }],
    sizes: SIZES.IPHONE_14,
    colors: COLORS.BASIC,
    printfulId: '536',
    promptKeywords: ['phone case', 'iPhone 14', 'protective']
  },

  'phone-case-iphone15': {
    id: 'phone-case-iphone15',
    frontendName: 'Phone Case (iPhone 15)',
    backendId: 'PHONE_IP15',
    category: 'accessories',
    subcategory: 'Phone Cases',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Back', widthInches: 3, heightInches: 6,
      widthPixels: 900, heightPixels: 1800,
      position: 'Full back panel'
    }],
    sizes: SIZES.IPHONE_15,
    colors: COLORS.BASIC,
    printfulId: '645',
    promptKeywords: ['phone case', 'iPhone 15', 'protective']
  },

  'laptop-sleeve-13': {
    id: 'laptop-sleeve-13',
    frontendName: 'Laptop Sleeve (13")',
    backendId: 'LAPTOP_13',
    category: 'accessories',
    subcategory: 'Laptop Sleeves',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Front', widthInches: 13, heightInches: 10,
      widthPixels: 3900, heightPixels: 3000,
      position: 'Full front panel'
    }],
    sizes: SIZES.LAPTOP_13,
    colors: COLORS.BASIC,
    printfulId: '399',
    promptKeywords: ['laptop sleeve', '13 inch', 'MacBook']
  },

  'laptop-sleeve-15': {
    id: 'laptop-sleeve-15',
    frontendName: 'Laptop Sleeve (15")',
    backendId: 'LAPTOP_15',
    category: 'accessories',
    subcategory: 'Laptop Sleeves',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Front', widthInches: 15, heightInches: 11,
      widthPixels: 4500, heightPixels: 3300,
      position: 'Full front panel'
    }],
    sizes: SIZES.LAPTOP_15,
    colors: COLORS.BASIC,
    printfulId: '400',
    promptKeywords: ['laptop sleeve', '15 inch', 'protective']
  },

  'mousepad': {
    id: 'mousepad',
    frontendName: 'Mouse Pad',
    backendId: 'MOUSEPAD',
    category: 'accessories',
    subcategory: 'Mouse Pads',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full Surface', widthInches: 9.25, heightInches: 7.75,
      widthPixels: 2775, heightPixels: 2325,
      position: 'Full top surface'
    }],
    sizes: SIZES.MOUSEPAD,
    colors: COLORS.AOP,
    printfulId: '376',
    promptKeywords: ['mouse pad', 'desk accessory', 'office']
  },

  'flip-flops': {
    id: 'flip-flops',
    frontendName: 'Flip Flops',
    backendId: 'FLIP_FLOPS',
    category: 'accessories',
    subcategory: 'Flip Flops',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Footbed', widthInches: 4, heightInches: 10,
      widthPixels: 1200, heightPixels: 3000,
      position: 'Full footbed (per foot)'
    }],
    sizes: SIZES.FLIP_FLOPS,
    colors: COLORS.FLIP_FLOPS,
    printfulId: '314',
    promptKeywords: ['flip flops', 'sandals', 'beach', 'summer']
  },

  'socks': {
    id: 'socks',
    frontendName: 'Socks',
    backendId: 'SOCKS',
    category: 'accessories',
    subcategory: 'Socks',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full Coverage', widthInches: 0, heightInches: 0,
      widthPixels: 1800, heightPixels: 2400,
      position: 'All-over print'
    }],
    sizes: SIZES.SOCKS,
    colors: COLORS.AOP,
    printfulId: '324',
    promptKeywords: ['socks', 'crew socks', 'all-over print']
  },

  'face-mask': {
    id: 'face-mask',
    frontendName: 'Face Mask',
    backendId: 'FACE_MASK',
    category: 'accessories',
    subcategory: 'Face Masks',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Front', widthInches: 7, heightInches: 5,
      widthPixels: 2100, heightPixels: 1500,
      position: 'Full front panel'
    }],
    sizes: SIZES.FACE_MASK,
    colors: COLORS.AOP,
    printfulId: '445',
    promptKeywords: ['face mask', 'reusable', 'cloth mask']
  },

  // ==========================================================================
  // HOME & LIVING (17 products)
  // ==========================================================================

  'mug-11oz': {
    id: 'mug-11oz',
    frontendName: 'Mug (11oz)',
    backendId: 'MUG_11',
    category: 'home_living',
    subcategory: 'Mugs',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full Wrap', widthInches: 8.5, heightInches: 3,
      widthPixels: 2550, heightPixels: 900,
      position: '360° wrap around mug'
    }],
    sizes: SIZES.MUG_11,
    colors: COLORS.DRINKWARE,
    printfulId: '19',
    promptKeywords: ['mug', 'coffee mug', '11oz', 'ceramic']
  },

  'mug-15oz': {
    id: 'mug-15oz',
    frontendName: 'Mug (15oz)',
    backendId: 'MUG_15',
    category: 'home_living',
    subcategory: 'Mugs',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full Wrap', widthInches: 8.5, heightInches: 3.5,
      widthPixels: 2550, heightPixels: 1050,
      position: '360° wrap around mug'
    }],
    sizes: SIZES.MUG_15,
    colors: COLORS.DRINKWARE,
    printfulId: '534',
    promptKeywords: ['mug', 'large mug', '15oz', 'ceramic']
  },

  'tumbler-20oz': {
    id: 'tumbler-20oz',
    frontendName: 'Tumbler (20oz)',
    backendId: 'TUMBLER_20',
    category: 'home_living',
    subcategory: 'Tumblers',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full Wrap', widthInches: 9, heightInches: 6.5,
      widthPixels: 2700, heightPixels: 1950,
      position: 'Full wrap around tumbler'
    }],
    sizes: SIZES.TUMBLER,
    colors: [{ name: 'White', hex: '#FFFFFF', isPopular: true }],
    printfulId: '455',
    promptKeywords: ['tumbler', 'insulated', 'stainless steel']
  },

  'water-bottle': {
    id: 'water-bottle',
    frontendName: 'Water Bottle',
    backendId: 'WATER_BTL',
    category: 'home_living',
    subcategory: 'Water Bottles',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full Wrap', widthInches: 8, heightInches: 7,
      widthPixels: 2400, heightPixels: 2100,
      position: 'Full wrap'
    }],
    sizes: SIZES.WATER_BOTTLE,
    colors: [{ name: 'White', hex: '#FFFFFF', isPopular: true }],
    printfulId: '494',
    promptKeywords: ['water bottle', 'insulated', 'stainless steel']
  },

  'poster-18x24': {
    id: 'poster-18x24',
    frontendName: 'Poster (18" × 24")',
    backendId: 'POSTER_18X24',
    category: 'home_living',
    subcategory: 'Posters',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Full Bleed', widthInches: 18, heightInches: 24,
      widthPixels: 5400, heightPixels: 7200,
      position: 'Full coverage'
    }],
    sizes: SIZES.POSTER_18X24,
    colors: COLORS.AOP,
    printfulId: '1',
    promptKeywords: ['poster', 'wall art', 'print']
  },

  'poster-24x36': {
    id: 'poster-24x36',
    frontendName: 'Poster (24" × 36")',
    backendId: 'POSTER_24X36',
    category: 'home_living',
    subcategory: 'Posters',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Full Bleed', widthInches: 24, heightInches: 36,
      widthPixels: 7200, heightPixels: 10800,
      position: 'Full coverage'
    }],
    sizes: SIZES.POSTER_24X36,
    colors: COLORS.AOP,
    printfulId: '2',
    promptKeywords: ['poster', 'large poster', 'statement piece']
  },

  'framed-poster': {
    id: 'framed-poster',
    frontendName: 'Framed Poster',
    backendId: 'FRAMED_POSTER',
    category: 'home_living',
    subcategory: 'Framed Posters',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Print Area', widthInches: 18, heightInches: 24,
      widthPixels: 5400, heightPixels: 7200,
      position: 'Within frame'
    }],
    sizes: SIZES.FRAMED_POSTER,
    colors: COLORS.FRAMES,
    printfulId: '367',
    promptKeywords: ['framed poster', 'framed art', 'ready to hang']
  },

  'canvas-print': {
    id: 'canvas-print',
    frontendName: 'Canvas Print',
    backendId: 'CANVAS',
    category: 'home_living',
    subcategory: 'Canvas Prints',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Full + Wrap', widthInches: 16, heightInches: 20,
      widthPixels: 4800, heightPixels: 6000,
      position: 'Include 1.5" gallery wrap edges'
    }],
    sizes: SIZES.CANVAS,
    colors: COLORS.AOP,
    printfulId: '3',
    promptKeywords: ['canvas', 'gallery wrap', 'wall art']
  },

  'blanket': {
    id: 'blanket',
    frontendName: 'Blanket',
    backendId: 'BLANKET',
    category: 'home_living',
    subcategory: 'Blankets',
    printMethod: 'aop',
    printAreas: [{
      name: 'Full Coverage', widthInches: 50, heightInches: 60,
      widthPixels: 7500, heightPixels: 9000,
      position: 'Full front coverage'
    }],
    sizes: SIZES.BLANKET,
    colors: COLORS.AOP,
    printfulId: '339',
    promptKeywords: ['blanket', 'fleece', 'throw blanket', 'cozy']
  },

  'pillow-case': {
    id: 'pillow-case',
    frontendName: 'Pillow Case',
    backendId: 'PILLOW_CASE',
    category: 'home_living',
    subcategory: 'Pillow Cases',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Full', widthInches: 20, heightInches: 30,
      widthPixels: 6000, heightPixels: 9000,
      position: 'Full pillow case coverage'
    }],
    sizes: SIZES.PILLOW_CASE,
    colors: COLORS.AOP,
    printfulId: '523',
    promptKeywords: ['pillow case', 'bedding', 'bedroom']
  },

  'throw-pillow': {
    id: 'throw-pillow',
    frontendName: 'Throw Pillow',
    backendId: 'THROW_PILLOW',
    category: 'home_living',
    subcategory: 'Throw Pillows',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Front', widthInches: 18, heightInches: 18,
      widthPixels: 5400, heightPixels: 5400,
      position: 'Full front panel'
    }],
    sizes: SIZES.THROW_PILLOW,
    colors: COLORS.AOP,
    printfulId: '82',
    promptKeywords: ['throw pillow', 'decorative pillow', 'cushion']
  },

  'beach-towel': {
    id: 'beach-towel',
    frontendName: 'Beach Towel',
    backendId: 'BEACH_TOWEL',
    category: 'home_living',
    subcategory: 'Beach Towels',
    printMethod: 'aop',
    printAreas: [{
      name: 'Full', widthInches: 30, heightInches: 60,
      widthPixels: 4500, heightPixels: 9000,
      position: 'Full front coverage'
    }],
    sizes: SIZES.BEACH_TOWEL,
    colors: COLORS.AOP,
    printfulId: '462',
    promptKeywords: ['beach towel', 'pool towel', 'summer']
  },

  'coasters': {
    id: 'coasters',
    frontendName: 'Coasters',
    backendId: 'COASTERS',
    category: 'home_living',
    subcategory: 'Coasters',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Top', widthInches: 3.75, heightInches: 3.75,
      widthPixels: 1125, heightPixels: 1125,
      position: 'Full top surface'
    }],
    sizes: SIZES.COASTERS,
    colors: COLORS.AOP,
    printfulId: '467',
    promptKeywords: ['coasters', 'drink coasters', 'cork back']
  },

  'notebook': {
    id: 'notebook',
    frontendName: 'Notebook',
    backendId: 'NOTEBOOK',
    category: 'home_living',
    subcategory: 'Notebooks',
    printMethod: 'sublimation',
    printAreas: [{
      name: 'Cover', widthInches: 5.5, heightInches: 8.5,
      widthPixels: 1650, heightPixels: 2550,
      position: 'Front cover'
    }],
    sizes: SIZES.NOTEBOOK,
    colors: COLORS.AOP,
    printfulId: '516',
    promptKeywords: ['notebook', 'journal', 'spiral bound']
  },

  'postcard': {
    id: 'postcard',
    frontendName: 'Postcard',
    backendId: 'POSTCARD',
    category: 'home_living',
    subcategory: 'Postcards',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Front', widthInches: 4, heightInches: 6,
      widthPixels: 1200, heightPixels: 1800,
      position: 'Full front'
    }],
    sizes: SIZES.POSTCARD,
    colors: COLORS.AOP,
    printfulId: '513',
    promptKeywords: ['postcard', 'greeting card', 'stationery']
  },

  'sticker-sheet': {
    id: 'sticker-sheet',
    frontendName: 'Sticker Sheet',
    backendId: 'STICKER_SHEET',
    category: 'home_living',
    subcategory: 'Sticker Sheets',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Full Sheet', widthInches: 8.5, heightInches: 11,
      widthPixels: 2550, heightPixels: 3300,
      position: 'Full sheet'
    }],
    sizes: SIZES.STICKER_SHEET,
    colors: COLORS.AOP,
    printfulId: '505',
    promptKeywords: ['stickers', 'sticker sheet', 'vinyl', 'kiss-cut']
  },

  'magnet': {
    id: 'magnet',
    frontendName: 'Magnet',
    backendId: 'MAGNET',
    category: 'home_living',
    subcategory: 'Magnets',
    printMethod: 'dtg',
    printAreas: [{
      name: 'Full', widthInches: 3, heightInches: 3,
      widthPixels: 900, heightPixels: 900,
      position: 'Full surface'
    }],
    sizes: SIZES.MAGNET,
    colors: COLORS.AOP,
    printfulId: '514',
    promptKeywords: ['magnet', 'fridge magnet', 'refrigerator']
  },
};

export default PRODUCTS;
