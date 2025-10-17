# Verde Development Roadmap

**Last Updated**: 2025-10-15
**Project**: Verde Cannabis Marketplace
**Status**: Post-Optimization Phase (Bundle reduced, Footer redesigned)

---

## 🔴 Immediate Priority (This Week)

### Code Splitting & Architecture

- [ ] **Audit code splitting behavior**
  - Create `DashboardDriver.tsx` and `DashboardAdmin.tsx`
  - Remove duplicate lazy imports in `src/routing/router.tsx`
  - Confirm splitting with `pnpm build` analyzer
  - **Priority**: HIGH | **Effort**: 4h | **ROI**: 8/10

### Reusable Components

- [ ] **Extract StatusBadge component**
  - Create `src/components/ui/StatusBadge.tsx`
  - Replace 4 duplicate implementations (AdminView, DriverView, OrderTracking)
  - Add TypeScript variants for order statuses
  - **Priority**: HIGH | **Effort**: 2h | **ROI**: 5/10

- [ ] **Create order-utils.ts**
  - Move order formatting helpers to `src/lib/order-utils.ts`
  - Consolidate status mapping, timeline builders, ETA calculations
  - Update imports across codebase
  - **Priority**: HIGH | **Effort**: 2h | **ROI**: 5/10

### Performance Optimization

- [ ] **Add React.memo to high-frequency components**
  - `ProductCard` (renders 10-100+ times)
  - `CartItem` (re-renders on every cart change)
  - `OrderCard` (renders in lists)
  - `FeatureCard` (12 instances on landing)
  - **Priority**: HIGH | **Effort**: 3h | **ROI**: 7/10

- [ ] **Extract inline callbacks to useCallback**
  - Audit all `onClick={() => ...}` patterns
  - Convert to `useCallback` with proper deps
  - Measure re-render reduction (target: 60-80%)
  - **Priority**: MEDIUM | **Effort**: 6h | **ROI**: 7/10

### Authentication Setup

- [ ] **Configure Supabase project**
  - Create account + new project at supabase.com
  - Set up `users`, `sessions` tables
  - Configure environment variables (`.env.local`)
  - **Priority**: CRITICAL | **Effort**: 2h | **ROI**: 10/10

- [ ] **Implement phone OTP authentication**
  - Add Supabase Auth SDK
  - Create OTP verification flow
  - Add refresh token persistence
  - Test login/logout flow
  - **Priority**: CRITICAL | **Effort**: 8h | **ROI**: 10/10

- [ ] **Add age verification modal**
  - Create 21+ age gate component
  - Persist compliance flag to session
  - Show on first visit only
  - **Priority**: CRITICAL | **Effort**: 3h | **ROI**: 10/10

**Week 1 Target**: 30 hours | All immediate items complete

---

## 🟡 Short-Term Goals (Next 2-3 Weeks)

### Route Protection

- [ ] **Create ProtectedRoute wrapper**
  - Build HOC for authenticated routes
  - Redirect to `/login` if unauthenticated
  - Handle loading states
  - Add role-based checks
  - **Priority**: HIGH | **Effort**: 4h | **ROI**: 9/10

- [ ] **Implement role-based access control**
  - Add role middleware (customer/driver/admin)
  - Protect `/dashboard/driver` and `/dashboard/admin`
  - Create role-specific navigation
  - **Priority**: HIGH | **Effort**: 6h | **ROI**: 9/10

### Testing Infrastructure

- [ ] **Unit tests for store actions**
  - Test `addToCart`, `removeFromCart`, `updateCartQuantity`
  - Test `checkout` flow and validation
  - Test `advanceActiveOrderStatus`
  - Edge cases: empty cart, invalid products, max quantity
  - **Priority**: HIGH | **Effort**: 12h | **ROI**: 9/10

- [ ] **Selector stability tests**
  - Test memoization correctness
  - Verify `cartTotals` and `cartItemsDetailed` selectors
  - Check for unnecessary re-renders
  - **Priority**: MEDIUM | **Effort**: 6h | **ROI**: 8/10

- [ ] **Component integration tests**
  - ShopView: filtering, sorting, product display
  - CartDrawer: quantity updates, removal, totals
  - CheckoutModal: form validation, submission
  - **Priority**: HIGH | **Effort**: 12h | **ROI**: 9/10

- [ ] **End-to-end checkout flow test**
  - Simulate: browse → add to cart → checkout → order tracking
  - Verify state updates across components
  - Test error scenarios
  - **Priority**: HIGH | **Effort**: 8h | **ROI**: 10/10

### Documentation & Optimization

- [ ] **Update CLAUDE.md**
  - Document Supabase integration
  - Add auth architecture section
  - Update state management notes
  - **Priority**: MEDIUM | **Effort**: 2h | **ROI**: 6/10

- [ ] **Image optimization**
  - Generate WebP/AVIF versions of all images
  - Add `srcSet` to Img component
  - Test load time improvements
  - Add error handling for failed loads
  - **Priority**: MEDIUM | **Effort**: 6h | **ROI**: 6/10

**Weeks 2-3 Target**: 56 hours | Test coverage 85%+, Auth complete

---

## 🟢 Mid-Term Roadmap (Next Month)

### Backend Integration

- [ ] **Design Supabase schema**
  - Tables: `users`, `orders`, `products`, `inventory`, `dispensaries`
  - Define relationships and indexes
  - Plan Row Level Security (RLS) policies
  - **Priority**: HIGH | **Effort**: 8h | **ROI**: 10/10

- [ ] **Implement RLS policies**
  - User can only see own orders
  - Drivers see assigned deliveries
  - Admins have full access
  - **Priority**: CRITICAL | **Effort**: 6h | **ROI**: 10/10

- [ ] **Replace mock data with API**
  - Integrate Supabase client
  - Add React Query for server state
  - Implement product catalog API
  - Add optimistic cart updates
  - **Priority**: HIGH | **Effort**: 24h | **ROI**: 10/10

### Real-Time Features

- [ ] **WebSocket order tracking**
  - Set up Supabase Realtime subscriptions
  - Live order status updates
  - Driver location tracking
  - Push notifications
  - **Priority**: HIGH | **Effort**: 20h | **ROI**: 10/10

- [ ] **Admin dashboard live data**
  - Real-time order feed
  - Live inventory updates
  - Driver status monitoring
  - **Priority**: MEDIUM | **Effort**: 12h | **ROI**: 8/10

### Production Readiness

- [ ] **Error tracking integration**
  - Set up Sentry or LogRocket
  - Implement error boundary reporting
  - Add performance monitoring
  - **Priority**: HIGH | **Effort**: 3h | **ROI**: 9/10

- [ ] **Environment configuration**
  - Separate dev/staging/prod configs
  - Set up CI/CD pipeline
  - Configure deployment previews
  - **Priority**: MEDIUM | **Effort**: 4h | **ROI**: 7/10

**Month Target**: 77 hours | Full backend, real-time features, production-ready

---

## ⚙️ Success Metrics

### Current State (2025-10-15)

```
Bundle Size:       734 KB (196 KB gzipped) ✅
Test Coverage:     ~5% 🔴
TypeScript:        100% ✅
Authentication:    0% 🔴
Backend:           0% (mock data only) 🔴
Performance:       Baseline (no optimization) 🟡
```

### Target After Week 1

```
Bundle Size:       ~700 KB (optimized code splitting) ✅
Test Coverage:     ~5% (no change yet)
TypeScript:        100% ✅
Authentication:    60% (Supabase + OTP setup) 🟡
Backend:           0%
Performance:       +40% (React.memo, useCallback) ✅
```

### Target After Week 3

```
Bundle Size:       ~700 KB ✅
Test Coverage:     85%+ ✅
TypeScript:        100% ✅
Authentication:    100% (full role-based access) ✅
Backend:           0%
Performance:       +70% (all optimizations) ✅
```

### Target After Month

```
Bundle Size:       ~700 KB ✅
Test Coverage:     90%+ ✅
TypeScript:        100% ✅
Authentication:    100% ✅
Backend:           100% (Supabase integrated) ✅
Real-Time:         100% (WebSocket tracking) ✅
Production Ready:  YES ✅
```

---

## 🎯 Quick Wins (Do First)

These tasks provide maximum impact with minimal effort:

1. **Fix code splitting** (4h) → Proper bundle splitting
2. **Extract StatusBadge** (2h) → Reduce duplication
3. **Add React.memo** (3h) → Immediate performance gain
4. **Create order-utils.ts** (2h) → Better maintainability

**Total Quick Wins**: 11 hours for significant improvement

---

## 📋 Development Commands

```bash
# Development
pnpm dev              # Start dev server (port 8080)
pnpm build            # Production build
pnpm preview          # Preview production build

# Quality
pnpm typecheck        # TypeScript validation
pnpm lint             # ESLint check
pnpm test             # Run tests (watch mode)
pnpm test:run         # Run tests once

# Deployment
vercel --prod         # Deploy to production
git push              # Auto-deploy via Lovable.dev
```

---

## 🚀 Getting Started

**Recommended Path**:

1. Complete all 🔴 Immediate tasks (Week 1)
2. Move to 🟡 Short-term goals (Weeks 2-3)
3. Tackle 🟢 Mid-term roadmap (Month)

**Alternative (Production Urgency)**:

1. Auth first (Supabase setup + OTP)
2. Testing second (reach 85% coverage)
3. Performance + Backend (parallel work)

---

## 📌 Notes

- All tasks use TypeScript (maintain 100% coverage)
- Follow existing patterns (glass morphism design, HSL colors)
- Update CLAUDE.md when architecture changes
- Run `pnpm typecheck && pnpm test:run` before commits
- Use `/development:typecheck` slash command for validation

---

**Last Completed**: Footer redesign with GreenGradient.png + Verde logo overlay
**Next Up**: Code splitting audit + Supabase Auth setup
**Blocked**: None - ready to proceed
