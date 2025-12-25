import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socialApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  username?: string | null;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ 
  userId, 
  username,
  variant = "default", 
  size = "sm",
  className,
  showIcon = true,
  onFollowChange
}: FollowButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [optimisticFollowing, setOptimisticFollowing] = useState<boolean | null>(null);

  const { data: followData, isLoading: checkingFollow } = useQuery({
    queryKey: ["isFollowing", userId],
    queryFn: () => socialApi.isFollowing(userId),
    enabled: isAuthenticated && !!userId && userId !== user?.id,
    staleTime: 30000,
  });

  const followMutation = useMutation({
    mutationFn: () => socialApi.follow(userId),
    onMutate: () => {
      setOptimisticFollowing(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", userId] });
      queryClient.invalidateQueries({ queryKey: ["followCounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["social", "feed"] });
      onFollowChange?.(true);
      toast({
        title: "Following",
        description: `You are now following ${username || "this user"}`,
      });
    },
    onError: (error: Error) => {
      setOptimisticFollowing(null);
      toast({
        title: "Error",
        description: error.message || "Failed to follow user",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => socialApi.unfollow(userId),
    onMutate: () => {
      setOptimisticFollowing(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", userId] });
      queryClient.invalidateQueries({ queryKey: ["followCounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["social", "feed"] });
      onFollowChange?.(false);
      toast({
        title: "Unfollowed",
        description: `You unfollowed ${username || "this user"}`,
      });
    },
    onError: (error: Error) => {
      setOptimisticFollowing(null);
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow user",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || !userId || userId === user?.id) {
    return null;
  }

  const isFollowing = optimisticFollowing !== null ? optimisticFollowing : followData?.isFollowing;
  const isLoading = checkingFollow || followMutation.isPending || unfollowMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={cn(
        isFollowing 
          ? "hover:bg-destructive/10 hover:text-destructive hover:border-destructive" 
          : "bg-gradient-to-r from-[#ed5387] to-[#C2185B] hover:shadow-lg hover:shadow-[#ed5387]/20 border-0 text-white",
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
      data-testid={`button-follow-${userId}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && (isFollowing ? <UserMinus className="h-4 w-4 mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />)}
          {isFollowing ? "Following" : "Follow"}
        </>
      )}
    </Button>
  );
}
