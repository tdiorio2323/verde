# Brand Role Implementation Guide

Complete implementation of the BRAND role with isolated dashboards, RLS policies, and multi-tenant architecture.

## Overview

The brand role system enables:
- **Multi-tenant brand management** - Each brand has isolated data (products, menus, orders, customers)
- **Row-Level Security (RLS)** - Database enforces data isolation per brand
- **Role hierarchy** - ADMIN > BRAND > DRIVER > CUSTOMER
- **Invite system** - Admins and brand owners can invite team members
- **Session management** - Uses Zustand for client-side role derivation

---

## Architecture

### Role Priority

```
ADMIN (platform admin)
  ├─ Can manage all brands
  ├─ Can create brands
  └─ Can add/remove brand members

BRAND (brand owner/manager/staff)
  ├─ Can manage their brand's data
  ├─ Can invite team members
  └─ Brand-scoped access via RLS

DRIVER → CUSTOMER (existing roles)
```

### Database Schema

**Core Tables:**
- `admins` - Platform administrators
- `brands` - Brand/dispensary entities
- `brand_members` - User membership in brands (many-to-many)
- `brand_invites` - Invite tokens for onboarding
- `products` - Brand-owned product catalog
- `menus` - Brand-owned menu collections
- `menu_items` - Junction table (menus ↔ products)
- `customers` - Brand-owned customer records
- `orders` - Brand-owned order records

**Helper Functions:**
- `is_member_of_brand(brand_id)` - Checks if current user is a brand member
- `me_roles()` - Returns user's admin status and brand memberships

---

## Setup Instructions

### 1. Apply Database Migrations

```bash
# Push migrations to Supabase
supabase db push

# Or if using local Supabase:
supabase migration up
```

### 2. Mark Your Account as Admin

Replace `YOUR-USER-UUID` with your Supabase auth user ID:

```bash
# Via psql
psql "$SUPABASE_DB_URL" -c "INSERT INTO public.admins(user_id) VALUES ('YOUR-USER-UUID') ON CONFLICT DO NOTHING;"

# Or via Supabase SQL editor
INSERT INTO public.admins(user_id) VALUES ('YOUR-USER-UUID') ON CONFLICT DO NOTHING;
```

**Finding your user UUID:**
1. Sign in to your app
2. Open browser DevTools → Console
3. Run: `await (await fetch('/rest/v1/rpc/me_roles', {headers: {'apikey': 'YOUR_ANON_KEY', 'Authorization': 'Bearer YOUR_JWT'}})).json()`
4. Or check Supabase Dashboard → Authentication → Users

### 3. Seed Demo Data (Optional)

```bash
# Load demo brand with products, menus, customers, orders
psql "$SUPABASE_DB_URL" -f supabase/seed_brand_demo.sql
```

**Demo includes:**
- 1 brand: "Verde Demo Brand"
- 4 products: Sunset Gelato, Purple Haze, Lemon Fuel Cart, Gummies
- 1 public menu with all products
- 3 demo customers
- 3 demo orders (paid, delivered, pending)
- 1 invite token (see output for token)

### 4. Install Dependencies

```bash
npm install zustand
```

### 5. Start Development Server

```bash
npm run dev
```

---

## Usage

### Creating a Brand (Admin Only)

```typescript
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase
  .from("brands")
  .insert({
    name: "My Cannabis Co.",
    slug: "my-cannabis-co",
  })
  .select()
  .single();
```

### Adding Products to a Brand

```typescript
const { data, error } = await supabase
  .from("products")
  .insert({
    brand_id: brandId,
    name: "Blue Dream 3.5g",
    price_cents: 3500,
    active: true,
  });
```

### Creating a Menu

```typescript
// 1. Create menu
const { data: menu } = await supabase
  .from("menus")
  .insert({
    brand_id: brandId,
    name: "Evening Menu",
    is_public: true,
  })
  .select()
  .single();

// 2. Add products to menu
const { data: menuItems } = await supabase
  .from("menu_items")
  .insert([
    { menu_id: menu.id, product_id: product1.id, position: 0 },
    { menu_id: menu.id, product_id: product2.id, position: 1 },
  ]);
```

### Inviting Brand Members

```typescript
import { supabase } from "@/lib/supabase";

// Generate invite token
const token = crypto.randomUUID();
const { data: user } = await supabase.auth.getUser();

const { error } = await supabase.from("brand_invites").insert({
  brand_id: brandId,
  email: "new-member@example.com",
  token: token,
  created_by: user?.user?.id,
});

// Send invite URL: https://yourdomain.com/invite?token={token}
```

### Accepting an Invite

```typescript
// On invite page (/invite?token=...)
const token = new URLSearchParams(window.location.search).get("token");

const { data, error } = await supabase.rpc("accept_brand_invite", {
  invite_token: token,
});

if (data?.success) {
  // User is now a brand member, redirect to brand dashboard
  navigate("/dashboard/brand");
}
```

### Session State Management

```typescript
import { useSession } from "@/state/session";

function BrandComponent() {
  const { brandId, brandIds, isAdmin, role, refresh, setActiveBrand } = useSession();

  useEffect(() => {
    refresh(); // Fetch role data from Supabase
  }, []);

  // Switch active brand (if user is in multiple brands)
  const handleBrandChange = (newBrandId: string) => {
    setActiveBrand(newBrandId);
  };

  return <div>Active Brand: {brandId}</div>;
}
```

---

## Routes

| Path | Role Required | Description |
|------|--------------|-------------|
| `/dashboard/brand` | BRAND | Brand management dashboard |
| `/brand` | BRAND | Redirects to `/dashboard/brand` |

### Route Protection

The `ProtectedRoute` component enforces role requirements:

```tsx
<ProtectedRoute requireRole={ROLES.BRAND}>
  <BrandDashboard />
</ProtectedRoute>
```

If user doesn't have BRAND role, they're redirected to their default dashboard.

---

## Row-Level Security (RLS)

All brand data is protected by RLS policies:

### Brand Members Can:
- ✅ Read their brand's products, menus, customers, orders
- ✅ Write/update their brand's data
- ✅ Invite new members
- ❌ Access other brands' data

### Admins Can:
- ✅ Read/write all brands
- ✅ Create new brands
- ✅ Manage all brand members

### Public Users Can:
- ✅ Read products in public menus
- ❌ Access private brand data

### Example RLS Policy

```sql
-- Products are readable by:
-- 1. Platform admins
-- 2. Brand members
-- 3. Anyone if product is in a public menu
create policy "products_read_admin_member_or_public_menu"
on public.products for select
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
  or exists (
    select 1 from public.menu_items mi
    join public.menus m on m.id = mi.menu_id
    where mi.product_id = products.id and m.is_public = true
  )
);
```

---

## Client-Side Queries

Always filter by `brand_id` even though RLS enforces it:

```typescript
// Good: Explicit brand filter
const { data: products } = await supabase
  .from("products")
  .select("*")
  .eq("brand_id", brandId);

// Also works: RLS will filter automatically
const { data: products } = await supabase
  .from("products")
  .select("*");
// Returns only products user has access to
```

---

## Role Derivation

Client-side role is derived from server data:

```typescript
// src/lib/roles.ts
export function deriveRole(me: { isAdmin: boolean; brandIds: string[] }): Role {
  if (me.isAdmin) return ROLES.ADMIN;
  if (me.brandIds?.length) return ROLES.BRAND;
  return ROLES.CUSTOMER;
}
```

**Priority:**
1. If user is in `admins` table → ADMIN
2. If user is in `brand_members` for any brand → BRAND
3. Otherwise → CUSTOMER

---

## Multi-Brand Support

Users can be members of multiple brands:

```typescript
const { brandIds, brandId, setActiveBrand } = useSession();

// Switch active brand
if (brandIds.length > 1) {
  <select value={brandId} onChange={e => setActiveBrand(e.target.value)}>
    {brandIds.map(id => <option key={id} value={id}>{id}</option>)}
  </select>
}
```

---

## Testing

### 1. Test Admin Access

```bash
# Mark your account as admin
psql "$SUPABASE_DB_URL" -c "INSERT INTO public.admins(user_id) VALUES ('YOUR-UUID');"

# Verify in app
# 1. Sign in
# 2. Navigate to any dashboard
# 3. Open DevTools console:
# 4. Run: useSession.getState()
# 5. Check: { isAdmin: true, role: 'admin', ... }
```

### 2. Test Brand Member Access

```sql
-- Create a test brand
INSERT INTO public.brands (id, name, slug)
VALUES (gen_random_uuid(), 'Test Brand', 'test-brand');

-- Add yourself as brand member
INSERT INTO public.brand_members (brand_id, user_id, role)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'test-brand'),
  'YOUR-UUID',
  'owner'
);
```

### 3. Test RLS Isolation

```typescript
// As brand member, try to access another brand's products
const { data } = await supabase
  .from("products")
  .select("*")
  .eq("brand_id", "some-other-brand-id");

// Result: Empty array (RLS blocks access)
```

---

## Troubleshooting

### Issue: "You do not have permission to perform this action"

**Cause:** RLS policy blocking access

**Solutions:**
1. Verify user is admin: `SELECT * FROM public.admins WHERE user_id = auth.uid();`
2. Verify brand membership: `SELECT * FROM public.brand_members WHERE user_id = auth.uid();`
3. Check if using service_role key (bypasses RLS) vs anon key

### Issue: Role not updating after adding brand membership

**Cause:** Client cache not refreshed

**Solution:**
```typescript
const { refresh } = useSession();
await refresh(); // Fetches latest role data from server
```

### Issue: Can't create brands

**Cause:** Only admins can create brands

**Solution:**
```sql
-- Add yourself to admins table
INSERT INTO public.admins(user_id) VALUES ('YOUR-UUID');
```

---

## Next Steps

### Implement in UI

1. **Menu Manager** - CRUD for products and menus
2. **Order Management** - View/update order statuses
3. **Customer CRM** - View customer profiles and history
4. **Invite System** - UI for generating and sending invites
5. **Brand Switcher** - Dropdown for multi-brand users

### API Enhancements

1. **Edge Functions** - Send invite emails
2. **Webhooks** - Notify brand members of new orders
3. **Analytics** - Brand-scoped revenue/order analytics
4. **Bulk Operations** - Import products via CSV

---

## Files Created

```
src/
  constants/
    roles.ts                      # Role constants (ADMIN, BRAND, DRIVER, CUSTOMER)
  lib/
    roles.ts                      # Role derivation logic
  state/
    session.ts                    # Zustand store for session management
  pages/
    BrandDashboard.tsx            # Brand dashboard page component
  router.tsx                      # Updated with brand route

supabase/
  migrations/
    20251016_brand_role.sql       # Core schema + RLS policies
    20251016_brand_invites.sql    # Invite system
  seed_brand_demo.sql             # Demo data seeder
```

---

## Security Considerations

✅ **RLS Enforced** - All brand data protected at database level  
✅ **No Service Role in Client** - Client uses anon key with RLS  
✅ **Invite Expiration** - Tokens expire after 14 days  
✅ **Role Hierarchy** - Admins can override brand restrictions  
✅ **Audit Trail** - created_at, created_by tracked on invites  

⚠️ **TODO:**
- Rate limit invite creation (prevent spam)
- Email verification before accepting invites
- Audit logs for sensitive brand operations
- 2FA for brand owner accounts

---

## Support

For issues or questions:
1. Check RLS policies in Supabase Dashboard → Database → Policies
2. Verify role data: `SELECT * FROM me_roles();` in SQL editor
3. Check browser console for auth errors
4. Review migration logs for any failed statements

---

**Last Updated:** 2025-10-16  
**Version:** 1.0.0

