import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL").optional(),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .optional(),
  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(10, "VITE_SUPABASE_ANON_KEY must be at least 10 characters")
    .optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z
    .string()
    .min(10, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY must be at least 10 characters")
    .optional(),
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  VITE_ENABLE_ROUTES_DEBUG: z.string().optional(),
});

type ParsedEnv = z.infer<typeof envSchema>;

const resolveRequiredValue = (
  preferred: string | undefined,
  fallback: string | undefined,
  errorMessage: string,
): string => {
  const value = preferred ?? fallback;

  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
};

const parsedEnv: ParsedEnv = envSchema.parse(import.meta.env);

export const env = {
  VITE_SUPABASE_URL: resolveRequiredValue(
    parsedEnv.VITE_SUPABASE_URL,
    parsedEnv.NEXT_PUBLIC_SUPABASE_URL,
    "Supabase URL not provided. Set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.",
  ),
  VITE_SUPABASE_ANON_KEY: resolveRequiredValue(
    parsedEnv.VITE_SUPABASE_ANON_KEY,
    parsedEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    "Supabase publishable key not provided. Set VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.",
  ),
  VITE_APP_ENV: parsedEnv.VITE_APP_ENV,
  VITE_ENABLE_ROUTES_DEBUG: parsedEnv.VITE_ENABLE_ROUTES_DEBUG,
} as const satisfies {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_APP_ENV: "development" | "staging" | "production";
  VITE_ENABLE_ROUTES_DEBUG?: string;
};

export type Env = typeof env;
