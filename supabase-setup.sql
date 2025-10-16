-- Verde Cannabis Marketplace - Supabase Database Schema
-- This script sets up the database tables and Row Level Security (RLS) policies
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE PROFILES TABLE
-- =====================================================

-- Drop table if exists (for development only - remove for production)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT,
    age_verified BOOLEAN DEFAULT FALSE NOT NULL,
    role TEXT CHECK (role IN ('customer', 'driver', 'admin')) DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access and age verification';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id (automatic from Supabase Auth)';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number in E.164 format (+1234567890)';
COMMENT ON COLUMN public.profiles.full_name IS 'User full name (optional)';
COMMENT ON COLUMN public.profiles.age_verified IS 'Whether user has confirmed 21+ age requirement';
COMMENT ON COLUMN public.profiles.role IS 'User role: customer (default), driver, or admin';

-- =====================================================
-- 3. CREATE FUNCTION TO AUTO-UPDATE updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profiles table
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (auto-created on first login)
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
    ON public.profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 5. FUNCTION TO CREATE PROFILE ON USER SIGNUP
-- =====================================================

-- This function automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, phone, age_verified, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.phone, ''),
        FALSE,
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant authenticated users access to profiles table
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- 7. TEST DATA (OPTIONAL - FOR DEVELOPMENT ONLY)
-- =====================================================

-- Uncomment to create test admin account (replace with your actual user ID after first login)
-- UPDATE public.profiles SET role = 'admin', age_verified = TRUE WHERE phone = '+1234567890';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- 
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Copy .env.local.example to .env.local and add your credentials
-- 3. Test login with phone OTP in your app
-- 4. Verify profile is created automatically in profiles table
--
-- To make yourself an admin:
-- 1. Sign in to your app with your phone number
-- 2. Find your user ID in the Supabase dashboard (Authentication > Users)
-- 3. Run: UPDATE public.profiles SET role = 'admin', age_verified = TRUE WHERE id = 'your-user-id-here';
--

