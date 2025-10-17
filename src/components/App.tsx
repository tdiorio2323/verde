import { AppProviders } from "@/app/providers";
import { AppContent } from "@/components/AppContent";

/**
 * Application entry point
 * Initializes React root with all providers and routing
 */
export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
