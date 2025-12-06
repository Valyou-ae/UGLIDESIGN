import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imagesApi } from "@/lib/api";
import { useState, useCallback } from "react";

export type ProgressPhase = 
  | "analysis"        // Phase 1: Initial analysis (text + deep)
  | "draft_prompt"    // Phase 2: Creating cinematic draft prompt
  | "image_generation"// Phase 3: Generating image
  | "complete" 
  | "error" 
  | "done";

export interface ProgressUpdate {
  phase: ProgressPhase;
  message: string;
}

export interface TextInfo {
  texts: Array<{
    content: string;
    surface: string;
    style: string;
    importance: "primary" | "secondary" | "decorative";
  }>;
  artDirection: string;
}

export interface GenerateWithProgressOptions {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  enhanceWithAI?: boolean;
  processTextInPrompt?: boolean;
  onProgress?: (update: ProgressUpdate) => void;
}

export function useImages() {
  const queryClient = useQueryClient();
  const [isStreamGenerating, setIsStreamGenerating] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["images"],
    queryFn: imagesApi.getAll,
  });

  const generateImageMutation = useMutation({
    mutationFn: imagesApi.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const createImageMutation = useMutation({
    mutationFn: imagesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (id: string) => imagesApi.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => imagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const generateImageWithProgress = useCallback(async (options: GenerateWithProgressOptions) => {
    const { prompt, style, aspectRatio, processTextInPrompt = true, onProgress } = options;
    setIsStreamGenerating(true);

    return new Promise<any>((resolve, reject) => {
      const params = new URLSearchParams({
        prompt,
        ...(style && { style }),
        ...(aspectRatio && { aspectRatio }),
        processTextInPrompt: String(processTextInPrompt),
      });

      const eventSource = new EventSource(`/api/generate-image-stream?${params.toString()}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.phase === "done") {
            eventSource.close();
            setIsStreamGenerating(false);
            queryClient.invalidateQueries({ queryKey: ["images"] });
            resolve(data.result);
          } else if (data.phase === "error") {
            eventSource.close();
            setIsStreamGenerating(false);
            reject(new Error(data.message));
          } else if (onProgress) {
            onProgress(data as ProgressUpdate);
          }
        } catch (e) {
          console.error("Error parsing SSE data:", e);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsStreamGenerating(false);
        reject(new Error("Connection lost during generation"));
      };
    });
  }, [queryClient]);

  return {
    images: data?.images || [],
    isLoading,
    error,
    refetch,
    generateImage: generateImageMutation.mutateAsync,
    generateImageWithProgress,
    createImage: createImageMutation.mutateAsync,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    isGenerating: generateImageMutation.isPending || isStreamGenerating,
    isCreating: createImageMutation.isPending,
  };
}
