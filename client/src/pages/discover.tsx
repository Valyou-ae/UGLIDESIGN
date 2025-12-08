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
    title: "Luxury Watch Product Shot",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    creator: "productpro",
    verified: true,
    views: "234.5K",
    likes: "45.2K",
    uses: "18.3K",
    tags: ["product", "luxury", "watch"],
    category: "Product",
    aspectRatio: "1:1",
    prompt: "Luxury Swiss timepiece floating on reflective black surface, dramatic side lighting creating golden highlights on brushed steel case, sapphire crystal catching prismatic light, leather strap with visible grain texture, commercial photography style, 8K resolution"
  },
  {
    id: 2,
    title: "Golden Hour Portrait",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
    creator: "portraitmaster",
    verified: true,
    views: "312.8K",
    likes: "58.7K",
    uses: "24.1K",
    tags: ["portrait", "golden hour", "natural"],
    category: "Portrait",
    aspectRatio: "4:5",
    prompt: "Intimate portrait of a woman bathed in warm golden hour sunlight, soft bokeh background of autumn leaves, natural skin texture with subtle frecles, wind-swept hair catching light, Hasselblad medium format quality, shallow depth of field f/1.4"
  },
  {
    id: 3,
    title: "Gourmet Burger Perfection",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
    creator: "foodartist",
    verified: true,
    views: "189.3K",
    likes: "37.6K",
    uses: "15.8K",
    tags: ["food", "burger", "gourmet"],
    category: "Food",
    aspectRatio: "1:1",
    prompt: "Towering gourmet burger with perfectly melted aged cheddar, crispy bacon, caramelized onions, fresh lettuce, and brioche bun with sesame seeds, dramatic dark background, food styling with visible steam and juice drips, commercial food photography lighting"
  },
  {
    id: 4,
    title: "Majestic Lion King",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1000&auto=format&fit=crop",
    creator: "wildlifeart",
    verified: true,
    views: "456.2K",
    likes: "89.4K",
    uses: "35.2K",
    tags: ["wildlife", "lion", "majestic"],
    category: "Wildlife",
    aspectRatio: "16:9",
    prompt: "Majestic male lion with full golden mane, intense amber eyes staring directly at camera, African savanna at golden hour, dust particles catching light, shallow depth of field isolating subject, National Geographic quality wildlife photography"
  },
  {
    id: 5,
    title: "Modern Architecture Marvel",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop",
    creator: "archidesign",
    verified: false,
    views: "178.9K",
    likes: "32.1K",
    uses: "13.7K",
    tags: ["architecture", "modern", "minimal"],
    category: "Architecture",
    aspectRatio: "9:16",
    prompt: "Stunning modern skyscraper with curved glass facade reflecting blue sky and clouds, geometric patterns created by window frames, shot from dramatic low angle, clean minimalist aesthetic, architectural photography with tilt-shift effect"
  },
  {
    id: 6,
    title: "Enchanted Forest Path",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop",
    creator: "naturelover",
    verified: true,
    views: "267.4K",
    likes: "51.8K",
    uses: "21.3K",
    tags: ["nature", "forest", "mystical"],
    category: "Landscape",
    aspectRatio: "3:4",
    prompt: "Mystical forest pathway covered in emerald moss, ancient trees with twisted branches forming natural cathedral, volumetric light rays piercing through canopy creating god rays, morning mist adding ethereal atmosphere, fantasy landscape photography"
  },
  {
    id: 7,
    title: "High Fashion Editorial",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    creator: "fashionista",
    verified: true,
    views: "345.6K",
    likes: "67.3K",
    uses: "28.9K",
    tags: ["fashion", "editorial", "elegant"],
    category: "Fashion",
    aspectRatio: "9:16",
    prompt: "High fashion editorial portrait, model wearing avant-garde couture gown in deep burgundy silk, dramatic studio lighting with sharp shadows, minimalist white background, Vogue magazine cover quality, sophisticated and elegant pose"
  },
  {
    id: 8,
    title: "Neon Tokyo Nights",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
    creator: "cityscape",
    verified: true,
    views: "298.7K",
    likes: "57.2K",
    uses: "23.6K",
    tags: ["cityscape", "neon", "tokyo"],
    category: "Urban",
    aspectRatio: "16:9",
    prompt: "Rain-soaked Tokyo street at night, neon signs reflecting on wet pavement in pink, blue, and purple, steam rising from street vents, silhouettes of pedestrians with umbrellas, cyberpunk atmosphere, cinematic color grading"
  },
  {
    id: 9,
    title: "Artisan Coffee Pour",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop",
    creator: "coffeeculture",
    verified: false,
    views: "156.3K",
    likes: "29.8K",
    uses: "12.4K",
    tags: ["coffee", "latte art", "cafe"],
    category: "Food",
    aspectRatio: "4:5",
    prompt: "Perfect latte art being poured, barista hands creating intricate rosetta pattern, warm cafe lighting, steam rising from ceramic cup, wooden counter with coffee beans scattered, shallow depth of field, cozy coffee shop atmosphere"
  },
  {
    id: 10,
    title: "Ethereal Butterfly Garden",
    image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1000&auto=format&fit=crop",
    creator: "macroworld",
    verified: true,
    views: "187.4K",
    likes: "36.5K",
    uses: "15.1K",
    tags: ["butterfly", "macro", "nature"],
    category: "Nature",
    aspectRatio: "1:1",
    prompt: "Monarch butterfly resting on purple lavender flower, extreme macro photography revealing wing scale details, morning dew droplets on petals, soft bokeh background with hint of other butterflies, natural sunlight creating warm glow"
  },
  {
    id: 11,
    title: "Minimalist Interior Design",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop",
    creator: "interiorpro",
    verified: true,
    views: "234.1K",
    likes: "45.6K",
    uses: "19.2K",
    tags: ["interior", "minimalist", "modern"],
    category: "Interior",
    aspectRatio: "16:9",
    prompt: "Scandinavian minimalist living room with clean lines, neutral color palette of whites and warm woods, statement arc floor lamp, plush cream sofa, large windows with natural light streaming in, architectural digest quality photography"
  },
  {
    id: 12,
    title: "Cosmic Galaxy Spiral",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
    creator: "spaceexplorer",
    verified: true,
    views: "378.9K",
    likes: "74.2K",
    uses: "31.5K",
    tags: ["space", "galaxy", "cosmic"],
    category: "Space",
    aspectRatio: "1:1",
    prompt: "Breathtaking spiral galaxy with vibrant purple and blue nebula clouds, millions of stars in various colors, cosmic dust lanes visible, central bright core, Hubble telescope quality, deep space astrophotography"
  },
  {
    id: 13,
    title: "Fresh Sushi Platter",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
    creator: "sushimaster",
    verified: true,
    views: "198.5K",
    likes: "38.9K",
    uses: "16.2K",
    tags: ["sushi", "japanese", "food"],
    category: "Food",
    aspectRatio: "16:9",
    prompt: "Exquisite omakase sushi platter on black slate, featuring otoro, uni, and ikura, each piece glistening with freshness, wasabi and pickled ginger artfully placed, chopsticks resting elegantly, soft diffused lighting, Michelin star presentation"
  },
  {
    id: 14,
    title: "Vintage Porsche 911",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop",
    creator: "autoart",
    verified: true,
    views: "287.3K",
    likes: "56.1K",
    uses: "23.4K",
    tags: ["car", "vintage", "porsche"],
    category: "Automotive",
    aspectRatio: "16:9",
    prompt: "Classic Porsche 911 in racing green, parked on coastal road at sunset, chrome details catching golden light, mountains in background, automotive photography with dramatic sky, nostalgic 1970s sports car aesthetic"
  },
  {
    id: 15,
    title: "Serene Japanese Garden",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
    creator: "zenmaster",
    verified: false,
    views: "212.6K",
    likes: "41.3K",
    uses: "17.1K",
    tags: ["garden", "japanese", "zen"],
    category: "Landscape",
    aspectRatio: "16:9",
    prompt: "Tranquil Japanese zen garden with perfectly raked gravel, ancient maple tree with vibrant red autumn leaves, traditional stone lantern, koi pond with reflections, morning mist adding serenity, peaceful contemplative atmosphere"
  },
  {
    id: 16,
    title: "Fluffy Corgi Portrait",
    image: "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?q=80&w=1000&auto=format&fit=crop",
    creator: "petlover",
    verified: true,
    views: "423.7K",
    likes: "82.5K",
    uses: "34.8K",
    tags: ["dog", "corgi", "cute"],
    category: "Pets",
    aspectRatio: "1:1",
    prompt: "Adorable Pembroke Welsh Corgi with perfect fluffy coat, happy expression with tongue out, sitting in flower meadow, soft natural lighting, sharp focus on eyes, professional pet photography, heartwarming and joyful mood"
  },
  {
    id: 17,
    title: "Tropical Paradise Beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    creator: "travelphoto",
    verified: true,
    views: "356.2K",
    likes: "69.8K",
    uses: "29.3K",
    tags: ["beach", "tropical", "paradise"],
    category: "Travel",
    aspectRatio: "16:9",
    prompt: "Pristine white sand beach with crystal clear turquoise water, palm trees swaying gently, dramatic sunset with orange and pink clouds, small wooden boat on shore, Maldives luxury resort vibes, travel photography"
  },
  {
    id: 18,
    title: "Abstract Fluid Art",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
    creator: "abstractart",
    verified: true,
    views: "198.4K",
    likes: "38.7K",
    uses: "16.1K",
    tags: ["abstract", "fluid", "colorful"],
    category: "Abstract",
    aspectRatio: "1:1",
    prompt: "Mesmerizing fluid art with swirling metallics and vibrant colors, gold, turquoise, and deep purple creating organic patterns, high gloss finish, macro view showing cellular patterns, contemporary abstract art piece"
  },
  {
    id: 19,
    title: "Cozy Reading Nook",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
    creator: "bookworm",
    verified: false,
    views: "167.3K",
    likes: "32.4K",
    uses: "13.5K",
    tags: ["books", "cozy", "reading"],
    category: "Lifestyle",
    aspectRatio: "4:5",
    prompt: "Inviting reading corner with floor-to-ceiling bookshelves, velvet armchair in forest green, warm lamp light, steaming cup of tea, rain visible through nearby window, hygge atmosphere, book lover's paradise"
  },
  {
    id: 20,
    title: "Elegant Perfume Bottle",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    creator: "luxurybrands",
    verified: true,
    views: "145.8K",
    likes: "28.3K",
    uses: "11.7K",
    tags: ["perfume", "luxury", "product"],
    category: "Product",
    aspectRatio: "3:4",
    prompt: "Luxury perfume bottle with faceted crystal design, golden cap reflecting studio lights, dramatic shadows on marble surface, water droplets suggesting freshness, high-end cosmetics advertising photography"
  },
  {
    id: 21,
    title: "Mountain Reflection Lake",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
    creator: "landscapepro",
    verified: true,
    views: "389.5K",
    likes: "76.2K",
    uses: "32.1K",
    tags: ["mountain", "lake", "reflection"],
    category: "Landscape",
    aspectRatio: "16:9",
    prompt: "Majestic snow-capped mountains perfectly reflected in still alpine lake, pink and orange sunrise colors, foreground wildflowers, mirror-like water surface, Swiss Alps grandeur, landscape photography masterpiece"
  },
  {
    id: 22,
    title: "Street Style Fashion",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    creator: "streetstyle",
    verified: true,
    views: "276.4K",
    likes: "53.9K",
    uses: "22.5K",
    tags: ["fashion", "street", "urban"],
    category: "Fashion",
    aspectRatio: "9:16",
    prompt: "Confident model in trendy streetwear, oversized vintage denim jacket, high-waisted pants, urban graffiti wall background, golden hour side lighting, candid walking pose, contemporary street fashion photography"
  },
  {
    id: 23,
    title: "Decadent Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
    creator: "dessertlover",
    verified: true,
    views: "234.7K",
    likes: "45.8K",
    uses: "19.1K",
    tags: ["cake", "chocolate", "dessert"],
    category: "Food",
    aspectRatio: "1:1",
    prompt: "Three-layer dark chocolate cake with glossy ganache dripping down sides, fresh raspberries on top, dusted with edible gold, rustic wooden cake stand, moody dark food photography, bakery advertisement quality"
  },
  {
    id: 24,
    title: "Wise Owl Portrait",
    image: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?q=80&w=1000&auto=format&fit=crop",
    creator: "birdphotog",
    verified: false,
    views: "178.9K",
    likes: "34.6K",
    uses: "14.3K",
    tags: ["owl", "wildlife", "portrait"],
    category: "Wildlife",
    aspectRatio: "4:5",
    prompt: "Great horned owl with piercing golden eyes, detailed feather texture visible, dark forest background with bokeh, dramatic lighting highlighting facial features, wise and mysterious expression, wildlife portrait photography"
  },
  {
    id: 25,
    title: "Modern Sneaker Design",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    creator: "sneakerhead",
    verified: true,
    views: "312.5K",
    likes: "61.3K",
    uses: "25.7K",
    tags: ["sneakers", "product", "modern"],
    category: "Product",
    aspectRatio: "16:9",
    prompt: "Futuristic running sneaker floating in mid-air, dynamic angle showing sole design, vibrant red colorway with white accents, gradient background matching shoe colors, commercial product photography with motion blur"
  },
  {
    id: 26,
    title: "Aurora Borealis Magic",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000&auto=format&fit=crop",
    creator: "aurorahunter",
    verified: true,
    views: "423.6K",
    likes: "82.9K",
    uses: "35.1K",
    tags: ["aurora", "night sky", "nature"],
    category: "Nature",
    aspectRatio: "16:9",
    prompt: "Spectacular northern lights dancing across Arctic sky, vivid green and purple aurora curtains, snow-covered landscape below, starry night with Milky Way visible, long exposure photography capturing light movement"
  },
  {
    id: 27,
    title: "Vintage Film Camera",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop",
    creator: "vintagecollector",
    verified: false,
    views: "143.2K",
    likes: "27.8K",
    uses: "11.5K",
    tags: ["camera", "vintage", "retro"],
    category: "Product",
    aspectRatio: "1:1",
    prompt: "Classic Leica film camera on aged leather surface, brass details catching warm light, worn patina showing years of use, shallow depth of field, nostalgic still life photography, collector's item showcase"
  },
  {
    id: 28,
    title: "Colorful Hot Air Balloons",
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000&auto=format&fit=crop",
    creator: "adventurer",
    verified: true,
    views: "267.8K",
    likes: "52.3K",
    uses: "21.9K",
    tags: ["balloons", "colorful", "sky"],
    category: "Travel",
    aspectRatio: "3:4",
    prompt: "Dozens of colorful hot air balloons rising at dawn over Cappadocia fairy chimneys, soft pink and orange sunrise colors, misty valleys below, dream-like atmosphere, travel photography bucket list moment"
  },
  {
    id: 29,
    title: "Artisan Sourdough Bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    creator: "bakeryart",
    verified: true,
    views: "156.7K",
    likes: "30.4K",
    uses: "12.6K",
    tags: ["bread", "artisan", "bakery"],
    category: "Food",
    aspectRatio: "1:1",
    prompt: "Rustic sourdough loaf with perfect ear and crust scoring, flour dusting, warm interior crumb visible in cross-section, wooden cutting board, wheat stalks as props, artisan bakery photography with natural window light"
  },
  {
    id: 30,
    title: "Cyberpunk City Portrait",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
    creator: "cyberpunk",
    verified: true,
    views: "345.9K",
    likes: "67.8K",
    uses: "28.4K",
    tags: ["cyberpunk", "portrait", "neon"],
    category: "Portrait",
    aspectRatio: "4:5",
    prompt: "Cyberpunk portrait with neon pink and blue lighting on face, futuristic sunglasses reflecting city lights, rain droplets on skin, holographic jacket, dark urban background with neon signs, cinematic sci-fi aesthetic"
  },
  {
    id: 31,
    title: "Macro Water Droplet",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop",
    creator: "macrolens",
    verified: false,
    views: "134.5K",
    likes: "26.1K",
    uses: "10.8K",
    tags: ["macro", "water", "nature"],
    category: "Nature",
    aspectRatio: "16:9",
    prompt: "Perfect water droplet on green leaf surface, entire landscape reflected and inverted inside the drop, morning dew atmosphere, extreme macro photography with focus stacking, nature's tiny world revealed"
  },
  {
    id: 32,
    title: "Elegant Rose Bouquet",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop",
    creator: "floralart",
    verified: true,
    views: "189.3K",
    likes: "36.9K",
    uses: "15.3K",
    tags: ["flowers", "roses", "elegant"],
    category: "Floral",
    aspectRatio: "4:5",
    prompt: "Luxurious bouquet of garden roses in soft pink and cream, romantic lighting with gentle shadows, vintage vase on marble surface, scattered petals, fine art floral photography with painterly quality"
  },
  {
    id: 33,
    title: "Industrial Loft Space",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop",
    creator: "architech",
    verified: true,
    views: "234.6K",
    likes: "45.7K",
    uses: "19.1K",
    tags: ["interior", "loft", "industrial"],
    category: "Interior",
    aspectRatio: "16:9",
    prompt: "Stunning industrial loft conversion with exposed brick walls, steel beam ceiling, large factory windows, mix of vintage and modern furniture, warm Edison bulb lighting, urban chic living space photography"
  },
  {
    id: 34,
    title: "Sleeping Kitten Cuteness",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop",
    creator: "catlover",
    verified: true,
    views: "567.8K",
    likes: "112.4K",
    uses: "47.2K",
    tags: ["cat", "kitten", "cute"],
    category: "Pets",
    aspectRatio: "1:1",
    prompt: "Tiny orange tabby kitten curled up sleeping on fluffy white blanket, paws tucked under chin, soft natural window light, peaceful expression, extreme cuteness, heartwarming pet photography"
  },
  {
    id: 35,
    title: "Dramatic Storm Clouds",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000&auto=format&fit=crop",
    creator: "stormphotog",
    verified: false,
    views: "198.4K",
    likes: "38.6K",
    uses: "16.1K",
    tags: ["storm", "dramatic", "sky"],
    category: "Nature",
    aspectRatio: "16:9",
    prompt: "Dramatic supercell thunderstorm with swirling cloud formations, lightning bolt illuminating dark purple sky, vast prairie landscape below, nature's raw power captured, storm chaser photography"
  },
  {
    id: 36,
    title: "Luxury Diamond Ring",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    creator: "jewelryart",
    verified: true,
    views: "178.2K",
    likes: "34.5K",
    uses: "14.3K",
    tags: ["jewelry", "diamond", "luxury"],
    category: "Product",
    aspectRatio: "1:1",
    prompt: "Exquisite solitaire diamond engagement ring, brilliant cut stone catching light with fire and sparkle, platinum band on black velvet, dramatic spot lighting, luxury jewelry advertising photography"
  },
  {
    id: 37,
    title: "Venice Canal Romance",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000&auto=format&fit=crop",
    creator: "travelroma",
    verified: true,
    views: "287.6K",
    likes: "56.3K",
    uses: "23.6K",
    tags: ["venice", "travel", "romantic"],
    category: "Travel",
    aspectRatio: "3:4",
    prompt: "Gondola gliding through Venice canal at golden hour, ancient buildings with weathered facades reflecting in water, gondolier in striped shirt, fairy lights beginning to glow, romantic Italian travel photography"
  },
  {
    id: 38,
    title: "Geometric Abstract Pattern",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop",
    creator: "patternpro",
    verified: false,
    views: "145.7K",
    likes: "28.3K",
    uses: "11.8K",
    tags: ["geometric", "pattern", "abstract"],
    category: "Abstract",
    aspectRatio: "1:1",
    prompt: "Bold geometric pattern with overlapping circles and triangles, gradient colors from coral to teal, perfect symmetry, modern graphic design, seamless wallpaper texture, contemporary abstract art"
  },
  {
    id: 39,
    title: "Healthy Acai Bowl",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1000&auto=format&fit=crop",
    creator: "healthyfood",
    verified: true,
    views: "167.9K",
    likes: "32.6K",
    uses: "13.6K",
    tags: ["acai", "healthy", "food"],
    category: "Food",
    aspectRatio: "1:1",
    prompt: "Vibrant purple acai smoothie bowl topped with fresh berries, granola, coconut flakes, and chia seeds arranged in beautiful pattern, white ceramic bowl, bright natural light, wellness food photography"
  },
  {
    id: 40,
    title: "Misty Mountain Sunrise",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
    creator: "mountaineer",
    verified: true,
    views: "398.5K",
    likes: "78.2K",
    uses: "32.8K",
    tags: ["mountain", "sunrise", "misty"],
    category: "Landscape",
    aspectRatio: "16:9",
    prompt: "Breathtaking mountain range emerging from sea of clouds at sunrise, first golden rays hitting snow-capped peaks, layers of misty valleys, epic scale and grandeur, fine art landscape photography masterpiece"
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

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {displayedItems.map((item, index) => (
              <LazyMasonryCard key={item.id} item={item} index={index} />
            ))}
          </div>

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
