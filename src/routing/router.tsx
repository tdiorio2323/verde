import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// Lazy load heavy dashboard components
const Landing = lazy(() => import("@/pages/LandingPage"));
const Customer = lazy(() => import("@/pages/Dashboard"));
const Driver = lazy(() => import("@/pages/Dashboard"));     // split
const Admin = lazy(() => import("@/pages/Dashboard"));       // split
const NotFound = lazy(() => import("@/pages/NotFound"));
const RoutesDebug = lazy(() => import("@/pages/RoutesDebug"));

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/dashboard", element: <Customer /> },
  { path: "/dashboard/driver", element: <Driver /> },
  { path: "/dashboard/admin", element: <Admin /> },
  { path: "/_routes", element: <RoutesDebug /> },
  { path: "*", element: <NotFound /> },
]);
