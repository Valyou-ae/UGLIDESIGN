export interface PhotorealismCheckItem {
  id: string;
  requirement: string;
  description: string;
  promptAddition: string;
}

export const PHOTOREALISM_CHECKLIST: PhotorealismCheckItem[] = [
  {
    id: 'skin-texture',
    requirement: 'Realistic Skin Texture',
    description: 'Skin should show natural pores, subtle texture variations, and minor imperfections that make it look real rather than airbrushed.',
    promptAddition: 'realistic skin with visible pores and natural texture, subtle skin imperfections, authentic human skin surface'
  },
  {
    id: 'eye-detail',
    requirement: 'Natural Eye Detail',
    description: 'Eyes need catchlights (reflections), detailed iris patterns, natural moisture sheen, and properly sized pupils.',
    promptAddition: 'detailed eyes with catchlights and iris detail, natural eye moisture, realistic pupil size, lifelike gaze'
  },
  {
    id: 'hair-detail',
    requirement: 'Realistic Hair Rendering',
    description: 'Hair should show individual strand definition, realistic roots and scalp visibility, natural movement and flow.',
    promptAddition: 'individual hair strands visible, realistic hair roots, natural hair movement and flow, authentic hair texture'
  },
  {
    id: 'fabric-interaction',
    requirement: 'Natural Fabric Draping',
    description: 'Clothing must drape and fold naturally, responding to body contours, gravity, and movement realistically.',
    promptAddition: 'fabric drapes naturally over body contours, realistic clothing folds and wrinkles, garment responds to body shape and gravity'
  },
  {
    id: 'natural-pose',
    requirement: 'Authentic Stance and Pose',
    description: 'Body posture should show comfortable, natural weight distribution with subtle asymmetry.',
    promptAddition: 'natural relaxed pose with weight shifted slightly, authentic comfortable stance, subtle body asymmetry, not rigid or posed'
  },
  {
    id: 'lighting-response',
    requirement: 'Consistent Lighting Response',
    description: 'Light direction must be consistent across skin and fabric, with appropriate shadows and highlights.',
    promptAddition: 'consistent lighting direction on skin and fabric, natural shadows and highlights, realistic light interaction with materials'
  }
];

export interface AIFailure {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  avoidancePrompt: string;
}

export const COMMON_AI_FAILURES: AIFailure[] = [
  {
    id: 'waxy-skin',
    name: 'Waxy Skin',
    description: 'Skin appears smooth and waxy like a candle or mannequin, lacking natural texture.',
    symptoms: [
      'Overly smooth skin surface',
      'Unnatural sheen or glossiness',
      'No visible pores or texture',
      'Plastic-like appearance'
    ],
    avoidancePrompt: 'avoid waxy skin, avoid overly smooth skin, include natural skin texture and pores'
  },
  {
    id: 'plastic-look',
    name: 'Plastic Look',
    description: 'Overall appearance is too perfect and artificial, like a plastic figurine.',
    symptoms: [
      'Too perfect symmetry',
      'Unrealistic color saturation',
      'Missing natural imperfections',
      'Artificial material appearance'
    ],
    avoidancePrompt: 'avoid plastic appearance, avoid artificial look, include natural human imperfections and asymmetry'
  },
  {
    id: 'uncanny-valley-eyes',
    name: 'Uncanny Valley Eyes',
    description: 'Eyes that look dead, unfocused, or disturbing despite appearing technically correct.',
    symptoms: [
      'Eyes looking in different directions',
      'Missing or incorrect catchlights',
      'Dead or lifeless gaze',
      'Unnatural pupil sizes',
      'Missing eye moisture'
    ],
    avoidancePrompt: 'avoid dead eyes, ensure eyes focus together, include catchlights and natural eye moisture, lifelike gaze'
  },
  {
    id: 'floating-fabric',
    name: 'Floating Fabric',
    description: 'Clothing that doesn\'t properly interact with the body, appearing to hover or float.',
    symptoms: [
      'Fabric not following body contours',
      'Missing gravity effects',
      'Clothes appear stiff or cardboard-like',
      'No wrinkles where body bends'
    ],
    avoidancePrompt: 'fabric follows body contours naturally, clothing responds to gravity, realistic draping and folding'
  },
  {
    id: 'mannequin-pose',
    name: 'Mannequin Pose',
    description: 'Rigid, unnatural posing that looks like a department store mannequin.',
    symptoms: [
      'Perfectly symmetrical stance',
      'Stiff straight arms',
      'Unnatural head position',
      'No weight shift visible',
      'Frozen or statue-like appearance'
    ],
    avoidancePrompt: 'natural relaxed pose, subtle weight shift, comfortable authentic stance, avoid rigid posing'
  },
  {
    id: 'wrong-hand-anatomy',
    name: 'Incorrect Hand Anatomy',
    description: 'Hands with wrong number of fingers, incorrect proportions, or impossible positions.',
    symptoms: [
      'Extra or missing fingers',
      'Fingers of incorrect length',
      'Impossible finger bends',
      'Merged or fused fingers',
      'Wrong thumb position'
    ],
    avoidancePrompt: 'correct hand anatomy with exactly five fingers, proper finger proportions, natural hand positions'
  },
  {
    id: 'inconsistent-lighting',
    name: 'Inconsistent Lighting',
    description: 'Light appearing to come from multiple conflicting directions.',
    symptoms: [
      'Shadows pointing different directions',
      'Highlights inconsistent with light source',
      'Face lit from different angle than body',
      'Multiple light source artifacts'
    ],
    avoidancePrompt: 'single consistent light source direction, matching shadows and highlights, coherent lighting throughout'
  }
];

export function getPhotorealismPromptAdditions(): string {
  return PHOTOREALISM_CHECKLIST.map(item => item.promptAddition).join(', ');
}

export function getAIFailureAvoidancePrompt(): string {
  return COMMON_AI_FAILURES.map(failure => failure.avoidancePrompt).join(', ');
}

export function getFullHumanRealismPrompt(): string {
  const photorealism = getPhotorealismPromptAdditions();
  const avoidance = getAIFailureAvoidancePrompt();
  return `${photorealism}. ${avoidance}`;
}

export function getPhotorealismChecklistById(id: string): PhotorealismCheckItem | undefined {
  return PHOTOREALISM_CHECKLIST.find(item => item.id === id);
}

export function getAIFailureById(id: string): AIFailure | undefined {
  return COMMON_AI_FAILURES.find(failure => failure.id === id);
}
