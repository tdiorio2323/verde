import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(10, "VITE_SUPABASE_ANON_KEY must be at least 10 characters"),
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  VITE_ENABLE_ROUTES_DEBUG: z.string().optional(),
});

/**
 * Validated environment variables
 * @throws {ZodError} if environment variables are invalid
 */
export const env = envSchema.parse(import.meta.env);

export type Env = z.infer<typeof envSchema>;
