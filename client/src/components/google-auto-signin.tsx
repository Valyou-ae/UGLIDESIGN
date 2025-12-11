import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
            itp_support?: boolean;
            use_fedcm_for_prompt?: boolean;
            ux_mode?: string;
            login_hint?: string;
            hd?: string;
            prompt_parent_id?: string;
            state_cookie_domain?: string;
            intermediate_iframe_close_callback?: () => void;
          }) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getMomentType: () => string;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
            getDismissedReason: () => string;
          }) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: { id: string; password: string }, callback?: () => void) => void;
          revoke: (hint: string, callback?: (response: { successful: boolean; error?: string }) => void) => void;
          renderButton: (element: HTMLElement, config: {
            type?: string;
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            logo_alignment?: string;
            width?: number;
          }) => void;
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
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  const initializedRef = useRef(false);
  const isAuthenticatingRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (isLoading) return;
    if (isAuthenticated) return;

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
              }, 50);
              
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
            if (isAuthenticatingRef.current) return;
            isAuthenticatingRef.current = true;

            // Helper to update loading toast
            const updateLoadingToast = (text: string) => {
              const toast = document.getElementById('google-auth-loading');
              if (toast) toast.textContent = text;
            };
            
            // Helper to remove loading toast
            const removeLoadingToast = () => {
              const toast = document.getElementById('google-auth-loading');
              if (toast) toast.remove();
            };
            
            try {
              console.log("Google sign-in triggered, method:", response.select_by);
              // Show visual indicator that login is in progress
              const loadingToast = document.createElement('div');
              loadingToast.id = 'google-auth-loading';
              loadingToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:#fff;padding:16px 24px;border-radius:8px;z-index:99999;font-family:sans-serif;';
              loadingToast.textContent = 'Signing in with Google...';
              document.body.appendChild(loadingToast);
              
              // Helper function to attempt auth with retries
              const attemptAuth = async (retryCount = 0): Promise<{ok: boolean; status: number; body: string}> => {
                const timestamp = Date.now();
                const authResponse = await fetch(`/api/auth/google?_t=${timestamp}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                  },
                  credentials: "include",
                  cache: "no-store",
                  body: JSON.stringify({ credential: response.credential }),
                });
                
                const responseBody = await authResponse.text();
                
                // If server error and we have retries left, wait and retry
                if (authResponse.status >= 500 && retryCount < 3) {
                  // Check if it's a DNS-related error
                  if (responseBody.includes('EAI_AGAIN') || responseBody.includes('helium') || responseBody.includes('DNS')) {
                    updateLoadingToast(`Connection issue, retrying... (${retryCount + 1}/3)`);
                    console.log(`DNS error, retrying in ${(retryCount + 1) * 2}s... (attempt ${retryCount + 1}/3)`);
                    await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
                    return attemptAuth(retryCount + 1);
                  }
                }
                return { ok: authResponse.ok, status: authResponse.status, body: responseBody };
              };

              const authResponse = await attemptAuth();
              console.log("Auth response status:", authResponse.status);

              if (authResponse.ok) {
                console.log("Google sign-in successful");
                updateLoadingToast("Login successful! Redirecting...");
                onSuccess?.();
                // Reset auth state before navigation
                isAuthenticatingRef.current = false;
                // Check if there's a pending prompt to process
                const pendingPrompt = localStorage.getItem("pending_prompt");
                // Use full page navigation to ensure fresh auth state (bypasses CDN caching)
                // If there's a pending prompt, go to home page where FloatingPromptBar can process it
                window.location.href = pendingPrompt ? "/" : "/discover";
                return;
              } else {
                removeLoadingToast();
                let errorMessage = "Authentication failed";
                try {
                  if (authResponse.body) {
                    const error = JSON.parse(authResponse.body);
                    errorMessage = error.detail || error.message || errorMessage;
                  }
                } catch (e) {
                  errorMessage = `Login failed (${authResponse.status})`;
                }
                console.error("Google auth failed:", errorMessage);
                // If it's a DNS error, suggest trying again
                if (errorMessage.includes('EAI_AGAIN') || errorMessage.includes('helium')) {
                  alert("Connection issue - please try again in a few seconds. The server is warming up.");
                } else {
                  alert(`Login failed: ${errorMessage}`);
                }
                onError?.(errorMessage);
                isAuthenticatingRef.current = false;
              }
            } catch (error) {
              removeLoadingToast();
              console.error("Google auth error:", error);
              const errorMsg = error instanceof Error ? error.message : "Authentication failed";
              alert(`Login error: ${errorMsg}`);
              onError?.(errorMsg);
              isAuthenticatingRef.current = false;
            }
          },
          auto_select: true,
          cancel_on_tap_outside: false,
          context: "signin",
          itp_support: true,
          use_fedcm_for_prompt: true,
          ux_mode: "popup",
          intermediate_iframe_close_callback: () => {
            console.log("Google One Tap closed");
          },
        });

        window.google.accounts.id.prompt((notification) => {
          const momentType = notification.getMomentType?.() || "unknown";
          
          if (notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason();
            console.log("One Tap not displayed:", reason);
            
            if (reason === "opt_out_or_no_session") {
              console.log("User not logged into Google or opted out");
            } else if (reason === "suppressed_by_user") {
              console.log("User previously dismissed, will retry after cooldown");
            }
          }
          
          if (notification.isSkippedMoment()) {
            const reason = notification.getSkippedReason();
            console.log("One Tap skipped:", reason);
            
            if (reason === "auto_cancel") {
              console.log("Auto-cancelled, will retry");
              setTimeout(() => {
                if (!isAuthenticatingRef.current && window.google?.accounts?.id) {
                  window.google.accounts.id.prompt();
                }
              }, 2000);
            }
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
  }, [setLocation, onSuccess, onError, isLoading, isAuthenticated]);

  return null;
}
