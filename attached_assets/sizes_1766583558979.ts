/**
 * ============================================================================
 * SIZE CHARTS
 * ============================================================================
 */

import { ProductSize } from '../types';

export const SIZES: Record<string, ProductSize[]> = {

  // Women's standard sizes
  WOMENS: [
    { code: 'XS', label: 'X-Small' },
    { code: 'S', label: 'Small' },
    { code: 'M', label: 'Medium' },
    { code: 'L', label: 'Large' },
    { code: 'XL', label: 'X-Large' },
    { code: '2XL', label: '2X-Large' },
  ],

  // Men's extended sizes (XS-5XL)
  MENS: [
    { code: 'XS', label: 'X-Small' },
    { code: 'S', label: 'Small' },
    { code: 'M', label: 'Medium' },
    { code: 'L', label: 'Large' },
    { code: 'XL', label: 'X-Large' },
    { code: '2XL', label: '2X-Large' },
    { code: '3XL', label: '3X-Large' },
    { code: '4XL', label: '4X-Large' },
    { code: '5XL', label: '5X-Large' },
  ],

  // Kids sizes with age ranges
  KIDS: [
    { code: 'XS', label: 'X-Small (4-5)' },
    { code: 'S', label: 'Small (6-7)' },
    { code: 'M', label: 'Medium (8-10)' },
    { code: 'L', label: 'Large (12-14)' },
    { code: 'XL', label: 'X-Large (16)' },
  ],

  // Baby sizes by month
  BABY: [
    { code: 'NB', label: 'Newborn' },
    { code: '3M', label: '3 Months' },
    { code: '6M', label: '6 Months' },
    { code: '12M', label: '12 Months' },
    { code: '18M', label: '18 Months' },
    { code: '24M', label: '24 Months' },
  ],

  // Kids leggings (toddler to youth)
  KIDS_LEGGINGS: [
    { code: '2T', label: '2T' },
    { code: '3T', label: '3T' },
    { code: '4T', label: '4T' },
    { code: 'XS', label: 'XS (5-6)' },
    { code: 'S', label: 'S (7-8)' },
    { code: 'M', label: 'M (9-10)' },
    { code: 'L', label: 'L (11-12)' },
  ],

  // Adult leggings
  LEGGINGS: [
    { code: 'XS', label: 'X-Small' },
    { code: 'S', label: 'Small' },
    { code: 'M', label: 'Medium' },
    { code: 'L', label: 'Large' },
    { code: 'XL', label: 'X-Large' },
    { code: '2XL', label: '2X-Large' },
  ],

  // One size products
  ONE_SIZE: [
    { code: 'OS', label: 'One Size' },
  ],

  // Youth hat
  YOUTH_HAT: [
    { code: 'Youth', label: 'Youth (adjustable)' },
  ],

  // Phone cases - iPhone 14 series
  IPHONE_14: [
    { code: 'iPhone14', label: 'iPhone 14' },
    { code: 'iPhone14Plus', label: 'iPhone 14 Plus' },
    { code: 'iPhone14Pro', label: 'iPhone 14 Pro' },
    { code: 'iPhone14ProMax', label: 'iPhone 14 Pro Max' },
  ],

  // Phone cases - iPhone 15 series
  IPHONE_15: [
    { code: 'iPhone15', label: 'iPhone 15' },
    { code: 'iPhone15Plus', label: 'iPhone 15 Plus' },
    { code: 'iPhone15Pro', label: 'iPhone 15 Pro' },
    { code: 'iPhone15ProMax', label: 'iPhone 15 Pro Max' },
  ],

  // Laptop sleeve sizes
  LAPTOP_13: [
    { code: '13', label: '13 inch' },
  ],

  LAPTOP_15: [
    { code: '15', label: '15 inch' },
  ],

  // Flip flop sizes (unisex)
  FLIP_FLOPS: [
    { code: 'S', label: 'Small (W 5-6 / M 4-5)' },
    { code: 'M', label: 'Medium (W 7-8 / M 6-7)' },
    { code: 'L', label: 'Large (W 9-10 / M 8-9)' },
    { code: 'XL', label: 'X-Large (W 11-12 / M 10-11)' },
  ],

  // Sock sizes
  SOCKS: [
    { code: 'S', label: 'Small (W 5-7)' },
    { code: 'M', label: 'Medium (W 8-11 / M 6-9)' },
    { code: 'L', label: 'Large (M 10-13)' },
  ],

  // Mug sizes
  MUG_11: [
    { code: '11oz', label: '11 oz' },
  ],

  MUG_15: [
    { code: '15oz', label: '15 oz' },
  ],

  // Tumbler
  TUMBLER: [
    { code: '20oz', label: '20 oz' },
  ],

  // Water bottle
  WATER_BOTTLE: [
    { code: '17oz', label: '17 oz (500ml)' },
  ],

  // Mousepad
  MOUSEPAD: [
    { code: 'standard', label: '9.25" × 7.75"' },
  ],

  // Face mask
  FACE_MASK: [
    { code: 'OS', label: 'One Size (adjustable)' },
  ],

  // Duffle bag
  DUFFLE: [
    { code: 'OS', label: '22" × 11.5" × 11.5"' },
  ],

  // Poster sizes
  POSTER_18X24: [
    { code: '18x24', label: '18" × 24"' },
  ],

  POSTER_24X36: [
    { code: '24x36', label: '24" × 36"' },
  ],

  // Framed poster sizes
  FRAMED_POSTER: [
    { code: '12x18', label: '12" × 18"' },
    { code: '18x24', label: '18" × 24"' },
    { code: '24x36', label: '24" × 36"' },
  ],

  // Canvas sizes
  CANVAS: [
    { code: '12x16', label: '12" × 16"' },
    { code: '16x20', label: '16" × 20"' },
    { code: '18x24', label: '18" × 24"' },
    { code: '24x36', label: '24" × 36"' },
  ],

  // Blanket sizes
  BLANKET: [
    { code: '50x60', label: '50" × 60"' },
    { code: '60x80', label: '60" × 80"' },
  ],

  // Pillow case
  PILLOW_CASE: [
    { code: 'standard', label: 'Standard (20" × 30")' },
  ],

  // Throw pillow sizes
  THROW_PILLOW: [
    { code: '14x14', label: '14" × 14"' },
    { code: '16x16', label: '16" × 16"' },
    { code: '18x18', label: '18" × 18"' },
    { code: '20x20', label: '20" × 20"' },
  ],

  // Beach towel
  BEACH_TOWEL: [
    { code: '30x60', label: '30" × 60"' },
  ],

  // Coasters
  COASTERS: [
    { code: 'set4', label: '3.75" × 3.75" (Set of 4)' },
  ],

  // Notebook
  NOTEBOOK: [
    { code: '5.5x8.5', label: '5.5" × 8.5"' },
  ],

  // Postcard
  POSTCARD: [
    { code: '4x6', label: '4" × 6"' },
  ],

  // Sticker sheet
  STICKER_SHEET: [
    { code: '8.5x11', label: '8.5" × 11"' },
  ],

  // Magnet sizes
  MAGNET: [
    { code: '3x3', label: '3" × 3"' },
    { code: '4x4', label: '4" × 4"' },
  ],
};

export default SIZES;
