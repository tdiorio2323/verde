import { createClient } from '@supabase/supabase-js';
import { env } from '@/shared/config/env';

/**
 * Centralized Supabase client instance for Verde Cannabis Marketplace.
 * Uses validated environment variables from @/shared/config/env
 * Configured for authentication and real-time subscriptions.
 */
export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'verde-auth-token',
  },
});

/**
 * Type definitions for Supabase database tables.
 * Extend this as you add more tables to your schema.
 * 
 * @todo Generate types automatically using:
 * `supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/shared/types/supabase.ts`
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string;
          full_name: string | null;
          age_verified: boolean;
          role: 'customer' | 'driver' | 'admin' | 'brand';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone: string;
          full_name?: string | null;
          age_verified?: boolean;
          role?: 'customer' | 'driver' | 'admin' | 'brand';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          full_name?: string | null;
          age_verified?: boolean;
          role?: 'customer' | 'driver' | 'admin' | 'brand';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

