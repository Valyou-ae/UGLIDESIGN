import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

interface CreditsData {
  credits: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  invalidate: () => void;
}

export function useCredits(): CreditsData {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", "credits"],
    queryFn: async () => {
      const res = await fetch("/api/user/credits", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch credits");
      return res.json();
    },
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["user", "credits"] });
    queryClient.invalidateQueries({ queryKey: ["user", "stats"] });
  };

  return {
    credits: data?.credits ?? 0,
    isLoading,
    error: error as Error | null,
    refetch,
    invalidate,
  };
}
