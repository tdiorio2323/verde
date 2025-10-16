# Verde Route Inventory
**Generated**: 2025-10-16 02:10 AM  
**Router**: React Router v6 (createBrowserRouter)  
**Total Routes**: 6

---

## 📍 Route Map

| Path | Component | Protection | Role Required | Features |
|------|-----------|------------|---------------|----------|
| `/` | `LandingPage` | ❌ Public | None | Hero, features, login button, footer CTA |
| `/dashboard` | `Dashboard` | ✅ Protected | Any (customer default) | Shop view, cart, orders, multi-role tabs |
| `/dashboard/driver` | `Dashboard` | ✅ Protected | `driver` | Driver assignments, delivery management |
| `/dashboard/admin` | `Dashboard` | ✅ Protected | `admin` | KPIs, orders, inventory, user management |
| `/_routes` | `RoutesDebug` | ❌ Public | None | Development route debugger |
| `*` | `NotFound` | ❌ Public | None | 404 error page with navigation |

---

## 🔒 Protection Details

### ProtectedRoute Wrapper
**Location**: `src/components/auth/ProtectedRoute.tsx`

**Features**:
- ✅ Checks authentication status
- ✅ Verifies age (21+) compliance
- ✅ Enforces role-based access
- ✅ Shows loading states
- ✅ Auto-redirects to `/` if unauthorized

**Implementation** (`src/routing/router.tsx`):
```tsx
{
  path: "/dashboard",
  element: (
    <ProtectedRoute requireAgeVerification={true}>
      <Dashboard />
    </ProtectedRoute>
  ),
}
```

---

## 🎭 Role-Based Views

The Dashboard component (`src/pages/Dashboard.tsx`) serves different content based on user role:

### Customer Role (Default)
- **Path**: `/dashboard`
- **Features**:
  - Product browsing with filters/search
  - Shopping cart management
  - Order tracking with live timeline
  - Dispensary selection

### Driver Role
- **Path**: `/dashboard/driver`
- **Features**:
  - Delivery assignment list
  - Route optimization
  - Status updates (assigned → accepted → enroute → arrived → delivered)
  - Customer info and delivery notes

### Admin Role
- **Path**: `/dashboard/admin`
- **Features**:
  - KPI dashboard (revenue, orders, customers, avg. order)
  - Recent orders table
  - Inventory management
  - User administration

---

## 📊 Route Component Breakdown

### Landing Page (`src/pages/LandingPage.tsx`)
**Lines**: 247  
**Sections**:
- Hero with Verde logo
- Platform features (3-column grid)
- Loyalty system overview
- Why TD Studios (4-column grid)
- Compliance & transparency
- Footer CTA with "Get Started" button

**Key Features**:
- Sign In/Out button (top right)
- Login modal integration
- Conditional CTAs based on auth state

---

### Dashboard (`src/pages/Dashboard.tsx`)
**Lines**: 182  
**Sub-components**:
- `ShopView` - Product catalog
- `CartDrawer` - Shopping cart sidebar
- `CheckoutModal` - Order submission
- `OrderTracking` - Live order status
- `DriverView` - Driver console
- `AdminView` - Admin dashboard

**State Management**:
- Syncs Supabase user role with local store
- Real-time cart count
- Active order tracking
- Dispensary selection

---

### Not Found (`src/pages/NotFound.tsx`)
**Purpose**: Catch-all 404 handler  
**Features**:
- Chrome silver glass morphism design
- Animated background
- "Back to Home" button
- Accessible with ARIA labels

---

### Routes Debug (`src/pages/RoutesDebug.tsx`)
**Purpose**: Development tool for route testing  
**Note**: Should be removed or protected in production  
**Recommendation**: Add `NODE_ENV` check:
```tsx
if (import.meta.env.PROD) {
  return <Navigate to="/" replace />;
}
```

---

## 🚦 Lazy Loading Configuration

**Location**: `src/routing/router.tsx`

All page components use React's `lazy()` for code splitting:
```tsx
const Landing = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const RoutesDebug = lazy(() => import("@/pages/RoutesDebug"));
```

**Benefits**:
- Reduced initial bundle size
- Faster first paint
- On-demand loading per route

---

## 🔄 Navigation Flow

### Unauthenticated User
```
Landing (/) 
  → Click "Sign In"
  → Login Modal (phone OTP)
  → Age Verification Modal (21+)
  → Dashboard (/dashboard)
```

### Authenticated User
```
Landing (/)
  → See "Sign Out" + phone number
  → Click "Go to Dashboard" 
  → Dashboard (/dashboard)
```

### Role-Based Redirect
```
User tries /dashboard/admin (but role = "customer")
  → ProtectedRoute detects mismatch
  → Auto-redirect to /dashboard
```

---

## 📱 Responsive Breakpoints

All routes use Tailwind breakpoints:
- `sm:` 640px - Mobile landscape
- `md:` 768px - Tablets
- `lg:` 1024px - Small desktops
- `xl:` 1280px - Large desktops
- `2xl:` 1536px - Extra large

---

## 🧪 Testing Route Access

### Manual Test Script
```bash
# Start dev server
npm run dev

# Test public route
open http://localhost:8080/

# Test protected route (should redirect if not logged in)
open http://localhost:8080/dashboard

# Test 404 handling
open http://localhost:8080/nonexistent

# Test debug route
open http://localhost:8080/_routes
```

### Automated Test (Playwright/Cypress)
```typescript
// Example test structure (not implemented yet)
test('unauthenticated user redirected from dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/');
});

test('authenticated user can access dashboard', async ({ page }) => {
  await signIn(page); // Helper function
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Multi-role experience hub');
});
```

---

## 🔧 Adding New Routes

### Step 1: Create Page Component
```bash
touch src/pages/NewPage.tsx
```

### Step 2: Add Lazy Import
```tsx
// src/routing/router.tsx
const NewPage = lazy(() => import("@/pages/NewPage"));
```

### Step 3: Add Route Definition
```tsx
export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/new-page", element: <NewPage /> },  // Add here
  // ... other routes
  { path: "*", element: <NotFound /> },  // Keep last
]);
```

### Step 4: (Optional) Add Protection
```tsx
{
  path: "/new-page",
  element: (
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  ),
}
```

---

## 📈 Route Performance

| Route | Initial Load | Chunk Size | Gzipped |
|-------|--------------|------------|---------|
| `/` (Landing) | ~300ms | 32 KB | 9.8 KB |
| `/dashboard` | ~500ms | 139 KB | 40 KB |
| `/dashboard/*` | ~500ms | 139 KB (shared) | 40 KB |
| `*` (404) | ~100ms | 0.86 KB | 0.51 KB |
| `/_routes` | ~150ms | 2.32 KB | 1.16 KB |

**Total Bundle**: 912 KB raw / 197 KB gzipped

---

## ✅ Route Health Checklist

- [x] All routes have lazy loading
- [x] Protected routes use ProtectedRoute wrapper
- [x] Role-based access enforced
- [x] 404 handler configured (catch-all)
- [x] Loading states shown during lazy load
- [x] Navigation accessible (skip links, keyboard)
- [ ] E2E tests for critical paths (TODO)
- [ ] Analytics tracking on route changes (TODO)
- [ ] SEO meta tags per route (TODO)

---

## 🔗 Related Files

- **Router Config**: `src/routing/router.tsx`
- **Protected Route**: `src/components/auth/ProtectedRoute.tsx`
- **Auth Context**: `src/contexts/AuthContext.tsx`
- **Page Components**: `src/pages/*.tsx`
- **Navigation**: No explicit nav component (buttons in pages)

---

**Last Updated**: 2025-10-16 02:10 AM  
**Maintainer**: Auto-generated from repo structure

