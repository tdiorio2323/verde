import { env } from "./env";

export const APP_ENV = {
  SUPABASE_URL: !!env.VITE_SUPABASE_URL,
  SUPABASE_ANON: !!env.VITE_SUPABASE_ANON_KEY,
  APP_ENV: env.VITE_APP_ENV,
  ROUTES_DEBUG: !!env.VITE_ENABLE_ROUTES_DEBUG,
};

declare global {
  interface Window {
    __APP_ENV?: typeof APP_ENV;
  }
}

// Expose environment status to window in development for debugging
if (import.meta.env.DEV) {
  window.__APP_ENV = APP_ENV;
  console.log("🔧 Development environment variables:", APP_ENV);
}

export {};
