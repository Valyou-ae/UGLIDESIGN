import { ReactNode, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";

interface GuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: GuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="auth-loading">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/landing" />;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: GuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated, user?.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="admin-loading">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/landing" />;
  }

  if (user?.role !== "admin") {
    return <Redirect to="/home" />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: GuardProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="guest-loading">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return <>{children}</>;
}
