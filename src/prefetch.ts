// Prefetch heavy routes in idle time for faster dashboard nav.
export function prefetchDashboard() {
  // Split points must match lazy() imports
  void import("./pages/Dashboard");
  void import("./pages/BrandDashboard");
}

export function prefetchOnIdle() {
  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(() => prefetchDashboard());
  } else {
    setTimeout(prefetchDashboard, 500);
  }
}

