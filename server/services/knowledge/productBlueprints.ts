import { Product, ProductColor } from '../../../shared/mockupTypes';

const STANDARD_DTG_COLORS: ProductColor[] = [
  { name: 'White', hex: '#FFFFFF', category: 'light' },
  { name: 'Black', hex: '#000000', category: 'dark' },
  { name: 'Navy', hex: '#1E3A5F', category: 'dark' },
  { name: 'Royal Blue', hex: '#2E5090', category: 'dark' },
  { name: 'Carolina Blue', hex: '#7BAFD4', category: 'light' },
  { name: 'Red', hex: '#B22222', category: 'dark' },
  { name: 'Cardinal Red', hex: '#8C1515', category: 'dark' },
  { name: 'Maroon', hex: '#5D1A1A', category: 'dark' },
  { name: 'Forest Green', hex: '#228B22', category: 'dark' },
  { name: 'Irish Green', hex: '#009A44', category: 'dark' },
  { name: 'Military Green', hex: '#4B5320', category: 'dark' },
  { name: 'Charcoal', hex: '#36454F', category: 'dark' },
  { name: 'Sport Grey', hex: '#9EA1A1', category: 'neutral' },
  { name: 'Ash Grey', hex: '#C4C4C4', category: 'light' },
  { name: 'Sand', hex: '#C2B280', category: 'light' },
  { name: 'Natural', hex: '#F5F5DC', category: 'light' },
  { name: 'Light Pink', hex: '#FFB6C1', category: 'light' },
  { name: 'Heliconia', hex: '#E63E62', category: 'dark' },
  { name: 'Purple', hex: '#663399', category: 'dark' },
  { name: 'Orange', hex: '#FF6600', category: 'dark' },
  { name: 'Gold', hex: '#FFD700', category: 'light' },
  { name: 'Daisy', hex: '#FFEB3B', category: 'light' },
  { name: 'Sapphire', hex: '#0F52BA', category: 'dark' },
  { name: 'Brown', hex: '#654321', category: 'dark' }
];

const BELLA_CANVAS_COLORS: ProductColor[] = [
  { name: 'White', hex: '#FFFFFF', category: 'light' },
  { name: 'Vintage White', hex: '#FAF9F6', category: 'light' },
  { name: 'Soft Cream', hex: '#FFFDD0', category: 'light' },
  { name: 'Black', hex: '#000000', category: 'dark' },
  { name: 'Black Heather', hex: '#1C1C1C', category: 'dark' },
  { name: 'Dark Grey Heather', hex: '#4A4A4A', category: 'dark' },
  { name: 'Athletic Heather', hex: '#B5B5B5', category: 'neutral' },
  { name: 'Silver', hex: '#C0C0C0', category: 'light' },
  { name: 'Navy', hex: '#1E3A5F', category: 'dark' },
  { name: 'True Royal', hex: '#2E5090', category: 'dark' },
  { name: 'Heather Deep Teal', hex: '#3A6A6A', category: 'dark' },
  { name: 'Red', hex: '#B22222', category: 'dark' },
  { name: 'Canvas Red', hex: '#CF1020', category: 'dark' },
  { name: 'Maroon', hex: '#5D1A1A', category: 'dark' },
  { name: 'Forest', hex: '#228B22', category: 'dark' },
  { name: 'Kelly Green', hex: '#4CBB17', category: 'dark' },
  { name: 'Army', hex: '#4B5320', category: 'dark' },
  { name: 'Heather Mauve', hex: '#C8A2C8', category: 'light' },
  { name: 'Heather Orchid', hex: '#DA70D6', category: 'light' },
  { name: 'Mustard', hex: '#FFDB58', category: 'light' },
  { name: 'Sunset', hex: '#FAD6A5', category: 'light' },
  { name: 'Peach', hex: '#FFE5B4', category: 'light' },
  { name: 'Burnt Orange', hex: '#CC5500', category: 'dark' },
  { name: 'Aqua', hex: '#00FFFF', category: 'light' }
];

const SWEATSHIRT_COLORS: ProductColor[] = [
  { name: 'White', hex: '#FFFFFF', category: 'light' },
  { name: 'Black', hex: '#000000', category: 'dark' },
  { name: 'Navy', hex: '#1E3A5F', category: 'dark' },
  { name: 'Sport Grey', hex: '#9EA1A1', category: 'neutral' },
  { name: 'Dark Heather', hex: '#4A4A4A', category: 'dark' },
  { name: 'Charcoal', hex: '#36454F', category: 'dark' },
  { name: 'Red', hex: '#B22222', category: 'dark' },
  { name: 'Maroon', hex: '#5D1A1A', category: 'dark' },
  { name: 'Forest Green', hex: '#228B22', category: 'dark' },
  { name: 'Military Green', hex: '#4B5320', category: 'dark' },
  { name: 'Royal', hex: '#2E5090', category: 'dark' },
  { name: 'Carolina Blue', hex: '#7BAFD4', category: 'light' },
  { name: 'Ash', hex: '#C4C4C4', category: 'light' },
  { name: 'Sand', hex: '#C2B280', category: 'light' },
  { name: 'Light Pink', hex: '#FFB6C1', category: 'light' },
  { name: 'Purple', hex: '#663399', category: 'dark' }
];

const AOP_BASE_COLORS: ProductColor[] = [
  { name: 'All-Over Print', hex: '#FFFFFF', category: 'light' }
];

export const DTG_PRODUCTS: Product[] = [
  {
    id: 'gildan-5000',
    name: 'Gildan 5000 Classic T-Shirt',
    category: 'Apparel',
    subcategory: 'T-Shirts',
    productType: 'dtg-apparel',
    isWearable: true,
    availableColors: STANDARD_DTG_COLORS,
    defaultPlacement: 'center-chest'
  },
  {
    id: 'bella-3001',
    name: 'Bella+Canvas 3001 Unisex Jersey Tee',
    category: 'Apparel',
    subcategory: 'T-Shirts',
    productType: 'dtg-apparel',
    isWearable: true,
    availableColors: BELLA_CANVAS_COLORS,
    defaultPlacement: 'center-chest'
  },
  {
    id: 'gildan-18000',
    name: 'Gildan 18000 Crewneck Sweatshirt',
    category: 'Apparel',
    subcategory: 'Sweatshirts',
    productType: 'dtg-apparel',
    isWearable: true,
    availableColors: SWEATSHIRT_COLORS,
    defaultPlacement: 'center-chest-large'
  },
  {
    id: 'gildan-18500',
    name: 'Gildan 18500 Pullover Hoodie',
    category: 'Apparel',
    subcategory: 'Hoodies',
    productType: 'dtg-apparel',
    isWearable: true,
    availableColors: SWEATSHIRT_COLORS,
    defaultPlacement: 'above-pocket'
  }
];

export const AOP_PRODUCTS: Product[] = [
  {
    id: 'aop-tshirt',
    name: 'All-Over Print T-Shirt',
    category: 'Apparel',
    subcategory: 'T-Shirts',
    productType: 'aop-apparel',
    isWearable: true,
    availableColors: AOP_BASE_COLORS,
    defaultPlacement: 'full-coverage'
  },
  {
    id: 'aop-hoodie',
    name: 'All-Over Print Hoodie',
    category: 'Apparel',
    subcategory: 'Hoodies',
    productType: 'aop-apparel',
    isWearable: true,
    availableColors: AOP_BASE_COLORS,
    defaultPlacement: 'full-coverage-panels'
  },
  {
    id: 'aop-leggings',
    name: 'All-Over Print Leggings',
    category: 'Apparel',
    subcategory: 'Leggings',
    productType: 'aop-apparel',
    isWearable: true,
    availableColors: AOP_BASE_COLORS,
    defaultPlacement: '360-coverage'
  },
  {
    id: 'aop-joggers',
    name: 'All-Over Print Joggers',
    category: 'Apparel',
    subcategory: 'Joggers',
    productType: 'aop-apparel',
    isWearable: true,
    availableColors: AOP_BASE_COLORS,
    defaultPlacement: 'full-coverage-side-panel'
  }
];

const ALL_PRODUCTS: Product[] = [...DTG_PRODUCTS, ...AOP_PRODUCTS];

export function getProduct(id: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.id === id);
}

export function getDTGProducts(): Product[] {
  return [...DTG_PRODUCTS];
}

export function getAOPProducts(): Product[] {
  return [...AOP_PRODUCTS];
}

export function getAllProducts(): Product[] {
  return [...ALL_PRODUCTS];
}

export function getProductsByCategory(category: string): Product[] {
  return ALL_PRODUCTS.filter(p => p.category === category);
}

export function getProductsBySubcategory(subcategory: string): Product[] {
  return ALL_PRODUCTS.filter(p => p.subcategory === subcategory);
}

export interface GarmentBlueprint {
  fit: string;
  hem: string;
  collarType: string;
  sleeveType: string;
  extraFeatures?: string;
  aopConstruction?: string;
}

export function getGarmentBlueprint(product: Product): GarmentBlueprint {
  const name = product.name.toLowerCase();
  const isAop = product.productType === 'aop-apparel';

  if (name.includes('leggings')) {
    return {
      fit: 'Form-fitting, high-waisted',
      hem: 'Flatlock seams at ankles',
      collarType: 'N/A - Wide elastic waistband (3-4 inches)',
      sleeveType: 'N/A - Full-length legs tapering to ankle',
      extraFeatures: '82% Polyester/18% Spandex blend, flatlock seams for comfort',
      aopConstruction: isAop ? 'Solid color waistband using dominant accent color from pattern' : undefined
    };
  }

  if (name.includes('joggers')) {
    return {
      fit: 'Relaxed fit with tapered leg',
      hem: 'Ribbed ankle cuffs',
      collarType: 'N/A - Elastic waistband with drawstring',
      sleeveType: 'N/A - Full-length legs with side seam pockets',
      extraFeatures: 'Side seam pockets, elastic waistband',
      aopConstruction: isAop ? 'Side panels may require pattern alignment consideration' : undefined
    };
  }

  if (name.includes('hoodie')) {
    return {
      fit: 'Regular fit',
      hem: 'Ribbed waistband',
      collarType: 'Hood with drawstrings, attached to crewneck base',
      sleeveType: 'Set-in long sleeves with ribbed cuffs',
      extraFeatures: 'Kangaroo pocket on front',
      aopConstruction: isAop ? 'Panel construction, hood separate panel, solid color ribbing using accent color' : undefined
    };
  }

  if (name.includes('sweatshirt') || name.includes('crewneck')) {
    return {
      fit: 'Regular fit',
      hem: 'Ribbed waistband',
      collarType: 'Ribbed crewneck',
      sleeveType: 'Set-in long sleeves with ribbed cuffs',
      aopConstruction: isAop ? 'Solid color collar and cuffs using dominant accent color' : undefined
    };
  }

  return {
    fit: 'Regular fit (not slim, not oversized)',
    hem: 'Straight hem with no side slits',
    collarType: 'Ribbed crewneck (rounded collar, no buttons, no placket)',
    sleeveType: 'Set-in short sleeves',
    aopConstruction: isAop ? 'Solid color collar and sleeve hems using dominant accent color' : undefined
  };
}

export function getGarmentBlueprintPrompt(product: Product): string {
  const blueprint = getGarmentBlueprint(product);
  let prompt = `Garment Construction: ${blueprint.fit}. ${blueprint.collarType}. ${blueprint.sleeveType}. ${blueprint.hem}.`;
  
  if (blueprint.extraFeatures) {
    prompt += ` Features: ${blueprint.extraFeatures}.`;
  }
  
  if (blueprint.aopConstruction) {
    prompt += ` AOP: ${blueprint.aopConstruction}.`;
  }
  
  return prompt;
}
