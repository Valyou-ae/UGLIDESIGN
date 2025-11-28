import { useState, useRef, useEffect } from "react";
import { 
  Scissors, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Link as LinkIcon, 
  Check, 
  Download, 
  RefreshCw, 
  Copy, 
  X, 
  Info, 
  Sparkles,
  AlertCircle,
  Wand2,
  ChevronDown,
  Trash2,
  RotateCcw,
  Palette,
  Monitor,
  Maximize,
  Zap
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Sample images imports
import samplePortrait from "@assets/generated_images/sample_portrait_photo_for_background_removal.png";
import sampleProduct from "@assets/generated_images/sample_product_photo_for_background_removal.png";
import sampleAnimal from "@assets/generated_images/sample_animal_photo_for_background_removal.png";
import sampleCar from "@assets/generated_images/sample_car_photo_for_background_removal.png";
import sampleLogo from "@assets/generated_images/sample_logo_for_background_removal.png";
import sampleFood from "@assets/generated_images/sample_food_photo_for_background_removal.png";

type ProcessingState = "idle" | "uploading" | "processing" | "complete" | "error";
type ViewMode = "single" | "batch";

export default function BackgroundRemover() {
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [state, setState] = useState<ProcessingState>("idle");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Mock processing simulation
  const processImage = () => {
    if (state === "processing") return; // Prevent double clicks
    
    setState("processing");
    setProgress(0);
    setProcessingStage("Analyzing image...");

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    const stages = [
      { pct: 20, text: "Detecting subject..." },
      { pct: 50, text: "Generating mask..." },
      { pct: 80, text: "Applying transparency..." },
      { pct: 100, text: "Finalizing..." }
    ];

    let currentStage = 0;

    intervalRef.current = setInterval(() => {
      if (currentStage >= stages.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setState("complete");
        toast({
          title: "Background removed!",
          description: "Your image is ready to download.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400",
        });
        return;
      }

      setProgress(stages[currentStage].pct);
      setProcessingStage(stages[currentStage].text);
      currentStage++;
    }, 800);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        // We don't auto-start processing anymore to give user control
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleSelect = (img: string) => {
    setSelectedImage(img);
    setState("idle"); // Ensure we reset state if a new sample is picked
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("idle");
    setSelectedImage(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="p-8 lg:p-10 max-w-[1400px] mx-auto min-h-full flex flex-col">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center text-[13px] text-muted-foreground mb-2">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>Background Remover</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-16 mb-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                    Background Remover
                  </h1>
                  <Scissors className="h-6 w-6 text-pink-600 animate-cut" />
                </div>
                <Badge className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-2 py-0.5 text-[11px]">
                  Instant
                </Badge>
              </div>

              <div className="flex items-center gap-8 opacity-0 lg:opacity-100 animate-fade-in">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Check className="h-3.5 w-3.5" />
                  <span>99.9% Accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Maximize className="h-3.5 w-3.5" />
                  <span>Any Size</span>
                </div>
              </div>
            </div>
            <p className="text-[15px] text-muted-foreground mt-2">
              Remove backgrounds instantly with AI precision
            </p>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="flex-1 flex flex-col">
            
            {/* STATE 1: EMPTY / UPLOAD STATE */}
            {!selectedImage && (
              <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-10">
                <div className="w-full max-w-[700px]">
                  
                  {/* Hero Upload Zone */}
                  <div 
                    className="group relative bg-card border-2 border-dashed border-border rounded-[24px] p-16 text-center transition-all duration-300 hover:border-pink-500 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 hover:scale-[1.01] cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      onChange={handleFileSelect}
                    />
                    
                    <div className="mb-6 relative inline-block">
                      <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full group-hover:bg-pink-500/30 transition-colors" />
                      <Upload className="h-20 w-20 text-pink-500 relative z-10 transition-transform duration-500 group-hover:-translate-y-2" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-2">Drag & drop an image</h2>
                    <p className="text-lg text-muted-foreground mb-4">or click to upload</p>
                    <p className="text-sm text-muted-foreground/60 uppercase tracking-wider font-medium">
                      PNG, JPG, JPEG, WEBP, GIF
                    </p>
                  </div>

                  {/* Quick Options Row */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setViewMode("single")}
                      className={cn(
                        "flex flex-col items-start p-5 rounded-2xl border transition-all hover:-translate-y-0.5",
                        viewMode === "single" 
                          ? "bg-card border-pink-500 shadow-md shadow-pink-500/5" 
                          : "bg-muted/30 border-transparent hover:border-pink-500/30 hover:bg-card"
                      )}
                    >
                      <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20 text-pink-600 mb-3">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold mb-1">Single Image</span>
                      <span className="text-xs text-muted-foreground">Remove one background</span>
                    </button>

                    <button 
                      onClick={() => setViewMode("batch")}
                      className={cn(
                        "flex flex-col items-start p-5 rounded-2xl border transition-all hover:-translate-y-0.5 relative overflow-hidden",
                        viewMode === "batch"
                          ? "bg-card border-pink-500 shadow-md shadow-pink-500/5"
                          : "bg-muted/30 border-transparent hover:border-pink-500/30 hover:bg-card"
                      )}
                    >
                      <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">Pro</div>
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-3">
                        <Layers className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold mb-1">Batch Process</span>
                      <span className="text-xs text-muted-foreground">Process multiple images</span>
                    </button>

                    <button className="flex flex-col items-start p-5 rounded-2xl bg-muted/30 border border-transparent hover:border-pink-500/30 hover:bg-card transition-all hover:-translate-y-0.5">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 mb-3">
                        <LinkIcon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold mb-1">Import from URL</span>
                      <span className="text-xs text-muted-foreground">Paste image link</span>
                    </button>
                  </div>

                  {/* Sample Images Row */}
                  <div className="mt-10">
                    <p className="text-[13px] text-muted-foreground font-medium mb-4 text-center">Try with a sample</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[samplePortrait, sampleProduct, sampleAnimal, sampleCar, sampleLogo, sampleFood].map((img, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSampleSelect(img)}
                          className="h-14 w-14 rounded-full border-2 border-transparent hover:border-pink-500 hover:scale-110 transition-all overflow-hidden shadow-sm"
                        >
                          <img src={img} alt="Sample" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STATE 2: PROCESSING / RESULTS STATE */}
            {selectedImage && (
              <div className="flex-1 flex flex-col animate-fade-in">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
                  
                  {/* Column 1: Original Image */}
                  <div className="bg-card border border-border rounded-[20px] overflow-hidden flex flex-col">
                    <div className="p-4 lg:p-5 border-b border-border">
                      <h3 className="text-sm font-semibold">Original</h3>
                    </div>
                    <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbC1vcGFjaXR5PSIwLjEiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-repeat p-4 flex items-center justify-center">
                      <img src={selectedImage} alt="Original" className="max-h-full max-w-full object-contain shadow-lg rounded-lg" />
                    </div>
                    <div className="p-3 px-5 bg-muted/30 border-t border-border">
                      <p className="text-xs text-muted-foreground font-mono">photo.jpg • 2.4 MB • 1024×1024</p>
                    </div>
                  </div>

                  {/* Column 2: Alpha Mask */}
                  <div className="bg-card border border-border rounded-[20px] overflow-hidden flex flex-col">
                    <div className="p-4 lg:p-5 border-b border-border flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Alpha Mask</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>White = Keep, Black = Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex-1 bg-black p-4 flex items-center justify-center relative">
                      {state === "complete" ? (
                        <img src={selectedImage} alt="Mask" className="max-h-full max-w-full object-contain shadow-lg rounded-lg grayscale contrast-200 brightness-125" />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          {state === "processing" ? (
                            <>
                              <div className="h-12 w-12 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
                              <p className="text-sm animate-pulse">{processingStage}</p>
                            </>
                          ) : (
                            <>
                              <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 opacity-30" />
                              </div>
                              <p className="text-sm opacity-50">Mask will appear here</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Final Output */}
                  <div className="bg-card border border-border rounded-[20px] overflow-hidden flex flex-col">
                    <div className="p-4 lg:p-5 border-b border-border flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Final Output</h3>
                      {state === "complete" && <Sparkles className="h-4 w-4 text-pink-500 animate-pulse" />}
                    </div>
                    <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbC1vcGFjaXR5PSIwLjEiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-repeat p-4 flex items-center justify-center relative">
                      {state === "complete" ? (
                        <>
                          <img src={selectedImage} alt="Final" className="max-h-full max-w-full object-contain shadow-lg rounded-lg" />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute bottom-6 right-6 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Removed!
                          </motion.div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          {state === "processing" ? (
                            <>
                              <Wand2 className="h-8 w-8 text-pink-500 animate-pulse" />
                              <p className="text-sm">Applying magic...</p>
                            </>
                          ) : (
                            <>
                              <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                <Scissors className="h-8 w-8 opacity-30" />
                              </div>
                              <p className="text-sm opacity-50">Result will appear here</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Action Bar */}
                <div className="mt-6 bg-card border border-border rounded-[16px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="ghost" onClick={reset} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Start Over
                    </Button>
                    {state === "complete" && (
                      <Button variant="ghost" onClick={processImage} className="text-muted-foreground hover:text-foreground">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-process
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                    {state !== "complete" && state !== "processing" && (
                      <Button 
                        onClick={processImage}
                        className="h-12 px-8 rounded-[12px] bg-gradient-to-r from-pink-500 to-pink-600 hover:brightness-110 hover:shadow-lg hover:shadow-pink-500/25 text-white font-bold transition-all"
                      >
                        <Scissors className="h-5 w-5 mr-2" />
                        Remove Background
                      </Button>
                    )}
                    {state === "processing" && (
                      <div className="flex flex-col items-center w-full min-w-[200px]">
                        <div className="flex justify-between w-full text-xs mb-1.5 font-medium">
                          <span>Processing...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {state === "complete" && (
                      <>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="bg-pink-600 hover:bg-pink-700 text-white border-0 rounded-[12px] px-5">
                              <Download className="h-4 w-4 mr-2" />
                              Download PNG
                              <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Download Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">PNG (Transparent)</span>
                                <span className="text-xs text-muted-foreground">Recommended for web</span>
                              </div>
                              <Badge variant="secondary" className="ml-auto text-[10px]">Best</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">JPEG (White BG)</span>
                                <span className="text-xs text-muted-foreground">Good for ecommerce</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">WebP</span>
                                <span className="text-xs text-muted-foreground">Smallest file size</span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
                
              </div>
            )}

          </div>
        </div>
      </main>
      
      {/* Processing Overlay Animation */}
      <AnimatePresence>
        {state === "processing" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-[24px] shadow-2xl p-10 max-w-[400px] w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                <motion.div 
                  className="h-full bg-pink-500"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full animate-pulse" />
                <Scissors className="h-16 w-16 text-pink-500 relative z-10 animate-cut" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{processingStage}</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Our AI is precisely separating the subject from the background.
              </p>
              
              <Button variant="ghost" onClick={() => setState("idle")} className="text-muted-foreground hover:text-destructive">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
