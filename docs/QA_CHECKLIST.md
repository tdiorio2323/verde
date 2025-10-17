# QA Checklist - Brand Role System

Complete testing checklist for the brand role and invite system.

---

## Prerequisites

### 1. Database Setup

```bash
# Apply all migrations
supabase db push

# Verify migrations applied
supabase db remote --workdir . \
  --db-url "$SUPABASE_DB_URL" \
  list
```

**Expected migrations:**

- ✅ `20251016_brand_role.sql`
- ✅ `20251016_brand_invites.sql`
- ✅ `20251016_invite_redeem.sql`
- ✅ `20251016_customer_invites.sql`

### 2. Admin Setup

```sql
-- Get your user UUID from Supabase Dashboard → Authentication → Users
-- Replace YOUR-UUID below

INSERT INTO public.admins(user_id)
VALUES ('YOUR-UUID')
ON CONFLICT DO NOTHING;

-- Verify
SELECT * FROM public.admins WHERE user_id = 'YOUR-UUID';
```

### 3. Seed Demo Data (Optional)

```bash
psql "$SUPABASE_DB_URL" -f supabase/seed_brand_demo.sql
```

---

## Test Cases

### ✅ Test 1: Admin Role Assignment

**Steps:**

1. Sign in to the application
2. Open browser DevTools → Console
3. Run: `window.location.href = '/dashboard/admin'`
4. Verify you can access the admin dashboard

**Expected:**

- ✅ No redirect to landing page
- ✅ Admin dashboard loads successfully
- ✅ Can see "Admin Command center" or similar UI

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 2: Brand Invite Generation

**Steps:**

1. In Supabase SQL Editor, run:

```sql
-- Get your brand_id from seed
SELECT id, name FROM public.brands WHERE slug = 'verde-demo-brand';

-- Generate invite
INSERT INTO public.brand_invites (brand_id, email, token, created_by)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'verde-demo-brand'),
  'test@example.com',
  'test-invite-token-123',
  (SELECT user_id FROM public.admins LIMIT 1)
);

-- Verify
SELECT * FROM public.brand_invites WHERE token = 'test-invite-token-123';
```

**Expected:**

- ✅ Insert succeeds
- ✅ Invite row created with correct brand_id
- ✅ expires_at is ~14 days in future

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 3: Brand Invite Acceptance (Authenticated)

**Steps:**

1. Ensure you're signed in
2. Navigate to: `/accept-brand-invite?token=test-invite-token-123`
3. Wait for processing

**Expected:**

- ✅ Redirect to `/dashboard/brand`
- ✅ BrandDashboard loads successfully
- ✅ Check membership: `SELECT * FROM public.brand_members WHERE user_id = 'YOUR-UUID';`
- ✅ Invite marked accepted: `SELECT accepted_at FROM public.brand_invites WHERE token = 'test-invite-token-123';`

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 4: Brand Invite Acceptance (Unauthenticated)

**Steps:**

1. Sign out
2. Navigate to: `/accept-brand-invite?token=another-test-token`
3. Observe behavior

**Expected:**

- ✅ Shows "Sign in to continue" message
- ✅ Does NOT create brand membership
- ✅ After signing in and revisiting link → membership created

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 5: Customer Invite Generation

**Steps:**

```sql
INSERT INTO public.customer_invites (brand_id, email, token, created_by)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'verde-demo-brand'),
  'customer@example.com',
  'customer-invite-token-456',
  (SELECT user_id FROM public.admins LIMIT 1)
);

-- Verify
SELECT * FROM public.customer_invites WHERE token = 'customer-invite-token-456';
```

**Expected:**

- ✅ Insert succeeds
- ✅ expires_at is ~30 days in future

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 6: Customer Invite Acceptance (Signed In)

**Steps:**

1. Sign in to application
2. Navigate to: `/accept-invite?token=customer-invite-token-456`
3. Wait for processing

**Expected:**

- ✅ Redirect to `/dashboard`
- ✅ Customer record created: `SELECT * FROM public.customers WHERE brand_id = 'BRAND-UUID' AND user_id = 'YOUR-UUID';`
- ✅ Invite marked accepted

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 7: Customer Invite Acceptance (Signed Out)

**Steps:**

1. Sign out
2. Navigate to: `/accept-invite?token=customer-invite-token-789`
3. Observe behavior

**Expected:**

- ✅ Shows "Joining Brand…" message
- ✅ Customer record created with email but no user_id
- ✅ Redirect to `/dashboard` (will show sign-in prompt)

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 8: RLS Isolation - Brand Data

**Steps:**

```sql
-- Create second brand
INSERT INTO public.brands (id, name, slug)
VALUES (gen_random_uuid(), 'Other Brand', 'other-brand');

-- Try to access other brand's products (should fail via RLS)
-- Run this as your authenticated user in client:
```

```typescript
const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("brand_id", "OTHER-BRAND-UUID-HERE");
```

**Expected:**

- ✅ Returns empty array `[]`
- ✅ No error (RLS silently filters)
- ✅ Cannot see other brand's data

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 9: RLS Admin Override

**Steps:**

```typescript
// As admin, query all brands
const { data, error } = await supabase.from("brands").select("*");

// Should see ALL brands including ones you're not a member of
```

**Expected:**

- ✅ Returns all brands (admin override)
- ✅ Can see verde-demo-brand AND other-brand

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 10: Role Derivation

**Steps:**

1. In browser console:

```typescript
import { useSession } from "@/state/session";
const session = useSession.getState();
await session.refresh();
console.log(session);
```

**Expected:**

```javascript
{
  isAdmin: true,
  brandIds: ["UUID1", "UUID2", ...],
  role: "admin", // or "brand" if not admin but has brandIds
  brandId: "UUID1",
  loading: false
}
```

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 11: Expired Invite Token

**Steps:**

```sql
-- Create expired invite
INSERT INTO public.brand_invites (brand_id, email, token, created_by, expires_at)
VALUES (
  (SELECT id FROM public.brands LIMIT 1),
  'expired@example.com',
  'expired-token',
  (SELECT user_id FROM public.admins LIMIT 1),
  now() - interval '1 day' -- already expired
);
```

2. Navigate to: `/accept-brand-invite?token=expired-token`

**Expected:**

- ✅ Shows error: "invalid_or_expired_invite"
- ✅ Does NOT create membership
- ✅ Does NOT redirect

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 12: Duplicate Invite Acceptance

**Steps:**

1. Accept a valid invite token (should succeed)
2. Try to accept the same token again

**Expected:**

- ✅ Second attempt fails with "invalid_or_expired_invite"
- ✅ Invite already marked as accepted (accepted_at NOT NULL)
- ✅ No duplicate membership created

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 13: Multi-Brand Membership

**Steps:**

```sql
-- Create second brand
INSERT INTO public.brands (id, name, slug)
VALUES (gen_random_uuid(), 'Second Brand', 'second-brand');

-- Add yourself as member
INSERT INTO public.brand_members (brand_id, user_id, role)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'second-brand'),
  'YOUR-UUID',
  'owner'
);

-- Verify
SELECT * FROM public.brand_members WHERE user_id = 'YOUR-UUID';
```

2. Navigate to `/dashboard/brand`
3. Check if brand switcher appears

**Expected:**

- ✅ Brand switcher dropdown visible (if brandIds.length > 1)
- ✅ Can switch between brands
- ✅ Data updates when switching brands

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 14: Public Menu Access (Unauthenticated)

**Steps:**

1. Sign out
2. Try to access products in public menu:

```typescript
const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("brand_id", "BRAND-UUID-WITH-PUBLIC-MENU");
```

**Expected:**

- ✅ Returns products (RLS allows public menu access)
- ✅ No auth required

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 15: Private Menu Access (Non-Member)

**Steps:**

```sql
-- Create private menu
INSERT INTO public.menus (brand_id, name, is_public)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'verde-demo-brand'),
  'Private VIP Menu',
  false
);
```

2. As non-member, try to access:

```typescript
const { data } = await supabase
  .from("menus")
  .select("*")
  .eq("brand_id", "BRAND-UUID")
  .eq("is_public", false);
```

**Expected:**

- ✅ Returns empty array (RLS blocks)
- ✅ Only brand members can see private menus

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 16: Environment Variable - Debug Routes

**Steps:**

1. Check `.env.development`:

```bash
cat .env.development
# Should contain: VITE_ENABLE_ROUTES_DEBUG=true
```

2. Navigate to `/_routes`

**Expected:**

- ✅ In development: RoutesDebug page loads
- ✅ In production (after `npm run build`): Should NOT exist (404)

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

### ✅ Test 17: Production Build

**Steps:**

```bash
# Build for production
npm run build

# Check for debug routes in build
grep -r "RoutesDebug" dist/
```

**Expected:**

- ✅ Build succeeds
- ✅ No errors in console
- ✅ RoutesDebug NOT included in production bundle (if VITE_ENABLE_ROUTES_DEBUG=false)

**Actual:**

- [ ] Pass
- [ ] Fail: ******\_\_\_******

---

## Summary Checklist

- [ ] ✅ All migrations applied successfully
- [ ] ✅ Admin role assignment works
- [ ] ✅ Brand invite generation works
- [ ] ✅ Brand invite acceptance (authenticated) works
- [ ] ✅ Brand invite acceptance (unauthenticated) shows proper prompt
- [ ] ✅ Customer invite generation works
- [ ] ✅ Customer invite acceptance (signed in) works
- [ ] ✅ Customer invite acceptance (signed out) creates unlinked record
- [ ] ✅ RLS isolates brand data correctly
- [ ] ✅ Admin can override RLS and see all brands
- [ ] ✅ Role derivation logic works (me_roles RPC)
- [ ] ✅ Expired tokens are rejected
- [ ] ✅ Duplicate invite acceptance is prevented
- [ ] ✅ Multi-brand membership works
- [ ] ✅ Public menus are accessible without auth
- [ ] ✅ Private menus are restricted to members
- [ ] ✅ Debug routes are gated by environment variable
- [ ] ✅ Production build succeeds

---

## Troubleshooting

### Issue: "invalid_or_expired_invite"

**Causes:**

- Token already used (accepted_at NOT NULL)
- Token expired (expires_at < now())
- Token doesn't exist
- Wrong token value

**Debug:**

```sql
SELECT * FROM public.brand_invites WHERE token = 'YOUR-TOKEN';
-- Check accepted_at and expires_at columns
```

### Issue: RLS blocking legitimate access

**Causes:**

- User not in admins table
- User not in brand_members for that brand
- Trying to access private menu as non-member

**Debug:**

```sql
-- Check admin status
SELECT * FROM public.admins WHERE user_id = auth.uid();

-- Check brand membership
SELECT * FROM public.brand_members WHERE user_id = auth.uid();

-- Test RLS function
SELECT public.is_member_of_brand('BRAND-UUID');
```

### Issue: Role not updating after accepting invite

**Cause:** Client cache not refreshed

**Fix:**

```typescript
import { useSession } from "@/state/session";
const { refresh } = useSession.getState();
await refresh();
```

---

## Performance Benchmarks

After completing QA, measure:

- [ ] Time to accept brand invite: **\_**ms
- [ ] Time to accept customer invite: **\_**ms
- [ ] Time to load /dashboard/brand: **\_**ms
- [ ] Time to query brand products: **\_**ms
- [ ] Time to switch brands: **\_**ms

---

**QA Completed By:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Environment:** Development / Staging / Production  
**Build:** ******\_\_\_******

---

**Last Updated:** 2025-10-16
