/**
 * ============================================================================
 * COLOR PALETTES
 * ============================================================================
 */

import { ProductColor } from '../types';

export const COLORS: Record<string, ProductColor[]> = {
  
  // Full spectrum for men's apparel
  APPAREL_FULL: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
    { name: 'Black', hex: '#000000', isPopular: true },
    { name: 'Navy', hex: '#1E3A5F', isPopular: true },
    { name: 'Heather Grey', hex: '#9CA3AF', isPopular: true },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Royal Blue', hex: '#1D4ED8' },
    { name: 'Forest Green', hex: '#166534' },
    { name: 'Maroon', hex: '#7F1D1D' },
    { name: 'Gold', hex: '#FBBF24' },
    { name: 'Orange', hex: '#EA580C' },
    { name: 'Purple', hex: '#7C3AED' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Teal', hex: '#0D9488' },
    { name: 'Charcoal', hex: '#374151' },
    { name: 'Light Blue', hex: '#7DD3FC' },
    { name: 'Olive', hex: '#65A30D' },
    { name: 'Burgundy', hex: '#881337' },
    { name: 'Coral', hex: '#F97316' },
  ],

  // Women's fashion palette
  WOMENS: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
    { name: 'Black', hex: '#000000', isPopular: true },
    { name: 'Blush Pink', hex: '#FBB6CE' },
    { name: 'Mauve', hex: '#C084FC' },
    { name: 'Sage Green', hex: '#86EFAC' },
    { name: 'Dusty Rose', hex: '#F9A8D4' },
    { name: 'Navy', hex: '#1E3A5F' },
    { name: 'Burgundy', hex: '#881337' },
    { name: 'Cream', hex: '#FFFBEB' },
    { name: 'Lavender', hex: '#C4B5FD' },
    { name: 'Terracotta', hex: '#C2410C' },
    { name: 'Olive', hex: '#65A30D' },
  ],

  // Kids fun colors
  KIDS: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
    { name: 'Black', hex: '#000000' },
    { name: 'Bright Pink', hex: '#EC4899', isPopular: true },
    { name: 'Sky Blue', hex: '#38BDF8', isPopular: true },
    { name: 'Lime Green', hex: '#84CC16' },
    { name: 'Sunny Yellow', hex: '#FACC15' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Turquoise', hex: '#06B6D4' },
    { name: 'Navy', hex: '#1E3A5F' },
    { name: 'Heather Grey', hex: '#9CA3AF' },
  ],

  // Baby soft colors
  BABY: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
    { name: 'Heather Grey', hex: '#D1D5DB' },
    { name: 'Light Pink', hex: '#FBB6CE', isPopular: true },
    { name: 'Light Blue', hex: '#7DD3FC', isPopular: true },
    { name: 'Butter Yellow', hex: '#FEF08A' },
    { name: 'Mint', hex: '#86EFAC' },
  ],

  // Basic black/white
  BASIC: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
    { name: 'Black', hex: '#000000', isPopular: true },
  ],

  // Drinkware colors
  DRINKWARE: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
    { name: 'Black', hex: '#1F2937' },
    { name: 'Navy', hex: '#1E3A5F' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Light Pink', hex: '#F9A8D4' },
    { name: 'Light Blue', hex: '#7DD3FC' },
    { name: 'Green', hex: '#16A34A' },
    { name: 'Yellow', hex: '#FACC15' },
  ],

  // AOP base (white only for sublimation)
  AOP: [
    { name: 'White', hex: '#FFFFFF', isPopular: true },
  ],

  // Raglan/baseball tee combos
  RAGLAN: [
    { name: 'White/Black', hex: '#FFFFFF', isPopular: true },
    { name: 'White/Navy', hex: '#FFFFFF' },
    { name: 'White/Red', hex: '#FFFFFF' },
    { name: 'Grey/Black', hex: '#9CA3AF' },
    { name: 'Grey/Navy', hex: '#9CA3AF' },
    { name: 'White/Charcoal', hex: '#FFFFFF' },
  ],

  // Knitwear/sweater colors
  KNITWEAR: [
    { name: 'Black', hex: '#000000', isPopular: true },
    { name: 'Navy', hex: '#1E3A5F', isPopular: true },
    { name: 'Cream', hex: '#FFFBEB' },
    { name: 'Heather Grey', hex: '#9CA3AF' },
    { name: 'Burgundy', hex: '#881337' },
    { name: 'Forest Green', hex: '#166534' },
    { name: 'Camel', hex: '#D4A76A' },
  ],

  // Outerwear colors
  OUTERWEAR: [
    { name: 'Black', hex: '#000000', isPopular: true },
    { name: 'Navy', hex: '#1E3A5F', isPopular: true },
    { name: 'Olive', hex: '#65A30D' },
    { name: 'Charcoal', hex: '#374151' },
    { name: 'Burgundy', hex: '#881337' },
  ],

  // Frame colors for framed posters
  FRAMES: [
    { name: 'Black Frame', hex: '#000000', isPopular: true },
    { name: 'White Frame', hex: '#FFFFFF' },
    { name: 'Natural Wood', hex: '#D4A76A' },
  ],

  // Hat colors
  HATS: [
    { name: 'Black', hex: '#000000', isPopular: true },
    { name: 'Navy', hex: '#1E3A5F' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Royal Blue', hex: '#1D4ED8' },
  ],

  // Tote bag colors
  TOTE: [
    { name: 'Natural', hex: '#F5F0E1', isPopular: true },
    { name: 'Black', hex: '#1F2937', isPopular: true },
    { name: 'Navy', hex: '#1E3A5F' },
  ],

  // Flip flop strap colors
  FLIP_FLOPS: [
    { name: 'White Straps', hex: '#FFFFFF', isPopular: true },
    { name: 'Black Straps', hex: '#000000', isPopular: true },
  ],
};

export default COLORS;
