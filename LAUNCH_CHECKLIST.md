# 🚀 Verde Launch Checklist

Complete pre-launch verification for the brand + customer invite infrastructure.

---

## Prerequisites

### Environment Setup

```bash
# 1. Set Supabase connection string
export SUPABASE_DB_URL='postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres'

# 2. Verify Supabase CLI is installed
supabase --version

# 3. Verify PostgreSQL client is installed
psql --version
```

---

## Step 1: Deploy Migrations

### Automated (Recommended)

```bash
./scripts/deploy-migrations.sh
```

### Manual

```bash
# Push migrations
supabase db push

# Seed demo data (optional)
psql "$SUPABASE_DB_URL" -f supabase/seed_brand_demo.sql
```

**Verify:**
```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('brands', 'brand_members', 'brand_invites', 'customer_invites', 'admins');

-- Check RPCs exist
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('redeem_brand_invite', 'redeem_customer_invite', 'me_roles');

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'brands';
```

**Expected Output:**
- ✅ 5+ tables created
- ✅ 3+ RPC functions created
- ✅ RLS enabled on all brand tables

---

## Step 2: Configure Admin Access

### Get Your User UUID

1. Sign in to your app at `http://localhost:8080`
2. Go to Supabase Dashboard → Authentication → Users
3. Copy your User ID (UUID format)

### Mark as Admin

```sql
-- Replace YOUR-UUID with your actual user UUID
INSERT INTO public.admins(user_id) 
VALUES ('YOUR-UUID') 
ON CONFLICT DO NOTHING;

-- Verify
SELECT * FROM public.admins WHERE user_id = 'YOUR-UUID';
```

**Expected Output:**
```
          user_id          
--------------------------
 YOUR-UUID
```

---

## Step 3: Email Service Integration

### Option A: Resend (Recommended)

```bash
# Install Resend
npm install resend

# Add to .env.local
echo "VITE_RESEND_API_KEY=re_your_api_key" >> .env.local
```

Update `src/lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendBrandInvite({ email, brandName, token, expiresAt }) {
  await resend.emails.send({
    from: 'Verde <noreply@verde.com>',
    to: email,
    subject: `You've been invited to manage ${brandName}`,
    html: getBrandInviteTemplate({ email, brandName, token, expiresAt }),
  });
}
```

### Option B: SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@verde.com',
  subject: `You've been invited to manage ${brandName}`,
  html: getBrandInviteTemplate({ email, brandName, token, expiresAt }),
});
```

### Configure URLs

Update `.env.production`:
```bash
VITE_ENABLE_ROUTES_DEBUG=false
VITE_PUBLIC_HOST=https://verde.tdstudiosdigital.com
```

---

## Step 4: Smoke Tests

### Automated

```bash
# Replace YOUR-UUID with your actual user UUID
./scripts/smoke-test.sh YOUR-UUID
```

### Manual Tests

#### Test 1: Brand Invite Generation

```sql
INSERT INTO public.brand_invites (brand_id, email, token, created_by)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'verde-demo-brand'),
  'test-brand@example.com',
  'test-brand-token-123',
  (SELECT user_id FROM public.admins LIMIT 1)
);
```

#### Test 2: Brand Invite Acceptance

1. **Sign in** to your app
2. **Navigate to:** `http://localhost:8080/accept-brand-invite?token=test-brand-token-123`
3. **Expected:** Redirects to `/dashboard/brand`
4. **Verify:**
   ```sql
   SELECT * FROM public.brand_members 
   WHERE user_id = 'YOUR-UUID' AND brand_id = (SELECT id FROM brands WHERE slug = 'verde-demo-brand');
   ```

#### Test 3: Customer Invite Generation

```sql
INSERT INTO public.customer_invites (brand_id, email, token, created_by)
VALUES (
  (SELECT id FROM public.brands WHERE slug = 'verde-demo-brand'),
  'test-customer@example.com',
  'test-customer-token-456',
  (SELECT user_id FROM public.admins LIMIT 1)
);
```

#### Test 4: Customer Invite Acceptance

1. **Navigate to:** `http://localhost:8080/accept-invite?token=test-customer-token-456`
2. **Expected:** Redirects to `/dashboard`
3. **Verify:**
   ```sql
   SELECT * FROM public.customers 
   WHERE brand_id = (SELECT id FROM brands WHERE slug = 'verde-demo-brand')
     AND email = 'test-customer@example.com';
   ```

#### Test 5: RLS Isolation

```typescript
// In browser console (as authenticated user)
const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("brand_id", "some-other-brand-id");

// Expected: Empty array (RLS blocks access)
console.log(data); // []
```

#### Test 6: Admin Override

```typescript
// As admin user
const { data } = await supabase
  .from("brands")
  .select("*");

// Expected: All brands visible (admin override)
console.log(data); // [{ id: ..., name: ... }, ...]
```

---

## Step 5: Production Settings

### Environment Variables

Create `.env.production`:
```bash
VITE_ENABLE_ROUTES_DEBUG=false
VITE_PUBLIC_HOST=https://verde.tdstudiosdigital.com
VITE_RESEND_API_KEY=re_your_production_key
```

### Build Test

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Verify /_routes does NOT load (should 404)
curl http://localhost:4173/_routes
```

### Deployment

```bash
# Deploy to Vercel
vercel --prod

# Or deploy to your hosting platform
npm run build
# Upload dist/ to your server
```

---

## Step 6: Post-Launch Verification

### Production Checklist

- [ ] ✅ Migrations applied to production database
- [ ] ✅ Admin account(s) configured
- [ ] ✅ Email service connected and tested
- [ ] ✅ Environment variables set correctly
- [ ] ✅ VITE_ENABLE_ROUTES_DEBUG=false in production
- [ ] ✅ Brand invite flow works end-to-end
- [ ] ✅ Customer invite flow works end-to-end
- [ ] ✅ RLS blocks cross-brand access
- [ ] ✅ Admin can see all brands
- [ ] ✅ Expired tokens are rejected
- [ ] ✅ Duplicate redemptions prevented
- [ ] ✅ Production build succeeds
- [ ] ✅ No console errors in production

### Monitoring

Set up alerts for:
- Failed invite redemptions
- RLS policy violations
- Expired invite attempts
- Email delivery failures

---

## Troubleshooting

### Issue: Migrations fail to apply

**Solution:**
```bash
# Check Supabase connection
psql "$SUPABASE_DB_URL" -c "SELECT version();"

# Reset local migrations (if needed)
supabase db reset

# Re-apply migrations
supabase db push
```

### Issue: "invalid_or_expired_invite"

**Debug:**
```sql
-- Check invite exists and is valid
SELECT * FROM public.brand_invites WHERE token = 'YOUR-TOKEN';

-- Check columns: accepted_at (should be NULL), expires_at (should be future)
```

### Issue: RLS blocking admin access

**Solution:**
```sql
-- Verify admin status
SELECT * FROM public.admins WHERE user_id = auth.uid();

-- If missing, add admin
INSERT INTO public.admins(user_id) VALUES ('YOUR-UUID');
```

### Issue: Email not sending

**Debug:**
```typescript
// Check environment variable
console.log(import.meta.env.VITE_RESEND_API_KEY);

// Check email service logs
// Resend: https://resend.com/logs
// SendGrid: https://app.sendgrid.com/email_activity
```

---

## Performance Benchmarks

Record these metrics after launch:

- [ ] Time to accept brand invite: _____ms
- [ ] Time to accept customer invite: _____ms
- [ ] Time to load /dashboard/brand: _____ms
- [ ] Time to query brand products: _____ms
- [ ] Email delivery time: _____s

---

## Support

### Key Documentation

- **Setup Guide:** `docs/BRAND_ROLE_SETUP.md`
- **QA Checklist:** `docs/QA_CHECKLIST.md`
- **Email Templates:** `docs/EMAIL_TEMPLATES.md`
- **Invite System:** `docs/INVITE_SYSTEM_SUMMARY.md`

### Database Schema

- **Migrations:** `supabase/migrations/`
- **Seed Data:** `supabase/seed_brand_demo.sql`

### Frontend

- **Brand Dashboard:** `src/pages/BrandDashboard.tsx`
- **Invite Pages:** `src/pages/AcceptBrandInvite.tsx`, `src/pages/AcceptCustomerInvite.tsx`
- **Email Service:** `src/lib/email.ts`

---

## Launch Day Commands

```bash
# 1. Deploy migrations
./scripts/deploy-migrations.sh

# 2. Configure admin
psql "$SUPABASE_DB_URL" -c "INSERT INTO public.admins(user_id) VALUES ('YOUR-UUID');"

# 3. Run smoke tests
./scripts/smoke-test.sh YOUR-UUID

# 4. Build production
npm run build

# 5. Deploy
vercel --prod
```

---

**Status:** 🟢 Ready for launch  
**Last Updated:** 2025-10-16  
**Version:** 1.0.0

---

## Sign-Off

- [ ] Database migrations deployed _________________ (Name/Date)
- [ ] Admin configured _________________ (Name/Date)
- [ ] Email service tested _________________ (Name/Date)
- [ ] Smoke tests passed _________________ (Name/Date)
- [ ] Production deployed _________________ (Name/Date)

**Launch approved by:** _________________ **Date:** _________________

