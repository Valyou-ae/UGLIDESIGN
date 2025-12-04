export interface CinematicComponent {
  name: string;
  qualityBoost: string;
  keywords: string[];
  basicTemplate: string;
  enhancedTemplate: string;
  professionalTemplate: string;
}

export interface LightingSetup {
  name: string;
  keywords: string[];
  characteristics: string[];
  bestUse: string[];
}

export interface ColorGrade {
  name: string;
  keywords: string[];
  characteristics: string[];
}

export interface CameraSystem {
  name: string;
  keywords: string[];
  characteristics: string[];
  specs?: string;
}

export interface ArtisticStyle {
  id: string;
  name: string;
  keywords: string[];
  characteristics: string[];
  colorPalette: string[];
  techniques: string[];
  bestUse: string[];
  promptTemplate: string;
}

export const CINEMATIC_DNA_COMPONENTS: Record<string, CinematicComponent> = {
  atmospheric: {
    name: "Volumetric Atmospheric Effects",
    qualityBoost: "15-20%",
    keywords: ["volumetric fog", "god rays", "atmospheric haze", "light shafts", "crepuscular rays", "atmospheric perspective"],
    basicTemplate: "volumetric atmosphere, atmospheric depth",
    enhancedTemplate: "volumetric fog with god rays piercing through, atmospheric haze creating depth separation, soft light shafts",
    professionalTemplate: "masterful volumetric atmospheric lighting: soft volumetric fog with dramatic god rays cutting through mist, exponential distance haze creating natural depth, crepuscular rays with dust particles catching light, atmospheric perspective with color desaturation in far planes, professional Hollywood-grade depth separation"
  },
  lighting: {
    name: "Professional Lighting Systems",
    qualityBoost: "20-25%",
    keywords: ["three-point lighting", "Rembrandt lighting", "cinematic lighting", "key light", "fill light", "rim light"],
    basicTemplate: "three-point lighting, professional illumination",
    enhancedTemplate: "cinematic three-point lighting with Rembrandt setup, dramatic shadows with soft falloff, edge-defining rim light",
    professionalTemplate: "masterful Hollywood lighting: three-point setup with 4:1 contrast ratio, Rembrandt key light creating characteristic triangle shadow, soft fill preserving shadow detail, dramatic rim lighting with warm edge separation, precise shadow control with gradient falloff, naturalistic light wrapping around forms"
  },
  depth: {
    name: "Depth Layering System",
    qualityBoost: "10-15%",
    keywords: ["foreground", "midground", "background", "depth layers", "layered composition", "depth separation"],
    basicTemplate: "foreground midground background, depth layers",
    enhancedTemplate: "detailed foreground framing elements, sharp midground subject, soft atmospheric background, cinematic depth layering",
    professionalTemplate: "masterful depth composition: sharp textured foreground framing elements creating visual interest, crystal-clear midground subject with selective focus emphasis, soft atmospheric background with natural bokeh and depth haze, professional layer separation using both DOF and atmospheric depth techniques, natural progression of detail from front to back"
  },
  colorGrading: {
    name: "Professional Color Grading",
    qualityBoost: "15-20%",
    keywords: ["teal and orange", "color grade", "film stock", "Kodak Vision3", "cinematic color", "color science"],
    basicTemplate: "cinematic color grading, professional colors",
    enhancedTemplate: "teal and orange complementary color grade, cinematic film look with lifted blacks, professional color correction",
    professionalTemplate: "masterful Hollywood color grade: teal shadows with orange highlights complementary color scheme, Kodak Vision3 500T film stock emulation with characteristic warmth, sophisticated color science with warm skin tones and cool shadows, crushed blacks with detail retention, wide dynamic range with smooth highlight rolloff, cohesive color palette throughout"
  },
  materials: {
    name: "Material & Surface Rendering",
    qualityBoost: "10-15%",
    keywords: ["subsurface scattering", "SSS", "PBR", "realistic reflections", "physically based rendering"],
    basicTemplate: "realistic materials, proper reflections",
    enhancedTemplate: "subsurface scattering on skin showing translucency, PBR materials with accurate specularity, realistic surface properties",
    professionalTemplate: "masterful material rendering: subsurface scattering with natural skin translucency and vein visibility, PBR with accurate metallic roughness and fresnel reflections, realistic refractive transparency on glass and water, photorealistic surface properties with micro-detail textures, natural light interaction on every surface"
  },
  composition: {
    name: "Cinematic Composition Rules",
    qualityBoost: "10-15%",
    keywords: ["rule of thirds", "golden ratio", "leading lines", "natural framing", "composition"],
    basicTemplate: "rule of thirds, balanced composition",
    enhancedTemplate: "rule of thirds composition with leading lines guiding the eye, golden ratio placement, professional framing",
    professionalTemplate: "masterful cinematic composition: rule of thirds with golden spiral placement creating visual flow, leading lines naturally guiding viewer attention to subject, natural framing elements creating depth and context, foreground-midground-background layer separation, deliberate negative space for visual breathing room, perfect visual balance with dynamic asymmetry"
  },
  camera: {
    name: "Cinema Camera Systems",
    qualityBoost: "15-20%",
    keywords: ["ARRI Alexa", "Zeiss lens", "cinema camera", "cinematic depth of field", "film-like rendering"],
    basicTemplate: "cinema camera, professional lens",
    enhancedTemplate: "shot on ARRI Alexa with Zeiss Supreme Prime, shallow depth of field, cinematic camera, professional cinematography",
    professionalTemplate: "masterful cinema capture: ARRI Alexa LF with Zeiss Supreme Prime 50mm at T1.5, full frame sensor with 14+ stops dynamic range, cinematic shallow depth of field with creamy bokeh, film-like organic rendering with natural skin tones, wide color gamut with smooth gradients, professional motion picture aesthetic"
  }
};

export const LIGHTING_SETUPS: Record<string, LightingSetup> = {
  threePoint: {
    name: "Three-Point Lighting",
    keywords: ["three-point lighting", "key light", "fill light", "rim light", "studio lighting"],
    characteristics: ["key main light", "fill shadow reducer", "back/rim separation"],
    bestUse: ["portraits", "product photography", "interviews", "studio shots"]
  },
  rembrandt: {
    name: "Rembrandt Lighting",
    keywords: ["Rembrandt lighting", "triangle light", "45-degree lighting", "dramatic portrait lighting"],
    characteristics: ["45° angle light", "triangle of light on shadow side", "dramatic shadows", "artistic quality"],
    bestUse: ["portrait photography", "character shots", "dramatic mood", "classical aesthetic"]
  },
  butterfly: {
    name: "Butterfly Lighting",
    keywords: ["butterfly lighting", "paramount lighting", "beauty lighting", "top-down light"],
    characteristics: ["light above and in front", "butterfly shadow under nose", "symmetrical shadows", "glamorous look"],
    bestUse: ["beauty photography", "fashion", "glamour shots", "commercial"]
  },
  split: {
    name: "Split Lighting",
    keywords: ["split lighting", "side lighting", "dramatic split", "half-lit face"],
    characteristics: ["90° angle light", "half face illuminated", "extreme drama", "strong shadows"],
    bestUse: ["dramatic portraits", "artistic shots", "masculine subjects", "moody photography"]
  },
  practical: {
    name: "Practical Lighting",
    keywords: ["practical lights", "in-scene lighting", "motivated lighting", "diegetic light"],
    characteristics: ["visible light sources", "natural motivation", "atmospheric"],
    bestUse: ["realistic scenes", "environmental lighting", "atmospheric shots", "narrative lighting"]
  },
  naturalGoldenHour: {
    name: "Golden Hour",
    keywords: ["golden hour", "magic hour", "warm sunset light", "low angle sun"],
    characteristics: ["warm tones", "long shadows", "soft quality", "romantic mood"],
    bestUse: ["landscapes", "portraits", "romantic scenes", "outdoor photography"]
  },
  naturalBlueHour: {
    name: "Blue Hour",
    keywords: ["blue hour", "twilight", "cool ambient light", "dusk lighting"],
    characteristics: ["cool tones", "soft shadows", "balanced", "magical atmosphere"],
    bestUse: ["cityscapes", "atmospheric shots", "moody scenes", "evening photography"]
  }
};

export const COLOR_GRADES: Record<string, ColorGrade> = {
  tealOrange: {
    name: "Teal and Orange",
    keywords: ["teal and orange", "complementary color grade", "blockbuster colors", "Hollywood grade"],
    characteristics: ["warm skin tones", "cool shadows", "high contrast", "commercial look"]
  },
  bleachBypass: {
    name: "Bleach Bypass",
    keywords: ["bleach bypass", "desaturated", "high contrast", "gritty look"],
    characteristics: ["low saturation", "high contrast", "gritty feel", "tactical aesthetic"]
  },
  kodakVision3: {
    name: "Kodak Vision3 500T",
    keywords: ["Kodak 500T", "tungsten film", "cinematic film grain", "Kodak Vision3"],
    characteristics: ["warm tungsten balance", "fine grain", "rich colors", "professional standard"]
  },
  kodak250D: {
    name: "Kodak Vision3 250D",
    keywords: ["Kodak 250D", "daylight film", "natural colors"],
    characteristics: ["daylight balanced", "natural colors", "fine grain", "outdoor standard"]
  },
  fujiEterna: {
    name: "Fujifilm Eterna Vivid",
    keywords: ["Fuji Eterna", "vivid colors", "Japanese film stock"],
    characteristics: ["saturated colors", "rich blues", "warm skin tones", "vibrant"]
  },
  warmVintage: {
    name: "Warm Vintage",
    keywords: ["warm vintage", "faded blacks", "nostalgic"],
    characteristics: ["warm tones", "faded blacks", "soft contrast", "nostalgic feel"]
  },
  coldModern: {
    name: "Cold Modern",
    keywords: ["cold modern", "cool tones", "clean blacks"],
    characteristics: ["cool tones", "clean blacks", "high contrast", "contemporary"]
  }
};

export const CAMERA_SYSTEMS: Record<string, CameraSystem> = {
  arriAlexa: {
    name: "ARRI Alexa",
    keywords: ["ARRI Alexa", "Alexa LF", "Alexa Mini", "cinema camera"],
    characteristics: ["natural colors", "wide dynamic range", "film-like grain", "professional standard"],
    specs: "4.5K, 14+ stops dynamic range, Super 35 or LF sensor"
  },
  redKomodo: {
    name: "RED Komodo",
    keywords: ["RED Komodo", "RED camera", "6K cinema"],
    characteristics: ["sharp detail", "RED color science", "compact form", "high resolution"],
    specs: "6K, Super 35 sensor, 16+ stops dynamic range"
  },
  sonyVenice: {
    name: "Sony Venice",
    keywords: ["Sony Venice", "Venice camera", "full frame cinema"],
    characteristics: ["full frame sensor", "dual base ISO", "natural skin tones", "flexible workflow"],
    specs: "6K full frame, 15+ stops dynamic range"
  },
  blackmagicUrsa: {
    name: "Blackmagic URSA",
    keywords: ["Blackmagic URSA", "BMPCC", "affordable cinema"],
    characteristics: ["accessible pricing", "RAW recording", "film-like image", "indie favorite"],
    specs: "4.6K to 12K, Super 35 to large format"
  }
};

export const CINEMA_LENSES: Record<string, CameraSystem> = {
  zeissSupreme: {
    name: "Zeiss Supreme Prime",
    keywords: ["Zeiss Supreme", "cinema prime", "professional lens"],
    characteristics: ["clinical sharpness", "minimal distortion", "beautiful bokeh", "professional coating"]
  },
  cookeS4: {
    name: "Cooke S4/i",
    keywords: ["Cooke S4", "Cooke look", "organic rendering"],
    characteristics: ["soft organic look", "beautiful skin tones", "controlled flares", "classic cinema"]
  },
  canonCNE: {
    name: "Canon CN-E",
    keywords: ["Canon CN-E", "cinema zoom", "versatile lens"],
    characteristics: ["versatile zoom range", "consistent T-stop", "reliable quality", "practical choice"]
  },
  vintageGlass: {
    name: "Vintage Lens Character",
    keywords: ["vintage lens", "vintage glass", "character lens", "analog bokeh"],
    characteristics: ["optical character", "unique flares", "imperfect rendering", "artistic quality"]
  }
};

export const ARTISTIC_STYLES: Record<string, ArtisticStyle> = {
  ancientEgyptian: {
    id: "ancient_egyptian",
    name: "Ancient Egyptian Art",
    keywords: ["Ancient Egyptian art", "hieroglyphic style", "Egyptian wall painting", "profile view"],
    characteristics: ["composite view", "hierarchical scale", "register-based composition", "flat 2D representation"],
    colorPalette: ["lapis blue", "golden yellow", "red ochre", "black", "white", "green"],
    techniques: ["profile/frontal composite", "horizontal register layout", "symbolic sizing"],
    bestUse: ["historical illustrations", "symbolic imagery", "decorative panels"],
    promptTemplate: "Ancient Egyptian wall painting style, profile view with frontal eye, hierarchical composition, lapis blue and golden ochre palette"
  },
  ancientGreek: {
    id: "ancient_greek",
    name: "Ancient Greek Art",
    keywords: ["Ancient Greek art", "classical Greek style", "Greek vase painting", "red-figure pottery"],
    characteristics: ["idealized human forms", "mathematical proportions", "dynamic poses", "mythological subjects"],
    colorPalette: ["terra cotta red", "black glaze", "white slip", "natural stone colors"],
    techniques: ["contrapposto", "foreshortening", "circular composition"],
    bestUse: ["classical scenes", "athletic figures", "mythological imagery"],
    promptTemplate: "Ancient Greek red-figure vase painting, athletic figures in dynamic poses, classical proportions, terra cotta and black palette"
  },
  byzantine: {
    id: "byzantine",
    name: "Byzantine Art",
    keywords: ["Byzantine art", "Byzantine mosaic", "gold background", "iconic style", "Orthodox icon"],
    characteristics: ["flat 2D figures", "gold backgrounds", "frontal hieratic poses", "large expressive eyes"],
    colorPalette: ["gold", "rich blues", "deep reds", "purples", "jewel tones"],
    techniques: ["gold leaf backgrounds", "mosaic tesserae", "reverse perspective"],
    bestUse: ["religious imagery", "spiritual art", "sacred portraits"],
    promptTemplate: "Byzantine mosaic icon, gold leaf background, frontal hieratic figure, large expressive eyes, rich blue and purple robes"
  },
  renaissance: {
    id: "high_renaissance",
    name: "High Renaissance",
    keywords: ["High Renaissance", "Renaissance masterpiece", "classical Renaissance", "sfumato technique"],
    characteristics: ["perfect balance and harmony", "idealized human forms", "mastered perspective", "pyramidal composition"],
    colorPalette: ["rich deep colors", "warm earth tones", "vibrant reds and blues", "subtle gradations"],
    techniques: ["sfumato", "chiaroscuro", "pyramidal composition", "perfect perspective"],
    bestUse: ["classical portraits", "religious masterpieces", "idealized figures"],
    promptTemplate: "High Renaissance painting, sfumato technique, perfect proportions, warm earth tones and deep blues, pyramidal composition"
  },
  baroque: {
    id: "baroque",
    name: "Baroque",
    keywords: ["Baroque style", "dramatic Baroque", "theatrical lighting", "Baroque grandeur"],
    characteristics: ["dramatic emotional intensity", "strong tenebrism", "dynamic diagonal compositions", "theatrical grandeur"],
    colorPalette: ["deep reds", "rich golds", "dramatic blacks", "warm amber tones"],
    techniques: ["tenebrism", "diagonal composition", "foreshortening", "rich impasto"],
    bestUse: ["dramatic portraits", "religious art", "theatrical scenes"],
    promptTemplate: "Baroque painting with Caravaggio-style tenebrism, dramatic light from single source, rich colors, diagonal composition"
  },
  impressionism: {
    id: "impressionism",
    name: "Impressionism",
    keywords: ["Impressionist style", "visible brushstrokes", "light and color", "plein air"],
    characteristics: ["visible brushstrokes", "emphasis on light", "everyday subjects", "outdoor scenes"],
    colorPalette: ["bright pure colors", "broken color technique", "luminous palette", "no black"],
    techniques: ["visible brushwork", "broken color", "optical mixing", "plein air painting"],
    bestUse: ["landscapes", "cityscapes", "outdoor scenes", "light studies"],
    promptTemplate: "Impressionist painting style, visible brushstrokes, emphasis on light and atmosphere, broken color technique, plein air aesthetic"
  },
  artNouveau: {
    id: "art_nouveau",
    name: "Art Nouveau",
    keywords: ["Art Nouveau", "organic curves", "decorative style", "Mucha style"],
    characteristics: ["flowing organic curves", "nature-inspired motifs", "decorative elegance", "whiplash lines"],
    colorPalette: ["muted pastels", "gold accents", "soft greens and blues", "earth tones"],
    techniques: ["sinuous lines", "flat color areas", "organic patterns", "decorative borders"],
    bestUse: ["decorative art", "posters", "ornamental design", "elegant portraits"],
    promptTemplate: "Art Nouveau style, flowing organic curves, decorative elegance, Mucha-inspired, nature motifs, gold accents"
  },
  artDeco: {
    id: "art_deco",
    name: "Art Deco",
    keywords: ["Art Deco", "geometric elegance", "1920s style", "streamlined"],
    characteristics: ["geometric shapes", "bold colors", "symmetry", "luxury materials", "streamlined forms"],
    colorPalette: ["gold and black", "chrome silver", "bold primary colors", "rich jewel tones"],
    techniques: ["geometric patterns", "bold outlines", "symmetrical design", "metallic accents"],
    bestUse: ["architectural design", "poster art", "luxury branding", "1920s aesthetic"],
    promptTemplate: "Art Deco style, geometric elegance, bold symmetrical patterns, gold and black palette, streamlined luxury aesthetic"
  },
  surrealism: {
    id: "surrealism",
    name: "Surrealism",
    keywords: ["Surrealist art", "dreamlike", "Dali style", "subconscious imagery"],
    characteristics: ["dreamlike scenes", "impossible juxtapositions", "symbolic imagery", "photorealistic impossible"],
    colorPalette: ["varied", "often muted earth tones", "hyperreal colors", "atmospheric"],
    techniques: ["photorealistic rendering", "impossible combinations", "perspective distortion", "symbolic elements"],
    bestUse: ["fantasy art", "conceptual imagery", "dreamscapes", "psychological themes"],
    promptTemplate: "Surrealist painting, dreamlike scene, impossible juxtapositions, Dali-inspired melting forms, hyperreal rendering"
  },
  popArt: {
    id: "pop_art",
    name: "Pop Art",
    keywords: ["Pop Art", "Warhol style", "bold colors", "commercial aesthetic"],
    characteristics: ["bold flat colors", "commercial imagery", "repetition", "irony and critique"],
    colorPalette: ["bright primary colors", "CMYK colors", "halftone dots", "high contrast"],
    techniques: ["screen printing aesthetic", "halftone dots", "flat color areas", "bold outlines"],
    bestUse: ["portraits", "commercial parody", "bold graphics", "cultural commentary"],
    promptTemplate: "Pop Art style, bold flat colors, Warhol-inspired, halftone dots, commercial aesthetic, high contrast"
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    keywords: ["cyberpunk", "neon noir", "dystopian future", "high tech low life"],
    characteristics: ["neon lighting", "urban dystopia", "high tech elements", "rain and reflections"],
    colorPalette: ["neon pink", "electric blue", "toxic green", "deep blacks", "chrome"],
    techniques: ["high contrast lighting", "neon glow effects", "reflective surfaces", "atmospheric haze"],
    bestUse: ["sci-fi scenes", "urban environments", "character design", "futuristic themes"],
    promptTemplate: "Cyberpunk aesthetic, neon-lit dystopian cityscape, rain-slicked streets, high tech low life, pink and blue neon glow"
  },
  vaporwave: {
    id: "vaporwave",
    name: "Vaporwave",
    keywords: ["vaporwave", "retrowave", "aesthetic", "80s nostalgia", "digital decay"],
    characteristics: ["80s/90s nostalgia", "glitch effects", "classical statues", "digital decay"],
    colorPalette: ["pastel pink", "cyan", "purple gradient", "chrome", "sunset colors"],
    techniques: ["gradient backgrounds", "glitch effects", "retro computer graphics", "palm trees"],
    bestUse: ["digital art", "album covers", "nostalgic themes", "internet culture"],
    promptTemplate: "Vaporwave aesthetic, pastel pink and cyan gradient, Greek statue elements, retro computer graphics, nostalgic 80s feel"
  },
  animeStyle: {
    id: "anime_manga",
    name: "Anime/Manga",
    keywords: ["anime", "manga", "cel shaded", "Japanese animation", "Studio Ghibli"],
    characteristics: ["large expressive eyes", "clean lines", "vibrant colors", "dynamic poses"],
    colorPalette: ["vibrant saturated colors", "cel shading", "gradient skies", "hair highlights"],
    techniques: ["clean line art", "cel shading", "speed lines", "emotion symbols"],
    bestUse: ["character design", "action scenes", "fantasy themes", "emotional storytelling"],
    promptTemplate: "Anime style, cel shaded, large expressive eyes, vibrant colors, clean line art, Studio Ghibli inspired"
  },
  watercolor: {
    id: "watercolor",
    name: "Watercolor",
    keywords: ["watercolor", "soft edges", "paper texture", "flowing pigments"],
    characteristics: ["soft edges", "translucent layers", "visible paper texture", "flowing pigments"],
    colorPalette: ["soft washes", "bleeding colors", "white of paper", "translucent layers"],
    techniques: ["wet-on-wet", "dry brush", "color bleeding", "paper texture"],
    bestUse: ["landscapes", "botanical illustration", "soft portraits", "atmospheric scenes"],
    promptTemplate: "Watercolor painting, soft bleeding edges, visible paper texture, translucent washes, flowing pigments"
  },
  oilPainting: {
    id: "oil_painting",
    name: "Oil Painting",
    keywords: ["oil painting", "visible brushstrokes", "Renaissance", "classical art"],
    characteristics: ["rich textures", "visible brushstrokes", "luminous glazes", "deep colors"],
    colorPalette: ["deep rich colors", "luminous glazes", "earth tones", "sophisticated harmonies"],
    techniques: ["impasto", "glazing", "scumbling", "alla prima"],
    bestUse: ["portraits", "landscapes", "classical subjects", "fine art"],
    promptTemplate: "Oil painting, visible brushstrokes, rich luminous colors, classical technique, museum quality"
  },
  minimalArt: {
    id: "minimalist",
    name: "Minimalist",
    keywords: ["minimalist", "clean lines", "negative space", "simple"],
    characteristics: ["clean lines", "negative space", "simple forms", "limited palette"],
    colorPalette: ["limited colors", "monochromatic", "black and white", "single accent color"],
    techniques: ["reduction to essentials", "geometric forms", "negative space", "clean edges"],
    bestUse: ["modern design", "logos", "conceptual art", "clean aesthetics"],
    promptTemplate: "Minimalist design, clean lines, negative space, simple geometric forms, limited color palette"
  },
  retrowave: {
    id: "retrowave",
    name: "Retrowave/Synthwave",
    keywords: ["synthwave", "neon", "80s aesthetic", "vaporwave", "grid"],
    characteristics: ["neon colors", "grid patterns", "sunset gradients", "retro-futuristic"],
    colorPalette: ["neon pink", "electric purple", "cyan", "sunset orange", "chrome"],
    techniques: ["gradient backgrounds", "neon glow", "wireframe grids", "chrome text"],
    bestUse: ["music artwork", "retro themes", "sci-fi", "gaming aesthetics"],
    promptTemplate: "Synthwave aesthetic, neon sunset gradient, chrome elements, 80s retro-futuristic style, grid lines"
  },
  gothicDark: {
    id: "gothic_dark",
    name: "Gothic/Dark Fantasy",
    keywords: ["Gothic art", "dark fantasy", "medieval dark", "macabre"],
    characteristics: ["dark atmospheric", "ornate details", "dramatic shadows", "mysterious mood"],
    colorPalette: ["deep blacks", "blood red", "pale skin tones", "silver", "moonlight blue"],
    techniques: ["high contrast", "intricate details", "atmospheric fog", "dramatic lighting"],
    bestUse: ["fantasy art", "horror themes", "dark romance", "atmospheric scenes"],
    promptTemplate: "Gothic dark fantasy style, dramatic shadows, ornate details, atmospheric fog, mysterious mood, moonlit scene"
  },
  steampunk: {
    id: "steampunk",
    name: "Steampunk",
    keywords: ["steampunk", "Victorian", "brass gears", "clockwork", "retro-futuristic"],
    characteristics: ["Victorian era meets technology", "brass and copper", "gears and clockwork", "steam-powered"],
    colorPalette: ["brass gold", "copper", "aged brown leather", "deep burgundy", "oxidized green"],
    techniques: ["intricate mechanical details", "aged textures", "Victorian ornate design", "industrial elements"],
    bestUse: ["alternative history", "character design", "mechanical devices", "Victorian fantasy"],
    promptTemplate: "Steampunk aesthetic, brass gears and clockwork, Victorian elegance, aged leather and copper, steam-powered machinery"
  },
  photorealistic: {
    id: "photorealistic",
    name: "Photorealistic",
    keywords: ["photorealistic", "hyperrealistic", "DSLR", "8K", "sharp focus"],
    characteristics: ["extreme detail", "realistic lighting", "accurate textures", "natural colors"],
    colorPalette: ["natural colors", "realistic skin tones", "accurate materials", "true-to-life"],
    techniques: ["high resolution detail", "accurate light physics", "realistic materials", "subtle imperfections"],
    bestUse: ["product photography", "portraits", "architectural visualization", "realistic scenes"],
    promptTemplate: "Photorealistic, DSLR quality, 8K resolution, sharp focus, natural lighting, accurate textures and materials"
  },
  glitchArt: {
    id: "glitch_art",
    name: "Glitch Art",
    keywords: ["glitch art", "digital corruption", "databending", "pixel sorting"],
    characteristics: ["digital errors", "RGB channel shifts", "pixelation", "compression artifacts"],
    colorPalette: ["RGB separation", "neon aberrations", "corrupt color values"],
    techniques: ["databending", "pixel sorting", "channel shifting", "scan line effects"],
    bestUse: ["digital art", "album covers", "experimental visuals", "cyberpunk elements"],
    promptTemplate: "Glitch art aesthetic, digital corruption, RGB channel shift, pixel sorting effects, scan line distortion"
  },
  y2kAesthetic: {
    id: "y2k_aesthetic",
    name: "Y2K / Web 1.0",
    keywords: ["Y2K aesthetic", "millennium style", "early internet", "cyber Y2K"],
    characteristics: ["translucent tech", "metallic surfaces", "futuristic optimism", "iridescent"],
    colorPalette: ["iridescent", "chrome silver", "hot pink", "lime green", "electric blue"],
    techniques: ["chrome effects", "iridescent overlays", "low-res graphics", "web 1.0 elements"],
    bestUse: ["nostalgic tech art", "millennium themes", "early internet aesthetics"],
    promptTemplate: "Y2K aesthetic, translucent iMac style, iridescent colors, chrome accents, early 2000s futurism"
  },
  frutigerAero: {
    id: "frutiger_aero",
    name: "Frutiger Aero",
    keywords: ["Frutiger Aero", "glossy skeuomorphism", "Windows Vista", "aqua bubbles"],
    characteristics: ["glossy interfaces", "water droplets", "nature plus technology", "glass effects"],
    colorPalette: ["aqua blue", "green nature", "white silver", "sky blue"],
    techniques: ["glossy reflections", "translucent overlays", "water effects", "glass morphism"],
    bestUse: ["tech interface nostalgia", "2000s aesthetics", "optimistic futurism"],
    promptTemplate: "Frutiger Aero style, glossy translucent interface, water droplets, aqua blue, Windows Vista aesthetic"
  },
  darkAcademia: {
    id: "dark_academia",
    name: "Dark Academia",
    keywords: ["dark academia", "gothic academic", "moody library", "scholarly gothic"],
    characteristics: ["libraries and books", "vintage academic", "dark moody colors", "classical art"],
    colorPalette: ["dark browns", "burgundy", "forest green", "deep navy", "gold"],
    techniques: ["moody photography", "vintage overlays", "dark atmospheric lighting"],
    bestUse: ["academic imagery", "gothic aesthetics", "book covers", "scholarly themes"],
    promptTemplate: "Dark Academia aesthetic, vintage library, leather-bound books, moody lighting, burgundy and gold"
  },
  cottagecore: {
    id: "cottagecore",
    name: "Cottagecore",
    keywords: ["cottagecore", "rustic countryside", "pastoral", "farmhouse aesthetic"],
    characteristics: ["rural settings", "vintage clothing", "domestic activities", "soft lighting"],
    colorPalette: ["warm earth tones", "soft pastels", "cream beige", "muted greens"],
    techniques: ["soft natural photography", "vintage overlays", "warm color grading"],
    bestUse: ["lifestyle photography", "cozy scenes", "rural imagery", "romantic aesthetics"],
    promptTemplate: "Cottagecore digital aesthetic, rustic kitchen, wildflowers, soft natural light, warm earth tones"
  },
  seapunk: {
    id: "seapunk",
    name: "Seapunk",
    keywords: ["seapunk aesthetic", "aquatic internet", "neon ocean", "cyber aquatic"],
    characteristics: ["aquatic themes", "neon underwater", "dolphins and crystals", "3D water"],
    colorPalette: ["aqua teal", "neon pink", "purple", "iridescent"],
    techniques: ["3D rendered water", "neon effects", "digital collage", "crystal effects"],
    bestUse: ["music visuals", "internet art", "aquatic themes", "pop culture"],
    promptTemplate: "Seapunk aesthetic, neon dolphins, underwater scene, aqua and pink colors, cyber aquatic"
  },
  liminalSpace: {
    id: "liminal_space",
    name: "Liminal Space",
    keywords: ["liminal space", "backrooms", "empty mall", "eerie familiar"],
    characteristics: ["unsettling emptiness", "familiar yet wrong", "fluorescent lighting", "abandoned spaces"],
    colorPalette: ["desaturated", "fluorescent yellow", "institutional colors", "faded tones"],
    techniques: ["low quality photography", "flash aesthetic", "empty composition"],
    bestUse: ["unsettling art", "psychological themes", "surreal unease", "horror"],
    promptTemplate: "Liminal space, empty mall, fluorescent lighting, desaturated colors, eerie familiar atmosphere"
  },
  ukiyoe: {
    id: "ukiyo_e",
    name: "Ukiyo-e (Japanese Woodblock)",
    keywords: ["ukiyo-e", "Japanese woodblock", "Hokusai style", "traditional Japanese"],
    characteristics: ["flat colors", "bold outlines", "nature motifs", "wave patterns"],
    colorPalette: ["indigo blue", "sumi black", "subtle gradients", "muted naturals"],
    techniques: ["woodblock printing style", "flat color areas", "bold outlines", "nature elements"],
    bestUse: ["Japanese themes", "nature art", "traditional style", "waves and mountains"],
    promptTemplate: "Ukiyo-e woodblock print style, Hokusai-inspired, indigo and white, bold outlines, wave patterns"
  },
  artBrut: {
    id: "art_brut",
    name: "Art Brut / Outsider Art",
    keywords: ["art brut", "outsider art", "raw art", "naive style"],
    characteristics: ["unconventional techniques", "raw expression", "self-taught aesthetic", "unpolished"],
    colorPalette: ["intense personal colors", "unorthodox combinations", "direct from tube"],
    techniques: ["intuitive mark-making", "unconventional materials", "raw expression"],
    bestUse: ["expressive art", "psychological themes", "raw emotion", "alternative aesthetics"],
    promptTemplate: "Art Brut style, raw outsider art, unconventional techniques, intense expression, naive aesthetic"
  },
  pointillism: {
    id: "pointillism",
    name: "Pointillism / Divisionism",
    keywords: ["pointillism", "dot painting", "Seurat style", "divisionism"],
    characteristics: ["tiny dots of color", "optical mixing", "systematic technique", "luminous effect"],
    colorPalette: ["pure spectrum colors", "complementary pairs", "optical blending"],
    techniques: ["dot application", "color theory", "optical mixing", "systematic placement"],
    bestUse: ["landscapes", "light studies", "impressionistic subjects", "fine art"],
    promptTemplate: "Pointillism style, tiny dots of pure color, Seurat-inspired, luminous optical mixing effect"
  },
  expressionism: {
    id: "expressionism",
    name: "Expressionism",
    keywords: ["expressionist", "emotional distortion", "bold colors", "psychological"],
    characteristics: ["emotional distortion", "bold colors", "angular forms", "psychological intensity"],
    colorPalette: ["intense colors", "unnatural hues", "emotional associations", "high contrast"],
    techniques: ["distortion for emotion", "bold brushwork", "angular shapes", "intense color"],
    bestUse: ["emotional themes", "portraits", "psychological art", "intense subjects"],
    promptTemplate: "Expressionist style, emotional distortion, bold intense colors, angular forms, psychological intensity"
  },
  cubism: {
    id: "cubism",
    name: "Cubism",
    keywords: ["cubist", "geometric fragmentation", "Picasso style", "multiple viewpoints"],
    characteristics: ["geometric fragmentation", "multiple viewpoints", "abstract forms", "deconstructed"],
    colorPalette: ["muted earth tones", "geometric shapes", "grays and browns", "limited palette"],
    techniques: ["fragmentation", "multiple perspectives", "geometric shapes", "abstraction"],
    bestUse: ["portraits", "still life", "abstract compositions", "modern art"],
    promptTemplate: "Cubist style, geometric fragmentation, multiple viewpoints, Picasso-inspired, deconstructed forms"
  },
  fauvism: {
    id: "fauvism",
    name: "Fauvism",
    keywords: ["fauvist", "wild color", "Matisse style", "bold brushwork"],
    characteristics: ["wild colors", "simplified forms", "bold brushwork", "emotional color"],
    colorPalette: ["wild vivid colors", "pure pigments", "complementary contrasts", "unnatural hues"],
    techniques: ["bold flat color", "simplified drawing", "spontaneous brushwork", "emotional color"],
    bestUse: ["landscapes", "portraits", "expressive subjects", "bold color studies"],
    promptTemplate: "Fauvist style, wild vivid colors, Matisse-inspired, bold brushwork, simplified forms"
  },
  bauhaus: {
    id: "bauhaus",
    name: "Bauhaus",
    keywords: ["Bauhaus design", "geometric", "primary colors", "functional art"],
    characteristics: ["geometric shapes", "primary colors", "functional design", "grid systems"],
    colorPalette: ["red yellow blue", "black", "white", "primary colors only"],
    techniques: ["geometric composition", "grid layouts", "clean typography", "functional design"],
    bestUse: ["graphic design", "posters", "architecture", "modern design"],
    promptTemplate: "Bauhaus design style, geometric shapes, primary colors, clean lines, functional modernist aesthetic"
  },
  constructivism: {
    id: "constructivism",
    name: "Constructivism",
    keywords: ["constructivist", "Russian avant-garde", "geometric abstract", "revolutionary art"],
    characteristics: ["geometric abstraction", "dynamic diagonals", "industrial aesthetic", "political art"],
    colorPalette: ["red", "black", "white", "occasional gold", "limited palette"],
    techniques: ["diagonal composition", "geometric shapes", "photomontage", "bold typography"],
    bestUse: ["political art", "posters", "revolutionary themes", "graphic design"],
    promptTemplate: "Constructivist style, Russian avant-garde, bold diagonals, red and black, revolutionary aesthetic"
  },
  arteConcept: {
    id: "conceptual_art",
    name: "Conceptual Art",
    keywords: ["conceptual art", "idea-based", "minimal visual", "text art"],
    characteristics: ["idea over aesthetics", "minimal visual elements", "text integration", "philosophical"],
    colorPalette: ["minimal", "often monochrome", "neutral", "background focused"],
    techniques: ["text as art", "documentation", "instruction-based", "found objects"],
    bestUse: ["philosophical themes", "text-based art", "installations", "abstract concepts"],
    promptTemplate: "Conceptual art, idea-focused, minimal visual elements, philosophical, text integration"
  },
  nouveau: {
    id: "nouveau_realisme",
    name: "Nouveau Réalisme",
    keywords: ["nouveau réalisme", "assemblage", "found objects", "material art"],
    characteristics: ["real objects", "assemblage technique", "material focus", "urban debris"],
    colorPalette: ["found materials", "rust", "urban colors", "natural decay"],
    techniques: ["assemblage", "compression", "wrapping", "accumulation"],
    bestUse: ["found object art", "urban themes", "material studies", "contemporary art"],
    promptTemplate: "Nouveau Réalisme style, assemblage art, found objects, material focus, urban aesthetic"
  },
  digitalFantasy: {
    id: "digital_fantasy",
    name: "Digital Fantasy Art",
    keywords: ["digital fantasy", "concept art", "epic fantasy", "ArtStation trending"],
    characteristics: ["epic scenes", "detailed rendering", "fantasy elements", "dramatic lighting"],
    colorPalette: ["rich saturated colors", "atmospheric", "dramatic lighting", "magical effects"],
    techniques: ["digital painting", "matte painting", "dramatic composition", "detailed rendering"],
    bestUse: ["fantasy scenes", "game art", "book covers", "epic imagery"],
    promptTemplate: "Digital fantasy art, epic scene, dramatic lighting, ArtStation trending, detailed concept art rendering"
  },
  pixelArt: {
    id: "pixel_art",
    name: "Pixel Art",
    keywords: ["pixel art", "8-bit", "16-bit", "retro gaming"],
    characteristics: ["visible pixels", "limited palette", "nostalgic gaming", "crisp edges"],
    colorPalette: ["limited palette", "8-bit colors", "high contrast", "retro game colors"],
    techniques: ["pixel-by-pixel", "dithering", "limited resolution", "clean edges"],
    bestUse: ["game art", "retro themes", "icons", "nostalgic designs"],
    promptTemplate: "Pixel art style, 16-bit aesthetic, limited color palette, crisp pixel edges, retro gaming look"
  },
  lowPoly: {
    id: "low_poly",
    name: "Low Poly 3D",
    keywords: ["low poly", "geometric 3D", "flat shaded", "modern minimal 3D"],
    characteristics: ["geometric faces", "flat shading", "clean aesthetic", "modern minimal"],
    colorPalette: ["gradient colors", "flat shading", "pastel or vibrant", "clean tones"],
    techniques: ["triangulated meshes", "flat shading", "geometric simplification"],
    bestUse: ["landscapes", "animals", "modern graphics", "stylized 3D"],
    promptTemplate: "Low poly 3D style, geometric triangular faces, flat shading, clean modern aesthetic"
  },
  isometric: {
    id: "isometric",
    name: "Isometric Illustration",
    keywords: ["isometric", "isometric 3D", "technical illustration", "axonometric"],
    characteristics: ["30-degree angles", "no perspective", "clean geometry", "technical precision"],
    colorPalette: ["flat colors", "soft shadows", "clean palette", "organized tones"],
    techniques: ["isometric projection", "clean geometry", "soft shadows", "detailed rendering"],
    bestUse: ["infographics", "architecture", "games", "technical illustration"],
    promptTemplate: "Isometric illustration, 3D render, clean geometry, soft shadows, technical precision, organized layout"
  },
  lineart: {
    id: "line_art",
    name: "Line Art / Ink Drawing",
    keywords: ["line art", "ink drawing", "pen and ink", "fine lines"],
    characteristics: ["clean lines", "no fill", "detailed linework", "elegant strokes"],
    colorPalette: ["black ink", "white background", "occasional single color"],
    techniques: ["hatching", "crosshatching", "varied line weight", "clean strokes"],
    bestUse: ["illustrations", "portraits", "decorative art", "technical drawings"],
    promptTemplate: "Fine line art, pen and ink style, detailed linework, hatching technique, elegant strokes"
  },
  stainedGlass: {
    id: "stained_glass",
    name: "Stained Glass",
    keywords: ["stained glass", "gothic windows", "lead lines", "luminous colors"],
    characteristics: ["bold lead lines", "translucent colors", "geometric sections", "luminous"],
    colorPalette: ["jewel tones", "red blue green gold", "translucent colors"],
    techniques: ["bold black outlines", "flat color sections", "geometric divisions"],
    bestUse: ["religious imagery", "decorative art", "luminous themes", "geometric design"],
    promptTemplate: "Stained glass style, bold lead lines, jewel tones, translucent luminous colors, gothic cathedral window"
  },
  paperCut: {
    id: "paper_cut",
    name: "Paper Cut / Kirigami",
    keywords: ["paper cut art", "layered paper", "kirigami", "shadow box"],
    characteristics: ["layered paper", "silhouettes", "depth layers", "clean cuts"],
    colorPalette: ["solid colors", "layered gradients", "paper textures"],
    techniques: ["paper layering", "shadow depth", "silhouette design", "clean edges"],
    bestUse: ["decorative art", "illustrations", "shadow boxes", "layered designs"],
    promptTemplate: "Paper cut art style, layered paper silhouettes, depth and shadow, clean cut edges, kirigami technique"
  },
  pencilSketch: {
    id: "pencil_sketch",
    name: "Pencil Sketch",
    keywords: ["pencil sketch", "graphite", "crosshatching", "detailed drawing"],
    characteristics: ["graphite tones", "shading techniques", "paper texture", "detailed rendering"],
    colorPalette: ["graphite grays", "paper white", "charcoal black"],
    techniques: ["crosshatching", "shading", "blending", "varied pressure"],
    bestUse: ["portraits", "studies", "realistic drawings", "artistic sketches"],
    promptTemplate: "Pencil sketch, detailed graphite drawing, crosshatching, fine shading, paper texture visible"
  },
  charcoal: {
    id: "charcoal_drawing",
    name: "Charcoal Drawing",
    keywords: ["charcoal", "dramatic contrast", "smudged edges", "expressive"],
    characteristics: ["deep blacks", "soft edges", "dramatic contrast", "expressive strokes"],
    colorPalette: ["rich blacks", "soft grays", "white highlights"],
    techniques: ["smudging", "lifting highlights", "dramatic shading", "expressive marks"],
    bestUse: ["portraits", "figure drawing", "dramatic subjects", "expressive art"],
    promptTemplate: "Charcoal drawing, deep rich blacks, soft smudged edges, dramatic contrast, expressive rendering"
  },
  pastel: {
    id: "pastel_art",
    name: "Pastel Art",
    keywords: ["pastel art", "soft pastels", "chalky texture", "blended colors"],
    characteristics: ["soft chalky texture", "blended colors", "luminous quality", "delicate"],
    colorPalette: ["soft colors", "blended gradients", "luminous tones"],
    techniques: ["blending", "layering", "paper tooth texture", "soft edges"],
    bestUse: ["portraits", "landscapes", "soft subjects", "delicate themes"],
    promptTemplate: "Pastel art, soft chalky texture, blended luminous colors, delicate rendering, paper texture"
  },
  chineseInkWash: {
    id: "chinese_ink_wash",
    name: "Chinese Ink Wash / Sumi-e",
    keywords: ["Chinese ink wash", "sumi-e", "brush painting", "Zen aesthetic"],
    characteristics: ["minimal brushstrokes", "negative space", "ink gradations", "spiritual quality"],
    colorPalette: ["black ink", "gray washes", "white space", "occasional red seal"],
    techniques: ["single brushstrokes", "wet on wet", "ink gradation", "empty space"],
    bestUse: ["nature subjects", "meditation art", "Asian themes", "minimalist"],
    promptTemplate: "Chinese ink wash painting, sumi-e style, minimal brushstrokes, negative space, Zen aesthetic"
  },
  persianMiniature: {
    id: "persian_miniature",
    name: "Persian Miniature",
    keywords: ["Persian miniature", "Islamic art", "illuminated manuscript", "ornate detail"],
    characteristics: ["intricate detail", "flat perspective", "ornate borders", "jewel-like colors"],
    colorPalette: ["gold", "lapis blue", "vermillion", "emerald", "turquoise"],
    techniques: ["fine brushwork", "flat composition", "ornate borders", "gold accents"],
    bestUse: ["narrative scenes", "Islamic themes", "ornate illustrations", "manuscript style"],
    promptTemplate: "Persian miniature painting, intricate detail, gold accents, lapis blue, illuminated manuscript style"
  },
  aboriginal: {
    id: "aboriginal_dot",
    name: "Aboriginal Dot Painting",
    keywords: ["Aboriginal art", "dot painting", "Dreamtime", "indigenous Australian"],
    characteristics: ["dot patterns", "earth tones", "symbolic imagery", "spiritual meaning"],
    colorPalette: ["earth ochres", "red brown", "white dots", "black", "yellow"],
    techniques: ["dot application", "symbolic patterns", "concentric circles", "line work"],
    bestUse: ["indigenous themes", "spiritual art", "pattern design", "cultural imagery"],
    promptTemplate: "Aboriginal dot painting style, earth ochres, concentric dot patterns, Dreamtime symbolism"
  },
  africanTribal: {
    id: "african_tribal",
    name: "African Tribal Art",
    keywords: ["African tribal", "mask art", "geometric patterns", "bold forms"],
    characteristics: ["bold geometric", "mask influences", "symbolic patterns", "earthy tones"],
    colorPalette: ["earth tones", "black", "white", "red ochre", "natural pigments"],
    techniques: ["geometric simplification", "bold outlines", "pattern integration", "carved textures"],
    bestUse: ["masks", "patterns", "cultural art", "bold graphics"],
    promptTemplate: "African tribal art style, bold geometric forms, mask influences, earth tones, symbolic patterns"
  },
  mexicanFolklore: {
    id: "mexican_folk",
    name: "Mexican Folk Art / Día de los Muertos",
    keywords: ["Mexican folk art", "Día de los Muertos", "calavera", "vibrant colors"],
    characteristics: ["sugar skulls", "marigolds", "vibrant colors", "celebratory death imagery"],
    colorPalette: ["hot pink", "orange marigold", "turquoise", "lime green", "purple"],
    techniques: ["bold patterns", "floral motifs", "skull decoration", "bright contrasts"],
    bestUse: ["cultural celebrations", "decorative art", "vibrant designs", "folk themes"],
    promptTemplate: "Mexican folk art, Día de los Muertos style, sugar skull calavera, marigolds, vibrant hot pink and orange"
  },
  nordic: {
    id: "nordic_folk",
    name: "Nordic / Scandinavian Folk",
    keywords: ["Nordic folk art", "Scandinavian design", "rosemaling", "folk patterns"],
    characteristics: ["floral patterns", "symmetrical design", "folk motifs", "nature themes"],
    colorPalette: ["red", "blue", "white", "cream", "forest green"],
    techniques: ["rosemaling curves", "symmetrical patterns", "floral motifs", "clean lines"],
    bestUse: ["decorative art", "folk themes", "Scandinavian design", "pattern work"],
    promptTemplate: "Nordic folk art, Scandinavian rosemaling, symmetrical floral patterns, red blue and white palette"
  },
  indianMiniature: {
    id: "indian_miniature",
    name: "Indian Miniature / Mughal",
    keywords: ["Indian miniature", "Mughal painting", "Rajput style", "ornate detail"],
    characteristics: ["intricate detail", "flat composition", "ornate borders", "narrative scenes"],
    colorPalette: ["gold", "rich reds", "deep blues", "vibrant greens", "white"],
    techniques: ["fine brushwork", "layered detail", "gold highlights", "flat perspective"],
    bestUse: ["royal scenes", "narrative art", "ornate illustrations", "cultural themes"],
    promptTemplate: "Indian Mughal miniature painting, intricate detail, gold highlights, rich jewel tones, ornate borders"
  },
  artHorror: {
    id: "horror_art",
    name: "Horror Art / Macabre",
    keywords: ["horror art", "macabre", "dark grotesque", "unsettling imagery"],
    characteristics: ["disturbing imagery", "dark atmosphere", "grotesque elements", "psychological horror"],
    colorPalette: ["dark blacks", "blood red", "sickly greens", "pale flesh", "moonlight"],
    techniques: ["high contrast", "disturbing details", "atmospheric fog", "dramatic shadows"],
    bestUse: ["horror themes", "dark fantasy", "psychological art", "gothic imagery"],
    promptTemplate: "Horror art, macabre style, dark grotesque imagery, unsettling atmosphere, dramatic shadows"
  },
  solarpunk: {
    id: "solarpunk",
    name: "Solarpunk",
    keywords: ["solarpunk", "eco-futurism", "green technology", "optimistic future"],
    characteristics: ["nature and technology", "solar panels", "green cities", "optimistic"],
    colorPalette: ["verdant greens", "solar gold", "sky blue", "sustainable materials"],
    techniques: ["organic architecture", "plant integration", "futuristic tech", "natural lighting"],
    bestUse: ["eco-friendly futures", "sustainable cities", "hopeful sci-fi", "green technology"],
    promptTemplate: "Solarpunk aesthetic, eco-futuristic city, green technology, solar panels, nature integrated architecture"
  },
  dieselpunk: {
    id: "dieselpunk",
    name: "Dieselpunk",
    keywords: ["dieselpunk", "1940s retro-futurism", "art deco machines", "diesel era"],
    characteristics: ["1930s-40s aesthetic", "diesel powered", "art deco machines", "alternate history"],
    colorPalette: ["diesel black", "chrome", "rust", "military olive", "art deco gold"],
    techniques: ["streamlined design", "art deco influences", "industrial detail", "period styling"],
    bestUse: ["alternate history", "retro-futurism", "industrial scenes", "period sci-fi"],
    promptTemplate: "Dieselpunk aesthetic, 1940s retro-futurism, art deco machinery, streamlined diesel era technology"
  },
  atompunk: {
    id: "atompunk",
    name: "Atompunk / Atomic Age",
    keywords: ["atompunk", "atomic age", "1950s futurism", "Googie architecture"],
    characteristics: ["1950s optimism", "atomic symbols", "Googie style", "space age"],
    colorPalette: ["turquoise", "coral", "chrome", "atomic gold", "pastel"],
    techniques: ["Googie architecture", "boomerang shapes", "starburst motifs", "atomic symbols"],
    bestUse: ["retro-futurism", "1950s themes", "space age", "atomic era"],
    promptTemplate: "Atompunk style, 1950s atomic age futurism, Googie architecture, turquoise and coral, starburst motifs"
  },
  biopunk: {
    id: "biopunk",
    name: "Biopunk",
    keywords: ["biopunk", "organic technology", "bio-engineering", "genetic modification"],
    characteristics: ["organic tech fusion", "biological machines", "genetic themes", "visceral"],
    colorPalette: ["flesh tones", "bio-luminescent", "organic greens", "blood red", "bone white"],
    techniques: ["organic textures", "bio-mechanical detail", "living technology", "visceral rendering"],
    bestUse: ["sci-fi themes", "biological horror", "organic tech", "genetic themes"],
    promptTemplate: "Biopunk aesthetic, organic bio-technology, living machines, bio-luminescent elements, visceral detail"
  },
  nanopunk: {
    id: "nanopunk",
    name: "Nanopunk",
    keywords: ["nanopunk", "nanotechnology", "microscopic tech", "molecular machines"],
    characteristics: ["nanoscale technology", "molecular machines", "invisible tech", "clean futurism"],
    colorPalette: ["clean whites", "chrome silver", "holographic", "subtle glow"],
    techniques: ["microscopic detail", "clean surfaces", "subtle technology", "molecular precision"],
    bestUse: ["high-tech themes", "medical sci-fi", "clean futurism", "nano-scale"],
    promptTemplate: "Nanopunk aesthetic, nanotechnology theme, molecular machines, clean futuristic surfaces, subtle tech integration"
  }
};

export const MOOD_LIGHTING_MAP: Record<string, string[]> = {
  dramatic: ["Rembrandt lighting", "split lighting", "strong shadows", "high contrast"],
  romantic: ["soft golden hour", "warm diffused light", "gentle shadows", "glowing highlights"],
  mysterious: ["low key lighting", "fog and haze", "rim lighting", "deep shadows"],
  energetic: ["bright dynamic lighting", "multiple light sources", "vibrant colors"],
  peaceful: ["soft natural light", "even illumination", "muted tones", "gentle gradients"],
  cinematic: ["three-point lighting", "volumetric rays", "atmospheric depth", "film-like quality"],
  noir: ["high contrast", "venetian blind shadows", "single hard light source", "black and white aesthetic"]
};

export const SUBJECT_LIGHTING_MAP: Record<string, string[]> = {
  portrait: ["Rembrandt lighting", "butterfly lighting", "loop lighting", "soft key with fill"],
  landscape: ["golden hour", "blue hour", "directional sunlight", "overcast diffused"],
  product: ["soft box lighting", "rim lighting", "reflector fill", "clean white background"],
  action: ["dynamic directional light", "motion blur friendly", "high shutter speed lighting"],
  architecture: ["time of day lighting", "long exposure", "balanced interior/exterior"],
  food: ["soft directional", "backlight for steam", "warm tones", "shadow control"]
};

export interface DesignDNAComponent {
  name: string;
  qualityBoost: string;
  keywords: string[];
  basicTemplate: string;
  enhancedTemplate: string;
  professionalTemplate: string;
}

export const DESIGN_DNA_COMPONENTS: Record<string, DesignDNAComponent> = {
  atmosphere: {
    name: "Design Atmosphere",
    qualityBoost: "15-20%",
    keywords: ["atmospheric depth", "visual layers", "depth gradients", "subtle textures"],
    basicTemplate: "atmospheric depth in the design, subtle gradients",
    enhancedTemplate: "rich atmospheric depth through layered gradients, subtle textured backgrounds, visual depth without photography",
    professionalTemplate: "masterful atmospheric design: sophisticated depth through layered gradient overlays, subtle textured backgrounds with grain, visual dimensionality created through design elements not camera effects, professional depth separation in graphic composition"
  },
  conceptualLighting: {
    name: "Conceptual Lighting Effects",
    qualityBoost: "20-25%",
    keywords: ["dramatic spotlight", "ambient glow", "conceptual lighting", "mood lighting"],
    basicTemplate: "dramatic spotlight effect, mood lighting",
    enhancedTemplate: "dramatic conceptual spotlight illuminating key elements, ambient glow creating atmosphere, stylized lighting effects",
    professionalTemplate: "masterful conceptual lighting within the design: dramatic spotlight effects drawing focus to key elements, sophisticated ambient glow creating emotional resonance, stylized lighting that enhances mood without referencing photography, rim glow effects for element separation"
  },
  colorHarmony: {
    name: "Design Color Harmony",
    qualityBoost: "15-20%",
    keywords: ["color palette", "color harmony", "complementary colors", "cohesive palette"],
    basicTemplate: "harmonious color palette, cohesive colors",
    enhancedTemplate: "sophisticated color harmony with complementary tones, deliberate color palette creating mood, professional color relationships",
    professionalTemplate: "masterful design color palette: sophisticated complementary color harmony creating visual tension, cohesive restricted palette enhancing focus, strategic color temperature for emotional impact, professional color relationships that guide the eye"
  },
  visualHierarchy: {
    name: "Visual Hierarchy",
    qualityBoost: "10-15%",
    keywords: ["visual hierarchy", "focal point", "design balance", "typographic hierarchy"],
    basicTemplate: "clear visual hierarchy, balanced layout",
    enhancedTemplate: "deliberate visual hierarchy with clear focal point, typographic balance, strategic element placement",
    professionalTemplate: "masterful visual hierarchy: crystal-clear focal point drawing immediate attention, sophisticated typographic hierarchy with purposeful weight distribution, strategic negative space creating breathing room, perfect balance between text and imagery"
  },
  texture: {
    name: "Design Texture & Finish",
    qualityBoost: "10-15%",
    keywords: ["subtle grain", "design texture", "surface finish", "tactile quality"],
    basicTemplate: "subtle texture, professional finish",
    enhancedTemplate: "subtle grain texture adding visual interest, premium surface finish, tactile quality in digital form",
    professionalTemplate: "masterful design texture: sophisticated subtle grain adding depth and organic feel, premium matte or gloss finish appropriate to mood, micro-textures creating tactile visual quality, refined surface treatment elevating the design"
  },
  composition: {
    name: "Design Composition",
    qualityBoost: "10-15%",
    keywords: ["design composition", "layout balance", "golden ratio", "grid alignment"],
    basicTemplate: "balanced design composition, professional layout",
    enhancedTemplate: "golden ratio composition, deliberate element placement, professional grid-based layout",
    professionalTemplate: "masterful design composition: golden ratio placement creating natural visual flow, grid-aligned elements with deliberate asymmetry, strategic use of rule of thirds for text and imagery, professional balance between white space and content"
  }
};

export function buildDesignDNA(
  quality: 'fast' | 'balanced' | 'professional' = 'balanced',
  includeComponents: string[] = ['atmosphere', 'conceptualLighting', 'colorHarmony', 'visualHierarchy', 'texture', 'composition']
): string {
  const parts: string[] = [];
  
  for (const componentKey of includeComponents) {
    const component = DESIGN_DNA_COMPONENTS[componentKey];
    if (component) {
      switch (quality) {
        case 'fast':
          parts.push(component.basicTemplate);
          break;
        case 'balanced':
          parts.push(component.enhancedTemplate);
          break;
        case 'professional':
          parts.push(component.professionalTemplate);
          break;
      }
    }
  }
  
  return parts.join('. ');
}

export function buildCinematicDNA(
  quality: 'fast' | 'balanced' | 'professional' = 'balanced',
  includeComponents: string[] = ['atmospheric', 'lighting', 'depth', 'colorGrading', 'materials', 'composition', 'camera']
): string {
  const parts: string[] = [];
  
  for (const componentKey of includeComponents) {
    const component = CINEMATIC_DNA_COMPONENTS[componentKey];
    if (component) {
      switch (quality) {
        case 'fast':
          parts.push(component.basicTemplate);
          break;
        case 'balanced':
          parts.push(component.enhancedTemplate);
          break;
        case 'professional':
          parts.push(component.professionalTemplate);
          break;
      }
    }
  }
  
  return parts.join(', ');
}

export function selectLightingForSubject(subject: string, mood?: string): string {
  const subjectLower = subject.toLowerCase();
  let lighting: string[] = [];
  
  if (subjectLower.includes('portrait') || subjectLower.includes('person') || subjectLower.includes('face')) {
    lighting = SUBJECT_LIGHTING_MAP.portrait;
  } else if (subjectLower.includes('landscape') || subjectLower.includes('nature') || subjectLower.includes('mountain')) {
    lighting = SUBJECT_LIGHTING_MAP.landscape;
  } else if (subjectLower.includes('product') || subjectLower.includes('object')) {
    lighting = SUBJECT_LIGHTING_MAP.product;
  } else if (subjectLower.includes('action') || subjectLower.includes('sport') || subjectLower.includes('movement')) {
    lighting = SUBJECT_LIGHTING_MAP.action;
  } else if (subjectLower.includes('building') || subjectLower.includes('architecture') || subjectLower.includes('interior')) {
    lighting = SUBJECT_LIGHTING_MAP.architecture;
  } else if (subjectLower.includes('food') || subjectLower.includes('dish') || subjectLower.includes('meal')) {
    lighting = SUBJECT_LIGHTING_MAP.food;
  } else {
    lighting = ['three-point lighting', 'natural lighting', 'soft illumination'];
  }
  
  if (mood && MOOD_LIGHTING_MAP[mood.toLowerCase()]) {
    lighting = [...lighting, ...MOOD_LIGHTING_MAP[mood.toLowerCase()]];
  }
  
  return lighting.slice(0, 3).join(', ');
}

export function selectColorGradeForMood(mood: string): ColorGrade {
  const moodLower = mood.toLowerCase();
  
  if (moodLower.includes('dramatic') || moodLower.includes('action') || moodLower.includes('intense')) {
    return COLOR_GRADES.tealOrange;
  } else if (moodLower.includes('gritty') || moodLower.includes('war') || moodLower.includes('dark')) {
    return COLOR_GRADES.bleachBypass;
  } else if (moodLower.includes('warm') || moodLower.includes('nostalgic') || moodLower.includes('vintage')) {
    return COLOR_GRADES.warmVintage;
  } else if (moodLower.includes('cold') || moodLower.includes('modern') || moodLower.includes('tech')) {
    return COLOR_GRADES.coldModern;
  } else if (moodLower.includes('natural') || moodLower.includes('outdoor') || moodLower.includes('daylight')) {
    return COLOR_GRADES.kodak250D;
  } else {
    return COLOR_GRADES.kodakVision3;
  }
}

export function selectCameraForSubject(subject: string): { camera: CameraSystem; lens: CameraSystem } {
  const subjectLower = subject.toLowerCase();
  
  if (subjectLower.includes('portrait') || subjectLower.includes('character') || subjectLower.includes('person')) {
    return { camera: CAMERA_SYSTEMS.arriAlexa, lens: CINEMA_LENSES.cookeS4 };
  } else if (subjectLower.includes('action') || subjectLower.includes('fast') || subjectLower.includes('movement')) {
    return { camera: CAMERA_SYSTEMS.redKomodo, lens: CINEMA_LENSES.zeissSupreme };
  } else if (subjectLower.includes('cinematic') || subjectLower.includes('film') || subjectLower.includes('movie')) {
    return { camera: CAMERA_SYSTEMS.arriAlexa, lens: CINEMA_LENSES.zeissSupreme };
  } else if (subjectLower.includes('indie') || subjectLower.includes('artistic') || subjectLower.includes('creative')) {
    return { camera: CAMERA_SYSTEMS.blackmagicUrsa, lens: CINEMA_LENSES.vintageGlass };
  } else {
    return { camera: CAMERA_SYSTEMS.sonyVenice, lens: CINEMA_LENSES.zeissSupreme };
  }
}

export function getStylePromptEnhancement(styleId: string): string {
  const style = ARTISTIC_STYLES[styleId];
  if (!style) return '';
  
  return `${style.promptTemplate}, ${style.techniques.slice(0, 2).join(', ')}, ${style.colorPalette.slice(0, 3).join(' and ')} palette`;
}

export function detectArtisticStyleFromPrompt(prompt: string): string | null {
  const promptLower = prompt.toLowerCase();
  
  for (const [styleId, style] of Object.entries(ARTISTIC_STYLES)) {
    for (const keyword of style.keywords) {
      if (promptLower.includes(keyword.toLowerCase())) {
        return styleId;
      }
    }
  }
  
  if (promptLower.includes('anime') || promptLower.includes('manga')) return 'animeStyle';
  if (promptLower.includes('watercolor')) return 'watercolor';
  if (promptLower.includes('oil paint')) return 'oilPainting';
  if (promptLower.includes('cyberpunk') || promptLower.includes('neon city')) return 'cyberpunk';
  if (promptLower.includes('baroque') || promptLower.includes('classical')) return 'baroque';
  if (promptLower.includes('renaissance') || promptLower.includes('da vinci')) return 'renaissance';
  if (promptLower.includes('pop art') || promptLower.includes('warhol')) return 'popArt';
  if (promptLower.includes('minimalist') || promptLower.includes('minimal')) return 'minimalArt';
  if (promptLower.includes('steampunk')) return 'steampunk';
  if (promptLower.includes('gothic') || promptLower.includes('dark fantasy')) return 'gothicDark';
  if (promptLower.includes('surreal') || promptLower.includes('dreamlike')) return 'surrealism';
  if (promptLower.includes('vaporwave') || promptLower.includes('aesthetic')) return 'vaporwave';
  if (promptLower.includes('synthwave') || promptLower.includes('retrowave')) return 'retrowave';
  if (promptLower.includes('art nouveau') || promptLower.includes('mucha')) return 'artNouveau';
  if (promptLower.includes('art deco')) return 'artDeco';
  if (promptLower.includes('impressionist') || promptLower.includes('monet')) return 'impressionism';
  
  return null;
}

export function buildFullEnhancedPrompt(
  userPrompt: string,
  options: {
    quality?: 'fast' | 'balanced' | 'professional';
    style?: string;
    mood?: string;
    subject?: string;
  } = {}
): string {
  const { quality = 'balanced', style, mood, subject } = options;
  
  const parts: string[] = [userPrompt];
  
  const cinematicDNA = buildCinematicDNA(quality);
  parts.push(cinematicDNA);
  
  const detectedSubject = subject || userPrompt.split(' ').slice(0, 3).join(' ');
  const lighting = selectLightingForSubject(detectedSubject, mood);
  parts.push(lighting);
  
  if (mood) {
    const colorGrade = selectColorGradeForMood(mood);
    parts.push(colorGrade.keywords.slice(0, 2).join(', '));
  }
  
  const detectedStyle = style || detectArtisticStyleFromPrompt(userPrompt);
  if (detectedStyle && ARTISTIC_STYLES[detectedStyle]) {
    const styleEnhancement = getStylePromptEnhancement(detectedStyle);
    parts.push(styleEnhancement);
  }
  
  const { camera, lens } = selectCameraForSubject(detectedSubject);
  if (quality !== 'fast') {
    parts.push(`shot on ${camera.name} with ${lens.name}`);
  }
  
  return parts.filter(p => p).join(', ');
}
