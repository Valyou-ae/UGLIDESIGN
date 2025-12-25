import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p className="mb-2">
            🍪 We use cookies to enhance your experience, analyze site traffic, and personalize content. 
            By clicking "Accept", you consent to our use of cookies.
          </p>
          <p className="text-xs text-gray-400">
            Learn more in our{" "}
            <Link href="/privacy-policy" className="text-pink-400 hover:text-pink-300 underline">
              Privacy Policy
            </Link>
            {" "}and{" "}
            <Link href="/terms-of-service" className="text-pink-400 hover:text-pink-300 underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Accept All
          </button>
          <button
            onClick={declineCookies}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
