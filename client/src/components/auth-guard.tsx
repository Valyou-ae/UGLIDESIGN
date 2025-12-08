import { ReactNode, useEffect, useRef } from "react";
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
      <div className="flex items-center justify-center min-h-screen bg-background" data-testid="auth-loading">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: GuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "admin" && !toastShownRef.current) {
      toastShownRef.current = true;
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated, user?.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background" data-testid="admin-loading">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
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
      <div className="flex items-center justify-center min-h-screen bg-background" data-testid="guest-loading">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return <>{children}</>;
}
