# Verde Audit Report

## Build Status
- **Build**: ✅ PASS (197 KB gzipped)
- **Typecheck**: ✅ PASS (0 errors)
- **Lint**: ✅ PASS (1 warning, non-blocking)

## Env Keys Required
From `npm run audit:env`:
- VITE_SUPABASE_URL (✅ set)
- VITE_SUPABASE_ANON_KEY (✅ set)

## Auth & Security
- **RLS**: profiles + age gate present
- **Route Protection**: `<ProtectedRoute>` component (client-side, Vite doesn't support middleware)
- **Age Gate**: Modal enforces 21+ with `age_verified` flag in DB

## Next 60 Minutes
1. Enable Phone provider in Supabase dashboard
2. Add test pair: `+1234567890` with OTP `123456`
3. Run SQL migration: `supabase/sql/2025-10-16-age-gate.sql`
4. Smoke test login flow

## Files
- `src/lib/supabase.ts` - Client config
- `src/components/auth/ProtectedRoute.tsx` - Route guard
- `src/contexts/AuthContext.tsx` - Auth hooks
- `supabase-setup.sql` - Full migration (150 lines)
- `supabase/sql/2025-10-16-age-gate.sql` - Compact migration (30 lines)
