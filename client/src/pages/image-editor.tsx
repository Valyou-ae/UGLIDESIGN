import { useState, useRef, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  X, 
  Rocket,
  ChevronLeft,
  ChevronRight,
  History as HistoryIcon,
  Trash2,
  RotateCcw,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCredits } from "@/hooks/use-credits";

type EditVersion = {
  id: string;
  imageUrl: string;
  prompt: string;
  versionNumber: number;
  createdAt: string;
};

type EditStatus = "idle" | "uploading" | "editing" | "complete" | "error";

export default function ImageEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { credits, invalidate: refreshCredits } = useCredits();
  const queryClient = useQueryClient();
  const searchString = useSearch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const versionScrollRef = useRef<HTMLDivElement>(null);
  
  const [status, setStatus] = useState<EditStatus>("idle");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [versions, setVersions] = useState<EditVersion[]>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const loadedImageIdRef = useRef<string | null>(null);

  const fetchVersions = useCallback(async (imageId: string, selectLatest = true) => {
    setIsLoadingVersions(true);
    try {
      const response = await fetch(`/api/images/${imageId}/versions`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const fetchedVersions: EditVersion[] = data.versions.map((v: any) => ({
          id: v.id,
          imageUrl: `/api/images/${v.id}/image`,
          prompt: v.editPrompt || "Original",
          versionNumber: v.versionNumber ?? 0,
          createdAt: v.createdAt,
        }));
        setVersions(fetchedVersions);
        if (fetchedVersions.length > 0 && selectLatest) {
          setSelectedVersionIndex(fetchedVersions.length - 1);
          const latestVersion = fetchedVersions[fetchedVersions.length - 1];
          setCurrentImage(latestVersion.imageUrl);
          setCurrentImageId(latestVersion.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    } finally {
      setIsLoadingVersions(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const imageIdFromUrl = params.get("imageId");
    
    if (!imageIdFromUrl || !user) return;
    if (loadedImageIdRef.current === imageIdFromUrl) return;
    
    loadedImageIdRef.current = imageIdFromUrl;
    fetchVersions(imageIdFromUrl);
  }, [searchString, user, fetchVersions]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setStatus("uploading");
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        setCurrentImage(imageUrl);
        
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/image-editor/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Upload failed");
        }

        const data = await response.json();
        const imageApiUrl = `/api/images/${data.imageId}/image`;
        setCurrentImageId(data.imageId);
        setCurrentImage(imageApiUrl);
        
        await fetchVersions(data.imageId);
        
        setStatus("idle");
        
        toast({
          title: "Image uploaded",
          description: "You can now edit your image with prompts",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  }, [toast, fetchVersions]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleEdit = async () => {
    if (!currentImageId || !editPrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload an image and enter an edit prompt",
        variant: "destructive",
      });
      return;
    }

    if (credits !== null && credits < 1) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 1 credit to edit an image",
        variant: "destructive",
      });
      return;
    }

    setStatus("editing");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/image-editor/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          imageId: currentImageId,
          prompt: editPrompt.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Edit failed");
      }

      const data = await response.json();
      
      setCurrentImage(data.imageUrl);
      setCurrentImageId(data.imageId);
      setEditPrompt("");
      setStatus("complete");
      refreshCredits();
      
      if (versions.length > 0 && versions[0].id) {
        const rootId = versions[0].id;
        await fetchVersions(rootId);
      }
      
      toast({
        title: "Edit complete",
        description: "Your image has been edited successfully",
      });

      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Edit failed");
      toast({
        title: "Edit failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const selectVersion = (index: number) => {
    if (index >= 0 && index < versions.length) {
      setSelectedVersionIndex(index);
      setCurrentImage(versions[index].imageUrl);
      setCurrentImageId(versions[index].id);
    }
  };

  const scrollVersions = (direction: "left" | "right") => {
    if (versionScrollRef.current) {
      const scrollAmount = 120;
      versionScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDownload = async () => {
    if (!currentImageId) return;
    
    try {
      const response = await fetch(`/api/images/${currentImageId}/image`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-image-v${selectedVersionIndex}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded",
        description: "Image saved to your device",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const resetEditor = () => {
    setCurrentImage(null);
    setCurrentImageId(null);
    setVersions([]);
    setSelectedVersionIndex(0);
    setEditPrompt("");
    setStatus("idle");
    setErrorMessage(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Image Editor</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Upload an image and edit it with natural language prompts
              </p>
            </div>
            {credits !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{credits} credits</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col p-6 overflow-auto">
            {!currentImage ? (
              <div
                className={cn(
                  "flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                data-testid="upload-zone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  data-testid="input-file"
                />
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#ed5387]/20 to-[#9C27B0]/20 flex items-center justify-center">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground">
                      Drop your image here
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse (PNG, JPG, WEBP up to 10MB)
                    </p>
                  </div>
                </motion.div>
                
                {status === "uploading" && (
                  <div className="mt-6 flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-2xl overflow-hidden relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt="Current edit"
                      className="max-w-full max-h-full object-contain"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      data-testid="img-current"
                    />
                  </AnimatePresence>
                  
                  {status === "editing" && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#ed5387] to-[#9C27B0] animate-pulse" />
                          <Sparkles className="h-8 w-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Editing your image...</span>
                      </div>
                    </div>
                  )}
                  
                  {status === "complete" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={resetEditor}
                            className="h-9 w-9 rounded-full"
                            data-testid="button-reset"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Start over</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={handleDownload}
                            className="h-9 w-9 rounded-full"
                            data-testid="button-download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {versions.length > 0 && (
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <HistoryIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Version History</span>
                        <span className="text-xs text-muted-foreground">({versions.length})</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => scrollVersions("left")}
                          data-testid="button-scroll-left"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => scrollVersions("right")}
                          data-testid="button-scroll-right"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div
                      ref={versionScrollRef}
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {isLoadingVersions && (
                        <div className="flex items-center justify-center w-full py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">Loading versions...</span>
                        </div>
                      )}
                      {!isLoadingVersions && versions.map((version, index) => (
                        <motion.div
                          key={version.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "flex-shrink-0 w-24 cursor-pointer group",
                            selectedVersionIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg"
                          )}
                          onClick={() => selectVersion(index)}
                          data-testid={`version-${index}`}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={version.imageUrl}
                              alt={`Version ${version.versionNumber}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="mt-1.5">
                            <p className="text-xs font-medium text-foreground truncate">
                              V{version.versionNumber}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {version.prompt}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-shrink-0 rounded-2xl bg-gradient-to-r from-[#ed5387]/10 via-[#9C27B0]/10 to-[#ed5387]/10 p-4">
                  <div className="flex gap-3">
                    <Textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="Describe how you want to edit the image... (e.g., 'Remove the background', 'Add a sunset sky', 'Make it look vintage')"
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-background/80 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleEdit();
                        }
                      }}
                      disabled={status === "editing"}
                      data-testid="input-edit-prompt"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleEdit}
                            disabled={!editPrompt.trim() || status === "editing"}
                            className="h-auto px-6 bg-gradient-to-r from-[#ed5387] to-[#9C27B0] hover:from-[#ed5387]/90 hover:to-[#9C27B0]/90 text-white"
                            data-testid="button-edit"
                          >
                            {status === "editing" ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Rocket className="h-5 w-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Apply edit (1 credit)</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {errorMessage && (
                    <div className="mt-3 flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
