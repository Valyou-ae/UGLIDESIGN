/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 */

export interface PrintArea {
  name: string;
  widthInches: number;
  heightInches: number;
  widthPixels: number;      // at 300 DPI
  heightPixels: number;     // at 300 DPI
  position: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  isPopular?: boolean;
}

export interface ProductSize {
  code: string;
  label: string;
}

export type ProductCategory = 
  | 'womens_apparel' 
  | 'mens_apparel' 
  | 'kids_apparel' 
  | 'accessories' 
  | 'home_living';

export type PrintMethod = 
  | 'dtg' 
  | 'sublimation' 
  | 'aop' 
  | 'embroidery';

export interface Product {
  id: string;
  frontendName: string;
  backendId: string;
  category: ProductCategory;
  subcategory: string;
  printMethod: PrintMethod;
  printAreas: PrintArea[];
  sizes: ProductSize[];
  colors: ProductColor[];
  printfulId: string;
  promptKeywords: string[];
}

export interface ProductMapping {
  frontendName: string;
  backendId: string;
  printfulId: string;
  category: string;
  printMethod: PrintMethod;
  printAreaPx: { width: number; height: number };
}

export interface CategoryGroup {
  name: string;
  productIds: string[];
}
