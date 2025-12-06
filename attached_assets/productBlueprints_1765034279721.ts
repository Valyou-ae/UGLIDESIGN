import { Product } from '../../types';

export function getGarmentBlueprint(product: Product): string {
    const name = product.name.toLowerCase();
    const isAop = product.productType.includes('aop') || product.productType.includes('sublimation');
    
    // Handle non-wearable items first to ensure they get a product-focused blueprint
    if (product.productType === 'hard-good-mug') {
        return `
**4. ITEM BLUEPRINT (IMMUTABLE CONSTRUCTION):**
*   **Item Type:** 11oz Ceramic Mug.
*   **Shape:** Classic cylindrical mug shape.
*   **Handle:** Standard C-shaped handle.
*   **Material:** Glossy ceramic.
*   **Print Application:** The design is sublimated onto the mug's surface, wrapping around it. It is not a sticker.
        `;
    }
     if (name.includes('tote bag')) {
         return `
**4. ITEM BLUEPRINT (IMMUTABLE CONSTRUCTION):**
*   **Item Type:** AOP Tote Bag.
*   **Shape:** Rectangular, simple construction.
*   **Material:** Spun polyester canvas with a sturdy texture.
*   **Handles:** Two long cotton web handles, stitched securely to the bag's body.
*   **Interior:** Open top, no zipper, single unlined compartment.`;
    }
    if (name.includes('pillow')) {
        return `
**4. ITEM BLUEPRINT (IMMUTABLE CONSTRUCTION):**
*   **Item Type:** Square decorative pillow.
*   **Shape:** Square shape with knife-edge seams.
*   **Material:** 100% polyester cover with a soft, slightly textured feel.
*   **Closure:** Hidden zipper closure on one side.
*   **Insert:** Includes a soft polyester pillow insert, giving it a full, plump look.`;
    }
    if (name.includes('towel')) {
        return `
**4. ITEM BLUEPRINT (IMMUTABLE CONSTRUCTION):**
*   **Item Type:** Beach Towel.
*   **Shape:** Large rectangle.
*   **Material:** Polyester-cotton blend. The top (print side) is soft, absorbent polyester fleece; the back is white absorbent cotton terry cloth.
*   **Edges:** Hemmed edges for durability.`;
    }
    if (name.includes('blanket')) {
        return `
**4. ITEM BLUEPRINT (IMMUTABLE CONSTRUCTION):**
*   **Item Type:** Fleece Blanket.
*   **Shape:** Large rectangle.
*   **Material:** 100% polyester fleece with a soft, fuzzy pile texture.
*   **Edges:** Hemmed edges.
*   **Appearance:** Soft, plush, and cozy.`;
    }


    // Handle wearable apparel items
    let blueprint = `
**4. GARMENT BLUEPRINT (IMMUTABLE CONSTRUCTION):**
    `;

    if (name.includes('t-shirt') || name.includes('tee')) {
        blueprint += `
*   **Fit:** Regular Fit (not slim, not oversized).
*   **Hem:** Straight Hem with no side slits.
*   **Collar Type:** Ribbed Crewneck (a simple, rounded collar with no points, no buttons, no placket).
*   **Sleeve Type:** Set-in Short Sleeves.`;
    } else if (name.includes('hoodie')) {
        blueprint += `
*   **Fit:** Regular Fit.
*   **Hem:** Ribbed waistband.
*   **Collar Type:** Hood with drawstrings, attached to a crewneck base.
*   **Sleeve Type:** Set-in Long Sleeves with ribbed cuffs.
*   **Extra Features:** Kangaroo pocket on the front.`;
    } else if (name.includes('sweatshirt')) {
         blueprint += `
*   **Fit:** Regular Fit.
*   **Hem:** Ribbed waistband.
*   **Collar Type:** Ribbed Crewneck.
*   **Sleeve Type:** Set-in Long Sleeves with ribbed cuffs.`;
    } else if (name.includes('leggings')) {
        blueprint += `
*   **Garment Type:** Women's full-length leggings.
*   **Fabric:** The fabric is a stretchy, athletic 82% Polyester/18% Spandex blend, NOT a sweater knit.
*   **Fit:** Form-fitting, high-waisted.
*   **Waistband:** Wide, comfortable elastic waistband (approximately 3-4 inches).
*   **Legs:** Full-length, tapering to the ankle.
*   **Seams:** Flatlock seams for comfort and durability, visible along the inseam and crotch.`;
    } else if (name.includes('swimsuit')) {
        blueprint += `
*   **Garment Type:** Women's one-piece swimsuit.
*   **Fit:** Form-fitting, classic silhouette.
*   **Neckline:** Scoop neck front, moderate scoop back.
*   **Straps:** Standard, non-adjustable shoulder straps.
*   **Leg Cut:** Moderate leg cut.
*   **Lining:** Fully lined for opacity.`;
    } else {
        // Default for unknown apparel
         blueprint += `
*   **Fit:** Regular Fit (not slim, not oversized).
*   **Hem:** Straight Hem with no side slits.
*   **Collar Type:** Ribbed Crewneck.
*   **Sleeve Type:** Set-in Short Sleeves.`;
    }
    
    if (isAop) {
        if (product.subcategory === 'Leggings') {
            blueprint += `
*   **AOP Construction:** The main body of the leggings are constructed from the seamless pattern [IMAGE 1]. The wide waistband MUST be a solid color. To choose this color, analyze the pattern [IMAGE 1] and select the most prominent non-background accent color.
    **CRITICAL CONSISTENCY RULE:** This chosen solid color for the waistband MUST be the EXACT SAME color across ALL generated images in this batch.`
        } else if (['T-Shirts', 'Tops', 'Hoodies', 'Sweatshirts'].includes(product.subcategory)) {
            blueprint += `
*   **AOP Construction:** The ribbed crewneck collar and sleeve cuffs (if applicable) MUST be a solid color. To choose this color, analyze the pattern [IMAGE 1] and select the most prominent non-background accent color.
    **CRITICAL CONSISTENCY RULE:** This chosen solid color for the collar and cuffs MUST be the EXACT SAME color across ALL generated images in this batch.`
        }
        // For other AOP products like swimsuits, blankets, etc., no special trim rule is needed.
    }
    
    return blueprint;
}