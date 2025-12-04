import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

const articles = [
  { slug: 'overview', title: 'Cinematic DNA: Overview' },
  { slug: 'lighting', title: 'Professional Lighting Systems' },
  { slug: 'color', title: 'Professional Color Grading' },
  { slug: 'composition', title: 'Cinematic Composition' },
  { slug: 'styles', title: 'Artistic Styles Library' },
];

const articleContent: Record<string, string> = {
  overview: `# Cinematic DNA Overview

The Cinematic DNA system provides Hollywood-grade image enhancement through 7 key components:

## Key Components

- **Volumetric Atmospheric Effects** - Adds depth through fog, haze, and atmospheric perspective
- **Professional Lighting Systems** - Studio-quality lighting setups and natural light scenarios
- **Depth Layering** - Creates visual depth through foreground, midground, and background separation
- **Color Grading** - Professional color science for mood and atmosphere
- **Material Rendering** - Realistic surface textures and material properties
- **Cinematic Composition** - Rule of thirds, golden ratio, and dynamic framing
- **Cinema Camera Systems** - Lens characteristics and camera movement simulation

Each component contributes 8-15% quality improvement to your generated images.`,

  lighting: `# Professional Lighting Systems

## Natural Light Scenarios
- **Golden Hour** - Warm, directional light with long shadows
- **Blue Hour** - Cool, ambient light during twilight
- **Overcast** - Soft, diffused lighting without harsh shadows
- **Direct Sunlight** - High contrast with defined shadows

## Studio Lighting Setups
- **Rembrandt** - Classic portrait lighting with triangle shadow
- **Butterfly** - Front-facing light creating shadow under nose
- **Loop** - Small shadow loop on one side of face
- **Split** - Half face lit, half in shadow

## Dramatic Effects
- **Rim Light** - Edge lighting for subject separation
- **Practical Lights** - Using visible light sources in frame
- **Chiaroscuro** - Strong contrast between light and dark`,

  color: `# Professional Color Grading

## Popular Color Grades
- **Teal and Orange** - Complementary colors for cinematic look
- **Bleach Bypass** - Desaturated, high contrast look
- **Film Emulation** - Kodak, Fuji film stock looks
- **Cross Process** - Unusual color shifts for artistic effect

## Color Theory
- **Warm Tones** - Convey comfort, energy, passion
- **Cool Tones** - Suggest calm, mystery, isolation
- **Complementary Colors** - Create visual tension
- **Analogous Colors** - Harmonious, cohesive palettes`,

  composition: `# Cinematic Composition

## Classic Rules
- **Rule of Thirds** - Subject placement at intersection points
- **Golden Ratio** - Natural proportions for balance
- **Leading Lines** - Guide viewer's eye through frame
- **Framing** - Use elements to frame your subject

## Dynamic Techniques
- **Dutch Angle** - Tilted camera for tension
- **Deep Focus** - Sharp foreground to background
- **Shallow Focus** - Isolated subject, blurred background
- **Symmetry** - Centered, balanced compositions`,

  styles: `# Artistic Styles Library

## Historical Periods
- Renaissance, Baroque, Impressionism, Art Nouveau, Art Deco

## Modern Movements
- Surrealism, Pop Art, Minimalism, Abstract Expressionism

## Digital Aesthetics
- Cyberpunk, Vaporwave, Synthwave, Glitch Art

## Cultural Styles
- Ukiyo-e, Persian Miniature, Aboriginal Art, Madhubani

## Fashion Eras
- Victorian, Art Deco, 1950s Americana, 80s Power Dressing

## Game Art Styles
- 8-bit, Low Poly, Anime, JRPG, Soulsborne`,
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
          <h1 key={index} className="text-2xl font-bold mt-4 mb-3 border-b border-slate-700 pb-2">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold mt-4 mb-2 text-primary-400">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\* - (.+)/);
        if (match) {
          elements.push(
            <li key={index} className="ml-4 my-1">
              <strong className="text-white">{match[1]}</strong>
              <span className="text-slate-400"> - {match[2]}</span>
            </li>
          );
        } else {
          const simpleMatch = line.match(/- \*\*(.+?)\*\*/);
          if (simpleMatch) {
            elements.push(
              <li key={index} className="ml-4 my-1">
                <strong className="text-white">{simpleMatch[1]}</strong>
              </li>
            );
          }
        }
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 my-1 text-slate-300">
            {line.substring(2)}
          </li>
        );
      } else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="my-2 text-slate-300">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden">
        <nav className="w-1/4 bg-slate-950 p-4 border-r border-slate-800 overflow-y-auto">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-primary-400">
            <BookOpen className="w-5 h-5" />
            Knowledge Base
          </h2>
          <ul className="space-y-1">
            {articles.map(article => (
              <li key={article.slug}>
                <button
                  onClick={() => setSelectedArticle(article.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedArticle === article.slug
                      ? 'bg-primary-600 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                >
                  {article.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="w-3/4 overflow-y-auto p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg z-10">
            <X className="w-6 h-6" />
          </button>

          <article className="prose prose-invert max-w-none">
            {parseMarkdown(articleContent[selectedArticle] || 'Article not found.')}
          </article>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBaseModal;
