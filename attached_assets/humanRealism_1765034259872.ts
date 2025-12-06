/**
 * HUMAN REALISM KNOWLEDGE BASE
 * 
 * Guidelines for generating photorealistic human models
 * Covers proportions, skin tones, expressions, and natural poses
 */

import { AgeGroup, Sex, Ethnicity } from '../../types';

export interface BodyProportions {
  proportionNotes: string;
}

export const BODY_PROPORTIONS: Record<AgeGroup, BodyProportions> = {
  'Baby': {
    proportionNotes: 'Babies have large heads (1/4 of total height), short limbs, rounded features, soft body with baby fat'
  },
  'Toddler': {
    proportionNotes: 'Toddlers transitioning from baby proportions, still rounded features, developing motor control, slightly longer limbs'
  },
  'Kids': {
    proportionNotes: 'Children have more adult-like proportions, less baby fat, active and energetic appearance, natural childhood physique'
  },
  'Teen': {
    proportionNotes: 'Teens in growth phase, can appear gangly, developing adult features, athletic or slim build, growing into proportions'
  },
  'Young Adult': {
    proportionNotes: 'Peak physical form, athletic or toned appearance, clear muscle definition, confident posture, energetic presence'
  },
  'Adult': {
    proportionNotes: 'Mature adult proportions, can range from slim to fuller figures, natural body types, realistic for age'
  },
  'Senior': {
    proportionNotes: 'Mature proportions, possible slight posture changes, natural aging appearance, dignity and wisdom in features'
  }
};

export interface SkinToneGuide {
  promptDescription: string;
}

export const SKIN_TONES: Record<Ethnicity, SkinToneGuide> = {
  'White': {
    promptDescription: 'Fair to light skin tone with natural undertones, realistic skin texture with subtle variations, pores and natural imperfections visible up close, natural healthy appearance'
  },
  'Black': {
    promptDescription: 'Beautiful deep skin tone with rich undertones and natural sheen, proper lighting shows depth and dimension, skin has healthy glow, natural texture visible, avoid flat rendering'
  },
  'Hispanic': {
    promptDescription: 'Medium to tan skin tone with warm undertones, healthy natural glow, skin shows warmth in lighting, natural texture and realistic appearance'
  },
  'Asian': {
    promptDescription: 'Light to medium Asian skin tone with natural undertones, smooth but realistic texture, natural healthy appearance, subtle variations and dimensionality'
  },
  'Indian': {
    promptDescription: 'Indian skin tone with warm golden undertones, healthy natural appearance, skin shows depth and warmth, realistic texture with natural variations'
  },
  'Southeast Asian': {
    promptDescription: 'Southeast Asian skin tone with warm golden-brown undertones, healthy tropical glow, natural realistic texture, warm appearance in lighting'
  },
  'Indigenous': {
    promptDescription: 'Indigenous skin tone with natural warm undertones, healthy appearance, realistic skin texture, warm tones enhanced in natural light'
  },
  'Diverse': {
    promptDescription: 'Mixed heritage skin tone with unique undertones, natural healthy appearance, realistic texture, beautiful blended features that don\'t conform to single ethnic stereotypes'
  }
};

export const FACIAL_EXPRESSIONS = {
  natural_smile: {
    promptAddition: 'Natural genuine smile with eyes showing happiness (crow\'s feet at corners), teeth visible but not exaggerated, warm friendly demeanor, authentic not forced happiness'
  },
};

export const POSTURE_GUIDE = {
  natural_standing: {
    promptAddition: 'Natural relaxed standing pose with weight shifted to one leg creating subtle hip tilt, shoulders are relaxed and level, arms hanging naturally with slight bends (not straight), body shows natural asymmetry not perfect symmetry, comfortable not stiff appearance'
  },
};

export const AVOID_AI_ARTIFACTS = {
  hands_and_fingers: {
    instruction: 'CRITICAL: Hands must have exactly 5 fingers per hand with correct proportions. Fingers bend at knuckles naturally. Thumb opposes the other four fingers. If you cannot render hands correctly, position them in pockets or out of primary frame.'
  },
  
  eyes_and_pupils: {
    instruction: 'Both eyes must be aligned and symmetrical. Pupils are the same size and look in the same direction. Iris color is natural for the ethnicity. Catch lights (reflections) in eyes add life.'
  },
};