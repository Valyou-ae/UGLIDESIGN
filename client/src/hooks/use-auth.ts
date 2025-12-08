import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchUser() {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error("Failed to fetch user");
  }
  
  const data = await response.json();
  return data.user;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  const logout = async () => {
    queryClient.clear();
    try {
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include" 
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    window.location.href = "/";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    error,
    login,
    logout,
  };
}
