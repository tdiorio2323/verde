import type { Session } from "@supabase/supabase-js";
import type { AuthUser } from "@/shared/types/app";
import type { Role } from "@/shared/types/app";

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: Error | null }>;
  refreshUser: () => Promise<void>;
};