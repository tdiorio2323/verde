import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";

/**
 * App content wrapper - renders the router
 */
export function AppContent() {
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
    </>
  );
}
