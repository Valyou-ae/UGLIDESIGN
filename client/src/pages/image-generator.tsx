import { useState, useRef, useEffect } from "react";
import { 
  Wand2, 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  MoreHorizontal, 
  Maximize2, 
  X, 
  Zap, 
  Clock, 
  Layers, 
  Settings,
  ChevronDown,
  Paperclip,
  Sliders,
  Check,
  Info,
  Trash2,
  Copy,
  RefreshCw,
  Search,
  Star,
  Edit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Import generated images for the gallery
import cyberpunkCity from "@assets/generated_images/futuristic_cyberpunk_city_street_at_night_with_neon_lights_and_rain.png";
import oilPainting from "@assets/generated_images/oil_painting_portrait_of_a_young_woman_with_flowers_in_her_hair.png";
import fantasyLandscape from "@assets/generated_images/epic_fantasy_landscape_with_mountains_and_a_dragon_flying.png";
import scifiSpaceship from "@assets/generated_images/sci-fi_spaceship_landing_on_an_alien_planet_with_two_moons.png";

// Types
type GenerationStatus = "idle" | "generating" | "complete";

type GeneratedImage = {
  id: string;
  src: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  timestamp: string;
  isNew?: boolean;
};

type Agent = {
  id: number;
  name: string;
  status: "idle" | "working" | "complete" | "error";
  message: string;
  icon: any;
};

const AGENTS: Agent[] = [
  { id: 1, name: "Text Sentinel", status: "idle", message: "Checking spelling...", icon: "🔤" },
  { id: 2, name: "Style Architect", status: "idle", message: "Enhancing style...", icon: "🎨" },
  { id: 3, name: "Visual Synthesizer", status: "idle", message: "Generating image...", icon: "🖼️" },
  { id: 4, name: "Master Refiner", status: "idle", message: "Refining details...", icon: "⚙️" },
  { id: 5, name: "Quality Analyst", status: "idle", message: "Analyzing quality...", icon: "🧠" },
];

const SAMPLE_PROMPTS = [
  "🌆 Cyberpunk city",
  "🎨 Oil painting portrait",
  "🏔️ Fantasy landscape",
  "🚀 Sci-fi spaceship"
];

const STYLE_PRESETS = [
  { name: "Auto ✨", id: "auto" },
  { name: "Photorealistic 📸", id: "photo" },
  { name: "Cinematic 🎬", id: "cinematic" },
  { name: "Anime/Manga 🎌", id: "anime" },
  { name: "Oil Painting 🖼️", id: "oil" },
  { name: "Watercolor 🎨", id: "watercolor" },
  { name: "Digital Art 💻", id: "digital" },
  { name: "Minimalist ⚪", id: "minimal" },
  { name: "Retrowave 🌆", id: "retro" },
  { name: "Dark Fantasy ⚔️", id: "fantasy" },
  { name: "Pop Art 🎪", id: "pop" },
  { name: "Isometric 3D 📦", id: "iso" },
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [generations, setGenerations] = useState<GeneratedImage[]>([]);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [progress, setProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [settings, setSettings] = useState({
    style: "auto",
    quality: "standard",
    aspectRatio: "1:1",
    variations: "4",
    refiner: false,
  });
  
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setStatus("generating");
    setProgress(0);
    setAgents(AGENTS.map(a => ({ ...a, status: "idle" })));

    // Simulation pipeline
    let currentAgentIndex = 0;
    const totalDuration = 5000; // 5 seconds total
    const intervalTime = totalDuration / 100;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeGeneration();
          return 100;
        }
        return prev + 1;
      });

      // Update agents based on progress
      const stage = Math.floor((progress / 100) * 5);
      if (stage !== currentAgentIndex && stage < 5) {
        setAgents(prev => prev.map((a, i) => {
          if (i < stage) return { ...a, status: "complete" };
          if (i === stage) return { ...a, status: "working" };
          return { ...a, status: "idle" };
        }));
        currentAgentIndex = stage;
      }
    }, intervalTime);
  };

  const completeGeneration = () => {
    setStatus("complete");
    setAgents(prev => prev.map(a => ({ ...a, status: "complete" })));
    
    // Add new generation
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      src: cyberpunkCity, // Just using one as example result
      prompt: prompt,
      style: settings.style,
      aspectRatio: settings.aspectRatio,
      timestamp: "Just now",
      isNew: true
    };
    
    setGenerations(prev => [newImage, ...prev]);
    
    toast({
      title: "Image Generated!",
      description: "Your creation is ready.",
      className: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-900/50 dark:text-purple-400",
    });

    // Reset agents after delay
    setTimeout(() => {
      setStatus("idle");
      setAgents(AGENTS.map(a => ({ ...a, status: "idle" })));
      setProgress(0);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Initialize with some sample images if empty
  useEffect(() => {
    if (generations.length === 0) {
      setGenerations([
        {
          id: "1",
          src: oilPainting,
          prompt: "Oil painting portrait of a young woman with flowers in her hair",
          style: "oil",
          aspectRatio: "1:1",
          timestamp: "2 hours ago"
        },
        {
          id: "2",
          src: fantasyLandscape,
          prompt: "Epic fantasy landscape with mountains and a dragon flying",
          style: "fantasy",
          aspectRatio: "16:9",
          timestamp: "5 hours ago"
        },
        {
          id: "3",
          src: scifiSpaceship,
          prompt: "Sci-fi spaceship landing on an alien planet with two moons",
          style: "scifi",
          aspectRatio: "16:9",
          timestamp: "1 day ago"
        }
      ]);
    }
  }, []);

  return (
    <div className="h-screen bg-background flex font-sans text-foreground overflow-hidden">
      {/* Sidebar is handled by layout component, but we'll just render main here */}
      <Sidebar className="hidden md:flex" />
      
      <main className="flex-1 flex flex-col relative h-full bg-[#09090B] dark:bg-[#09090B] bg-zinc-50 text-foreground">
        
        {/* Credits Float */}
        <div className="absolute top-6 right-6 z-10 bg-zinc-800/80 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/10">
          <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold">1,523 credits</span>
        </div>

        {/* Top Section: Generation Gallery */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 scroll-smooth">
          
          {generations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 mb-8 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                What will you imagine?
              </h1>
              <p className="text-zinc-400 text-lg mb-8">
                Describe anything and watch AI bring it to life
              </p>
              <p className="text-zinc-500 italic text-sm mb-8">
                Try: 'A cozy coffee shop in Tokyo at night, rain on windows, warm lighting, anime style'
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {SAMPLE_PROMPTS.map(p => (
                  <button 
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 rounded-full text-sm text-zinc-300 transition-all hover:scale-105"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 mx-auto max-w-[1600px]">
              {/* Active Generation Card */}
              {status === "generating" && (
                <div className="break-inside-avoid mb-4 relative group rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20">
                  <div className="aspect-square bg-zinc-900 flex flex-col items-center justify-center relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse" />
                    
                    {/* Active Agents View */}
                    <div className="relative z-10 w-full">
                       <div className="flex justify-between items-center mb-8 px-2">
                         {agents.map((agent, i) => (
                           <div key={agent.id} className="flex flex-col items-center gap-2 relative">
                             {i < agents.length - 1 && (
                               <div className={cn(
                                 "absolute top-4 left-1/2 w-full h-[2px]",
                                 agent.status === "complete" ? "bg-green-500" : "bg-zinc-700"
                               )} />
                             )}
                             <div className={cn(
                               "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                               agent.status === "working" ? "bg-purple-600 scale-110 shadow-lg shadow-purple-500/50" : 
                               agent.status === "complete" ? "bg-green-600" : "bg-zinc-700 text-zinc-500"
                             )}>
                               {agent.status === "complete" ? <Check className="h-4 w-4 text-white" /> : <span className="text-xs">{agent.icon}</span>}
                             </div>
                           </div>
                         ))}
                       </div>
                       
                       <div className="text-center space-y-2">
                         <h3 className="font-bold text-white text-lg">
                           {agents.find(a => a.status === "working")?.name || "Initializing..."}
                         </h3>
                         <p className="text-purple-300 text-sm animate-pulse">
                           {agents.find(a => a.status === "working")?.message}
                         </p>
                       </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                      <motion.div 
                        className="h-full bg-purple-500"
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Result Gallery */}
              {generations.map((gen) => (
                <div 
                  key={gen.id}
                  onClick={() => setSelectedImage(gen)}
                  className="break-inside-avoid mb-4 relative group rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 hover:shadow-2xl hover:shadow-black/50 transition-all hover:scale-[1.02]"
                >
                  <img src={gen.src} alt={gen.prompt} className="w-full h-auto object-cover" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {gen.style !== "auto" && (
                      <Badge className="bg-black/40 backdrop-blur-md border-white/10 text-white text-[10px] hover:bg-black/60">
                        {STYLE_PRESETS.find(s => s.id === gen.style)?.name.split(' ')[0]}
                      </Badge>
                    )}
                    <Badge className="bg-purple-500/80 backdrop-blur-md border-transparent text-white text-[10px]">
                      Premium 💎
                    </Badge>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                    <p className="text-white text-xs line-clamp-2 mb-3 font-medium">{gen.prompt}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md ml-auto">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section: Prompt Bar */}
        <div className="sticky bottom-0 left-0 right-0 p-6 md:px-10 md:pb-8 bg-gradient-to-t from-[#09090B] via-[#09090B] to-transparent z-20">
          
          {/* Settings Panel (Slide Up) */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                className="bg-[#18181B] border border-white/10 rounded-t-2xl mb-4 overflow-hidden shadow-2xl"
              >
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-purple-500" />
                      Generation Settings
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)} className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Style Column */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {STYLE_PRESETS.slice(0, 8).map(style => (
                          <button
                            key={style.id}
                            onClick={() => setSettings({...settings, style: style.id})}
                            className={cn(
                              "text-xs text-left px-3 py-2 rounded-lg border transition-all",
                              settings.style === style.id 
                                ? "bg-purple-500/20 border-purple-500 text-white" 
                                : "bg-zinc-800/50 border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            )}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality & Ratio Column */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quality</label>
                        <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-white/5">
                          {["Draft", "Standard", "Premium"].map(q => (
                            <button
                              key={q}
                              onClick={() => setSettings({...settings, quality: q.toLowerCase()})}
                              className={cn(
                                "flex-1 text-xs py-1.5 rounded-md transition-all font-medium",
                                settings.quality === q.toLowerCase()
                                  ? "bg-zinc-700 text-white shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-300"
                              )}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Aspect Ratio</label>
                        <div className="flex gap-2">
                          {[
                            { id: "1:1", label: "Square", icon: "⬜" },
                            { id: "16:9", label: "Landscape", icon: "🖼️" },
                            { id: "9:16", label: "Portrait", icon: "📱" },
                          ].map(r => (
                            <TooltipProvider key={r.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => setSettings({...settings, aspectRatio: r.id})}
                                    className={cn(
                                      "h-10 w-10 flex items-center justify-center rounded-lg border transition-all text-lg",
                                      settings.aspectRatio === r.id
                                        ? "bg-purple-500/20 border-purple-500 text-white"
                                        : "bg-zinc-800/50 border-transparent text-zinc-400 hover:bg-zinc-800"
                                    )}
                                  >
                                    {r.icon}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent><p>{r.label} ({r.id})</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Advanced Column */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Variations</label>
                        <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-white/5">
                          {["1", "2", "4"].map(v => (
                            <button
                              key={v}
                              onClick={() => setSettings({...settings, variations: v})}
                              className={cn(
                                "flex-1 text-xs py-1.5 rounded-md transition-all font-medium",
                                settings.variations === v
                                  ? "bg-zinc-700 text-white shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-300"
                              )}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg border border-white/5">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium text-white">Master Refiner</label>
                          <p className="text-xs text-zinc-500">Enhance details (slower)</p>
                        </div>
                        <Switch 
                          checked={settings.refiner}
                          onCheckedChange={(c) => setSettings({...settings, refiner: c})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt Bar */}
          <div className={cn(
            "bg-[#27272A] border transition-all duration-200 rounded-[20px] p-1.5 pl-3 flex items-end gap-2 shadow-2xl relative z-30",
            prompt.trim().length > 0 ? "border-purple-500/50 ring-1 ring-purple-500/20" : "border-[#3F3F46]"
          )}>
            
            {/* Left: Attach */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-zinc-400 hover:bg-zinc-700 hover:text-white mb-0.5">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Add reference image</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Center: Input */}
            <div className="flex-1 min-h-[44px] py-2.5">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What will you imagine?"
                className="w-full bg-transparent border-0 focus:ring-0 p-0 text-[15px] text-white placeholder:text-zinc-500 resize-none max-h-[120px] leading-relaxed"
                rows={1}
              />
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowSettings(!showSettings)}
                      className={cn(
                        "h-10 w-10 rounded-xl transition-colors",
                        showSettings ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
                      )}
                    >
                      <Sliders className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Generation Settings</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="hidden sm:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 px-3 rounded-xl text-zinc-400 hover:bg-zinc-700 hover:text-white font-medium text-xs gap-1">
                      V5 <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32 bg-[#18181B] border-zinc-800 text-zinc-200">
                    <DropdownMenuItem className="text-xs">V5 (Latest)</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">V4</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Niji (Anime)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={status === "generating" || !prompt.trim()}
                className={cn(
                  "h-10 rounded-xl font-bold transition-all duration-300",
                  status === "generating" 
                    ? "w-10 px-0 bg-zinc-700 text-zinc-400" 
                    : "px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white shadow-lg shadow-purple-600/20"
                )}
              >
                {status === "generating" ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Imagine</span>
                    <Wand2 className="h-4 w-4 sm:ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Lightbox / Detail Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
              onClick={() => setSelectedImage(null)}
            >
              <div 
                className="w-full max-w-7xl h-[90vh] bg-[#09090B] rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Left: Image */}
                <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbC1vcGFjaXR5PSIwLjEiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzMzIi8+PC9zdmc+')] bg-repeat flex items-center justify-center p-4 md:p-10 relative group">
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.prompt} 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
                  />
                  
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full bg-black/50 text-white border-0 hover:bg-black/70">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-[400px] bg-[#18181B] border-l border-white/10 flex flex-col">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white">Image Details</h3>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)} className="text-zinc-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 flex flex-col h-16 gap-1">
                        <Download className="h-5 w-5" />
                        <span className="text-[10px]">Download</span>
                      </Button>
                      <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 flex flex-col h-16 gap-1">
                        <RefreshCw className="h-5 w-5" />
                        <span className="text-[10px]">Variations</span>
                      </Button>
                      <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 flex flex-col h-16 gap-1">
                        <Edit className="h-5 w-5" />
                        <span className="text-[10px]">Edit</span>
                      </Button>
                      <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 flex flex-col h-16 gap-1">
                        <Star className="h-5 w-5" />
                        <span className="text-[10px]">Favorite</span>
                      </Button>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Prompt</label>
                      <div className="bg-zinc-900 rounded-lg p-4 text-sm text-zinc-200 leading-relaxed border border-white/5 group relative">
                        {selectedImage.prompt}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2 h-6 w-6 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                             navigator.clipboard.writeText(selectedImage.prompt);
                             toast({ title: "Copied to clipboard" });
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Style</label>
                        <p className="text-sm text-white font-medium capitalize">{selectedImage.style}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Ratio</label>
                        <p className="text-sm text-white font-medium">{selectedImage.aspectRatio}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Created</label>
                        <p className="text-sm text-white font-medium">{selectedImage.timestamp}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Model</label>
                        <p className="text-sm text-white font-medium">V5.2</p>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-4 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-3">
                         <Sparkles className="h-4 w-4 text-purple-400" />
                         <span className="text-sm font-bold text-purple-100">AI Analysis</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-purple-200/70">Composition Score</span>
                          <span className="text-white font-bold">9.2/10</span>
                        </div>
                        <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 w-[92%]" />
                        </div>
                        <p className="text-xs text-purple-200/70 mt-2 italic">
                          "Excellent use of lighting and contrast. The composition follows the rule of thirds."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/10 bg-zinc-900/50">
                    <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
                      Use This Prompt
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
