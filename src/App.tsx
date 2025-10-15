import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routing/router";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Skip Navigation Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:rounded-full focus:bg-white focus:text-background focus:font-semibold focus:shadow-glow focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          Skip to main content
        </a>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
