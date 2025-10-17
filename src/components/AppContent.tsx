import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { AgeVerificationModal } from "@/components/auth/AgeVerificationModal";
import { useAuth } from "@/contexts/auth/hook";
import { useState, useEffect } from "react";

/**
 * App content wrapper that handles age verification modal
 */
export function AppContent() {
  const { user } = useAuth();
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    // Show age verification modal if user is logged in but not age verified
    if (user && !user.ageVerified) {
      setShowAgeVerification(true);
    } else {
      setShowAgeVerification(false);
    }
  }, [user]);

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:rounded-full focus:bg-white focus:text-background focus:font-semibold focus:shadow-glow focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        Skip to main content
      </a>
      <RouterProvider router={router} />
      <AgeVerificationModal open={showAgeVerification} onOpenChange={setShowAgeVerification} />
    </>
  );
}
