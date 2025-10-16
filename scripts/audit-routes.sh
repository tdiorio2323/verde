#!/bin/bash
# Verde Route Audit Script
# Generates route inventory from codebase

echo "🗺️  Verde Route Audit"
echo "===================="
echo ""

echo "📁 Page Components:"
echo "------------------"
find src/pages -name "*.tsx" 2>/dev/null | while read file; do
  basename=$(basename "$file" .tsx)
  lines=$(wc -l < "$file" | tr -d ' ')
  echo "  📄 $basename ($lines lines)"
done
echo ""

echo "🔒 Protected Routes:"
echo "-------------------"
if [ -f "src/routing/router.tsx" ]; then
  grep -A 3 "ProtectedRoute" src/routing/router.tsx | \
    grep "path:" | \
    sed 's/.*path: "\([^"]*\)".*/  🔐 \1/' || echo "  No protected routes found"
else
  echo "  ⚠️  router.tsx not found"
fi
echo ""

echo "🌐 Public Routes:"
echo "----------------"
if [ -f "src/routing/router.tsx" ]; then
  grep "path:" src/routing/router.tsx | \
    grep -v "ProtectedRoute" | \
    sed 's/.*path: "\([^"]*\)".*/  🌍 \1/' || echo "  No public routes found"
else
  echo "  ⚠️  router.tsx not found"
fi
echo ""

echo "🔧 Route Components:"
echo "-------------------"
if [ -f "src/routing/router.tsx" ]; then
  grep "lazy(() => import" src/routing/router.tsx | \
    sed 's/.*import("\([^"]*\)").*/  ⚡ \1 (lazy loaded)/' || echo "  No lazy loaded routes"
else
  echo "  ⚠️  router.tsx not found"
fi
echo ""

echo "✅ Audit complete! See docs/ROUTES.md for full details."

