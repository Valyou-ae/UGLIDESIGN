import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
            itp_support?: boolean;
          }) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
            getDismissedReason: () => string;
          }) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleAutoSignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleAutoSignIn({ onSuccess, onError }: GoogleAutoSignInProps) {
  const [, setLocation] = useLocation();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const initializeGoogleSignIn = async () => {
      try {
        const configResponse = await fetch("/api/auth/google-client-id");
        if (!configResponse.ok) {
          console.log("Google Sign-In not configured");
          return;
        }
        
        const { clientId } = await configResponse.json();
        if (!clientId) {
          console.log("Google Client ID not available");
          return;
        }

        const waitForGoogle = () => {
          return new Promise<void>((resolve) => {
            if (window.google?.accounts?.id) {
              resolve();
            } else {
              const checkInterval = setInterval(() => {
                if (window.google?.accounts?.id) {
                  clearInterval(checkInterval);
                  resolve();
                }
              }, 100);
              
              setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
              }, 5000);
            }
          });
        };

        await waitForGoogle();

        if (!window.google?.accounts?.id) {
          console.log("Google Identity Services not loaded");
          return;
        }

        initializedRef.current = true;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const authResponse = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ credential: response.credential }),
              });

              if (authResponse.ok) {
                onSuccess?.();
                setLocation("/discover");
              } else {
                const error = await authResponse.json();
                onError?.(error.message || "Authentication failed");
              }
            } catch (error) {
              console.error("Google auth error:", error);
              onError?.("Authentication failed");
            }
          },
          auto_select: true,
          cancel_on_tap_outside: false,
          context: "signin",
          itp_support: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap not displayed:", notification.getNotDisplayedReason());
          }
          if (notification.isSkippedMoment()) {
            console.log("One Tap skipped:", notification.getSkippedReason());
          }
          if (notification.isDismissedMoment()) {
            console.log("One Tap dismissed:", notification.getDismissedReason());
          }
        });
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
      }
    };

    initializeGoogleSignIn();

    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [setLocation, onSuccess, onError]);

  return null;
}
