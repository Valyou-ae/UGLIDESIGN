import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';

// Hardcoded list of knowledge base articles available in the modal.
const articles = [
  { slug: 'master_overview', title: '🎬 Cinematic DNA: Overview' },
  { slug: 'deep_analysis_system', title: 'Stage 1: Deep Analysis' },
  { slug: 'gemini_optimization', title: 'Stage 7: Gemini Optimization' },
  { slug: 'agent_4_master_refiner', title: '🔮 Agent 4: Master Refiner' },
  { slug: 'skin_texture_library', title: '🧬 Skin Texture Library' },
  { slug: 'volumetric_atmospheric_effects', title: 'Volumetric Atmospherics' },
  { slug: 'professional_lighting_systems', title: 'Professional Lighting' },
  { slug: 'depth_layering_system', title: 'Depth Layering' },
  { slug: 'professional_color_grading', title: 'Professional Color Grading' },
  { slug: 'material_and_surface_rendering', title: 'Material Rendering' },
  { slug: 'cinematic_composition_rules', title: 'Cinematic Composition' },
  { slug: 'cinema_camera_systems', title: 'Cinema Cameras' },
  { slug: 'artistic_styles_library_part1', title: '🎨 Styles Pt. 1: Classical-Contemporary' },
  { slug: 'artistic_styles_library_part2', title: '🎨 Styles Pt. 2: Digital & Design' },
  { slug: 'style_106_manga_anime', title: '🎨 Style 106: Manga/Anime' },
  { slug: 'style_107_webtoon_manhwa', title: '🎨 Style 107: Webtoon/Manhwa' },
  { slug: 'style_108_bande_dessinee', title: '🎨 Style 108: Bande Dessinée' },
  { slug: 'style_109_american_comic_book', title: '🎨 Style 109: American Comic' },
  { slug: 'style_110_graphic_novel', title: '🎨 Style 110: Graphic Novel' },
  { slug: 'style_111_childrens_book_illustration', title: '🎨 Style 111: Children\'s Book' },
  { slug: 'style_112_editorial_illustration', title: '🎨 Style 112: Editorial' },
  { slug: 'style_113_technical_illustration', title: '🎨 Style 113: Technical' },
  { slug: 'style_114_medical_illustration', title: '🎨 Style 114: Medical' },
  { slug: 'style_115_botanical_illustration', title: '🎨 Style 115: Botanical' },
  { slug: 'style_126_chinese_ink_painting', title: '🎨 Style 126: Chinese Ink' },
  { slug: 'style_127_persian_miniature', title: '🎨 Style 127: Persian Mini.' },
  { slug: 'style_128_aboriginal_art', title: '🎨 Style 128: Aboriginal Art' },
  { slug: 'style_129_african_tribal_art', title: '🎨 Style 129: African Tribal' },
  { slug: 'style_130_madhubani', title: '🎨 Style 130: Madhubani' },
  { slug: 'style_146_gothic_architecture', title: '🏛️ Style 146: Gothic Arch.' },
  { slug: 'style_147_art_deco_architecture', title: '🏛️ Style 147: Art Deco Arch.' },
  { slug: 'style_148_brutalist_architecture', title: '🏛️ Style 148: Brutalist Arch.' },
  { slug: 'style_161_victorian_fashion', title: '👗 Style 161: Victorian' },
  { slug: 'style_162_edwardian_era', title: '👗 Style 162: Edwardian' },
  { slug: 'style_163_roaring_twenties', title: '👗 Style 163: Roaring 20s' },
  { slug: 'style_164_1950s_americana', title: '👗 Style 164: 1950s Americana' },
  { slug: 'style_165_1960s_mod', title: '👗 Style 165: 1960s Mod' },
  { slug: 'style_166_1970s_disco', title: '👗 Style 166: 1970s Disco' },
  { slug: 'style_167_1980s_power_dressing', title: '👗 Style 167: 80s Power Dressing' },
  { slug: 'style_168_1990s_grunge_fashion', title: '👗 Style 168: 90s Grunge' },
  { slug: 'style_169_haute_couture', title: '👗 Style 169: Haute Couture' },
  { slug: 'style_170_streetwear', title: '👗 Style 170: Streetwear' },
  { slug: 'style_171_avant_garde_fashion', title: '👗 Style 171: Avant-Garde' },
  { slug: 'style_172_cyberwear', title: '👗 Style 172: Cyberwear' },
  { slug: 'style_173_historical_costume', title: '👗 Style 173: Historical Costume' },
  { slug: 'style_174_traditional_japanese_kimono', title: '👗 Style 174: Kimono' },
  { slug: 'style_175_traditional_indian_saree', title: '👗 Style 175: Saree' },
  { slug: 'style_176_8_bit_16_bit_game_art', title: '🎮 Style 176: 8/16-Bit Art' },
  { slug: 'style_177_ps1_n64_low_poly', title: '🎮 Style 177: PS1/N64 Low Poly' },
  { slug: 'style_180_disney_2d_animation', title: '🎮 Style 180: Disney 2D' },
  { slug: 'style_181_stop_motion', title: '🎮 Style 181: Stop Motion' },
  { slug: 'style_182_claymation', title: '🎮 Style 182: Claymation' },
  { slug: 'style_183_retro_arcade', title: '🎮 Style 183: Retro Arcade' },
  { slug: 'style_184_jrpg_style', title: '🎮 Style 184: JRPG Style' },
  { slug: 'style_185_soulsborne_aesthetic', title: '🎮 Style 185: Soulsborne' },
  { slug: 'style_185_soulsborne_aesthetic_fashion', title: '👗 Style 185: Soulsborne Fashion' },
  { slug: 'style_186_indie_game_art', title: '🎮 Style 186: Indie Game Art' },
  { slug: 'style_187_vr_ar_interface', title: '🎮 Style 187: VR/AR UI' },
  { slug: 'style_188_mobile_game_ui', title: '🎮 Style 188: Mobile Game UI' },
];

/**
 * A simple markdown parser to convert knowledge base articles into React elements.
 * Uses `dangerouslySetInnerHTML` which is safe here as the markdown content is trusted and local.
 * @param markdown The raw markdown string.
 * @returns An array of React nodes.
 */
const parseMarkdown = (markdown: string): React.ReactNode[] => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4">
          {listItems.map((item, index) => (
            <li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const processLine = (line: string) => {
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/`(.*?)`/g, '<code class="bg-slate-800 text-sm rounded px-1.5 py-0.5 font-mono text-primary-400">$1</code>');
    return line;
  };

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        flushList();
        elements.push(
          <pre key={`pre-${index}`} className="bg-slate-950 p-4 rounded-lg my-4 overflow-x-auto text-sm border border-slate-700">
            <code>{codeBlockContent}</code>
          </pre>
        );
        codeBlockContent = '';
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      return;
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-3xl font-bold mt-8 mb-4 border-b border-slate-700 pb-2" dangerouslySetInnerHTML={{ __html: processLine(line.substring(2)) }} />);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-2xl font-bold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: processLine(line.substring(3)) }} />);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-slate-300" dangerouslySetInnerHTML={{ __html: processLine(line.substring(4)) }} />);
    } else if (line.trim().startsWith('- ')) {
      listItems.push(processLine(line.trim().substring(2)));
    } else if (line.trim() === '---') {
      flushList();
      elements.push(<hr key={index} className="my-6 border-slate-700" />);
    } else if (line.trim() !== '') {
      flushList();
      elements.push(<p key={index} className="my-2 text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: processLine(line) }} />);
    }
  });

  flushList();
  return elements;
};


interface KnowledgeBaseModalProps {
  onClose: () => void;
}

const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ onClose }) => {
  const [selectedArticle, setSelectedArticle] = useState(articles[0].slug);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      contentRef.current?.scrollTo(0, 0); // Reset scroll on article change
      try {
        const response = await fetch(`./knowledge_base/${selectedArticle}.md`);
        const text = response.ok ? await response.text() : 'Error: Could not load article.';
        setContent(text);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setContent('Error: Could not load article.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [selectedArticle]);

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden animate-fadeIn">

        {/* Sidebar Navigation */}
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

        {/* Content Area */}
        <main ref={contentRef} className="w-3/4 overflow-y-auto p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg z-10">
            <X className="w-6 h-6" />
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <article className="prose prose-invert max-w-none">
              {parseMarkdown(content)}
            </article>
          )}
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBaseModal;
