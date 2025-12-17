import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Sparkles, Lock, Heart, RefreshCw, Copy, Check } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col items-center justify-center gap-6 p-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center">
            <Lock className="w-10 h-10 text-white/40" />
          </div>
          <h1 className="text-2xl font-bold text-white">Image Not Available</h1>
          <p className="text-white/60 max-w-md">
            {error || "This image might be private or has been removed."}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10" data-testid="button-go-home">
            <ArrowLeft className="w-4 h-4" />
            Go to UGLI
          </Button>
        </Link>
      </div>
    );
  }

  return (
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
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-[80px] md:auto-rows-[100px]">
          {/* Main Image - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-12 md:col-span-8 row-span-4 md:row-span-5 relative group rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-800"
          >
            <img
              src={image.imageUrl}
              alt={image.prompt || "AI Generated Image"}
              className="w-full h-full object-cover"
              data-testid="img-shared-image"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  size="sm"
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0"
                  data-testid="button-download-shared"
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
                  data-testid="button-like-shared"
                >
                  <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                </Button>
                <Button
                  onClick={handleRemix}
                  size="sm"
                  className="bg-[#B94E30] hover:bg-[#A04228] text-white border-0"
                  data-testid="button-remix-shared"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Remix
                </Button>
              </div>
            </div>

            {/* Creator Badge */}
            {image.username && (
              <div className="absolute top-3 left-3 md:top-4 md:left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md flex items-center gap-2">
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
            className="col-span-12 md:col-span-4 row-span-3 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#B94E30]/20 to-[#E3B436]/10 border border-[#B94E30]/30 p-4 md:p-5 flex flex-col group hover:border-[#B94E30]/60 transition-colors cursor-pointer"
            onClick={handleCopyPrompt}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#E3B436] font-bold">Prompt</span>
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40 group-hover:text-white/80" />}
            </div>
            <p className="text-white/90 text-sm leading-relaxed flex-1 line-clamp-4 md:line-clamp-6">
              "{image.prompt}"
            </p>
            <p className="text-white/40 text-xs mt-2 group-hover:text-white/60">Click to copy</p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleLike}
            className={cn(
              "col-span-6 md:col-span-2 row-span-2 rounded-2xl md:rounded-3xl border p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer transition-colors",
              liked ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <Heart className={cn("w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2", liked ? "text-red-500 fill-current" : "text-white/40")} />
            <span className="text-xl md:text-2xl font-bold text-white">{likeCount}</span>
            <span className="text-[10px] md:text-xs text-white/40">{liked ? "Liked!" : "Tap to Like"}</span>
          </motion.div>

          {/* Action Card - Remix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleRemix}
            className="col-span-6 md:col-span-2 row-span-2 rounded-2xl md:rounded-3xl bg-[#B94E30] p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#A04228] transition-colors group"
          >
            <RefreshCw className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 text-white group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-white font-bold text-sm md:text-base">Remix</span>
            <span className="text-[10px] md:text-xs text-white/70">Make it yours</span>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 md:col-span-4 row-span-2 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 p-4 md:p-5 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-white/40 mb-1">Style</p>
              <p className="text-white font-medium capitalize text-xs md:text-sm">{image.style || "Auto"}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-white/40 mb-1">Ratio</p>
              <p className="text-white font-medium text-xs md:text-sm">{image.aspectRatio || "1:1"}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] md:text-xs text-white/40 mb-1">Created</p>
              <p className="text-white font-medium text-xs md:text-sm">{new Date(image.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-12 md:col-span-8 row-span-2 rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#B94E30] to-[#E3B436] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">Create Your Own Masterpiece</h3>
              <p className="text-white/80 text-xs md:text-sm">Join thousands of creators using UGLI</p>
            </div>
            <Link href="/image-gen">
              <Button className="bg-white text-[#B94E30] hover:bg-white/90 font-bold px-6" data-testid="button-try-ugli">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
