import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load page components for code splitting
const Landing = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const RoutesDebug = lazy(() => import("@/pages/RoutesDebug"));

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAgeVerification={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/driver",
    element: (
      <ProtectedRoute requiredRole="driver" requireAgeVerification={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/admin",
    element: (
      <ProtectedRoute requiredRole="admin" requireAgeVerification={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/_routes", element: <RoutesDebug /> },
  { path: "*", element: <NotFound /> },
]);
