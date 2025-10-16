import { useState, useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AgeVerificationModal } from "@/components/auth/AgeVerificationModal";

function AppContent() {
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
      <Toaster />
      <Sonner />
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:rounded-full focus:bg-white focus:text-background focus:font-semibold focus:shadow-glow focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        Skip to main content
      </a>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
              <p className="text-white/70">Loading...</p>
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <AgeVerificationModal
        open={showAgeVerification}
        onOpenChange={setShowAgeVerification}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
