import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchUser() {
  // Add timestamp to completely bypass any caching (fixes 304 empty body issue in production)
  const timestamp = Date.now();
  const response = await fetch(`/api/auth/user?_t=${timestamp}`, {
    credentials: "include",
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    // For any other non-OK status (including 304), return null to avoid parse errors
    console.error('Auth fetch error:', response.status, response.statusText);
    return null;
  }
  
  const text = await response.text();
  if (!text) {
    return null;
  }
  
  const data = JSON.parse(text);
  return data.user;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include" 
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Redirect first - the page reload will naturally clear the cache
    window.location.href = "/";
  };

  const refreshAuth = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    return refetch();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    error,
    login,
    logout,
    refreshAuth,
  };
}
