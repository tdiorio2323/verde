// src/routes.ts
import React from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import RoutesDebug from "./pages/RoutesDebug";

export type RouteItem = {
    path: string;
    component: React.ComponentType;
    label: string;
    private?: boolean
};

export const routes: RouteItem[] = [
    { path: "/", component: LandingPage, label: "Landing" },
    { path: "/dashboard", component: Dashboard, label: "Customer Experience", private: true },
    { path: "/dashboard/driver", component: Dashboard, label: "Driver Console", private: true },
    { path: "/dashboard/admin", component: Dashboard, label: "Admin Command", private: true },
    { path: "/_routes", component: RoutesDebug, label: "Routes Debug" },
    { path: "*", component: NotFound, label: "Not Found" },
];
