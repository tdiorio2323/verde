import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RouteErrorBoundary from "@/components/errors/RouteErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { LoadingFallback } from "@/components/LoadingFallback";
import { ROLES } from "@/shared/config/roles";

// Lazy load all page components for optimal code splitting
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const BrandDashboard = lazy(() => import("@/pages/BrandDashboard"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ShopDetail = lazy(() => import("@/pages/ShopDetail"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const AcceptBrandInvite = lazy(() => import("@/pages/AcceptBrandInvite"));
const AcceptCustomerInvite = lazy(() => import("@/pages/AcceptCustomerInvite"));
const RoutesDebug = lazy(() => import("@/pages/RoutesDebug"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * Gate the debug route by environment variable
 */
const DEBUG_ROUTES_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_ROUTES_DEBUG === "true";

/**
 * Application router configuration using React Router v6
 * All routes are lazy-loaded and wrapped in Suspense boundaries
 */
export const router = createBrowserRouter([
  // Public landing page
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Customer dashboard (default protected route)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Driver-specific dashboard
  {
    path: "/dashboard/driver",
    element: (
      <ProtectedRoute requireRole={ROLES.DRIVER}>
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Admin dashboard
  {
    path: "/dashboard/admin",
    element: (
      <ProtectedRoute requireRole={ROLES.ADMIN}>
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Brand dashboard
  {
    path: "/dashboard/brand",
    element: (
      <ProtectedRoute requireRole={ROLES.BRAND}>
        <Suspense fallback={<LoadingFallback />}>
          <BrandDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Public shop routes
  {
    path: "/shop",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ShopPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/shop/:slug",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ShopDetail />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Cart page
  {
    path: "/cart",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CartPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Invite acceptance routes (public)
  {
    path: "/accept-brand-invite",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AcceptBrandInvite />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/accept-invite",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AcceptCustomerInvite />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Dev-only route inspector (excluded in production)
  ...(DEBUG_ROUTES_ENABLED
    ? [
        {
          path: "/_routes",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <RoutesDebug />
            </Suspense>
          ),
          errorElement: <RouteErrorBoundary />,
        },
      ]
    : []),

  // Convenience redirects
  { path: "/admin", element: <Navigate to="/dashboard/admin" replace /> },
  { path: "/driver", element: <Navigate to="/dashboard/driver" replace /> },
  { path: "/brand", element: <Navigate to="/dashboard/brand" replace /> },

  // 404 catch-all (must be last)
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);
