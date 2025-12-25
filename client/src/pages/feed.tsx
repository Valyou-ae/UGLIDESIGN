import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Users, 
  Image as ImageIcon,
  Eye,
  Clock,
  ExternalLink
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { socialApi, FeedImage } from "@/lib/api";

export default function Feed() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(0);
  const [allImages, setAllImages] = useState<FeedImage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 20;

  const { data: feedData, isLoading: feedLoading, refetch } = useQuery({
    queryKey: ["social", "feed", page],
    queryFn: () => socialApi.getFeed(pageSize, page * pageSize),
    enabled: isAuthenticated,
  });

  // Accumulate images as pages load
  useEffect(() => {
    if (feedData?.images) {
      if (page === 0) {
        setAllImages(feedData.images);
      } else {
        setAllImages(prev => {
          const existingIds = new Set(prev.map(img => img.id));
          const newImages = feedData.images.filter(img => !existingIds.has(img.id));
          return [...prev, ...newImages];
        });
      }
      setIsLoadingMore(false);
    }
  }, [feedData, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to see your feed</h2>
          <p className="text-muted-foreground mb-6">Follow creators and see their latest creations here</p>
          <Button onClick={() => setLocation("/login")} data-testid="button-login-feed">
            Sign In
          </Button>
        </main>
      </div>
    );
  }

  const total = feedData?.total || 0;
  const hasMore = (page + 1) * pageSize < total;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setPage(p => p + 1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-feed-title">
              <Eye className="inline h-8 w-8 mr-2 text-primary" />
              Following
            </h1>
            <p className="text-muted-foreground">
              Latest creations from people you follow
            </p>
          </div>

          {feedLoading && page === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : allImages.length === 0 && !feedLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Your feed is empty</h3>
              <p className="mb-4">Follow some creators to see their work here!</p>
              <Button onClick={() => setLocation("/discover")} data-testid="button-discover-creators">
                Discover Creators
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {allImages.map((image: FeedImage, index: number) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`card-feed-image-${image.id}`}
                >
                  <div className="p-4 flex items-center gap-3 border-b border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={image.profileImageUrl || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-[#ed5387] to-[#9C27B0] text-white">
                        {(image.displayName || image.username || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {image.displayName || image.username || "Creator"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(image.createdAt)}
                      </p>
                    </div>
                    {image.style && (
                      <Badge variant="secondary" className="text-xs">
                        {image.style}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="aspect-[4/3] bg-muted relative group cursor-pointer">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt || "AI generated image"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(`/share/${image.id}`, '_blank')}
                        data-testid={`button-view-${image.id}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {image.prompt && (
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        <ImageIcon className="inline h-4 w-4 mr-1 text-primary" />
                        {image.prompt}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              {hasMore && (
                <div className="flex justify-center py-6">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    data-testid="button-load-more"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
