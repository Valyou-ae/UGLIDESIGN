import { BodyContour } from '@shared/mockupTypes';

export const BODY_CONTOURS: Record<string, BodyContour> = {
  chest_center: {
    area: 'Center Chest',
    curvature: 'Convex cylinder',
    radius: 15,
    distortionType: 'both',
    distortionAmount: '0-5% (minimal at center point)',
    technicalDescription: 'The center of the chest is the 0-point reference with minimal distortion. Acts as a cylindrical surface with ~15cm radius',
    promptInstructions: `The center of the chest (sternum area) is your ZERO POINT for distortion mapping. 
    This is where the design appears most true to its original form. 
    Elements at this central point have 1.0x scale with no compression. 
    However, even at center, the surface is slightly curved (15cm radius cylinder), not flat. 
    This means vertical lines have subtle curvature following the chest's roundness.`
  },

  chest_sides: {
    area: 'Chest Sides (Wrapping Edges)',
    curvature: 'Extreme cylindrical wrap',
    radius: 15,
    distortionType: 'compression',
    distortionAmount: '35-45% horizontal compression',
    technicalDescription: 'As the design wraps around the cylindrical torso, horizontal compression increases exponentially. At 45-60° angle, compression is severe',
    promptInstructions: `**CRITICAL DISTORTION ZONE**
    The sides of the chest where the garment wraps around the body are the HIGHEST DISTORTION AREAS.
    
    Compression Formula by Angle:
    - At center (0°): 1.0x width (no compression)
    - At 30° from center: 0.87x width (13% compression)
    - At 45° from center: 0.65x width (35% compression) - VISIBLE EDGES
    - At 60° from center: 0.50x width (50% compression) - EXTREME EDGES
    
    **MEASUREMENT TEST**: If you have a circle at the center of the design, by the time it reaches the visible side edges, it MUST be an ellipse that is 35-40% narrower horizontally.
    
    Text distortion: The word "DESIGN" at center might be 100px wide. At the visible edge, it must be 60-65px wide - dramatically compressed.
    
    This is NON-NEGOTIABLE. If edges are 75% or more of center width, the image is FAILED.`
  },

  underarm_sides: {
    area: 'Underarm/Side Seam Area',
    curvature: 'Complex compound curve',
    radius: 12,
    distortionType: 'both',
    distortionAmount: '25-35% compression + vertical stretch',
    technicalDescription: 'The underarm area has both horizontal compression and vertical stretch due to arm position and body curve',
    promptInstructions: `The underarm and side seam areas have COMPOUND DISTORTION:
    1. Horizontal compression (similar to chest sides): 25-35% narrower
    2. Vertical stretch: 10-15% due to arm raising the fabric
    3. Complex fold interactions: Deep shadow valleys where arm meets torso
    
    Design elements in this area must show both compression and stretch simultaneously.
    The fabric is being pulled vertically while wrapping horizontally.`
  },

  shoulders: {
    area: 'Shoulder Caps',
    curvature: 'Spherical projection',
    radius: 8,
    distortionType: 'both',
    distortionAmount: '15-25% multi-directional distortion',
    technicalDescription: 'Shoulders are spherical, not cylindrical. Distortion occurs in all directions radiating from the shoulder point',
    promptInstructions: `Shoulders are SPHERICAL surfaces, not cylindrical like the torso.
If the design extends onto the shoulders:
- Radial distortion: Elements distort outward from shoulder apex
- All-directional stretch: Both horizontal and vertical, increasing toward edges
- Seam transitions: Design breaks at the shoulder seam line

The shoulder is curved in 3D space more aggressively than the chest.`
  }
};

export const CYLINDRICAL_MAPPING = {
  concept: 'The torso is approximated as a cylinder with the sternum as front center',
  
  mathematicalModel: {
    description: 'Compression follows cosine of angle from center',
    formula: 'visible_width = actual_width × cos(angle_from_center)',
    example: 'At 45°: visible_width = 1.0 × cos(45°) = 0.707 (29.3% compression)'
  },
  
  practicalApplication: {
    centerPoint: 'Sternum (chest center) = 0° = 1.0x width',
    visibleEdge: 'Side seam visible in three-quarter view = 45-60° = 0.5-0.65x width',
    hiddenEdge: 'Back center = 180° = not visible in front views',
    
    exampleMeasurement: {
      centerElementWidth: '100 pixels',
      at30Degrees: '87 pixels (13% compression)',
      at45Degrees: '65 pixels (35% compression) - this should be visible',
      at60Degrees: '50 pixels (50% compression) - at extreme edge'
    }
  },
  
  promptInstruction: `The torso is a CYLINDER with approximately 15cm radius (30cm diameter, ~12" chest width).
  You must map the flat design onto this cylindrical surface.
  
  MENTAL MODEL: Imagine wrapping a rectangular sticker around a soda can. 
  The center of the sticker (facing you) looks normal width.
  The edges of the sticker (wrapping around the sides) appear much narrower due to the angle.
  This is the EXACT effect needed on the t-shirt.`
};

export const FOLD_DISTORTION = {
  valley_folds: {
    type: 'Valley (Compression Fold)',
    location: 'Underarm area, waist gathering, side seams under tension',
    visualEffect: 'Design compresses 20-30% in the fold valley',
    technicalDescription: 'Where fabric pinches inward creating a valley, the design elements compress together',
    promptInstruction: `Valley folds COMPRESS the design:
    - In a valley fold, two points on the design are physically closer together
    - This creates visible compression: text gets narrower, circles become ellipses
    - The compression is 20-30% at the fold bottom
    - The fold creates a shadow in the valley
    - Design lines must visually "pinch" together at the fold`
  },
  
  peak_folds: {
    type: 'Peak (Stretch Fold)',
    location: 'Over rounded areas like chest, biceps, protruding shoulders',
    visualEffect: 'Design stretches 10-15% over the peak',
    technicalDescription: 'Where fabric stretches over a rounded protrusion, design elements spread apart',
    promptInstruction: `Peak folds STRETCH the design:
    - As fabric goes over a rounded surface, it must stretch
    - Design elements spread apart: text gets wider, gaps increase
    - The stretch is 10-15% at the peak apex
    - The peak catches light (highlight)
    - Design lines must visually "spread" over the peak`
  },
  
  fold_interaction: {
    description: 'How folds affect the flat design layer',
    rule: 'The design is not painted on - it is part of the fabric surface. When fabric folds, the design folds WITH it.',
    
    designBehavior: [
      'Text baselines follow fold curves - they are not straight',
      'Circular elements become oval in folds',
      'Straight lines break and angle at fold points',
      'Parallel lines converge in compression zones',
      'Grid patterns show visible distortion at each fold'
    ],
    
    promptInstruction: `The design is BONDED to the fabric surface. It is not floating above - it IS the fabric.
    Therefore: Every fold in the fabric causes a corresponding distortion in the design.
    
    If there is a fold running vertically through the letter "O", the "O" must show the fold:
    - The left side of the "O" and right side will not align perfectly
    - The fold line will create a visible discontinuity
    - The circular shape will appear "bent" at the fold
    
    This is NON-NEGOTIABLE. Flat, undistorted designs on folded fabric = INSTANT FAILURE.`
  }
};

export const VERTICAL_PERSPECTIVE = {
  concept: 'Camera is at chest level, creating vertical foreshortening',
  
  effect: {
    top_of_design: 'Closer to camera, appears 8-12% larger',
    center_of_design: 'At camera level, true scale (1.0x)',
    bottom_of_design: 'Further from camera, appears 8-12% smaller'
  },
  
  measurement: {
    design_height: '40cm total',
    top_section: '10cm section at top appears ~11cm (10% larger)',
    middle_section: '20cm section at middle appears 20cm (true)',
    bottom_section: '10cm section at bottom appears ~9cm (10% smaller)'
  },
  
  promptInstruction: `The camera is positioned at CHEST LEVEL (not above looking down, not below looking up).
  This creates natural perspective foreshortening:
  
  The TOP of the design area (upper chest, near neckline) is slightly CLOSER to the camera.
  Therefore it appears slightly LARGER (8-12% scale increase).
  
  The BOTTOM of the design area (lower chest, near waist) is slightly FURTHER from the camera.
  Therefore it appears slightly SMALLER (8-12% scale decrease).
  
  This is subtle but important: A 10-inch tall design should show approximately:
  - Top 2 inches: appear as 2.2 inches
  - Middle 6 inches: appear as 6.0 inches (true)
  - Bottom 2 inches: appear as 1.8 inches
  
  This creates a natural perspective taper that makes the image feel photorealistic.`
};

export function getContourDistortionPrompt(): string {
  return `
## CONTOUR DISTORTION REQUIREMENTS

### CYLINDRICAL BODY MAPPING
${CYLINDRICAL_MAPPING.promptInstruction}

### BODY CONTOUR ZONES

**CENTER CHEST (Zero Point):**
${BODY_CONTOURS.chest_center.promptInstructions}

**CHEST SIDES (Critical Distortion Zone):**
${BODY_CONTOURS.chest_sides.promptInstructions}

**UNDERARM/SIDE SEAM:**
${BODY_CONTOURS.underarm_sides.promptInstructions}

**SHOULDERS:**
${BODY_CONTOURS.shoulders.promptInstructions}

### FOLD DISTORTION

**Valley Folds (Compression):**
${FOLD_DISTORTION.valley_folds.promptInstruction}

**Peak Folds (Stretch):**
${FOLD_DISTORTION.peak_folds.promptInstruction}

**Fold Interaction with Design:**
${FOLD_DISTORTION.fold_interaction.promptInstruction}

### VERTICAL PERSPECTIVE
${VERTICAL_PERSPECTIVE.promptInstruction}

### VERIFICATION REQUIREMENTS
1. Side edges of design MUST be 35-40% narrower than center (cylindrical compression)
2. Design MUST distort at every fabric fold (valley = compress, peak = stretch)
3. Top of design appears 8-12% larger than bottom (vertical perspective)
4. Lighting and distortion MUST match (highlights on peaks = stretch, shadows in valleys = compress)
`;
}
