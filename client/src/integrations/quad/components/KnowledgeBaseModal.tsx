import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Camera, Palette, Sun, Layers, Film, Image, Type, Zap } from 'lucide-react';

const articles = [
  { slug: 'overview', title: 'Cinematic DNA Overview', icon: Film },
  { slug: 'lighting', title: 'Professional Lighting (20-25%)', icon: Sun },
  { slug: 'color', title: 'Color Grading (15-20%)', icon: Palette },
  { slug: 'composition', title: 'Composition Rules (10-15%)', icon: Layers },
  { slug: 'atmospheric', title: 'Atmospheric Effects (15-20%)', icon: Sparkles },
  { slug: 'camera', title: 'Cinema Camera Systems (15-20%)', icon: Camera },
  { slug: 'styles', title: 'Artistic Styles Library (50+)', icon: Image },
  { slug: 'text', title: 'Text Integrity System', icon: Type },
  { slug: 'quality', title: 'Quality Presets & Tiers', icon: Zap },
];

const articleContent: Record<string, string> = {
  overview: `# Cinematic DNA System - 50-60% Quality Boost

The Cinematic DNA System transforms amateur-looking images (6/10) to Hollywood-standard cinematography (9-10/10).

## The 7 Core Components

Each component contributes measurable quality improvement:

- **Volumetric Atmospheric Effects** (+15-20%) - Fog, god rays, depth haze
- **Professional Lighting Systems** (+20-25%) - Hollywood lighting setups
- **Depth Layering System** (+10-15%) - Foreground/midground/background
- **Professional Color Grading** (+15-20%) - Film stock emulation, LUTs
- **Material & Surface Rendering** (+10-15%) - SSS, PBR, realistic textures
- **Cinematic Composition** (+10-15%) - Rule of thirds, golden ratio
- **Cinema Camera Systems** (+15-20%) - ARRI, RED, Zeiss lenses

## How It Works

The Style Architect analyzes your prompt and automatically:

1. Detects subject type (portrait, landscape, product, etc.)
2. Selects appropriate lighting setup (Rembrandt, butterfly, natural)
3. Applies matching color grade (teal/orange, bleach bypass, etc.)
4. Recommends camera and lens combination
5. Adds compositional rules and atmospheric depth

## Graphic Design Mode

For book covers, posters, and graphic design, the system automatically translates:

- "Cinematic lighting" → Dramatic spotlight effects within the design
- "Camera specs" → OMITTED (no "shot on ARRI Alexa" for book covers)
- "Color grading" → Moody, restricted color palette
- Focus on creating the artwork itself, not a photograph of it`,

  lighting: `# Professional Lighting Systems
**Quality Boost: 20-25%** (Highest Impact)

Hollywood-standard lighting setups used by professional cinematographers.

## Studio Lighting Setups

- **Three-Point Lighting** - Key, fill, and rim/back light
  - Low Contrast: 2:1 ratio, soft and even
  - Standard: 4:1 ratio, moderate contrast
  - Dramatic: 8:1 ratio, strong shadows
  - Chiaroscuro: 16:1+ ratio, extreme contrast

- **Rembrandt Lighting** - 45° angle with triangle shadow
  - Creates depth and dimension
  - Classic portrait aesthetic
  - Named after the painter's signature style

- **Butterfly Lighting** - Light above and in front
  - Creates butterfly shadow under nose
  - Glamorous, beauty look
  - Emphasizes cheekbones

- **Loop Lighting** - 30-45° angle, small shadow loop
  - Versatile and natural looking
  - Professional portraits and headshots

- **Split Lighting** - 90° angle, half face lit
  - Extreme drama
  - Strong masculine feel
  - Artistic and moody

## Natural Light Scenarios

- **Golden Hour** - Warm, directional light with long shadows
- **Blue Hour** - Cool ambient twilight, magical atmosphere
- **Overcast** - Soft, diffused lighting, no harsh shadows
- **Direct Sunlight** - High contrast with defined shadows

## Prompt Templates

- Basic: \`three-point lighting, professional illumination\`
- Enhanced: \`cinematic Rembrandt lighting with dramatic shadows\`
- Professional: \`Hollywood three-point setup with rim lighting, T1.5 aperture depth\``,

  color: `# Professional Color Grading
**Quality Boost: 15-20%**

Hollywood-standard color grading and film stock emulation.

## Popular Color Grades

- **Teal and Orange** - Complementary blockbuster look
  - Warm skin tones, cool backgrounds
  - Used in: Action films, commercial work
  - Intensities: Subtle → Moderate → Strong → Extreme

- **Bleach Bypass** - Desaturated, high contrast
  - Gritty, tactical aesthetic
  - Used in: War films, intense dramas
  - Creates harsh, documentary feel

- **Film Stock Emulation**
  - Kodak Vision3 500T: Warm tungsten, fine grain, rich colors
  - Kodak Vision3 250D: Daylight balanced, natural colors
  - Fuji Eterna Vivid: Saturated, rich blues, vibrant
  - Kodak Portra: Natural skin, soft colors, portrait optimized

## LUT-Based Grades

- **Cinematic Neutral** - Balanced professional base
- **Warm Vintage** - Warm tones, faded blacks, nostalgic
- **Cold Modern** - Cool tones, clean blacks, contemporary
- **High Contrast** - Deep blacks, bright highlights
- **Low Contrast** - Lifted blacks, soft highlights, dreamy

## Mood-Based Grading

- **Nostalgic**: Warm, faded, soft contrast
- **Dramatic**: High contrast, saturated, bold
- **Ethereal**: Soft, desaturated, lifted blacks
- **Gritty**: Desaturated, high contrast, harsh
- **Romantic**: Warm, soft, glowing highlights
- **Mysterious**: Cool tones, deep shadows, muted`,

  composition: `# Cinematic Composition Rules
**Quality Boost: 10-15%**

Professional composition techniques from cinema and photography.

## Core Techniques

- **Rule of Thirds**
  - Divide frame into 9 equal parts
  - Place subjects on intersection points
  - Horizon on horizontal lines
  - Creates dynamic, balanced compositions

- **Golden Ratio / Fibonacci**
  - 1:1.618 divine proportion
  - Natural, pleasing composition
  - Spiral guides eye through frame
  - Used in Renaissance art

- **Leading Lines**
  - Guide viewer's eye through frame
  - Types: Diagonal, Curved, Converging, Parallel
  - Creates depth and direction
  - Common: Roads, fences, architecture

- **Natural Framing**
  - Use scene elements to frame subject
  - Doorways, windows, arches, trees
  - Creates depth and context
  - Focuses attention on subject

- **Symmetry**
  - Vertical, Horizontal, or Radial
  - Formal, balanced feel
  - Strong for architecture
  - Dramatic impact

- **Negative Space**
  - Empty space around subject
  - Creates emphasis and breathing room
  - Modern, minimalist aesthetic
  - Powerful for isolation

## Depth Plane Composition

- **Foreground**: Framing elements, texture, depth cues
- **Midground**: Main subject, action, focus
- **Background**: Context, atmosphere, environment

Creates three-dimensional depth in 2D images.`,

  atmospheric: `# Volumetric Atmospheric Effects
**Quality Boost: 15-20%**

Creates dimensional depth and professional atmosphere.

## Volumetric Fog

Density Levels:
- **Subtle**: Hint of fog, slight depth haze
- **Moderate**: Visible fog, depth separation
- **Dense**: Heavy fog, mystery atmosphere
- **Extreme**: Thick fog, silhouette effect

## God Rays / Light Shafts

- Crepuscular rays through atmosphere
- Dramatic, spiritual quality
- Perfect for forests, windows, dust

Intensities:
- **Subtle**: Gentle light beams
- **Moderate**: Clear visible rays
- **Strong**: Prominent god rays
- **Extreme**: Dramatic light shafts

## Atmospheric Haze

Creates natural depth through:
- Color desaturation with distance
- Reduced contrast at far planes
- Blue/white shift in background
- Realistic depth perception

## Atmospheric Perspective

- Far objects appear lighter and bluer
- Creates natural depth separation
- Mimics real-world physics
- Hollywood standard technique

## Prompt Templates

- Basic: \`volumetric atmosphere, atmospheric depth\`
- Enhanced: \`volumetric fog and god rays, atmospheric haze\`
- Professional: \`volumetric atmospheric lighting with god rays, exponential distance haze, atmospheric perspective\``,

  camera: `# Cinema Camera Systems
**Quality Boost: 15-20%**

Professional cinema cameras and lens systems.

## Professional Cameras

- **ARRI Alexa LF** - Hollywood standard
  - 14+ stops dynamic range
  - Natural skin tones
  - Film-like rendering
  - Used in: Major studio productions

- **RED Komodo 6K** - High-speed action
  - 6K resolution
  - Global shutter option
  - Compact form factor
  - Used in: Action, documentary

- **Sony Venice** - Full-frame cinema
  - Dual ISO capability
  - Excellent low light
  - 15 stops dynamic range
  - Used in: Feature films, commercials

- **Blackmagic URSA** - Accessible cinema
  - 12-bit raw recording
  - Affordable pro quality
  - Film-like look
  - Used in: Indie films, web series

## Professional Lenses

- **Zeiss Supreme Prime** - Modern, clean, sharp
- **Cooke S4/i** - Classic, warm, organic
- **Canon CN-E** - Balanced, versatile
- **Vintage Anamorphic** - Flares, character, cinematic

## Sensor Formats

- Full Frame (36mm) - Shallow DOF, cinematic
- Super 35 (APS-C) - Standard cinema format
- Micro 4/3 - Deep focus, compact
- Large Format (65mm) - Ultra-shallow DOF

## Focal Length Aesthetics

- 24mm: Wide, environmental, expansive
- 35mm: Natural perspective, versatile
- 50mm: Standard, neutral, classic
- 85mm: Portrait, compression, flattering
- 135mm: Telephoto, compression, isolation

**Note**: For graphic design (book covers, posters), camera specs are automatically omitted.`,

  styles: `# Artistic Styles Library (50+)

Comprehensive library of artistic styles for any creative need.

## Historical Periods
- **Renaissance** - Sfumato, chiaroscuro, oil technique
- **Baroque** - Dynamic, ornate, dramatic lighting
- **Impressionism** - Loose brushwork, light emphasis
- **Art Nouveau** - Organic curves, decorative beauty
- **Art Deco** - Geometric, luxurious, streamlined

## Modern Movements
- **Surrealism** - Dreamlike, unexpected juxtapositions
- **Cubism** - Fragmented forms, multiple perspectives
- **Pop Art** - Bold colors, commercial imagery
- **Minimalism** - Simple forms, clean design
- **Abstract Expressionism** - Emotional, gestural

## Digital Aesthetics
- **Cyberpunk** - Neon, rain, high-tech dystopia
- **Vaporwave** - Retro pastels, Greek statues, nostalgia
- **Synthwave** - 80s neon, grids, sunsets
- **Glitch Art** - Digital errors, corruption effects
- **Y2K** - Chrome, bubbles, millennium style

## Cultural Styles
- **Ukiyo-e** - Japanese woodblock prints
- **Persian Miniature** - Detailed, flat perspective
- **Aboriginal Art** - Dot painting, dreamtime
- **Madhubani** - Indian folk art, natural dyes
- **Chinese Ink Painting** - Brush, ink, bamboo

## Game & Animation
- **Anime/Manga** - Japanese animation style
- **Studio Ghibli** - Miyazaki's warm, detailed worlds
- **Disney 2D** - Classic animation charm
- **Low Poly** - Geometric 3D simplification
- **Pixel Art** - 8-bit/16-bit retro gaming

## Fashion Eras
- **Victorian** - Ornate, formal, dark elegance
- **Art Deco Fashion** - Geometric glamour
- **1950s Americana** - Wholesome, bright, optimistic
- **1980s Power Dressing** - Bold shoulders, neon
- **Streetwear** - Urban, casual, branded`,

  text: `# Text Integrity System

AI-powered system for perfect text rendering in images.

## How It Works

1. **Text Detection** - Identifies quoted text and text instructions
2. **Candidate Generation** - Creates 8 image variations
3. **OCR Validation** - Uses Gemini Vision to extract text
4. **Scoring** - Levenshtein distance for accuracy
5. **Selection** - Best image based on accuracy + aesthetics

## Scoring Formula

**Combined Score = 70% Text Accuracy + 30% Aesthetics**

- Text accuracy: How closely rendered text matches expected
- Aesthetics: Composition, lighting, color quality

## Zone Layout System

For multi-block text, assigns zones:
- **ZONE 1 (Top Third)**: Main title
- **ZONE 2 (Middle Third)**: Subtitle
- **ZONE 3 (Bottom Third)**: Author/credits

## Critical Spelling Emphasis

Complex words (8+ chars, hyphenated) get extra attention:
- Flagged for model focus
- Additional validation passes

## Soft Limits (Recommendations)

- Max 4-5 text blocks per image
- Max 10-12 words per block
- Shorter text = higher accuracy

## Model Routing for Text

- Draft mode WITH text → Imagen 4 (better text rendering)
- Final mode → Imagen 4 PRIMARY with fallback
- Fallback → gemini-3-pro-image-preview

## Tips for Best Results

1. Keep text short and simple
2. Use clear quotation marks
3. Avoid complex typography instructions
4. Let the model handle font selection`,

  quality: `# Quality Presets & Tier System

Intelligent quality scaling based on prompt complexity.

## Quality Presets

- **Draft** (512 tokens, 70 words max)
  - Quick preview generation
  - Fast iteration
  - Light enhancement only

- **Standard** (1024 tokens, 150 words max)
  - Balanced quality and speed
  - Good for most use cases
  - Full Cinematic DNA

- **Premium** (4096 tokens, 200 words max)
  - High quality output
  - Deep synthesis
  - Extended thinking

- **Ultra** (8192 tokens, 250 words max)
  - Maximum quality
  - Professional output
  - Full multi-stage synthesis

## Auto-Scaling Tier System

Automatically adjusts based on complexity:

**Complexity Scoring:**
- Text content: +30-50 points
- Multilingual scripts: +25-35 points
- Complex styles: +10-40 points

**Tier Thresholds:**
- Standard: 0-30 points
- Premium: 31-60 points
- Ultra: 61+ points

## Tier Lock

Override automatic tier selection:
- Useful for consistent quality
- Prevents unexpected tier changes
- Available in settings

## Exponential Backoff

For API reliability:
- 5 retries with exponential delay
- 1s → 2s → 4s → 8s → 16s
- Only falls back after all retries fail

## Best Practices

1. Use Draft for quick iterations
2. Use Standard for most generations
3. Use Premium for final outputs
4. Use Ultra for portfolio/professional work
5. Enable AI Curation for text-heavy prompts`
};

interface KnowledgeBaseModalProps {
  onClose: () => void;
}

const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ onClose }) => {
  const [selectedArticle, setSelectedArticle] = useState(articles[0].slug);

  const parseMarkdown = (markdown: string): React.ReactNode[] => {
    const lines = markdown.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold mt-4 mb-3 border-b border-slate-700 pb-2 text-white">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-primary-400">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-blue-400">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*\s*[-–—]?\s*(.*)/);
        if (match) {
          elements.push(
            <li key={index} className="ml-4 my-1.5 flex">
              <span className="text-primary-400 mr-2">•</span>
              <span>
                <strong className="text-white">{match[1]}</strong>
                {match[2] && <span className="text-slate-400"> - {match[2]}</span>}
              </span>
            </li>
          );
        }
      } else if (line.startsWith('- ')) {
        const content = line.substring(2);
        const hasColon = content.includes(':');
        if (hasColon) {
          const [before, ...after] = content.split(':');
          elements.push(
            <li key={index} className="ml-4 my-1 flex">
              <span className="text-slate-500 mr-2">•</span>
              <span>
                <span className="text-slate-200">{before}</span>
                <span className="text-slate-400">:{after.join(':')}</span>
              </span>
            </li>
          );
        } else {
          elements.push(
            <li key={index} className="ml-4 my-1 flex text-slate-300">
              <span className="text-slate-500 mr-2">•</span>
              <span>{content}</span>
            </li>
          );
        }
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || 
                 line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ') ||
                 line.startsWith('7. ') || line.startsWith('8. ') || line.startsWith('9. ')) {
        const num = line.match(/^(\d+)\.\s+(.*)$/);
        if (num) {
          elements.push(
            <li key={index} className="ml-4 my-1.5 flex text-slate-300">
              <span className="text-primary-400 font-medium mr-3 min-w-[20px]">{num[1]}.</span>
              <span>{num[2]}</span>
            </li>
          );
        }
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={index} className="my-2 font-semibold text-white">
            {line.slice(2, -2)}
          </p>
        );
      } else if (line.startsWith('`') && line.endsWith('`') && !line.includes('\n')) {
        elements.push(
          <code key={index} className="block my-2 px-3 py-2 bg-slate-800 rounded text-green-400 text-sm font-mono">
            {line.slice(1, -1)}
          </code>
        );
      } else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="my-2 text-slate-300 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  const currentArticle = articles.find(a => a.slug === selectedArticle);
  const CurrentIcon = currentArticle?.icon || BookOpen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden">
        <nav className="w-1/4 bg-slate-950 p-4 border-r border-slate-800 overflow-y-auto">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-primary-400">
            <BookOpen className="w-5 h-5" />
            Knowledge Base
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Comprehensive Cinematic DNA system for 50-60% quality improvement
          </p>
          <ul className="space-y-1">
            {articles.map(article => {
              const Icon = article.icon;
              return (
                <li key={article.slug}>
                  <button
                    onClick={() => setSelectedArticle(article.slug)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedArticle === article.slug
                        ? 'bg-primary-600 text-white font-semibold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    data-testid={`kb-nav-${article.slug}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{article.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="w-3/4 overflow-y-auto p-8 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg z-10 transition-colors"
            data-testid="button-close-kb"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center">
              <CurrentIcon className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentArticle?.title}</h2>
              <p className="text-xs text-slate-500">Cinematic DNA Component</p>
            </div>
          </div>

          <article className="prose prose-invert max-w-none">
            {parseMarkdown(articleContent[selectedArticle] || 'Article not found.')}
          </article>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBaseModal;
