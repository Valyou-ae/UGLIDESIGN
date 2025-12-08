import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Compass, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Clock, 
  Flame, 
  Palette, 
  Type, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Bookmark, 
  BadgeCheck, 
  Eye, 
  Heart, 
  Wand2
} from "lucide-react";
import { motion } from "framer-motion";
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
  aspectRatio: "tall" | "wide" | "square" | "portrait";
}

function LazyMasonryCard({ item, index }: { item: InspirationItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const aspectClasses = {
    tall: "aspect-[3/5]",
    wide: "aspect-[4/3]",
    square: "aspect-square",
    portrait: "aspect-[3/4]"
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1, ease: "easeOut" }}
      className="break-inside-avoid mb-5"
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 left-3 bg-gradient-to-br from-[#B94E30] to-[#8B3A24] px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white shadow-lg">
            {item.category}
          </div>

          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B94E30] text-white">
            <Bookmark className="h-4 w-4" />
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-semibold text-white truncate drop-shadow-lg">{item.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#B94E30] to-[#E3B436]" />
              <span className="text-xs text-white/80">@{item.creator}</span>
              {item.verified && <BadgeCheck className="h-3 w-3 text-[#E3B436]" />}
            </div>
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

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState("Trending");

  const filters = [
    { icon: Sparkles, label: "Trending" },
    { icon: Clock, label: "New This Week" },
    { icon: Flame, label: "Most Popular" },
    { icon: Palette, label: "Styles" },
    { icon: Type, label: "Prompts" },
    { icon: Lightbulb, label: "Techniques" },
    { icon: Users, label: "Community" }
  ];

  const inspirations: InspirationItem[] = [
    {
      id: 1,
      title: "Ethereal Glow",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
      creator: "creativemind",
      verified: true,
      views: "45.2K",
      likes: "8.9K",
      uses: "3.2K",
      tags: ["portrait", "ethereal", "soft light"],
      category: "Style",
      aspectRatio: "tall"
    },
    {
      id: 2,
      title: "Neon Dystopia",
      image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?q=80&w=1000&auto=format&fit=crop",
      creator: "futuredesign",
      verified: false,
      views: "38.1K",
      likes: "7.2K",
      uses: "2.8K",
      tags: ["cyberpunk", "neon", "city"],
      category: "Style",
      aspectRatio: "wide"
    },
    {
      id: 3,
      title: "Liquid Dreams",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
      creator: "artflow",
      verified: false,
      views: "31.4K",
      likes: "5.8K",
      uses: "2.1K",
      tags: ["watercolor", "abstract", "flowing"],
      category: "Technique",
      aspectRatio: "square"
    },
    {
      id: 4,
      title: "Clean Commerce",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
      creator: "minimalstudio",
      verified: true,
      views: "28.9K",
      likes: "4.5K",
      uses: "1.9K",
      tags: ["minimal", "product", "clean"],
      category: "Prompt",
      aspectRatio: "portrait"
    },
    {
      id: 5,
      title: "Fantasy Realms",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop",
      creator: "dragonmaster",
      verified: true,
      views: "25.6K",
      likes: "4.1K",
      uses: "1.5K",
      tags: ["fantasy", "dragon", "epic"],
      category: "Style",
      aspectRatio: "tall"
    },
    {
      id: 6,
      title: "Retro Wave",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
      creator: "80slover",
      verified: false,
      views: "22.1K",
      likes: "3.8K",
      uses: "1.2K",
      tags: ["retro", "synthwave", "80s"],
      category: "Style",
      aspectRatio: "wide"
    },
    {
      id: 7,
      title: "Paper Cutout",
      image: "https://images.unsplash.com/photo-1516051662668-f3b5f6b9a131?q=80&w=1000&auto=format&fit=crop",
      creator: "crafty",
      verified: false,
      views: "19.8K",
      likes: "3.2K",
      uses: "1.1K",
      tags: ["paper", "craft", "cutout"],
      category: "Technique",
      aspectRatio: "portrait"
    },
    {
      id: 8,
      title: "Isometric Worlds",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
      creator: "iso_king",
      verified: true,
      views: "18.5K",
      likes: "2.9K",
      uses: "950",
      tags: ["isometric", "3d", "miniature"],
      category: "Style",
      aspectRatio: "square"
    },
    {
      id: 9,
      title: "Golden Hour Portrait",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      creator: "sunsetsnap",
      verified: true,
      views: "42.3K",
      likes: "9.1K",
      uses: "4.2K",
      tags: ["portrait", "golden hour", "warm"],
      category: "Style",
      aspectRatio: "tall"
    },
    {
      id: 10,
      title: "Abstract Geometry",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop",
      creator: "shapecraft",
      verified: false,
      views: "15.7K",
      likes: "2.4K",
      uses: "890",
      tags: ["abstract", "geometry", "colorful"],
      category: "Technique",
      aspectRatio: "square"
    },
    {
      id: 11,
      title: "Urban Architecture",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop",
      creator: "cityscape",
      verified: true,
      views: "21.4K",
      likes: "3.6K",
      uses: "1.3K",
      tags: ["architecture", "urban", "modern"],
      category: "Style",
      aspectRatio: "tall"
    },
    {
      id: 12,
      title: "Macro Nature",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1000&auto=format&fit=crop",
      creator: "naturelens",
      verified: false,
      views: "12.8K",
      likes: "2.1K",
      uses: "780",
      tags: ["macro", "nature", "details"],
      category: "Technique",
      aspectRatio: "portrait"
    },
    {
      id: 13,
      title: "Moody Landscape",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
      creator: "wanderlust",
      verified: true,
      views: "35.2K",
      likes: "6.8K",
      uses: "2.9K",
      tags: ["landscape", "moody", "mountains"],
      category: "Style",
      aspectRatio: "wide"
    },
    {
      id: 14,
      title: "Cinematic Portrait",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      creator: "filmmaker",
      verified: false,
      views: "27.9K",
      likes: "5.2K",
      uses: "1.8K",
      tags: ["cinematic", "portrait", "dramatic"],
      category: "Style",
      aspectRatio: "portrait"
    },
    {
      id: 15,
      title: "Minimalist Design",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      creator: "simplicity",
      verified: true,
      views: "19.3K",
      likes: "3.4K",
      uses: "1.2K",
      tags: ["minimal", "clean", "simple"],
      category: "Prompt",
      aspectRatio: "square"
    },
    {
      id: 16,
      title: "Street Photography",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop",
      creator: "streetwise",
      verified: false,
      views: "23.6K",
      likes: "4.1K",
      uses: "1.5K",
      tags: ["street", "urban", "candid"],
      category: "Style",
      aspectRatio: "tall"
    }
  ];

  return (
    <div className="h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar className="hidden md:flex border-r border-border/50" />
      
      <main className="flex-1 flex flex-col relative h-full overflow-y-auto bg-[#F8F8F8] dark:bg-[#0A0A0B] text-[#18181B] dark:text-[#FAFAFA] pb-20 md:pb-0">
        
        {/* HERO SECTION */}
        <div className="relative h-[320px] md:h-[360px] bg-[#0A0A0B] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0A0A0B] via-[#1A1A2E] to-[#16132D]" />
            
            <motion.div 
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[100px] -left-[100px] w-[400px] h-[400px] bg-[#B94E30] rounded-full opacity-20 blur-[100px]" 
            />
            <motion.div 
              animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#E3B436] rounded-full opacity-15 blur-[80px]" 
            />
            
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-3">
              <Compass className="h-7 w-7 md:h-8 md:w-8 text-transparent bg-clip-text bg-gradient-to-br from-[#B94E30] to-[#E3B436]" stroke="url(#compass-gradient)" />
              <svg width="0" height="0">
                <linearGradient id="compass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#B94E30" offset="0%" />
                  <stop stopColor="#E3B436" offset="100%" />
                </linearGradient>
              </svg>
              <h1 className="text-3xl md:text-[40px] font-bold text-[#FAFAFA]">Discover</h1>
            </div>
            
            <p className="text-base md:text-lg text-[#A1A1AA] max-w-xl">
              Explore trending styles and creative inspiration from the community.
            </p>

            <div className="mt-6 max-w-[600px] w-full">
              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1 focus-within:bg-white/15 focus-within:border-white/20 transition-all">
                <Search className="h-5 w-5 text-[#71717A] ml-4" />
                <input 
                  type="text" 
                  placeholder="Search styles, prompts, techniques..."
                  className="flex-1 bg-transparent border-none p-3 text-base text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:ring-0"
                  data-testid="input-discover-search"
                />
                <button className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors mr-1" data-testid="button-discover-filters">
                  <SlidersHorizontal className="h-5 w-5 text-[#FAFAFA]" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  data-testid={`filter-${filter.label.toLowerCase().replace(/\s/g, '-')}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all backdrop-blur-md border whitespace-nowrap",
                    activeFilter === filter.label
                      ? "bg-gradient-to-r from-[#B94E30] to-[#8B3A24] border-transparent text-white shadow-lg shadow-[#B94E30]/20"
                      : "bg-white/10 border-white/10 text-[#A1A1AA] hover:bg-white/20 hover:text-[#FAFAFA]"
                  )}
                >
                  <filter.icon className="h-3.5 w-3.5" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MASONRY GRID */}
        <div className="px-4 md:px-8 lg:px-12 py-8 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-[#B94E30]" />
            <h2 className="text-xl font-semibold text-[#18181B] dark:text-[#FAFAFA]">Trending Now</h2>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#16A34A]/10 rounded-full ml-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
              </span>
              <span className="text-xs font-medium text-[#16A34A]">Live</span>
            </div>
          </div>

          {/* Masonry Layout using CSS Columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {inspirations.map((item, index) => (
              <LazyMasonryCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
