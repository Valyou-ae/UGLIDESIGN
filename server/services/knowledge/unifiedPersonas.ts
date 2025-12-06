import { UnifiedPersona, AgeGroup, Sex, Ethnicity, Size } from '@shared/mockupTypes';
import { ADULT_PERSONAS } from './adultPersonas';
import { TEEN_PERSONAS } from './teenPersonas';
import { YOUNG_ADULT_PERSONAS } from './youngAdultPersonas';

export const ALL_PERSONAS: UnifiedPersona[] = [
  ...ADULT_PERSONAS,
  ...TEEN_PERSONAS,
  ...YOUNG_ADULT_PERSONAS
];

export function getPersona(id: string): UnifiedPersona | undefined {
  return ALL_PERSONAS.find(persona => persona.id === id);
}

export function getPersonasByAgeGroup(ageGroup: AgeGroup): UnifiedPersona[] {
  const ageRanges: Record<AgeGroup, { min: number; max: number }> = {
    'Baby': { min: 0, max: 1 },
    'Toddler': { min: 1, max: 4 },
    'Kids': { min: 4, max: 12 },
    'Teen': { min: 13, max: 17 },
    'Young Adult': { min: 18, max: 24 },
    'Adult': { min: 25, max: 55 },
    'Senior': { min: 56, max: 120 }
  };

  const range = ageRanges[ageGroup];
  if (!range) return [];

  return ALL_PERSONAS.filter(persona => {
    const age = parseInt(persona.age, 10);
    if (isNaN(age)) {
      const ageStr = persona.age.toLowerCase();
      if (ageGroup === 'Teen' && ageStr.includes('teen')) return true;
      if (ageGroup === 'Young Adult' && ageStr.includes('young adult')) return true;
      if (ageGroup === 'Adult' && ageStr.includes('adult') && !ageStr.includes('young')) return true;
      return false;
    }
    return age >= range.min && age <= range.max;
  });
}

export function getPersonasBySex(sex: Sex): UnifiedPersona[] {
  return ALL_PERSONAS.filter(persona => persona.sex === sex);
}

export function getPersonasByEthnicity(ethnicity: Ethnicity): UnifiedPersona[] {
  return ALL_PERSONAS.filter(persona => persona.ethnicity === ethnicity);
}

export interface PersonaFilters {
  ageGroup?: AgeGroup;
  sex?: Sex;
  ethnicity?: Ethnicity;
  size?: Size | string;
}

export function getRandomPersona(filters?: PersonaFilters): UnifiedPersona {
  let personas = ALL_PERSONAS;

  if (filters) {
    if (filters.ageGroup) {
      personas = personas.filter(p => {
        const age = parseInt(p.age, 10);
        if (isNaN(age)) {
          const ageStr = p.age.toLowerCase();
          if (filters.ageGroup === 'Teen' && ageStr.includes('teen')) return true;
          if (filters.ageGroup === 'Young Adult' && ageStr.includes('young adult')) return true;
          if (filters.ageGroup === 'Adult' && ageStr.includes('adult') && !ageStr.includes('young')) return true;
          return false;
        }
        const ranges: Record<AgeGroup, { min: number; max: number }> = {
          'Baby': { min: 0, max: 1 },
          'Toddler': { min: 1, max: 4 },
          'Kids': { min: 4, max: 12 },
          'Teen': { min: 13, max: 17 },
          'Young Adult': { min: 18, max: 24 },
          'Adult': { min: 25, max: 55 },
          'Senior': { min: 56, max: 120 }
        };
        const range = ranges[filters.ageGroup!];
        return range && age >= range.min && age <= range.max;
      });
    }

    if (filters.sex) {
      personas = personas.filter(p => p.sex === filters.sex);
    }

    if (filters.ethnicity && filters.ethnicity !== 'Diverse') {
      personas = personas.filter(p => p.ethnicity === filters.ethnicity);
    }

    if (filters.size) {
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      const requestedSizeIndex = sizeOrder.indexOf(filters.size as string);
      
      let sizeFilteredPersonas = personas.filter(p => p.size === filters.size);
      
      if (sizeFilteredPersonas.length === 0 && requestedSizeIndex >= 0) {
        for (let offset = 1; offset <= sizeOrder.length; offset++) {
          if (requestedSizeIndex - offset >= 0) {
            const smallerSize = sizeOrder[requestedSizeIndex - offset];
            sizeFilteredPersonas = personas.filter(p => p.size === smallerSize);
            if (sizeFilteredPersonas.length > 0) break;
          }
          if (requestedSizeIndex + offset < sizeOrder.length) {
            const largerSize = sizeOrder[requestedSizeIndex + offset];
            sizeFilteredPersonas = personas.filter(p => p.size === largerSize);
            if (sizeFilteredPersonas.length > 0) break;
          }
        }
      }
      
      if (sizeFilteredPersonas.length > 0) {
        personas = sizeFilteredPersonas;
      }
    }
  }

  if (personas.length === 0) {
    return ALL_PERSONAS[Math.floor(Math.random() * ALL_PERSONAS.length)];
  }

  return personas[Math.floor(Math.random() * personas.length)];
}

export { ADULT_PERSONAS } from './adultPersonas';
export { TEEN_PERSONAS } from './teenPersonas';
export { YOUNG_ADULT_PERSONAS } from './youngAdultPersonas';
