import { FabricPhysics, PrintMethod, MaterialPreset, MaterialPresetKey, JourneyType } from '@shared/mockupTypes';

export const FABRIC_PHYSICS: Record<string, FabricPhysics> = {
  'cotton-ringspun': {
    fabricType: 'Ring-spun Cotton',
    weight: '4.2 oz/yd²',
    stretchability: 15,
    drapeFactor: 40,
    wrinkleTendency: 65,
    textureDensity: 'Medium weave with visible cotton fibers, matte finish',
    printAbsorption: 'High ink absorption, slight color muting',
    foldCharacteristics: 'Natural creases at stress points, soft wrinkles',
    promptAddition: `The fabric is ring-spun cotton with a medium weight (4.2 oz/yd²). 
    It has natural fiber texture visible up close, with a soft matte finish. 
    The fabric drapes naturally with gentle folds and micro-wrinkles, especially at underarms and sides. 
    Cotton absorbs the print ink, so colors appear slightly muted and textured rather than glossy. 
    The weave pattern is subtly visible through the print.`
  },
  'cotton-combed': {
    fabricType: 'Combed Cotton',
    weight: '4.0 oz/yd²',
    stretchability: 10,
    drapeFactor: 35,
    wrinkleTendency: 55,
    textureDensity: 'Fine weave, smooth surface',
    printAbsorption: 'Moderate absorption, better color vibrancy',
    foldCharacteristics: 'Softer folds, less prone to harsh creases',
    promptAddition: `The fabric is combed cotton with fine, smooth surface texture. 
    The weave is tight and even, creating a semi-matte appearance. 
    This fabric drapes smoothly with gentle, flowing folds rather than sharp creases. 
    Prints on combed cotton maintain better color vibrancy than regular cotton. 
    The material has natural micro-wrinkles that follow body contours.`
  },
  'cotton-poly-blend': {
    fabricType: '50/50 Cotton-Polyester Blend',
    weight: '6-8 oz/yd²',
    stretchability: 20,
    drapeFactor: 50,
    wrinkleTendency: 30,
    textureDensity: 'Heathered texture with mixed fibers',
    printAbsorption: 'Moderate absorption, glossier finish',
    foldCharacteristics: 'Maintains shape better, fewer wrinkles',
    promptAddition: `The fabric is a 50/50 cotton-polyester blend, heavier weight (6-8 oz). 
    It has a distinctive heathered texture with blended color fibers visible. 
    The polyester content gives it more body and structure, with less tendency to wrinkle severely. 
    Folds are more structural and maintain their shape. 
    Prints have a slightly glossier appearance compared to pure cotton due to polyester fibers. 
    The fabric has moderate stretch and recovery.`
  },
  'polyester-performance': {
    fabricType: '100% Polyester Performance',
    weight: '3.5 oz/yd²',
    stretchability: 30,
    drapeFactor: 45,
    wrinkleTendency: 20,
    textureDensity: 'Smooth, athletic texture',
    printAbsorption: 'Dye sublimation - colors saturate fabric',
    foldCharacteristics: 'Athletic stretch creases, quick recovery',
    promptAddition: `The fabric is 100% polyester performance material, lightweight and athletic. 
    It has a smooth, slightly shiny surface with subtle stretch texture. 
    The material is highly flexible with visible stretch lines at tension points. 
    For dye sublimation prints, colors are vibrant and saturate the fabric completely. 
    Folds are dynamic and athletic-looking, with quick crease recovery. 
    The fabric has a technical, modern appearance with moisture-wicking properties visible in the texture.`
  },
  'fleece-polyester': {
    fabricType: 'Polyester Fleece',
    weight: '10-13 oz/yd²',
    stretchability: 25,
    drapeFactor: 70,
    wrinkleTendency: 15,
    textureDensity: 'Soft pile texture, fuzzy surface',
    printAbsorption: 'Surface printing on pile',
    foldCharacteristics: 'Bulky folds, soft compression zones',
    promptAddition: `The fabric is polyester fleece, thick and soft with a pile texture. 
    The surface has a fuzzy, brushed appearance with visible texture depth. 
    Due to the thickness, folds are bulkier and more pronounced. 
    The material compresses at pressure points (elbows, underarms) creating soft, padded-looking creases. 
    Prints sit on the surface of the pile, creating a unique textured look. 
    The fabric drapes heavily with substantial weight visible in hanging sections.`
  },
  'triblend': {
    fabricType: 'Tri-Blend (50% Poly, 25% Cotton, 25% Rayon)',
    weight: '3.8 oz/yd²',
    stretchability: 35,
    drapeFactor: 60,
    wrinkleTendency: 40,
    textureDensity: 'Ultra-soft slub texture',
    printAbsorption: 'Vintage appearance, slightly distressed',
    foldCharacteristics: 'Flowing drape, elegant folds',
    promptAddition: `The fabric is a tri-blend: 50% polyester, 25% cotton, 25% rayon. 
    It has an ultra-soft, luxurious feel with visible slub texture (irregular yarn thickness). 
    The rayon content gives it exceptional drape and flow, creating elegant, cascading folds. 
    The fabric has significant stretch and recovery, showing dynamic movement. 
    Prints on tri-blend have a vintage, slightly worn-in appearance. 
    The material has a premium, boutique quality look with organic texture variations.`
  }
};

export const DTG_PRINTING: PrintMethod = {
  id: 'dtg',
  name: 'Direct-to-Garment',
  commonName: 'DTG',
  description: 'Inkjet-based printing directly onto fabric, absorbed into fibers',
  surfaceCharacteristics: {
    texture: 'Soft hand feel, nearly imperceptible to touch, print sits within fabric fibers not on top',
    sheen: 'Matte finish matching fabric sheen, no additional glossiness, natural fabric appearance',
    thickness: 'No added thickness, completely flat with fabric surface, no raised texture',
    handFeel: 'Identical to unprinted fabric, soft and natural, breathable, no stiffness'
  },
  lightInteraction: {
    reflectivity: 'Minimal reflectivity, matches fabric base, slightly less reflective than fabric in dark ink areas',
    highlights: 'Subtle highlights following fabric texture, no distinct print highlights separate from fabric',
    shadows: 'Print follows fabric shadows naturally, no shadow casting from print itself'
  },
  fabricConformity: {
    stretchBehavior: 'Stretches perfectly with fabric, no cracking or distortion, design maintains integrity when fabric stretches',
    foldingBehavior: 'Folds smoothly with fabric, no resistance, print follows all fabric creases naturally',
    drapingBehavior: 'Drapes identically to unprinted fabric, print adds no weight or stiffness, flows naturally'
  },
  visualProperties: {
    colorVibrancy: 'Good vibrancy on light fabrics, slightly muted on dark fabrics, colors absorbed into fibers',
    edgeDefinition: 'Sharp edge definition, clean lines, capable of fine detail, slight fiber absorption at edges',
    detailCapability: 'Excellent detail capability, can reproduce photographs and fine graphics, 1200+ DPI quality'
  },
  promptPhrase: 'DTG direct-to-garment printed design',
  technicalDescription: 'design printed with DTG inkjet process directly into fabric fibers, soft hand feel with no additional texture, matte finish matching fabric sheen, print sits flush with fabric surface creating seamless integration, colors slightly absorbed into fibers creating natural appearance, design stretches and drapes perfectly with fabric without cracking or distortion, no raised or embossed effect, subtle highlights following natural fabric texture, print follows all fabric contours and folds naturally',
  bestForMaterials: ['100% cotton (optimal)', 'Cotton blends (80%+ cotton)'],
  limitations: ['Less vibrant on dark fabrics', 'Not ideal for 100% polyester']
};

export const SCREEN_PRINTING: PrintMethod = {
  id: 'screen-print',
  name: 'Screen Printing',
  commonName: 'Screen Print',
  description: 'Ink pressed through mesh screen onto fabric surface, creates ink layer on top of fabric',
  surfaceCharacteristics: {
    texture: 'Slight raised texture, tactile ink layer sits on fabric surface',
    sheen: 'Semi-matte to slight sheen depending on ink type',
    thickness: 'Thin but perceptible ink layer, approximately 0.1-0.3mm thickness',
    handFeel: 'Slightly stiffer than DTG in print areas'
  },
  lightInteraction: {
    reflectivity: 'Moderate reflectivity, slightly more reflective than fabric base',
    highlights: 'Distinct highlights on raised ink edges',
    shadows: 'Subtle shadows at print edges due to thickness'
  },
  fabricConformity: {
    stretchBehavior: 'Stretches with fabric but with slight resistance, plastisol may show micro-cracks',
    foldingBehavior: 'Folds with some resistance due to ink thickness',
    drapingBehavior: 'Drapes naturally but with slightly more body than DTG'
  },
  visualProperties: {
    colorVibrancy: 'Excellent color vibrancy, opaque bold colors',
    edgeDefinition: 'Very sharp clean edges, precise line work',
    detailCapability: 'Good detail but limited by mesh count'
  },
  promptPhrase: 'screen printed design with raised ink texture',
  technicalDescription: 'screen printed design with thin raised ink layer sitting on fabric surface, subtle tactile texture with slight sheen, ink creates perceptible relief effect, highlights catch on raised ink edges, bold opaque colors with excellent vibrancy, sharp clean edge definition',
  bestForMaterials: ['Cotton', 'Polyester', 'Blends'],
  limitations: ['Limited fine detail', 'Halftone dots visible in gradients']
};

export const SUBLIMATION_PRINTING: PrintMethod = {
  id: 'sublimation',
  name: 'Dye Sublimation',
  commonName: 'Sublimation',
  description: 'Dye gas infused into polyester fibers at molecular level',
  surfaceCharacteristics: {
    texture: 'Completely smooth, zero added texture',
    sheen: 'Inherits fabric sheen exactly',
    thickness: 'Absolutely no thickness change',
    handFeel: 'Identical to base fabric, softest possible feel'
  },
  lightInteraction: {
    reflectivity: 'Matches polyester fabric reflectivity',
    highlights: 'Highlights follow fabric structure only',
    shadows: 'Print creates no shadows'
  },
  fabricConformity: {
    stretchBehavior: 'Perfect stretch with no resistance or cracking',
    foldingBehavior: 'Folds exactly like unprinted fabric',
    drapingBehavior: 'Drapes identically to base fabric'
  },
  visualProperties: {
    colorVibrancy: 'Exceptional vibrancy, most vivid of all print methods',
    edgeDefinition: 'Very sharp edges, photographic quality',
    detailCapability: 'Exceptional fine detail, continuous tone'
  },
  promptPhrase: 'dye sublimation printed design infused into fabric',
  technicalDescription: 'dye sublimation design where dye is molecularly bonded into polyester fibers, absolutely no added texture or thickness, completely smooth surface, exceptional color vibrancy with glowing saturation, stretches and drapes perfectly with zero resistance or cracking, sharp photographic detail quality',
  bestForMaterials: ['100% polyester (required)', 'Polyester blends (50%+ poly)'],
  limitations: ['ONLY works on polyester', 'Does not work on cotton']
};

export const MATERIAL_PRESETS: Record<MaterialPresetKey, MaterialPreset> = {
  BRAND_NEW: {
    id: 'BRAND_NEW',
    name: 'Brand New',
    description: 'Fresh from package, minimal folds, crisp appearance',
    promptAddition: 'Brand new unworn garment fresh from package, crisp fabric with minimal natural folds (only 3-4 subtle creases from being folded), no pilling or wear marks visible, vibrant unworn color at full saturation, fabric has slight stiffness characteristic of new cotton, minimal micro-wrinkles, pristine unworn condition, fabric drape is slightly stiffer than worn garments'
  },
  LIVED_IN: {
    id: 'LIVED_IN',
    name: 'Lived In',
    description: 'Worn a few times, natural realistic appearance, comfortable look',
    promptAddition: 'Garment worn 2-3 times and washed approximately 5 times, natural realistic fabric folds (7+ visible creases and micro-wrinkles from natural wear), slight micro-pilling visible on close inspection, colors slightly softened by approximately 5% from washing, fabric has comfortable lived-in softness with natural drape, authentic worn-in appearance, micro-wrinkles concentrated at underarms and sides, realistic everyday garment condition'
  },
  VINTAGE_DISTRESSED: {
    id: 'VINTAGE_DISTRESSED',
    name: 'Vintage Distressed',
    description: 'Intentionally aged appearance, significant fading and texture',
    promptAddition: 'Vintage distressed garment with intentional aging, washed 40+ times creating significant wear, natural folds (8+ creases) with authentic vintage character, moderate pilling creating vintage texture particularly visible on fabric surface, colors faded by 30% creating authentic sun-faded vintage appearance, fabric is extremely soft with maximum vintage drape, possible subtle wear marks at stress points, authentic thrift store vintage aesthetic, nostalgic aged character throughout'
  }
};

export function getFabricPhysics(fabricType: string): FabricPhysics | null {
  const normalized = fabricType.toLowerCase();
  
  if (normalized.includes('tri') && normalized.includes('blend')) {
    return FABRIC_PHYSICS['triblend'];
  }
  if (normalized.includes('fleece')) {
    return FABRIC_PHYSICS['fleece-polyester'];
  }
  if (normalized.includes('poly') && normalized.includes('cotton')) {
    return FABRIC_PHYSICS['cotton-poly-blend'];
  }
  if (normalized.includes('performance') || normalized.includes('100% polyester')) {
    return FABRIC_PHYSICS['polyester-performance'];
  }
  if (normalized.includes('combed')) {
    return FABRIC_PHYSICS['cotton-combed'];
  }
  if (normalized.includes('ringspun') || normalized.includes('ring-spun')) {
    return FABRIC_PHYSICS['cotton-ringspun'];
  }
  
  return FABRIC_PHYSICS['cotton-ringspun'];
}

export function getPrintMethod(journeyType: JourneyType): PrintMethod {
  if (journeyType === 'AOP') {
    return SUBLIMATION_PRINTING;
  }
  return DTG_PRINTING;
}

export function getMaterialPreset(key: MaterialPresetKey): MaterialPreset {
  return MATERIAL_PRESETS[key] || MATERIAL_PRESETS.BRAND_NEW;
}
