
import { BrandStyleKey } from '../../types';
import { ShoppingBag, Camera, Sun, Building, PenTool } from 'lucide-react';
import React from 'react';

type BrandStyle = {
    id: BrandStyleKey;
    name: string;
    description: string;
    
    // UI Properties
    icon: React.ElementType;
    colorClass: string;
    moodKeywords: string[];
    
    // Prompting Properties
    photographyStyle: string;
    colorPalette: string;
    lighting: string;
    preferredEnvironment: string;
    atmosphere: string;
    technicalNotes: string;
    compositionStyle: string;
    cameraWork: string;
    postProcessing: string;
    idealFor: string[];
    platformNotes: string;
};

export const BRAND_STYLES: Record<BrandStyleKey, BrandStyle> = {
  ECOMMERCE_CLEAN: {
    id: 'ECOMMERCE_CLEAN',
    name: "E-Commerce Clean",
    description: "Professional product photography for online stores - bright, neutral, Amazon-ready",
    icon: ShoppingBag,
    colorClass: "text-blue-500",
    moodKeywords: ["professional", "clean", "trustworthy", "approachable", "commercial", "neutral", "clear", "product-focused"],
    photographyStyle: "professional e-commerce product photography, clean and bright, crisp detail, commercial quality, catalog-ready imagery, professional studio lighting, advertising-quality presentation",
    colorPalette: "neutral accurate color palette, pure whites, subtle grays, natural skin tones, true-to-life color representation, no color grading or filters, authentic product colors",
    lighting: "bright even studio lighting with soft shadows, professional three-point lighting setup, no harsh contrasts, fill light eliminates dark areas, clean professional illumination, product is evenly lit from multiple angles",
    preferredEnvironment: "professional photography studio with seamless white or light gray backdrop, minimal props, clean modern setting, neutral background that doesn't compete with product, studio environment",
    atmosphere: "crisp clear air, perfect visibility, sharp detail throughout, pristine conditions, bright and airy, professional commercial space, no atmospheric effects",
    technicalNotes: "5500K daylight white balance for neutral tones, f/5.6-f/8 for sharpness throughout entire product, minimal depth of field blur, accurate color rendering with no saturation boost, slightly overexposed by 1/3 stop for bright clean look",
    compositionStyle: "centered composition, subject fills frame appropriately, generous negative space around product, clean uncluttered layout, rule of thirds for lifestyle elements, professional framing",
    cameraWork: "static tripod-mounted shots, eye-level or slightly above, no dramatic angles, straightforward product presentation, consistent framing across angles",
    postProcessing: "minimal editing, accurate colors, slight contrast boost for clarity, no filters or special effects, clean whites (RGB 250-255), professional color correction only",
    idealFor: ["Amazon listings", "Etsy product pages", "Shopify stores", "eBay photos", "Print-on-demand marketplaces", "Product catalogs"],
    platformNotes: "Meets Amazon image requirements (pure white background for main image), suitable for all e-commerce platforms, passes automated background checks, professional retail quality"
  },
  EDITORIAL_FASHION: {
    id: 'EDITORIAL_FASHION',
    name: "Editorial Fashion",
    description: "High-end magazine-quality photography with dramatic lighting and bold composition",
    icon: Camera,
    colorClass: "text-purple-500",
    moodKeywords: ["dramatic", "bold", "artistic", "sophisticated", "high-fashion", "editorial", "confident", "striking", "cinematic"],
    photographyStyle: "editorial fashion photography, Vogue magazine aesthetic, high contrast dramatic composition, artistic interpretation, bold creative choices, fashion-forward presentation, gallery-quality imagery, avant-garde styling",
    colorPalette: "rich saturated colors with deep blacks and bright highlights, moody color grading, dramatic color contrasts, desaturated shadows with saturated highlights, cinematic color palette, bold color choices",
    lighting: "dramatic directional lighting with strong shadows, chiaroscuro effect creating depth, harsh key light with minimal fill, rim lighting for subject separation, hard light creating defined shadow edges, cinematic lighting ratios (8:1 or higher)",
    preferredEnvironment: "urban architecture with strong geometric elements, dramatic modern interiors, minimalist spaces with bold shapes, fashion-forward locations, industrial settings, contemporary art galleries, high-contrast backgrounds",
    atmosphere: "bold and confident mood, sharp contrast between light and shadow, cinematic atmosphere, dramatic tension, sophisticated urban energy, artistic interpretation, editorial magazine quality",
    technicalNotes: "3200K-4500K for moody warmth in some shots, 7000K+ for cool editorial look in others, f/1.4-f/2.8 for shallow depth of field with background blur, high contrast with crushed blacks (RGB 0-15) and bright highlights, slight film grain for texture (2-3% at 100 ISO equivalent)",
    compositionStyle: "rule of thirds with subject off-center, dramatic negative space, strong leading lines, geometric framing, unconventional angles, artistic cropping, fashion magazine layouts",
    cameraWork: "dynamic camera angles, low angle for power, high angle for vulnerability, dutch angles for tension, movement and energy, handheld feel for authenticity, bold perspective choices",
    postProcessing: "significant color grading with lifted shadows and crushed blacks, increased contrast (30-40% boost), selective desaturation, possible color tinting (teal/orange, blue/yellow), film grain addition, vignette for focus, artistic interpretation",
    idealFor: ["Fashion magazines", "Brand lookbooks", "Instagram influencers", "High-end brand marketing", "Artistic portfolios", "Premium product launches"],
    platformNotes: "Perfect for Instagram, Pinterest, fashion blogs, not suitable for Amazon/eBay (too artistic, doesn't show product clearly enough for pure e-commerce)"
  },
  VINTAGE_RETRO: {
    id: 'VINTAGE_RETRO',
    name: "Vintage Retro",
    description: "Nostalgic 70s-inspired photography with warm film grain and analog aesthetics",
    icon: Sun,
    colorClass: "text-orange-500",
    moodKeywords: ["nostalgic", "warm", "intimate", "vintage", "analog", "retro", "cozy", "authentic", "sentimental"],
    photographyStyle: "vintage film photography aesthetic, 1970s inspired imagery, slight film grain texture, warm analog feel, soft focus edges creating dreamy quality, nostalgic photographic style, retro film camera look, imperfect organic aesthetic",
    colorPalette: "warm earthy color tones, faded pastel hues, sepia undertones throughout, slightly desaturated colors for vintage feel, warm color cast (yellow-orange bias), vintage color film palette, sun-faded appearance",
    lighting: "soft diffused natural light, gentle golden hour glow, warm highlights with amber tones, muted soft shadows, nostalgic warmth in all lighting, window light with warm filtration, hazy soft light quality",
    preferredEnvironment: "retro interiors with vintage furniture, 1970s decor elements, wood paneling and earth tones, vintage wallpaper patterns, cozy nostalgic spaces, analog era settings, warm domestic environments, retro cafes and shops",
    atmosphere: "warm nostalgic glow permeating scene, soft dreamy quality with slight haze, gentle intimate feel, personal and authentic, analog warmth, comfortable lived-in spaces, memories and nostalgia",
    technicalNotes: "2800K-3200K warm white balance for golden cast, add subtle film grain (4-6% visible texture), slightly reduced contrast (-15% for softer look), soft vignette at edges (15-20% darkening), slight color shift toward yellow/amber, possible light leaks or lens flare for authentic film look",
    compositionStyle: "natural candid framing, slightly imperfect composition (not overly perfect), centered subjects common in retro photography, casual snapshot aesthetic, family photo album feel, organic not overly stylized",
    cameraWork: "handheld feel with slight imperfection, focal lengths typical of 70s cameras (35mm, 50mm), slight motion blur acceptable for authenticity, not overly sharp (medium sharpness), capturing candid moments",
    postProcessing: "significant warm color grading, add film grain texture layer, reduce clarity for soft vintage look, fade blacks to dark gray (no true black, RGB 20-30 minimum), reduce saturation by 20-30%, possible cross-processing effect, vintage photo filter",
    idealFor: ["Vintage brands", "Retro product lines", "Nostalgia marketing", "Indie brands", "Handmade/artisan products", "Lifestyle blogs", "Retro fashion"],
    platformNotes: "Works well on Instagram with vintage aesthetic, Etsy for handmade/vintage items, less suitable for corporate/professional platforms, appeals to nostalgic demographics"
  },
  STREET_URBAN: {
    id: 'STREET_URBAN',
    name: "Street Style Urban",
    description: "Authentic documentary-style street photography with gritty urban energy",
    icon: Building,
    colorClass: "text-green-500",
    moodKeywords: ["authentic", "urban", "real", "energetic", "street", "candid", "documentary", "genuine", "raw", "cultural"],
    photographyStyle: "documentary street photography aesthetic, authentic candid moments, photojournalistic approach capturing real life, genuine urban environment, unposed natural moments, street photography tradition, authentic city life documentation",
    colorPalette: "natural urban color palette, concrete grays and asphalt tones, brick reds and rust colors, graffiti colors (spray paint vibrance), authentic city palette, slightly desaturated for realism, real-world color accuracy, environmental colors",
    lighting: "natural available light only, realistic outdoor lighting conditions, authentic shadows from buildings and structures, unmodified harsh sunlight or overcast diffusion, real-world lighting (no studio lights), golden hour for warmth or midday for harsh realism",
    preferredEnvironment: "urban streets with authentic city details, graffiti walls and street art, city architecture and alleyways, public spaces and sidewalks, real neighborhood settings, urban texture (concrete, brick, metal), street furniture and signage, genuine city environments",
    atmosphere: "authentic street energy and life, slightly gritty urban feel, real-world imperfections visible, genuine urban atmosphere, city hustle and culture, raw unfiltered reality, urban authenticity",
    technicalNotes: "5000K-6000K for neutral to cool daylight (urban concrete reflects cool light), f/2.8-f/4 to keep environmental context visible, natural grain from higher ISO (400-800), realistic contrast matching urban lighting conditions, accurate color with no heavy grading",
    compositionStyle: "candid street photography framing, subject in environment (not isolated), environmental context visible, layers of depth with foreground/background elements, geometric lines from architecture, urban geometry, decisive moment capture",
    cameraWork: "handheld dynamic shooting, slightly imperfect framing for authenticity, capturing movement and energy, street photographer eye-level perspective, observational not posed, quick reactive framing",
    postProcessing: "minimal editing to maintain authenticity, slight contrast boost for urban pop, grain consistent with ISO 400-800 film, possible slight cool or warm tint based on time of day, maintain real-world color accuracy, no heavy filters or effects, documentary approach",
    idealFor: ["Streetwear brands", "Urban fashion", "Youth culture products", "Hip-hop/music merchandise", "Skateboard brands", "Street art collaborations", "Contemporary lifestyle brands"],
    platformNotes: "Excellent for Instagram, TikTok, youth-oriented platforms, street culture websites, appeals to urban/street fashion audiences, less formal than e-commerce standard"
  },
  MINIMALIST_MODERN: {
    id: 'MINIMALIST_MODERN',
    name: "Minimalist Modern",
    description: "Clean contemporary aesthetic with generous negative space and refined simplicity",
    icon: PenTool,
    colorClass: "text-gray-500",
    moodKeywords: ["minimal", "modern", "clean", "sophisticated", "refined", "elegant", "contemporary", "serene", "calm"],
    photographyStyle: "minimalist modern photography, clean simple composition with intentional space, refined elegant aesthetic, contemporary art gallery quality, sophisticated simplicity, architectural photography influence, Scandinavian design aesthetic",
    colorPalette: "muted sophisticated color palette, soft grays and warm whites, subtle earth tones, monochromatic elegance, desaturated refined colors, neutral palette with subtle warmth, contemporary color theory, restrained color choices",
    lighting: "soft even natural light creating gentle mood, refined highlights without harshness, subtle gradient lighting, architectural quality illumination, diffused window light, gentle shadow transitions, Nordic light quality, luminous but not bright",
    preferredEnvironment: "minimalist interiors with clean lines, modern architecture and simple geometric spaces, generous negative space and breathing room, refined contemporary settings, white walls and simple backgrounds, Scandinavian-inspired spaces, museum-quality environments",
    atmosphere: "serene calm pervading the scene, generous space creating breathing room, refined simplicity and elegance, sophisticated quiet mood, contemplative peaceful energy, modern zen aesthetic, thoughtful composition",
    technicalNotes: "5000K-5500K neutral clean white balance, f/4-f/5.6 for balanced sharpness and subtle depth, subtle contrast (not harsh), muted saturation (-20 to -30% for refined look), clean highlights (no blown whites), soft shadows (no deep blacks)",
    compositionStyle: "generous negative space (40-60% of frame can be empty), subject placed with intention and balance, geometric alignment and precision, asymmetrical balance, breathing room around subject, minimal elements in frame, every element serves purpose",
    cameraWork: "precise static composition, eye-level or slight bird's eye view, straight-on architectural perspective, no dramatic angles (calm not dramatic), careful framing and alignment, tripod-mounted precision",
    postProcessing: "subtle desaturation for refined palette, lifted shadows (no deep blacks, minimum RGB 30-40), slightly muted highlights, possible slight cool tint for modern feel, clarity reduction for softness, minimal contrast for calm feel, refined color grading",
    idealFor: ["Minimalist brands", "Scandinavian aesthetic products", "Contemporary design", "Wellness/meditation products", "Premium lifestyle brands", "Architecture firms", "Modern home goods"],
    platformNotes: "Perfect for Pinterest, Instagram minimal aesthetic accounts, design blogs, contemporary brand websites, appeals to design-conscious audiences, works for both e-commerce and editorial"
  }
};
