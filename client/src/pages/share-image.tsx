import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Sparkles, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SharedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style?: string;
  aspectRatio?: string;
  username?: string;
  createdAt: string;
}

export default function ShareImage() {
  const [, params] = useRoute("/share/:id");
  const imageId = params?.id;
  const [image, setImage] = useState<SharedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      toast({ title: "Downloaded!", description: "Image saved to your device" });
    } catch (err) {
      toast({ variant: "destructive", title: "Download failed", description: "Please try again" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-bold text-xl text-[#B94E30]">UGLI</span>
            </Button>
          </Link>
          <Link href="/image-gen">
            <Button className="gap-2 bg-[#B94E30] hover:bg-[#A04228] text-white" data-testid="button-create-own">
              <Sparkles className="w-4 h-4" />
              Create Your Own
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Image Display */}
          <div className="relative rounded-2xl overflow-hidden bg-muted/20 border border-border">
            <img
              src={image.imageUrl}
              alt={image.prompt || "AI Generated Image"}
              className="w-full h-auto object-contain"
              data-testid="img-shared-image"
            />
          </div>

          {/* Image Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-image-title">
                AI Generated Image
              </h1>
              {image.username && (
                <p className="text-sm text-muted-foreground" data-testid="text-creator">
                  Created by <span className="font-medium text-foreground">@{image.username}</span>
                </p>
              )}
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Prompt
              </label>
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-sm text-foreground leading-relaxed" data-testid="text-prompt">
                  {image.prompt || "No prompt available"}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {image.style && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Style</span>
                  <span className="text-xs font-medium text-foreground capitalize">{image.style}</span>
                </div>
              )}
              {image.aspectRatio && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Aspect Ratio</span>
                  <span className="text-xs font-medium text-foreground">{image.aspectRatio}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-xs text-muted-foreground">Created</span>
                <span className="text-xs font-medium text-foreground">
                  {new Date(image.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 gap-2"
                data-testid="button-download-shared"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Link href="/image-gen" className="flex-1">
                <Button className="w-full gap-2 bg-[#B94E30] hover:bg-[#A04228] text-white" data-testid="button-try-ugli">
                  <Sparkles className="w-4 h-4" />
                  Try UGLI Free
                </Button>
              </Link>
            </div>

            {/* CTA Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#B94E30]/10 to-[#E3B436]/10 border border-[#B94E30]/20">
              <h3 className="font-bold text-foreground mb-2">Generate Your Own AI Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create stunning AI-generated images with UGLI. Fast, powerful, and free to try.
              </p>
              <Link href="/">
                <Button variant="link" className="p-0 h-auto text-[#B94E30] gap-1" data-testid="link-learn-more">
                  Learn more <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
