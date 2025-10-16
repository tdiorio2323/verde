import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import RouteErrorBoundary from "./components/errors/RouteErrorBoundary";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // keep your existing component
import { ROLES } from "./constants/roles";

// Lazy chunks
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BrandDashboard = lazy(() => import("./pages/BrandDashboard"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ShopDetail = lazy(() => import("./pages/ShopDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AcceptBrandInvite = lazy(() => import("./pages/AcceptBrandInvite"));
const AcceptCustomerInvite = lazy(() => import("./pages/AcceptCustomerInvite"));
const RoutesDebug = lazy(() => import("./pages/RoutesDebug")); // optional dev-only
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal fallback
const Fallback = () => (
  <div className="flex h-dvh items-center justify-center">
    <div className="animate-pulse text-sm text-neutral-500">Loading…</div>
  </div>
);

// Optional: gate the debug route by env
const DEBUG_ROUTES_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_ROUTES_DEBUG === "true";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Fallback />}>
        <LandingPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Customer default
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Fallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Driver
  {
    path: "/dashboard/driver",
    element: (
      <ProtectedRoute requireRole={ROLES.DRIVER}>
        <Suspense fallback={<Fallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Admin
  {
    path: "/dashboard/admin",
    element: (
      <ProtectedRoute requireRole={ROLES.ADMIN}>
        <Suspense fallback={<Fallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Brand
  {
    path: "/dashboard/brand",
    element: (
      <ProtectedRoute requireRole={ROLES.BRAND}>
        <Suspense fallback={<Fallback />}>
          <BrandDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Shop routes (public)
  {
    path: "/shop",
    element: (
      <Suspense fallback={<Fallback />}>
        <ShopPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/shop/:slug",
    element: (
      <Suspense fallback={<Fallback />}>
        <ShopDetail />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={<Fallback />}>
        <CartPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Invite acceptance routes (public)
  {
    path: "/accept-brand-invite",
    element: (
      <Suspense fallback={<Fallback />}>
        <AcceptBrandInvite />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/accept-invite",
    element: (
      <Suspense fallback={<Fallback />}>
        <AcceptCustomerInvite />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },

  // Dev-only route inspector. Excluded in prod unless explicitly enabled.
  ...(DEBUG_ROUTES_ENABLED
    ? [
        {
          path: "/_routes",
          element: (
            <Suspense fallback={<Fallback />}>
              <RoutesDebug />
            </Suspense>
          ),
          errorElement: <RouteErrorBoundary />,
        },
      ]
    : []),

  // Hard redirect if someone hits /admin or /driver roots
  { path: "/admin", element: <Navigate to="/dashboard/admin" replace /> },
  { path: "/driver", element: <Navigate to="/dashboard/driver" replace /> },
  { path: "/brand", element: <Navigate to="/dashboard/brand" replace /> },

  // 404
  {
    path: "*",
    element: (
      <Suspense fallback={<Fallback />}>
        <NotFound />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);

