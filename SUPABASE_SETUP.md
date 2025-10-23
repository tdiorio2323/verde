# Supabase Setup Guide

This document outlines the Supabase configuration required for the Verde Cannabis Marketplace.

## Environment Variables

Set these in your `.env.local` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: Both `VITE_*` and `NEXT_PUBLIC_*` prefixes are supported due to `envPrefix` in `vite.config.ts`.

## Database Schema

The application uses these main tables:
- `profiles` - User profiles with roles (customer, driver, admin, brand)
- `brand_invites` - Brand invitation system
- `customer_invites` - Customer invitation system

## Storage Configuration

### Required Bucket: "designs"

Create a storage bucket named `designs` for the design library feature:

1. Navigate to Storage in your Supabase dashboard
2. Click "New bucket"
3. Name: `designs`
4. Public: Enable if you want direct public access

### Storage Policies

For public read access to the designs bucket, run this SQL:

```sql
-- Enable public read access for storage.objects in bucket "designs"
create policy "Public read designs"
  on storage.objects for select
  using ( bucket_id = 'designs' );

-- Optional: Enable public read access for storage.buckets
create policy "Public bucket access"
  on storage.buckets for select
  using ( name = 'designs' );
```

**Note**: Remove these policies if you prefer using signed URLs only for enhanced security.

### Alternative: Signed URLs Only

If you prefer private storage with signed URLs:

1. Keep the bucket private (no public policies)
2. The application will automatically fall back to signed URLs
3. URLs expire after 24 hours for security

## Type Generation

Generate TypeScript types from your Supabase schema:

```bash
# Add your project ID to this command
pnpm supabase:types

# Or run manually:
supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/shared/types/supabase.ts
```

## Row Level Security (RLS)

The following tables should have RLS enabled:
- `profiles` - Users can only read/update their own profile
- `brand_invites` - Restricted access based on invite tokens
- `customer_invites` - Restricted access based on invite tokens

## Testing the Setup

1. **Verify environment**: Run `pnpm check:env`
2. **Test designs bucket**: Visit `/designs` route
3. **Expected result**: Asset count > 0 if files are uploaded
4. **Debug info**: Check browser console for detailed logs

## Troubleshooting

### Storage Access Issues
- **403 Forbidden**: Check storage policies above
- **Empty bucket**: Upload test files to `/designs`
- **Network errors**: Verify SUPABASE_URL and ANON_KEY

### Authentication Issues
- **Invalid JWT**: Regenerate anon key in Supabase dashboard
- **CORS errors**: Ensure domain is added to allowed origins

For more help, see the [Troubleshooting section in README.md](./README.md#troubleshooting).

---

## Complete Authentication Setup

For detailed authentication setup including phone OTP, age verification, and role-based access, see the sections below:

### Phone Authentication Setup

1. Go to your Supabase Dashboard → Authentication → Providers
2. Enable **Phone** authentication
3. Configure SMS provider (Twilio recommended for production)

### Database Migration

Run the `supabase-setup.sql` script in your Supabase SQL Editor to create:
- `profiles` table with user data
- Row Level Security (RLS) policies  
- Automatic profile creation trigger
- Auto-update timestamp function

### Testing Authentication

```bash
pnpm dev
```

1. Open http://localhost:8080
2. Test phone OTP login flow
3. Verify age verification modal (21+ compliance)
4. Test role-based route access

For complete authentication setup details, configuration options, troubleshooting, and security features, see the detailed sections in this file above.

### 2. Enable Phone Authentication in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your Verde project
3. Navigate to **Authentication** → **Providers**
4. Enable **Phone** authentication
5. Configure your SMS provider:
   - **Recommended**: Twilio (requires Twilio account)
   - **For Testing**: Use Supabase's test phone provider (limited to test numbers)

#### Twilio Setup (Recommended for Production)

1. Sign up for Twilio: https://www.twilio.com/try-twilio
2. Get your Twilio Account SID and Auth Token
3. In Supabase, under Phone provider settings:
   - Enter your Twilio Account SID
   - Enter your Twilio Auth Token
   - Enter your Twilio Phone Number (must be verified)
4. Save changes

#### Test Phone Provider (Development Only)

1. In Supabase Phone settings, enable "Test Phone Provider"
2. Add test phone numbers like: `+1234567890` with OTP: `123456`
3. This is only for development - not for production!

### 3. Run Database Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your Verde project
3. Navigate to **SQL Editor**
4. Click **New query**
5. Copy the entire contents of `supabase-setup.sql` file
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:

- ✅ `profiles` table with user data
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation trigger
- ✅ Auto-update timestamp function

### 4. Verify Database Setup

1. In Supabase Dashboard, go to **Table Editor**
2. You should see the `profiles` table
3. Check the columns match the schema:
   - `id` (uuid, primary key)
   - `phone` (text)
   - `full_name` (text, nullable)
   - `age_verified` (boolean, default false)
   - `role` (text, default 'customer')
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

### 5. Test the Application

```bash
cd /Users/tylerdiorio/verde
npm run dev
```

1. Open http://localhost:8080 in your browser
2. Click **Sign In** button
3. Enter your phone number in E.164 format: `+1234567890`
4. Click **Send Verification Code**
5. Check your phone for the 6-digit OTP
6. Enter the OTP code
7. Click **Verify & Sign In**
8. You should see the **Age Verification Modal**
9. Confirm you're 21+ and continue
10. You should now be logged in and see the Dashboard!

### 6. Make Yourself an Admin (Optional)

After your first successful login:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user and copy the User ID (UUID)
3. Go to **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin', age_verified = TRUE
WHERE id = 'your-user-id-here';
```

4. Refresh your app - you should now have access to Admin and Driver views!

## 🔒 Security Features Implemented

### Row Level Security (RLS)

- ✅ Users can only view/edit their own profile
- ✅ Admins can view/edit all profiles
- ✅ Automatic profile creation on signup
- ✅ Age verification required for dashboard access
- ✅ Role-based route protection

### Authentication Flow

- ✅ Phone OTP authentication (SMS)
- ✅ Session persistence (localStorage)
- ✅ Auto token refresh
- ✅ Protected routes with redirect
- ✅ Age verification modal (21+ compliance)

## 📁 Files Created

- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `src/contexts/AuthContext.tsx` - Authentication context and hooks
- ✅ `src/components/auth/LoginModal.tsx` - Phone OTP login UI
- ✅ `src/components/auth/AgeVerificationModal.tsx` - 21+ age verification
- ✅ `src/components/auth/ProtectedRoute.tsx` - Route protection wrapper
- ✅ `supabase-setup.sql` - Database migration script
- ✅ `.env.local.example` - Environment variable template

## 🔧 Troubleshooting

### "Missing Supabase environment variables"

- Make sure you created `.env.local` file
- Restart dev server after creating `.env.local`

### "Error sending OTP" / "Verification Failed"

- Check that Phone authentication is enabled in Supabase
- Verify Twilio credentials are correct
- For testing, use Test Phone Provider with test numbers

### "Profile not created automatically"

- Check if the trigger `on_auth_user_created` exists in Supabase
- Re-run the migration SQL if needed
- Check Supabase logs for errors

### "Age verification modal won't close"

- The modal is intentionally persistent until verified
- Check that `age_verified` is being updated in database
- Check browser console for errors

### "Can't access driver/admin routes"

- Check your user's `role` in the `profiles` table
- Update role with SQL query shown in Step 6
- Refresh the page after changing role

## 📊 Database Schema Overview

```
auth.users (Supabase managed)
  ├── id (uuid)
  ├── phone (text)
  └── ... (other auth fields)

public.profiles (Custom table)
  ├── id (uuid) → references auth.users.id
  ├── phone (text, unique)
  ├── full_name (text, nullable)
  ├── age_verified (boolean, default: false)
  ├── role (text, default: 'customer')
  ├── created_at (timestamptz)
  └── updated_at (timestamptz)
```

## 🎯 Next Steps

1. ✅ Test phone authentication
2. ✅ Verify age verification modal works
3. ✅ Test role-based access (customer, driver, admin)
4. ⏭️ Configure Twilio for production SMS
5. ⏭️ Add user profile editing (full_name, etc.)
6. ⏭️ Implement real-time order tracking with Supabase Realtime
7. ⏭️ Add product/order/inventory tables to database

## 📚 Resources

- [Supabase Phone Auth Docs](https://supabase.com/docs/guides/auth/phone-login)
- [Twilio Setup Guide](https://www.twilio.com/docs/sms)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Setup Complete! 🎉**

Your Verde Cannabis Marketplace now has:

- ✅ Phone OTP authentication
- ✅ Age verification (21+ compliance)
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Session management
- ✅ User profiles

Ready to test? Run `npm run dev` and sign in!
