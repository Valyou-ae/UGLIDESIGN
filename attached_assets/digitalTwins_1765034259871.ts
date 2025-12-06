
import { ModelDetails } from '../../types';

interface DigitalTwin {
    name: string;
    description: string;
    features: string;
}

const DIGITAL_TWINS: Record<string, Record<string, Record<string, DigitalTwin[]>>> = {
    'Young Adult': {
        'Female': {
            'White': [
                {
                    name: "Chloe",
                    description: "A young adult White female model with a fresh, approachable look.",
                    features: "She has shoulder-length sandy blonde hair styled with soft waves, bright blue eyes, and faint freckles across the bridge of her nose. Her facial structure is defined with high cheekbones and a warm, inviting smile."
                },
                {
                    name: "Isabelle",
                    description: "A sophisticated young adult White female model with an elegant presence.",
                    features: "She has long, straight chestnut brown hair, emerald green eyes, and a subtle beauty mark just above her left eyebrow. She has a classic, timeless look with a calm and confident expression."
                }
            ],
            'Black': [
                {
                    name: "Amara",
                    description: "A vibrant young adult Black female model with a confident and stylish look.",
                    features: "She has voluminous, natural afro curls in a deep auburn color, and expressive, almond-shaped dark brown eyes. Her skin is a rich, deep brown, and she has a strong, defined jawline."
                },
                {
                    name: "Zoe",
                    description: "A modern young adult Black female model with a chic and friendly appearance.",
                    features: "She has her jet black hair styled in stylishly braided cornrows, deep brown eyes, and a warm, radiant smile. Her skin tone is a beautiful medium brown, and she has high cheekbones."
                }
            ],
            'Hispanic': [
                {
                    name: "Sofia",
                    description: "A young adult Hispanic female model with a warm and energetic presence.",
                    features: "She has long, thick, wavy dark brown hair with subtle caramel highlights, and warm, honey-brown eyes. Her skin is a glowing tan, and she has a naturally friendly and expressive face."
                },
                {
                    name: "Elena",
                    description: "A classic young adult Hispanic female model with a poised and graceful look.",
                    features: "She has sleek, straight jet-black hair, deep brown, soulful eyes, and a beautifully defined cupid's bow. Her skin is a smooth olive tone."
                }
            ],
            'Asian': [
                {
                    name: "Mei",
                    description: "A contemporary young adult Asian female model with a chic, minimalist style.",
                    features: "She has her jet black hair cut in a short, sharp bob, with expressive, dark brown almond-shaped eyes. Her features are delicate and she has a serene, composed expression."
                },
                {
                    name: "Hana",
                    description: "A friendly and approachable young adult Asian female model.",
                    features: "She has long, straight, dark brown hair, often worn in a sleek high ponytail. Her eyes are a warm, dark brown, and she has a bright, engaging smile."
                }
            ],
            'Indian': [
                {
                    name: "Priya",
                    description: "An elegant young adult Indian female model with a striking and traditional look.",
                    features: "She has long, thick, wavy jet-black hair, and large, expressive dark brown eyes. Her features are classic and she carries herself with a graceful confidence."
                },
                 {
                    name: "Anjali",
                    description: "A modern and vibrant young adult Indian female model.",
                    features: "She has voluminous, softly layered dark brown hair, warm amber eyes, and a radiant smile. Her look is contemporary and full of life."
                }
            ],
            'Southeast Asian': [
                {
                    name: "Linh",
                    description: "A young adult Southeast Asian female model with a natural and gentle beauty.",
                    features: "She has long, straight jet-black hair, deep brown eyes, and a kind, soft smile. Her features are delicate and her presence is calm and welcoming."
                }
            ],
            'Indigenous': [
                {
                    name: "Kaya",
                    description: "A strong and striking young adult Indigenous female model.",
                    features: "She has very long, straight, thick jet-black hair, often worn down or in a simple braid. She has deep brown eyes and prominent, high cheekbones that define her strong facial structure."
                }
            ],
            'Diverse': [
                {
                    name: "Nia",
                    description: "A unique young adult female model with blended features representing a diverse heritage.",
                    features: "She has voluminous, curly hair in a caramel blonde color, and striking hazel-green eyes. Her skin is a light caramel tone, and her face is dotted with a few light freckles. Her features are a beautiful mix that doesn't fit a single ethnic category."
                }
            ]
        },
        'Male': {
             // Male digital twins are not yet defined, the system will fallback gracefully.
        }
    },
     'Adult': {
        // Adult digital twins are not yet defined, the system will fallback.
    },
    'Senior': {
        // Senior digital twins are not yet defined, the system will fallback.
    }
};

/**
 * Gets a Digital Twin persona with a robust, multi-step fallback system.
 * This ensures the most relevant model is chosen even if an exact match isn't available,
 * prioritizing the user's selected sex and ethnicity to prevent incorrect defaults.
 * @param modelDetails The user's selections for the model.
 * @param seed A random seed for consistent selection from a pool.
 * @returns The most appropriate DigitalTwin persona.
 */
export function getDigitalTwin(modelDetails: ModelDetails, seed: number): DigitalTwin {
    const { age, sex, ethnicity } = modelDetails;

    // 1. Attempt exact match (Golden Path)
    let twinPool = DIGITAL_TWINS[age]?.[sex]?.[ethnicity];
    if (twinPool && twinPool.length > 0) {
        const index = seed % twinPool.length;
        return twinPool[index];
    }

    // 2. Fallback 1: Relax Age -> Keep Sex and Ethnicity, but use 'Young Adult'
    // This is useful for 'Adult' or 'Senior' selections where we have no specific twins yet.
    twinPool = DIGITAL_TWINS['Young Adult']?.[sex]?.[ethnicity];
    if (twinPool && twinPool.length > 0) {
        const index = seed % twinPool.length;
        return twinPool[index];
    }
    
    // 3. Fallback 2: Relax Ethnicity -> Keep Age and Sex, but use 'Diverse'
    // Useful if a specific ethnicity has no twins for a given age/sex combo.
    twinPool = DIGITAL_TWINS[age]?.[sex]?.['Diverse'];
    if (twinPool && twinPool.length > 0) {
        const index = seed % twinPool.length;
        return twinPool[index];
    }

    // 4. Fallback 3: Relax Age AND Ethnicity -> Keep only Sex, use 'Young Adult' and 'Diverse'
    // This is the main fallback for a sex that has some twins defined (like Female).
    twinPool = DIGITAL_TWINS['Young Adult']?.[sex]?.['Diverse'];
    if (twinPool && twinPool.length > 0) {
        const index = seed % twinPool.length;
        return twinPool[index];
    }

    // 5. Final Fallback: Absolute Default
    // This is the last resort if even the requested sex has no twins at all (e.g., Male pool is empty).
    return DIGITAL_TWINS['Young Adult']['Female']['Diverse'][0];
}
