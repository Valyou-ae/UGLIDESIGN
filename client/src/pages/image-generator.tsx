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
  SlidersHorizontal,
  Check,
  Info,
  Trash2,
  Copy,
  RefreshCw,
  Search,
  Star,
  Edit,
  Keyboard,
  BookOpen,
  ImagePlus,
  Camera,
  Clapperboard,
  Tv,
  Palette,
  Droplets,
  Monitor,
  Circle,
  Sunset,
  Sword,
  Shapes,
  Box,
  Pencil,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  BrainCircuit,
  Target,
  Bot,
  Crosshair,
  Sun,
  Moon
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
  activeColor: string;
};

const AGENTS: Agent[] = [
  { id: 1, name: "Text Sentinel", status: "idle", message: "Checking spelling...", icon: Bot, activeColor: "#3B82F6" },
  { id: 2, name: "Style Architect", status: "idle", message: "Enhancing style...", icon: Sparkles, activeColor: "#8B5CF6" },
  { id: 3, name: "Visual Synthesizer", status: "idle", message: "Generating image...", icon: Palette, activeColor: "#EC4899" },
  { id: 4, name: "Master Refiner", status: "idle", message: "Refining details...", icon: SlidersHorizontal, activeColor: "#F59E0B" },
  { id: 5, name: "Quality Analyst", status: "idle", message: "Analyzing quality...", icon: BrainCircuit, activeColor: "#10B981" },
];

const STYLE_PRESETS = [
  { name: "Auto", id: "auto", icon: Sparkles, desc: "AI selects best style" },
  { name: "Photorealistic", id: "photo", icon: Camera, desc: "DSLR quality, natural lighting" },
  { name: "Cinematic", id: "cinematic", icon: Clapperboard, desc: "Film grain, dramatic shadows" },
  { name: "Anime/Manga", id: "anime", icon: Tv, desc: "Cel shaded, vibrant colors" },
  { name: "Oil Painting", id: "oil", icon: Palette, desc: "Visible brushstrokes, Renaissance" },
  { name: "Watercolor", id: "watercolor", icon: Droplets, desc: "Soft edges, paper texture" },
  { name: "Digital Art", id: "digital", icon: Monitor, desc: "Trending on ArtStation" },
  { name: "Minimalist", id: "minimal", icon: Circle, desc: "Clean lines, negative space" },
  { name: "Retrowave", id: "retro", icon: Sunset, desc: "Neon lights, 80s aesthetic" },
  { name: "Dark Fantasy", id: "fantasy", icon: Sword, desc: "Gothic, dramatic lighting" },
  { name: "Pop Art", id: "pop", icon: Shapes, desc: "Bold colors, Ben-Day dots" },
  { name: "Isometric 3D", id: "iso", icon: Box, desc: "Clean geometry, soft shadows" },
  { name: "Pencil Sketch", id: "sketch", icon: Pencil, desc: "Graphite, crosshatching" },
];

const QUALITY_PRESETS = [
  { id: "draft", name: "Draft", icon: Zap, tooltip: "Fast preview, good for iteration" },
  { id: "standard", name: "Standard", icon: Sparkles, tooltip: "Balanced quality and speed" },
  { id: "premium", name: "Premium", icon: BookOpen, tooltip: "Maximum quality, slower" }, // Using BookOpen as generic gem replacement
  { id: "ultra", name: "Ultra", icon: Zap, tooltip: "Extreme detail, longest generation" }, // Using Zap as generic flame replacement
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1", icon: Square, tooltip: "Square - Social media profiles" },
  { id: "16:9", label: "16:9", icon: RectangleHorizontal, tooltip: "Landscape - Cinematic, wallpapers" },
  { id: "9:16", label: "9:16", icon: RectangleVertical, tooltip: "Portrait - Mobile, stories" },
  { id: "4:3", label: "4:3", icon: Monitor, tooltip: "Classic - Traditional photo" },
  { id: "3:4", label: "3:4", icon: Smartphone, tooltip: "Tall - Portrait photos, posters" },
];

const REFINER_PRESETS = [
  { id: "cinematic", name: "Cinematic", icon: Clapperboard },
  { id: "sharp", name: "Sharp Detail", icon: Crosshair },
  { id: "soft", name: "Soft Glow", icon: Sun },
  { id: "vibrant", name: "Vibrant", icon: Palette },
  { id: "moody", name: "Moody", icon: Moon },
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
    refiner: true,
    refinerPreset: "cinematic",
    aiCuration: true,
    autoOptimize: true
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
      <Sidebar className="hidden md:flex border-r border-border/50" />
      
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-background text-foreground">
        
        {/* TOP SECTION: PROMPT BAR (Minimalistic) */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4 transition-all">
          <div className="max-w-5xl mx-auto w-full space-y-4">
            
            {/* Prompt Input & Controls */}
            <div className="flex items-end gap-3">
              
              {/* Main Input Wrapper */}
              <div className={cn(
                "flex-1 bg-muted/40 border border-border rounded-xl transition-all duration-200 flex items-end p-2 gap-2 group focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 shadow-sm",
                prompt.trim().length > 0 && "bg-background border-muted-foreground/40"
              )}>
                
                {/* Reference Image Trigger */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg shrink-0 mb-0.5">
                        <ImagePlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Add reference image</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Textarea */}
                <div className="flex-1 relative py-2">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you want to create..."
                    className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm sm:text-base text-foreground placeholder:text-muted-foreground resize-none min-h-[24px] max-h-[120px] leading-relaxed"
                    rows={1}
                  />
                </div>

                {/* Right Side Actions inside Input */}
                <div className="flex items-center gap-1 mb-0.5 shrink-0">
                  <div className={cn(
                    "text-[10px] font-medium mr-2 transition-colors select-none",
                    prompt.length > 1800 ? "text-amber-500" : "text-muted-foreground/50"
                  )}>
                    {prompt.length}/2000
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={showSettings ? "secondary" : "ghost"} 
                          size="icon" 
                          onClick={() => setShowSettings(!showSettings)}
                          className={cn("h-8 w-8 rounded-lg transition-all", showSettings && "bg-muted text-foreground")}
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Settings</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Generate Button - Standard Style */}
              <Button 
                onClick={handleGenerate}
                disabled={status === "generating" || !prompt.trim()}
                size="lg"
                className="h-[54px] px-8 rounded-xl font-semibold shadow-md shrink-0"
              >
                {status === "generating" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Imagine
                  </>
                )}
              </Button>
            </div>

            {/* Settings Panel (Inline Expandable) */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="bg-muted/30 border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-inner">
                    
                    {/* Style */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Style</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-9 text-xs bg-background/50">
                            <span className="flex items-center gap-2 truncate">
                              {STYLE_PRESETS.find(s => s.id === settings.style)?.icon && (
                                 <Sparkles className="h-3 w-3 text-primary" />
                              )}
                              {STYLE_PRESETS.find(s => s.id === settings.style)?.name}
                            </span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[180px]">
                          {STYLE_PRESETS.map(style => (
                            <DropdownMenuItem 
                              key={style.id}
                              onClick={() => setSettings({...settings, style: style.id})}
                              className="text-xs cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <style.icon className="h-3.5 w-3.5" />
                                {style.name}
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Quality */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quality</label>
                      <div className="flex bg-background/50 rounded-lg p-1 border border-border/50 h-9">
                        {QUALITY_PRESETS.map(q => (
                          <button
                            key={q.id}
                            onClick={() => setSettings({...settings, quality: q.id})}
                            className={cn(
                              "flex-1 rounded flex items-center justify-center text-[10px] font-medium transition-all",
                              settings.quality === q.id 
                                ? "bg-background shadow-sm text-foreground" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {q.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ratio</label>
                      <div className="flex gap-1.5">
                        {ASPECT_RATIOS.map(r => (
                          <button
                            key={r.id}
                            onClick={() => setSettings({...settings, aspectRatio: r.id})}
                            className={cn(
                              "h-9 w-9 rounded-md flex items-center justify-center border transition-all",
                              settings.aspectRatio === r.id 
                                ? "bg-primary/10 border-primary text-primary" 
                                : "bg-background/50 border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                            )}
                          >
                            <r.icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Features */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Options</label>
                      <div className="flex gap-2">
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => setSettings({...settings, refiner: !settings.refiner})}
                           className={cn("h-9 flex-1 text-[10px]", settings.refiner && "border-primary text-primary bg-primary/5")}
                         >
                           Refiner
                         </Button>
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => setSettings({...settings, aiCuration: !settings.aiCuration})}
                           className={cn("h-9 flex-1 text-[10px]", settings.aiCuration && "border-primary text-primary bg-primary/5")}
                         >
                           AI Fix
                         </Button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Agents Status Bar (During Generation) */}
            <AnimatePresence>
              {status === "generating" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-muted/30 border border-border rounded-xl p-4 overflow-hidden relative"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-1">
                      {agents.map((agent, i) => (
                        <div key={agent.id} className="flex items-center">
                          {/* Node */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn(
                                  "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                                  agent.status === "working" 
                                    ? `bg-primary shadow-lg scale-110 text-white` 
                                    : agent.status === "complete" 
                                      ? "bg-green-500 text-white" 
                                      : "bg-muted border border-border text-muted-foreground"
                                )}>
                                  <agent.icon className="h-3.5 w-3.5" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent><p>{agent.name}</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {/* Connecting Line */}
                          {i < agents.length - 1 && (
                            <div className="w-8 h-0.5 bg-border -mx-1 relative overflow-hidden">
                              {agent.status === "complete" && (
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  className="h-full bg-primary"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium animate-pulse mt-2">
                      {agents.find(a => a.status === "working")?.message || "Initializing..."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* SCROLLABLE GALLERY */}
        <div className="flex-1 overflow-y-auto p-10">
          {generations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in max-w-xl mx-auto mt-[-100px]">
              <div className="w-40 h-40 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-[80px] opacity-20 mb-8" />
              <h2 className="text-3xl font-bold mb-3 text-foreground">Start Creating</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Enter a prompt above to unleash the power of our 5-agent AI system.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {["Futuristic city with neon lights", "Oil painting of a cat king", "Cyberpunk street food stall"].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 border border-border rounded-full text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mx-auto max-w-[1800px]">
              {generations.map((gen) => (
                <div 
                  key={gen.id}
                  onClick={() => setSelectedImage(gen)}
                  className="break-inside-avoid mb-6 relative group rounded-xl overflow-hidden cursor-pointer bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <img src={gen.src} alt={gen.prompt} className="w-full h-auto object-cover" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5">
                    <p className="text-white text-sm line-clamp-2 mb-4 font-medium leading-relaxed">{gen.prompt}</p>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-lg">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                      <div className="flex items-center gap-1 ml-auto">
                        <Button size="icon" className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-lg">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md rounded-lg">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setSelectedImage(null)}
            >
              <div 
                className="w-full max-w-7xl h-[85vh] bg-card rounded-2xl overflow-hidden flex border border-border shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Left: Image */}
                <div className="flex-1 bg-muted/20 flex items-center justify-center p-8 relative group">
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.prompt} 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button size="icon" className="rounded-full bg-black/50 text-white border-0 hover:bg-black/70">
                       <Maximize2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="w-[400px] bg-card border-l border-border flex flex-col">
                  <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="font-bold text-foreground">Image Details</h3>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Actions */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: Download, label: "Save" },
                        { icon: RefreshCw, label: "Vary" },
                        { icon: Edit, label: "Edit" },
                        { icon: Star, label: "Like" }
                      ].map((action, i) => (
                        <Button key={i} variant="ghost" className="flex flex-col h-16 gap-1 bg-muted/30 hover:bg-muted text-foreground rounded-xl border border-border">
                          <action.icon className="h-5 w-5" />
                          <span className="text-[10px]">{action.label}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prompt</label>
                      <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-border relative group">
                        {selectedImage.prompt}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                             navigator.clipboard.writeText(selectedImage.prompt);
                             toast({ title: "Copied" });
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-xs text-muted-foreground">Style</span>
                        <span className="text-xs font-medium text-foreground capitalize">{selectedImage.style}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-xs text-muted-foreground">Dimensions</span>
                        <span className="text-xs font-medium text-foreground">1024 × 1024</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-xs text-muted-foreground">Model</span>
                        <span className="text-xs font-medium text-foreground">V5.2</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-xs text-muted-foreground">Seed</span>
                        <span className="text-xs font-medium text-foreground font-mono">82739103</span>
                      </div>
                    </div>
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
