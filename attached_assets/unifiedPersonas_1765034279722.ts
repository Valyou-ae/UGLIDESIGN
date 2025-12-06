/**
 * UNIFIED PERSONA SYSTEM
 * 
 * This file is the central hub for retrieving a complete, unified persona.
 * It combines data from all age-specific knowledge bases.
 * 
 * Version: 2.0
 * Date: December 5, 2024
 */
import { ModelDetails, AgeGroup, Sex, Ethnicity, UnifiedPersona } from '../../types';
import { ADULT_PERSONAS } from './adultPersonas';
import { TEEN_PERSONAS } from './teenPersonas';
import { YOUNG_ADULT_PERSONAS } from './youngAdultPersonas';


/**
 * The unified persona library.
 * Structure: Age → Sex → Ethnicity → Size → Persona[]
 */
const UNIFIED_PERSONAS: Record<
  AgeGroup,
  Partial<Record<Sex, Partial<Record<Ethnicity, Partial<Record<string, UnifiedPersona[]>>>>>>
> = {
  'Young Adult': YOUNG_ADULT_PERSONAS as any, // Cast as any to handle flexible persona structure
  'Adult': ADULT_PERSONAS as any,
  'Teen': TEEN_PERSONAS as any,
  // Placeholders for future phases
  'Senior': {},
  'Kids': {},
  'Toddler': {},
  'Baby': {}
};

/**
 * Gets a unified persona with a robust, multi-step fallback system.
 * This is now asynchronous ONLY because the legacy fallback it calls is async.
 * Once the legacy system is removed, this can be made synchronous again.
 */
export async function getUnifiedPersona(
  modelDetails: ModelDetails,
  seed: number
): Promise<UnifiedPersona> {
  const { age, sex, ethnicity, modelSize } = modelDetails;
  
  const getPersonaFromPool = (pool: UnifiedPersona[] | undefined): UnifiedPersona | null => {
    if (pool && pool.length > 0) {
      return pool[seed % pool.length];
    }
    return null;
  }

  // Helper to safely access nested properties
  const getPool = (ageGrp: AgeGroup, sx: Sex, eth: Ethnicity, size: string) => {
    try {
      // @ts-ignore - The structure is complex and can vary slightly
      return UNIFIED_PERSONAS[ageGrp]?.[sx]?.[eth]?.[size];
    } catch (e) {
      return undefined;
    }
  };

  // 1. Attempt exact match
  let persona = getPersonaFromPool(getPool(age, sex, ethnicity, modelSize));
  if (persona) return persona;

  // 2. Fallback: Relax size to 'M' (most common)
  console.warn(`No exact persona for: ${age} ${sex} ${ethnicity} ${modelSize}. Trying fallback size 'M'.`);
  persona = getPersonaFromPool(getPool(age, sex, ethnicity, 'M'));
  if (persona) return persona;
  
  // 3. Fallback: Relax age to 'Young Adult' (most complete dataset)
  console.warn(`No persona for: ${age} ${sex} ${ethnicity}. Trying fallback age 'Young Adult'.`);
  persona = getPersonaFromPool(getPool('Young Adult', sex, ethnicity, modelSize)) || getPersonaFromPool(getPool('Young Adult', sex, ethnicity, 'M'));
  if (persona) return persona;
  
  // 4. Fallback: Relax ethnicity to 'Diverse'
  console.warn(`No persona for: ${sex} ${ethnicity}. Trying fallback ethnicity 'Diverse'.`);
  persona = getPersonaFromPool(getPool(age, sex, 'Diverse', modelSize)) || getPersonaFromPool(getPool('Young Adult', sex, 'Diverse', 'M'));
  if (persona) return persona;

  // 5. Absolute Last Resort Fallback - Guaranteed to exist
  console.error("CRITICAL FALLBACK: Could not find any suitable persona. Using absolute default.");
  // @ts-ignore
  return UNIFIED_PERSONAS['Young Adult']['Female']['White']['M'][0];
}