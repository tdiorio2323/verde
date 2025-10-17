/**
 * Minimal loading fallback for Suspense boundaries
 */
export function LoadingFallback() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="animate-pulse text-sm text-neutral-500">Loading…</div>
    </div>
  );
}