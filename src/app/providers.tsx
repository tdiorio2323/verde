import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

/**
 * Application-wide providers wrapper.
 * Wraps the app with all necessary context providers and UI utilities.
 *
 * Providers included:
 * - ErrorBoundary: Catches and displays React errors
 * - TooltipProvider: Enables tooltip components
 * - Toaster/Sonner: Toast notification systems
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        {children}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
