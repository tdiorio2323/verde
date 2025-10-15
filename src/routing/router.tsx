import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// Lazy load page components for code splitting
const Landing = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const RoutesDebug = lazy(() => import("@/pages/RoutesDebug"));

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/driver", element: <Dashboard /> },
  { path: "/dashboard/admin", element: <Dashboard /> },
  { path: "/_routes", element: <RoutesDebug /> },
  { path: "*", element: <NotFound /> },
]);
