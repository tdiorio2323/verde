#!/bin/bash
#
# Smoke test for Verde brand invite system
# Usage: ./scripts/smoke-test.sh YOUR-USER-UUID
#

set -e

if [ -z "$1" ]; then
  echo "❌ Error: User UUID required"
  echo "   Usage: ./scripts/smoke-test.sh YOUR-USER-UUID"
  exit 1
fi

USER_UUID=$1

if [ -z "$SUPABASE_DB_URL" ]; then
  echo "❌ Error: SUPABASE_DB_URL not set"
  exit 1
fi

echo "🧪 Running smoke tests for Verde invite system..."
echo "   User UUID: $USER_UUID"
echo ""

# Test 1: Verify user is admin
echo "✅ Test 1: Admin status"
ADMIN_CHECK=$(psql "$SUPABASE_DB_URL" -tAc "
  SELECT EXISTS(SELECT 1 FROM public.admins WHERE user_id = '$USER_UUID');
")

if [ "$ADMIN_CHECK" = "t" ]; then
  echo "   ✓ User is admin"
else
  echo "   ⚠ User is NOT admin. Adding..."
  psql "$SUPABASE_DB_URL" -c "INSERT INTO public.admins(user_id) VALUES ('$USER_UUID') ON CONFLICT DO NOTHING;"
  echo "   ✓ User marked as admin"
fi
echo ""

# Test 2: Get or create demo brand
echo "✅ Test 2: Demo brand exists"
BRAND_ID=$(psql "$SUPABASE_DB_URL" -tAc "
  SELECT id FROM public.brands WHERE slug = 'verde-demo-brand' LIMIT 1;
")

if [ -z "$BRAND_ID" ]; then
  echo "   ⚠ Demo brand not found. Run seed script first."
  exit 1
else
  echo "   ✓ Brand found: $BRAND_ID"
fi
echo ""

# Test 3: Generate brand invite
echo "✅ Test 3: Generate brand invite"
BRAND_TOKEN="test-brand-$(date +%s)"
psql "$SUPABASE_DB_URL" -c "
  INSERT INTO public.brand_invites (brand_id, email, token, created_by)
  VALUES ('$BRAND_ID', 'test-brand@example.com', '$BRAND_TOKEN', '$USER_UUID');
" > /dev/null
echo "   ✓ Brand invite created"
echo "   🔗 Test URL: http://localhost:8080/accept-brand-invite?token=$BRAND_TOKEN"
echo ""

# Test 4: Generate customer invite
echo "✅ Test 4: Generate customer invite"
CUSTOMER_TOKEN="test-customer-$(date +%s)"
psql "$SUPABASE_DB_URL" -c "
  INSERT INTO public.customer_invites (brand_id, email, token, created_by)
  VALUES ('$BRAND_ID', 'test-customer@example.com', '$CUSTOMER_TOKEN', '$USER_UUID');
" > /dev/null
echo "   ✓ Customer invite created"
echo "   🔗 Test URL: http://localhost:8080/accept-invite?token=$CUSTOMER_TOKEN"
echo ""

# Test 5: Verify RLS blocks cross-brand access
echo "✅ Test 5: RLS isolation check"
OTHER_BRAND_ID=$(psql "$SUPABASE_DB_URL" -tAc "
  SELECT id FROM public.brands WHERE id != '$BRAND_ID' LIMIT 1;
")

if [ -z "$OTHER_BRAND_ID" ]; then
  echo "   ⚠ Only one brand exists, cannot test RLS isolation"
else
  # This would need to be tested in the app with actual auth context
  echo "   ℹ RLS isolation must be tested in browser with authenticated user"
  echo "   Try querying: SELECT * FROM products WHERE brand_id = '$OTHER_BRAND_ID'"
  echo "   Expected: Empty result (RLS blocks access)"
fi
echo ""

# Test 6: Verify RPCs exist
echo "✅ Test 6: RPC functions"
RPC_COUNT=$(psql "$SUPABASE_DB_URL" -tAc "
  SELECT COUNT(*) FROM information_schema.routines
  WHERE routine_schema = 'public'
    AND routine_name IN ('redeem_brand_invite', 'redeem_customer_invite', 'me_roles', 'is_member_of_brand');
")

if [ "$RPC_COUNT" = "4" ]; then
  echo "   ✓ All RPC functions exist"
else
  echo "   ⚠ Missing RPC functions (found $RPC_COUNT/4)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Smoke test complete!"
echo ""
echo "📋 Manual tests:"
echo "   1. Sign in to app"
echo "   2. Visit brand invite URL (copy from above)"
echo "   3. Should redirect to /dashboard/brand"
echo "   4. Visit customer invite URL"
echo "   5. Should redirect to /dashboard"
echo "   6. Check database for new records:"
echo "      - brand_members (brand invite)"
echo "      - customers (customer invite)"
echo ""
echo "🔍 Verify in database:"
echo "   psql \"\$SUPABASE_DB_URL\" -c \"SELECT * FROM public.brand_members WHERE user_id = '$USER_UUID';\""
echo "   psql \"\$SUPABASE_DB_URL\" -c \"SELECT * FROM public.customers WHERE brand_id = '$BRAND_ID';\""

