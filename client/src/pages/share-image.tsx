import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Sparkles, Lock, ExternalLink, Heart, RefreshCw, Copy, Check, Eye, Users, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SharedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style?: string;
  aspectRatio?: string;
  username?: string;
  createdAt: string;
  galleryImageId?: string;
  likeCount?: number;
  likedByViewer?: boolean;
}

type DesignVariant = "hero" | "moodboard" | "spotlight";

export default function ShareImage() {
  const [, params] = useRoute("/share/:id");
  const [, setLocation] = useLocation();
  const imageId = params?.id;
  const [image, setImage] = useState<SharedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [designVariant, setDesignVariant] = useState<DesignVariant>("hero");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchImage() {
      if (!imageId) return;
      
      try {
        const response = await fetch(`/api/images/share/${imageId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("This image is private or doesn't exist.");
          } else {
            setError("Failed to load image.");
          }
          return;
        }
        const data = await response.json();
        setImage(data.image);
        setLikeCount(data.image.likeCount || 0);
        setLiked(data.image.likedByViewer || false);
      } catch (err) {
        setError("Failed to load image.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchImage();
  }, [imageId]);

  const handleDownload = async () => {
    if (!image) return;
    
    try {
      toast({ title: "Downloading...", description: "Preparing your image" });
      
      if (image.imageUrl.startsWith('data:')) {
        const a = document.createElement("a");
        a.href = image.imageUrl;
        a.download = `ugli-${image.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const response = await fetch(image.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ugli-${image.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      toast({ title: "Downloaded!", description: "Image saved to your device" });
    } catch (err) {
      toast({ variant: "destructive", title: "Download failed", description: "Please try again" });
    }
  };

  const handleLike = async () => {
    if (!image?.galleryImageId) {
      toast({ title: "Like feature", description: "Sign in to like images" });
      return;
    }
    
    try {
      const response = await fetch(`/api/gallery/${image.galleryImageId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      } else {
        toast({ title: "Sign in to like", description: "Create an account to like images" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not like image" });
    }
  };

  const handleRemix = () => {
    if (!image?.prompt) {
      toast({ title: "No prompt available", description: "This image doesn't have a prompt to remix" });
      return;
    }
    const encodedPrompt = encodeURIComponent(image.prompt);
    setLocation(`/image-gen?remix=${encodedPrompt}`);
  };

  const handleCopyPrompt = () => {
    if (!image?.prompt) return;
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    toast({ title: "Copied!", description: "Prompt copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#B94E30] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Image Not Available</h1>
          <p className="text-muted-foreground max-w-md">
            {error || "This image might be private or has been removed."}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2" data-testid="button-go-home">
            <ArrowLeft className="w-4 h-4" />
            Go to UGLI
          </Button>
        </Link>
      </div>
    );
  }

  // Design Variant Switcher (only visible for testing)
  const DesignSwitcher = () => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-full px-2 py-1.5 flex gap-1 shadow-2xl">
      {[
        { id: "hero" as const, label: "Hero Canvas" },
        { id: "moodboard" as const, label: "Moodboard" },
        { id: "spotlight" as const, label: "Spotlight" },
      ].map((design) => (
        <button
          key={design.id}
          onClick={() => setDesignVariant(design.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            designVariant === design.id
              ? "bg-[#B94E30] text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {design.label}
        </button>
      ))}
    </div>
  );

  // DESIGN 1: Hero Storytelling Canvas
  const HeroCanvas = () => (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Blurred backdrop */}
      <div 
        className="absolute inset-0 scale-110 blur-3xl opacity-30"
        style={{ 
          backgroundImage: `url(${image.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Header */}
      <header className="relative z-20 p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-xl">UGLI</span>
          </Button>
        </Link>
        <Link href="/image-gen">
          <Button className="gap-2 bg-[#B94E30] hover:bg-[#A04228] text-white">
            <Sparkles className="w-4 h-4" />
            Create Your Own
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-80px)] p-4 lg:p-8 gap-6">
        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-2xl w-full"
          >
            <img
              src={image.imageUrl}
              alt={image.prompt || "AI Generated Image"}
              className="w-full h-auto rounded-2xl shadow-2xl"
              data-testid="img-shared-image"
            />
            
            {/* Floating Creator Chip */}
            {image.username && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B94E30] to-[#E3B436] flex items-center justify-center text-white text-xs font-bold">
                  {image.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-sm font-medium">@{image.username}</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Action Rail */}
        <div className="lg:w-80 flex flex-col gap-4">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Heart className={cn("w-5 h-5", liked ? "text-red-500 fill-current" : "text-white/60")} />
                <span className="text-white font-medium">{likeCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-white/60" />
                <span className="text-white/60 font-medium">--</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleLike}
                variant="outline"
                className={cn(
                  "gap-2 border-white/20 text-white hover:bg-white/10",
                  liked && "bg-red-500/20 border-red-500/50 text-red-400"
                )}
              >
                <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                {liked ? "Liked" : "Like"}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
                Save
              </Button>
            </div>
          </motion.div>

          {/* Prompt Drawer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setPromptExpanded(!promptExpanded)}
            >
              <h3 className="text-white font-semibold">Prompt</h3>
              {promptExpanded ? (
                <ChevronUp className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/60" />
              )}
            </div>
            
            <AnimatePresence>
              {promptExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-white/80 text-sm mt-3 leading-relaxed">
                    {image.prompt}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleCopyPrompt}
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      onClick={handleRemix}
                      size="sm"
                      className="gap-1.5 bg-[#B94E30] hover:bg-[#A04228] text-white"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Remix
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!promptExpanded && (
              <p className="text-white/50 text-sm mt-2 line-clamp-2">
                {image.prompt}
              </p>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-3"
          >
            {image.style && (
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Style</span>
                <span className="text-white text-sm font-medium capitalize">{image.style}</span>
              </div>
            )}
            {image.aspectRatio && (
              <div className="flex justify-between">
                <span className="text-white/50 text-sm">Ratio</span>
                <span className="text-white text-sm font-medium">{image.aspectRatio}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Created</span>
              <span className="text-white text-sm font-medium">
                {new Date(image.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/image-gen">
              <Button className="w-full gap-2 bg-gradient-to-r from-[#B94E30] to-[#E3B436] hover:opacity-90 text-white h-12 text-base">
                <Zap className="w-5 h-5" />
                Make Your Own
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );

  // DESIGN 2: Interactive Moodboard Grid
  const MoodboardGrid = () => (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-white/5">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-xl text-[#B94E30]">UGLI</span>
          </Button>
        </Link>
        <Link href="/image-gen">
          <Button className="gap-2 bg-[#B94E30] hover:bg-[#A04228] text-white">
            <Sparkles className="w-4 h-4" />
            Create
          </Button>
        </Link>
      </header>

      {/* Moodboard Grid */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-4 auto-rows-[100px]">
          {/* Main Image - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-12 md:col-span-8 row-span-5 relative group rounded-3xl overflow-hidden bg-neutral-800"
          >
            <img
              src={image.imageUrl}
              alt={image.prompt || "AI Generated Image"}
              className="w-full h-full object-cover"
              data-testid="img-shared-image"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  size="sm"
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleLike}
                  size="sm"
                  className={cn(
                    "backdrop-blur-md border-0",
                    liked ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                  )}
                >
                  <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                </Button>
                <Button
                  onClick={handleRemix}
                  size="sm"
                  className="bg-[#B94E30] hover:bg-[#A04228] text-white border-0"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Remix
                </Button>
              </div>
            </div>

            {/* Creator Badge */}
            {image.username && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#B94E30] to-[#E3B436] flex items-center justify-center text-white text-[10px] font-bold">
                  {image.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-xs font-medium">@{image.username}</span>
              </div>
            )}
          </motion.div>

          {/* Prompt Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-4 row-span-3 rounded-3xl bg-gradient-to-br from-[#B94E30]/20 to-[#E3B436]/10 border border-[#B94E30]/30 p-5 flex flex-col group hover:border-[#B94E30]/60 transition-colors cursor-pointer"
            onClick={handleCopyPrompt}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#E3B436] font-bold">Prompt</span>
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40 group-hover:text-white/80" />}
            </div>
            <p className="text-white/90 text-sm leading-relaxed flex-1 line-clamp-6">
              "{image.prompt}"
            </p>
            <p className="text-white/40 text-xs mt-2 group-hover:text-white/60">Click to copy</p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-6 md:col-span-2 row-span-2 rounded-3xl bg-white/5 border border-white/10 p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Heart className={cn("w-8 h-8 mb-2", liked ? "text-red-500 fill-current" : "text-white/40")} />
            <span className="text-2xl font-bold text-white">{likeCount}</span>
            <span className="text-xs text-white/40">Likes</span>
          </motion.div>

          {/* Action Card - Remix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleRemix}
            className="col-span-6 md:col-span-2 row-span-2 rounded-3xl bg-[#B94E30] p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#A04228] transition-colors group"
          >
            <RefreshCw className="w-8 h-8 mb-2 text-white group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-white font-bold">Remix</span>
            <span className="text-xs text-white/70">Make it yours</span>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 md:col-span-4 row-span-2 rounded-3xl bg-white/5 border border-white/10 p-5 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">Style</p>
              <p className="text-white font-medium capitalize text-sm">{image.style || "Auto"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">Ratio</p>
              <p className="text-white font-medium text-sm">{image.aspectRatio || "1:1"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">Created</p>
              <p className="text-white font-medium text-sm">{new Date(image.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-12 md:col-span-8 row-span-2 rounded-3xl bg-gradient-to-r from-[#B94E30] to-[#E3B436] p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Create Your Own Masterpiece</h3>
              <p className="text-white/80 text-sm">Join thousands of creators using UGLI</p>
            </div>
            <Link href="/image-gen">
              <Button className="bg-white text-[#B94E30] hover:bg-white/90 font-bold px-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );

  // DESIGN 3: Immersive Spotlight
  const SpotlightPage = () => (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Ambient glow */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(185, 78, 48, 0.15) 0%, transparent 60%)`
        }}
      />
      
      {/* Header */}
      <header className="relative z-20 p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-xl text-[#B94E30]">UGLI</span>
          </Button>
        </Link>
        <Link href="/image-gen">
          <Button className="gap-2 bg-[#B94E30] hover:bg-[#A04228] text-white rounded-full px-6">
            <Sparkles className="w-4 h-4" />
            Create
          </Button>
        </Link>
      </header>

      {/* Scrollytelling Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-32">
        {/* Image Reveal Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8"
        >
          <div className="relative">
            {/* Spotlight ring */}
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#B94E30]/30 via-transparent to-[#E3B436]/20 blur-xl" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={image.imageUrl}
                alt={image.prompt || "AI Generated Image"}
                className="w-full h-auto"
                data-testid="img-shared-image"
              />
            </div>

            {/* Creator floating badge */}
            {image.username && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center gap-3 shadow-xl"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B94E30] to-[#E3B436] flex items-center justify-center text-white text-sm font-bold">
                  {image.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">@{image.username}</p>
                  <p className="text-white/50 text-xs">Creator</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Prompt Typography Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="py-12 mt-8"
        >
          <p className="text-center text-white/30 text-xs uppercase tracking-[0.3em] mb-4">The Prompt</p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white text-2xl md:text-3xl font-light leading-relaxed italic px-4"
          >
            "{image.prompt}"
          </motion.blockquote>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-3 mt-8"
          >
            <Button
              onClick={handleCopyPrompt}
              variant="outline"
              className="gap-2 rounded-full border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Prompt"}
            </Button>
            <Button
              onClick={handleRemix}
              className="gap-2 rounded-full bg-[#B94E30] hover:bg-[#A04228] text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Remix This
            </Button>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="py-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={handleLike}
              className={cn(
                "p-6 rounded-2xl bg-white/5 border border-white/10 text-center cursor-pointer transition-all hover:bg-white/10",
                liked && "bg-red-500/10 border-red-500/30"
              )}
            >
              <Heart className={cn("w-6 h-6 mx-auto mb-2", liked ? "text-red-500 fill-current" : "text-white/40")} />
              <p className="text-2xl font-bold text-white">{likeCount}</p>
              <p className="text-xs text-white/40">{liked ? "Liked!" : "Tap to Like"}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#E3B436]" />
              <p className="text-2xl font-bold text-white capitalize">{image.style || "Auto"}</p>
              <p className="text-xs text-white/40">Style</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="w-6 h-6 mx-auto mb-2 border border-white/40 rounded" />
              <p className="text-2xl font-bold text-white">{image.aspectRatio || "1:1"}</p>
              <p className="text-xs text-white/40">Ratio</p>
            </div>
            <div 
              onClick={handleDownload}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <Download className="w-6 h-6 mx-auto mb-2 text-white/40" />
              <p className="text-lg font-bold text-white">Save</p>
              <p className="text-xs text-white/40">Download</p>
            </div>
          </div>
        </motion.section>

        {/* Make It Yours Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="py-8"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#B94E30]/20 to-[#E3B436]/10 border border-[#B94E30]/30 p-8 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-[#E3B436]" />
            <h3 className="text-2xl font-bold text-white mb-2">Make It Yours</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Use this prompt as inspiration or remix it to create your own unique masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/image-gen">
                <Button className="gap-2 bg-[#B94E30] hover:bg-[#A04228] text-white px-8 h-12 rounded-full">
                  <Sparkles className="w-5 h-5" />
                  Start Fresh
                </Button>
              </Link>
              <Button
                onClick={handleRemix}
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 px-8 h-12 rounded-full"
              >
                <RefreshCw className="w-5 h-5" />
                Use This Prompt
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent md:hidden z-30">
        <div className="flex gap-2">
          <Button
            onClick={handleLike}
            variant="outline"
            className={cn(
              "flex-1 gap-2 border-white/20 text-white",
              liked && "bg-red-500/20 border-red-500/50"
            )}
          >
            <Heart className={cn("w-4 h-4", liked && "fill-current text-red-500")} />
            {likeCount}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 gap-2 border-white/20 text-white"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleRemix}
            className="flex-1 gap-2 bg-[#B94E30] text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Remix
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {designVariant === "hero" && <HeroCanvas />}
      {designVariant === "moodboard" && <MoodboardGrid />}
      {designVariant === "spotlight" && <SpotlightPage />}
      <DesignSwitcher />
    </>
  );
}
