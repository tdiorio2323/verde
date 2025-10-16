#!/bin/bash
# Verde Environment Variable Audit Script
# Scans codebase for env usage and validates .env.local

echo "🔍 Verde Environment Audit"
echo "=========================="
echo ""

echo "📋 Environment Variables in Code:"
echo "---------------------------------"
grep -rh "import\.meta\.env\." src/ --include="*.ts" --include="*.tsx" 2>/dev/null | \
  sed 's/.*import\.meta\.env\.\([A-Z_]*\).*/\1/' | \
  sort | uniq | \
  while read var; do
    echo "  - $var"
  done
echo ""

echo "📄 .env.local Status:"
echo "--------------------"
if [ -f ".env.local" ]; then
  echo "  ✅ File exists"
  echo ""
  echo "  Variables defined:"
  grep -E "^VITE_" .env.local | sed 's/=.*//' | while read var; do
    echo "    ✅ $var"
  done
else
  echo "  ❌ File missing"
  echo "  👉 Copy .env.local.example to .env.local"
fi
echo ""

echo "🔒 Security Check:"
echo "-----------------"
if grep -rq "SUPABASE_SERVICE_ROLE_KEY" src/ 2>/dev/null; then
  echo "  ⚠️  WARNING: Service role key found in src/"
  echo "  👉 Never expose service key to client!"
else
  echo "  ✅ No service role key in client code"
fi
echo ""

echo "✅ Audit complete!"

