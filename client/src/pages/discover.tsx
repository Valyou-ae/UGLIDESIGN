import { useState, useEffect, useRef, useCallback } from "react";
import { 
  TrendingUp, 
  Bookmark, 
  BadgeCheck, 
  Eye, 
  Heart, 
  Wand2,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";

interface InspirationItem {
  id: number;
  title: string;
  image: string;
  creator: string;
  verified: boolean;
  views: string;
  likes: string;
  uses: string;
  tags: string[];
  category: string;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "3:4";
  prompt: string;
}

function LazyMasonryCard({ item, index }: { item: InspirationItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const aspectClasses: Record<string, string> = {
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
    "4:5": "aspect-[4/5]",
    "3:4": "aspect-[3/4]"
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: "easeOut" }}
      className="break-inside-avoid mb-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group bg-white dark:bg-[#111113] border border-[#E4E4E7] dark:border-[#1F1F23] rounded-[20px] overflow-hidden cursor-pointer hover:border-[#B94E30]/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(185,78,48,0.15)] transition-all duration-300">
        <div className={cn("relative overflow-hidden", aspectClasses[item.aspectRatio])}>
          {isVisible ? (
            <>
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
                  imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                )}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#B94E30]/20 to-[#664D3F]/20 animate-pulse" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 animate-pulse" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
          
          <div className="absolute top-3 left-3 bg-gradient-to-br from-[#B94E30] to-[#8B3A24] px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white shadow-lg">
            {item.category}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-medium text-white/80">
              {item.aspectRatio}
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B94E30] text-white">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-base font-semibold text-white truncate drop-shadow-lg">{item.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#B94E30] to-[#E3B436]" />
              <span className="text-xs text-white/80">@{item.creator}</span>
              {item.verified && <BadgeCheck className="h-3 w-3 text-[#E3B436]" />}
            </div>
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="bg-black/40 backdrop-blur-md rounded-lg p-3">
                    <p className="text-[11px] text-white/90 leading-relaxed line-clamp-3">
                      <span className="text-[#E3B436] font-medium">Prompt: </span>
                      {item.prompt}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-xs text-[#71717A] dark:text-[#52525B]">
              <Eye className="h-3.5 w-3.5" />
              <span>{item.views}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#71717A] dark:text-[#52525B]">
              <Heart className="h-3.5 w-3.5" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#71717A] dark:text-[#52525B]">
              <Wand2 className="h-3.5 w-3.5" />
              <span>{item.uses}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-[#F4F4F5] dark:bg-[#1F1F25] rounded-md text-[10px] text-[#71717A]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const allInspirations: InspirationItem[] = [
  {
    id: 1,
    title: "Ethereal Dreamscape",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop",
    creator: "dreamweaver",
    verified: true,
    views: "156.8K",
    likes: "28.4K",
    uses: "12.1K",
    tags: ["surreal", "dreamlike", "ethereal"],
    category: "Surrealism",
    aspectRatio: "9:16",
    prompt: "A surrealist dreamscape where giant luminescent jellyfish float through ancient marble ruins, bioluminescent tendrils casting ethereal blue and magenta light across crumbling Corinthian columns, volumetric god rays piercing through cosmic mist, hyperdetailed 8K render, inspired by Salvador Dalí and Zdzisław Beksiński"
  },
  {
    id: 2,
    title: "Cosmic Renaissance",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
    creator: "cosmicmaster",
    verified: true,
    views: "203.5K",
    likes: "41.2K",
    uses: "18.7K",
    tags: ["space", "renaissance", "baroque"],
    category: "Digital Art",
    aspectRatio: "1:1",
    prompt: "Baroque ceiling fresco reimagined as a cosmic nebula, cherubs replaced with celestial beings made of stardust and aurora light, gold leaf accents catching light from distant supernovas, Caravaggio-style chiaroscuro with deep space backgrounds, ultra-realistic oil painting texture, 16K masterpiece"
  },
  {
    id: 3,
    title: "Neon Samurai",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop",
    creator: "cyberblade",
    verified: true,
    views: "287.3K",
    likes: "52.9K",
    uses: "24.3K",
    tags: ["cyberpunk", "samurai", "neon"],
    category: "Cyberpunk",
    aspectRatio: "4:5",
    prompt: "A lone samurai warrior standing in a rain-soaked Tokyo alley, traditional armor infused with pulsing cyan and magenta circuitry, holographic cherry blossoms falling, reflections on wet asphalt creating chromatic aberration effects, cinematic Blade Runner lighting, photorealistic CGI render with film grain"
  },
  {
    id: 4,
    title: "Bioluminescent Garden",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1000&auto=format&fit=crop",
    creator: "natureglow",
    verified: false,
    views: "134.2K",
    likes: "22.8K",
    uses: "9.6K",
    tags: ["nature", "glow", "fantasy"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "An enchanted midnight garden where every plant emits its own bioluminescent glow, orchids pulsing with deep violet light, mushrooms casting emerald shadows, fireflies creating trails of liquid gold, dewdrops acting as tiny prisms scattering rainbow light, macro photography style with extreme bokeh, 8K resolution"
  },
  {
    id: 5,
    title: "Abstract Emotions",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
    creator: "emotionart",
    verified: true,
    views: "178.9K",
    likes: "35.6K",
    uses: "15.2K",
    tags: ["abstract", "emotional", "vibrant"],
    category: "Abstract",
    aspectRatio: "1:1",
    prompt: "Abstract expressionist explosion of raw human emotion, violent splashes of cadmium red representing passion, deep ultramarine pools of melancholy, streaks of titanium white hope cutting through darkness, paint texture so thick it appears three-dimensional, inspired by Jackson Pollock meets Mark Rothko, museum-quality fine art print"
  },
  {
    id: 6,
    title: "Mechanical Butterfly",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop",
    creator: "steampunkist",
    verified: true,
    views: "145.7K",
    likes: "26.3K",
    uses: "11.8K",
    tags: ["steampunk", "butterfly", "mechanical"],
    category: "Steampunk",
    aspectRatio: "3:4",
    prompt: "A magnificent mechanical butterfly with wings made of intricately interlocking brass gears and copper filigree, ruby gemstone body housing a tiny glowing steam engine, iridescent stained glass wing membranes catching Victorian gaslight, hovering above antique clockwork flowers, macro photography with tilt-shift blur, hyperrealistic render"
  },
  {
    id: 7,
    title: "Floating Islands",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    creator: "skypainter",
    verified: true,
    views: "267.4K",
    likes: "48.7K",
    uses: "21.9K",
    tags: ["fantasy", "islands", "magical"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "Majestic floating islands suspended in a cotton candy sunset sky, ancient waterfalls cascading into clouds below, bioluminescent trees with leaves that shimmer between turquoise and gold, rope bridges connecting impossible rock formations, tiny villages with warm glowing windows, matte painting style with photorealistic lighting, epic wide shot composition"
  },
  {
    id: 8,
    title: "Neural Networks",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    creator: "aiartist",
    verified: false,
    views: "112.3K",
    likes: "19.4K",
    uses: "8.2K",
    tags: ["AI", "neural", "technology"],
    category: "Tech Art",
    aspectRatio: "1:1",
    prompt: "Visualization of a neural network as a living organism, synaptic connections rendered as threads of liquid light in deep blue and electric purple, data packets appearing as golden fireflies traveling through organic circuitry, entire structure pulsing with the rhythm of machine learning, abstract interpretation of artificial consciousness, 4K resolution with ray tracing"
  },
  {
    id: 9,
    title: "Venetian Masquerade",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1000&auto=format&fit=crop",
    creator: "masqueart",
    verified: true,
    views: "189.6K",
    likes: "37.2K",
    uses: "16.8K",
    tags: ["venetian", "mask", "elegant"],
    category: "Portrait",
    aspectRatio: "9:16",
    prompt: "Haunting portrait of a mysterious figure in an ornate Venetian carnival mask, crafted from midnight blue velvet and adorned with genuine peacock feathers, gold leaf detailing catching candlelight, the wearer's eyes visible through the mask radiating an otherworldly amber glow, baroque lace collar, Renaissance palazzo backdrop shrouded in fog, dramatic Rembrandt lighting, oil painting texture"
  },
  {
    id: 10,
    title: "Prismatic Whale",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2uj98?q=80&w=1000&auto=format&fit=crop",
    creator: "oceanmystic",
    verified: true,
    views: "234.8K",
    likes: "45.1K",
    uses: "20.3K",
    tags: ["whale", "cosmic", "prismatic"],
    category: "Surrealism",
    aspectRatio: "16:9",
    prompt: "A colossal space whale swimming through the aurora borealis, its body a living prism refracting starlight into rainbow spectrums, cosmic barnacles emitting soft nebula light, smaller celestial fish following in its wake, the Milky Way galaxy visible in its eye reflection, breathtaking scale with tiny astronaut for reference, Hubble telescope quality with artistic interpretation"
  },
  {
    id: 11,
    title: "Art Deco Goddess",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    creator: "decomaster",
    verified: true,
    views: "156.2K",
    likes: "29.8K",
    uses: "13.4K",
    tags: ["art deco", "goddess", "gold"],
    category: "Art Deco",
    aspectRatio: "4:5",
    prompt: "Art Deco goddess emerging from geometric sunburst patterns, skin rendered in polished bronze with gold leaf accents, headdress featuring stylized peacock feathers in emerald and sapphire enamel, symmetrical composition with radiating lines, inspired by Tamara de Lempicka and Erté, luxurious 1920s glamour, high-contrast studio lighting"
  },
  {
    id: 12,
    title: "Quantum Garden",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    creator: "quantumart",
    verified: false,
    views: "98.7K",
    likes: "17.3K",
    uses: "7.4K",
    tags: ["quantum", "particles", "garden"],
    category: "Sci-Fi",
    aspectRatio: "1:1",
    prompt: "A garden existing in quantum superposition, flowers simultaneously blooming and wilting in overlapping states, probability clouds rendered as iridescent mist, particles phasing between matter and energy, Schrödinger's cat napping on a bench that exists in multiple positions, scientific visualization meets impressionist painting, soft diffused lighting"
  },
  {
    id: 13,
    title: "Dragon's Forge",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1000&auto=format&fit=crop",
    creator: "forgemaster",
    verified: true,
    views: "312.5K",
    likes: "58.9K",
    uses: "26.7K",
    tags: ["dragon", "fire", "forge"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "Ancient dragon serving as a living forge, molten metal dripping from its scales, a dwarven blacksmith working fearlessly at the anvil placed in the dragon's palm, sparks creating constellations in the dark cavern, weapons glowing with enchanted runes cooling on racks, atmospheric perspective with smoke and ember particles, epic fantasy illustration"
  },
  {
    id: 14,
    title: "Liquid Metal Portrait",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    creator: "metalmorph",
    verified: true,
    views: "143.9K",
    likes: "27.6K",
    uses: "12.3K",
    tags: ["chrome", "liquid", "portrait"],
    category: "Surrealism",
    aspectRatio: "1:1",
    prompt: "Human face sculpted from liquid mercury in mid-transformation, features melting and reforming simultaneously, perfect chrome reflections showing distorted studio environment, single drop of gold falling from the eye like a tear, hyper-photorealistic CGI render with subsurface scattering, studio lighting with colored gels creating purple and teal accents"
  },
  {
    id: 15,
    title: "Origami Universe",
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop",
    creator: "papercosmos",
    verified: false,
    views: "87.4K",
    likes: "15.2K",
    uses: "6.5K",
    tags: ["origami", "paper", "universe"],
    category: "Paper Art",
    aspectRatio: "3:4",
    prompt: "An entire universe constructed from intricately folded paper, galaxies as spiraling origami roses, stars as precisely creased crystalline shapes, planets with paper-thin rings showing visible fold lines, a paper astronaut floating past a geometric nebula, soft shadows revealing paper texture, macro photography with studio lighting"
  },
  {
    id: 16,
    title: "Mushroom Kingdom",
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1000&auto=format&fit=crop",
    creator: "fungalart",
    verified: true,
    views: "176.3K",
    likes: "33.8K",
    uses: "15.1K",
    tags: ["mushroom", "fantasy", "glow"],
    category: "Fantasy",
    aspectRatio: "9:16",
    prompt: "Towering bioluminescent mushroom forest at twilight, caps ranging from deep violet to electric blue emitting soft pulsing light, tiny fairy villages nested in the gill structures, phosphorescent spores drifting like snow, giant caterpillar smoking on the largest mushroom, Alice in Wonderland meets Avatar Pandora aesthetic, cinematic fog and depth"
  },
  {
    id: 17,
    title: "Geometric Phoenix",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop",
    creator: "geobird",
    verified: true,
    views: "198.7K",
    likes: "38.4K",
    uses: "17.2K",
    tags: ["phoenix", "geometric", "fire"],
    category: "Low Poly",
    aspectRatio: "1:1",
    prompt: "Majestic phoenix rising from ashes rendered in low-poly geometric style, thousands of triangular facets transitioning from deep red embers at the base to brilliant gold and white at the wing tips, each polygon reflecting light differently, trailing particles of geometric fire, dark obsidian background, vector art precision with 3D depth"
  },
  {
    id: 18,
    title: "Victorian Astronaut",
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop",
    creator: "retrospace",
    verified: false,
    views: "134.6K",
    likes: "25.9K",
    uses: "11.6K",
    tags: ["steampunk", "astronaut", "vintage"],
    category: "Steampunk",
    aspectRatio: "4:5",
    prompt: "Victorian-era astronaut in a brass and leather spacesuit, ornate copper helmet with multiple glass portholes and gear mechanisms, floating in space surrounded by clockwork satellites and steam-powered rockets, Earth visible as an antique globe, sepia tones with accents of copper and verdigris, Jules Verne inspired retrofuturism"
  },
  {
    id: 19,
    title: "Crystal Cavern",
    image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=1000&auto=format&fit=crop",
    creator: "crystalart",
    verified: true,
    views: "167.8K",
    likes: "32.1K",
    uses: "14.4K",
    tags: ["crystal", "cave", "magical"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "Massive underground crystal cavern with formations the size of skyscrapers, each crystal emitting its own colored light - amethyst purple, citrine gold, rose quartz pink, a crystal-clear underground lake reflecting infinite colors, small explorer with lantern for scale, volumetric light beams piercing from cracks above, fantasy realism with HDR lighting"
  },
  {
    id: 20,
    title: "Ink Dragon",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop",
    creator: "inkmaster",
    verified: true,
    views: "245.3K",
    likes: "47.6K",
    uses: "21.4K",
    tags: ["dragon", "ink", "japanese"],
    category: "Japanese Art",
    aspectRatio: "9:16",
    prompt: "Traditional Japanese dragon materializing from spilled ink, body flowing between solid scales and liquid ink splashes, whiskers trailing calligraphic brushstrokes, clouds rendered in sumi-e wash technique, gold leaf accents on eyes and horns, transitioning from ancient scroll to modern splash art, mixed media texture with visible rice paper grain"
  },
  {
    id: 21,
    title: "Clockwork Heart",
    image: "https://images.unsplash.com/photo-1516617442634-75371039cb3a?q=80&w=1000&auto=format&fit=crop",
    creator: "heartmech",
    verified: false,
    views: "121.4K",
    likes: "23.2K",
    uses: "10.4K",
    tags: ["mechanical", "heart", "steampunk"],
    category: "Steampunk",
    aspectRatio: "1:1",
    prompt: "Anatomically accurate human heart reconstructed entirely from clockwork mechanisms, visible chambers made of glass showing spinning gears inside, copper arteries with flowing liquid light instead of blood, diamond valves opening and closing, suspended in a Victorian display case, scientific illustration meets surrealist art, warm amber backlighting"
  },
  {
    id: 22,
    title: "Neon Geisha",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop",
    creator: "neontokyo",
    verified: true,
    views: "278.9K",
    likes: "53.4K",
    uses: "24.1K",
    tags: ["geisha", "neon", "cyberpunk"],
    category: "Cyberpunk",
    aspectRatio: "4:5",
    prompt: "Futuristic geisha with traditional white makeup contrasted by glowing circuit patterns under her skin, holographic kimono displaying ever-shifting cherry blossom animations, cybernetic hair ornaments doubling as data interfaces, standing on a rain-slicked Tokyo rooftop with holographic advertisements reflecting in puddles, blade runner noir atmosphere"
  },
  {
    id: 23,
    title: "Living Stained Glass",
    image: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?q=80&w=1000&auto=format&fit=crop",
    creator: "glassartist",
    verified: true,
    views: "154.2K",
    likes: "29.7K",
    uses: "13.3K",
    tags: ["stained glass", "cathedral", "light"],
    category: "Religious Art",
    aspectRatio: "9:16",
    prompt: "Cathedral stained glass window coming alive, biblical figures stepping out of their lead-lined frames, light physically manifesting as the glass colors splash onto the stone floor, centuries of captured sunset light releasing simultaneously, Gothic architecture with impossible height, sacred geometry and divine proportion, dramatic upward perspective"
  },
  {
    id: 24,
    title: "Ember Dancer",
    image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=1000&auto=format&fit=crop",
    creator: "firedancer",
    verified: false,
    views: "189.5K",
    likes: "36.8K",
    uses: "16.5K",
    tags: ["fire", "dance", "silhouette"],
    category: "Performance Art",
    aspectRatio: "3:4",
    prompt: "Ethereal dancer whose movements create trails of living fire and ember, body transitioning from solid to flame at the extremities, each pose leaving persistent light paintings in the air, traditional flamenco silhouette recognizable within the inferno, long exposure photography merged with digital fire simulation, pitch black background emphasizing the luminance"
  },
  {
    id: 25,
    title: "Porcelain Dreams",
    image: "https://images.unsplash.com/photo-1604076913837-52ab5f25f437?q=80&w=1000&auto=format&fit=crop",
    creator: "porcelainart",
    verified: true,
    views: "112.8K",
    likes: "21.4K",
    uses: "9.6K",
    tags: ["porcelain", "delicate", "blue"],
    category: "Ceramics",
    aspectRatio: "1:1",
    prompt: "Surrealist composition of a woman made entirely of Ming dynasty porcelain, traditional blue and white patterns flowing across her surface like living tattoos, hairline cracks revealing golden kintsugi repairs, delicate hands holding a matching teacup, soft diffused lighting revealing the translucent quality of fine china, museum photography style"
  },
  {
    id: 26,
    title: "Cosmic Jellyfish",
    image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1000&auto=format&fit=crop",
    creator: "cosmicjelly",
    verified: true,
    views: "223.6K",
    likes: "43.2K",
    uses: "19.4K",
    tags: ["jellyfish", "space", "ethereal"],
    category: "Surrealism",
    aspectRatio: "9:16",
    prompt: "Giant cosmic jellyfish drifting through a nebula, bell made of crystallized starlight with visible constellations inside, tentacles trailing for lightyears leaving new star formations in their wake, smaller jellyfish acting as moons in orbit, bioluminescent patterns pulsing in mathematical sequences, Hubble telescope meets bioluminescent photography"
  },
  {
    id: 27,
    title: "Autumn Spirit",
    image: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=1000&auto=format&fit=crop",
    creator: "spiritart",
    verified: false,
    views: "145.3K",
    likes: "28.1K",
    uses: "12.6K",
    tags: ["autumn", "spirit", "leaves"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "Ancient forest spirit embodying autumn itself, form composed entirely of swirling maple and oak leaves in every shade from deep burgundy to bright gold, eyes glowing with harvest moon light, deer antlers crowned with the last remaining flowers of summer, standing in a clearing as leaves dance around in an eternal gentle tornado, Studio Ghibli meets nature photography"
  },
  {
    id: 28,
    title: "Holographic Butterfly",
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop",
    creator: "holoart",
    verified: true,
    views: "134.7K",
    likes: "26.3K",
    uses: "11.8K",
    tags: ["holographic", "butterfly", "iridescent"],
    category: "Digital Art",
    aspectRatio: "4:5",
    prompt: "Macro photograph of a butterfly with wings made entirely of holographic material, reflecting impossible colors that shift with viewing angle, compound eyes showing galaxy reflections, antennae tipped with tiny prisms, resting on a dewdrop-covered chrome flower, studio macro lighting with multiple colored light sources, hyperrealistic CGI"
  },
  {
    id: 29,
    title: "Astral Library",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000&auto=format&fit=crop",
    creator: "librarian",
    verified: true,
    views: "267.8K",
    likes: "51.9K",
    uses: "23.3K",
    tags: ["library", "magical", "infinite"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "Infinite interdimensional library with bookshelves extending into impossible geometries, floating platforms and spiral staircases defying gravity, books occasionally flying to their readers, ambient light from glowing manuscripts and phosphorescent bookworms, cozy reading nooks suspended in void, M.C. Escher architecture meets Beauty and the Beast warmth"
  },
  {
    id: 30,
    title: "Ocean Within",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop",
    creator: "oceanmind",
    verified: false,
    views: "178.4K",
    likes: "34.6K",
    uses: "15.5K",
    tags: ["ocean", "mind", "surreal"],
    category: "Surrealism",
    aspectRatio: "1:1",
    prompt: "Surrealist portrait where the human head opens like a shell to reveal an entire ocean ecosystem inside, whales swimming through neural pathways, coral growing from memories, a lighthouse of consciousness at the center, waves gently splashing at the opened edges, concept of inner depths made literal, René Magritte meets marine biology illustration"
  },
  {
    id: 31,
    title: "Synthwave Sunset",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
    creator: "retrowave",
    verified: true,
    views: "298.3K",
    likes: "57.2K",
    uses: "25.7K",
    tags: ["synthwave", "retro", "80s"],
    category: "Synthwave",
    aspectRatio: "16:9",
    prompt: "Ultimate synthwave landscape with chrome grid extending to the horizon, massive sun setting behind geometric mountains, palm tree silhouettes with neon pink outlines, vintage sports car on endless highway, everything bathed in gradient from hot pink through purple to deep blue, scan lines and VHS artifacts, 1984 vision of 2020"
  },
  {
    id: 32,
    title: "Fractal Flower",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop",
    creator: "fractalart",
    verified: false,
    views: "98.5K",
    likes: "18.9K",
    uses: "8.5K",
    tags: ["fractal", "flower", "mathematical"],
    category: "Generative Art",
    aspectRatio: "1:1",
    prompt: "Perfectly mathematical fractal flower with infinitely repeating patterns at every scale, petals following Fibonacci spirals in living color gradients, stamens made of smaller flower fractals, roots visible as branching algorithms, scientific precision meets natural beauty, Mandelbrot set rendered as a garden, ultra-high resolution for zoom exploration"
  },
  {
    id: 33,
    title: "Thunder God",
    image: "https://images.unsplash.com/photo-1429552077091-836152271555?q=80&w=1000&auto=format&fit=crop",
    creator: "mythmaker",
    verified: true,
    views: "312.7K",
    likes: "60.3K",
    uses: "27.1K",
    tags: ["mythology", "thunder", "power"],
    category: "Mythology",
    aspectRatio: "9:16",
    prompt: "Ancient thunder god of mixed mythologies towering above storm clouds, wielding lightning bolts that crack the sky into fragments, armor made of condensed thunderclouds with silver lining, eyes blazing with pure electrical discharge, eagles and ravens circling overhead, epic movie poster composition with divine scale, hyperdetailed digital painting"
  },
  {
    id: 34,
    title: "Glass Ocean",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1000&auto=format&fit=crop",
    creator: "glasswave",
    verified: true,
    views: "167.2K",
    likes: "32.4K",
    uses: "14.5K",
    tags: ["glass", "ocean", "frozen"],
    category: "Surrealism",
    aspectRatio: "16:9",
    prompt: "The moment an ocean wave crystallizes into glass, perfect transparency revealing fish frozen mid-swim, sunlight refracting through the liquid-solid transition creating rainbow caustics on the sandy beach, seashells half-embedded in the glass surface, photorealistic with impossible physics, golden hour lighting"
  },
  {
    id: 35,
    title: "Midnight Bloom",
    image: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?q=80&w=1000&auto=format&fit=crop",
    creator: "nightflora",
    verified: false,
    views: "123.8K",
    likes: "23.9K",
    uses: "10.7K",
    tags: ["flower", "night", "glow"],
    category: "Nature Art",
    aspectRatio: "3:4",
    prompt: "Rare midnight blooming flower that only opens under moonlight, petals transitioning from deep indigo at the edges to luminescent white at the center, pollen that glows like fireflies, surrounded by sleeping regular flowers for contrast, captured at the exact moment of full bloom, macro photography with ethereal blue moonlight"
  },
  {
    id: 36,
    title: "Painted Universe",
    image: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1000&auto=format&fit=crop",
    creator: "cosmicpainter",
    verified: true,
    views: "234.6K",
    likes: "45.3K",
    uses: "20.3K",
    tags: ["universe", "painting", "artistic"],
    category: "Space Art",
    aspectRatio: "1:1",
    prompt: "God's canvas - the universe revealed as an unfinished oil painting, areas of photorealistic space transitioning to visible brushstrokes at the edges, a giant hand holding a cosmic paintbrush adding new stars, paint tubes floating by labeled with element names, the line between reality and art dissolving, metaphysical masterpiece"
  },
  {
    id: 37,
    title: "Digital Koi",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
    creator: "digifish",
    verified: true,
    views: "156.9K",
    likes: "30.2K",
    uses: "13.6K",
    tags: ["koi", "digital", "water"],
    category: "Digital Art",
    aspectRatio: "4:5",
    prompt: "Massive koi fish swimming through streams of binary code and data particles instead of water, scales displaying scrolling matrix text, fins leaving trails of dissolving pixels, eyes containing loading spinners that never complete, traditional Japanese pond elements reconstructed as circuit boards, bridging ancient symbolism with digital age aesthetics"
  },
  {
    id: 38,
    title: "Aurora Guardian",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000&auto=format&fit=crop",
    creator: "auroraart",
    verified: false,
    views: "189.4K",
    likes: "36.7K",
    uses: "16.4K",
    tags: ["aurora", "guardian", "spirit"],
    category: "Fantasy",
    aspectRatio: "16:9",
    prompt: "Colossal spirit guardian manifesting within the aurora borealis, body composed of flowing Northern Lights in electric greens and magentas, ancient Scandinavian patterns glowing on its ethereal form, protecting a tiny village below with its cosmic presence, wolves howling on snow-covered peaks, epic fantasy landscape with scientifically accurate aurora physics"
  },
  {
    id: 39,
    title: "Candy Architecture",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop",
    creator: "candybuild",
    verified: true,
    views: "143.2K",
    likes: "27.6K",
    uses: "12.4K",
    tags: ["candy", "architecture", "surreal"],
    category: "Surrealism",
    aspectRatio: "1:1",
    prompt: "Impossible architecture built entirely from candy and confections, spiral staircases of twisted licorice, stained glass windows made of stretched hard candy in every color, gummy bear fountains, cotton candy clouds inside the atrium, everything structurally impossible but deliciously rendered, Willy Wonka meets Gaudi, warm bakery lighting"
  },
  {
    id: 40,
    title: "Time Keeper",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1000&auto=format&fit=crop",
    creator: "chronoart",
    verified: true,
    views: "278.5K",
    likes: "53.8K",
    uses: "24.2K",
    tags: ["time", "clock", "surreal"],
    category: "Surrealism",
    aspectRatio: "9:16",
    prompt: "Ancient being who maintains all of time's clocks, robes woven from clock hands and calendar pages, face constantly aging and de-aging in cycles, surrounded by floating timepieces from every era - sundials to atomic clocks, sand from hourglasses trailing like cosmic dust, standing in a space where past present and future visually overlap, Dalí persistence of memory evolved"
  }
];

export default function Discover() {
  const [displayedItems, setDisplayedItems] = useState<InspirationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_LOAD = 12;

  useEffect(() => {
    setDisplayedItems(allInspirations.slice(0, ITEMS_PER_LOAD));
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    
    const startIndex = page * ITEMS_PER_LOAD;
    const endIndex = startIndex + ITEMS_PER_LOAD;
    
    if (startIndex >= allInspirations.length) {
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const nextItems = allInspirations.slice(startIndex, endIndex);
      setDisplayedItems(prev => [...prev, ...nextItems]);
      setPage(prev => prev + 1);
      setIsLoading(false);
    }, 300);
  }, [page, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && displayedItems.length < allInspirations.length) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, displayedItems.length]);

  return (
    <div className="h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar className="hidden md:flex border-r border-border/50" />
      
      <main className="flex-1 flex flex-col relative h-full overflow-y-auto bg-[#F8F8F8] dark:bg-[#0A0A0B] text-[#18181B] dark:text-[#FAFAFA] pb-20 md:pb-0">
        
        {/* MASONRY GRID - No header */}
        <div className="px-4 md:px-8 lg:px-12 py-6 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-[#B94E30]" />
            <h2 className="text-xl font-semibold text-[#18181B] dark:text-[#FAFAFA]">Discover</h2>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#16A34A]/10 rounded-full ml-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
              </span>
              <span className="text-xs font-medium text-[#16A34A]">Live</span>
            </div>
            <div className="ml-auto text-sm text-[#71717A]">
              {displayedItems.length} of {allInspirations.length} designs
            </div>
          </div>

          {/* Masonry Layout using CSS Columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {displayedItems.map((item, index) => (
              <LazyMasonryCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isLoading && (
              <div className="flex items-center gap-3 text-[#71717A]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading more designs...</span>
              </div>
            )}
            {displayedItems.length >= allInspirations.length && (
              <div className="text-sm text-[#71717A]">
                You've seen all {allInspirations.length} designs
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
