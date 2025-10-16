#!/bin/bash
#
# Deploy Verde migrations and seed data to Supabase
# Usage: ./scripts/deploy-migrations.sh
#

set -e

echo "🚀 Deploying Verde migrations..."

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "❌ Error: SUPABASE_DB_URL not set"
  echo "   Set it with: export SUPABASE_DB_URL='your-connection-string'"
  exit 1
fi

# Push migrations
echo "📦 Pushing migrations to Supabase..."
supabase db push

# Seed demo data (optional)
read -p "🌱 Seed demo data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌱 Seeding demo data..."
  psql "$SUPABASE_DB_URL" -f supabase/seed_brand_demo.sql
  echo "✅ Demo data seeded"
fi

# Verify RPCs exist
echo "🔍 Verifying RPCs..."
psql "$SUPABASE_DB_URL" -c "
  SELECT 
    routine_name as function_name,
    routine_type as type
  FROM information_schema.routines
  WHERE routine_schema = 'public'
    AND routine_name LIKE '%redeem%' OR routine_name = 'me_roles'
  ORDER BY routine_name;
"

# Verify tables exist
echo "🔍 Verifying tables..."
psql "$SUPABASE_DB_URL" -c "
  SELECT 
    tablename,
    hasindexes,
    hasrules
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN ('brands', 'brand_members', 'brand_invites', 'customer_invites', 'admins', 'products', 'menus', 'customers', 'orders')
  ORDER BY tablename;
"

# Check RLS status
echo "🔍 Verifying RLS enabled..."
psql "$SUPABASE_DB_URL" -c "
  SELECT 
    tablename,
    rowsecurity as rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN ('brands', 'brand_members', 'brand_invites', 'customer_invites', 'products', 'menus', 'customers', 'orders')
  ORDER BY tablename;
"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Mark yourself as admin:"
echo "      psql \"\$SUPABASE_DB_URL\" -c \"INSERT INTO public.admins(user_id) VALUES ('YOUR-UUID');\""
echo ""
echo "   2. Test invite flow:"
echo "      Generate test token → Navigate to /accept-brand-invite?token=TOKEN"
echo ""
echo "   3. Set up email service (Resend/SendGrid)"
echo "      Update src/lib/email.ts with your API key"

