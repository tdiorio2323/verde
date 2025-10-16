import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env.local file.'
  );
}

/**
 * Supabase client instance for Verde Cannabis Marketplace.
 * Configured for authentication and real-time subscriptions.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
          role: 'customer' | 'driver' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone: string;
          full_name?: string | null;
          age_verified?: boolean;
          role?: 'customer' | 'driver' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          full_name?: string | null;
          age_verified?: boolean;
          role?: 'customer' | 'driver' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

