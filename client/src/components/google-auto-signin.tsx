import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  initializeGoogleAuth,
  registerCredentialCallback,
  showOneTapPrompt,
  cancelOneTap,
} from "@/lib/google-auth";

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
  const { isAuthenticated, isLoading } = useAuth();
  const isAuthenticatingRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) return;

    let unregister: (() => void) | null = null;

    const setup = async () => {
      const ready = await initializeGoogleAuth();
      if (!ready) return;

      const handleCredential = async (response: { credential: string; select_by?: string }) => {
        if (isAuthenticatingRef.current) return;
        isAuthenticatingRef.current = true;

        const updateLoadingToast = (text: string) => {
          const toast = document.getElementById('google-auth-loading');
          if (toast) toast.textContent = text;
        };

        const removeLoadingToast = () => {
          const toast = document.getElementById('google-auth-loading');
          if (toast) toast.remove();
        };

        try {
          console.log("Google sign-in triggered, method:", response.select_by);
          const loadingToast = document.createElement('div');
          loadingToast.id = 'google-auth-loading';
          loadingToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:#fff;padding:16px 24px;border-radius:8px;z-index:99999;font-family:sans-serif;';
          loadingToast.textContent = 'Signing in with Google...';
          document.body.appendChild(loadingToast);

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

            if (authResponse.status >= 500 && retryCount < 3) {
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
            isAuthenticatingRef.current = false;
            const pendingPrompt = localStorage.getItem("pending_prompt");
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
      };

      unregister = registerCredentialCallback(handleCredential);

      showOneTapPrompt((notification) => {
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
              if (!isAuthenticatingRef.current) {
                showOneTapPrompt();
              }
            }, 2000);
          }
        }

        if (notification.isDismissedMoment()) {
          console.log("One Tap dismissed:", notification.getDismissedReason());
        }
      });
    };

    setup();

    return () => {
      if (unregister) unregister();
      cancelOneTap();
    };
  }, [onSuccess, onError, isLoading, isAuthenticated]);

  return null;
}
