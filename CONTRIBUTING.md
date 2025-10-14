# Contributing Guide

Thanks for helping evolve the Verde experience. Please read the patterns below before opening a pull request.

### Zustand Selector Stability

We rely on `useSyncExternalStore`, so every selector must return a stable reference.

- **Memoize derived data** – wrap multi-field selectors with `createDerivedSelector` (see `src/data/store.ts`) and supply an equality check (`shallowEqual`, `areCartTotalsEqual`, etc.).
- **Avoid inline objects/functions** – instead of `useAppStore(state => ({ foo: state.foo, bar: state.bar }))`, grab each value with its own selector.
- **Cache snapshots** – when adding selectors that compute arrays or objects, ensure they reference existing state objects or return memoized copies.

Before merging changes to the store, run `pnpm exec tsc --noEmit` and `pnpm build` to confirm React’s `getSnapshot` warning stays silent.

### 5. Deploy

- If using **Vercel**: `vercel --prod`
- If using **Netlify**: `netlify deploy --prod`
- If using a custom CI (GitHub Actions, etc.), ensure the push triggers the configured production pipeline.

### 6. Verify Deployment

- Confirm build output URL is live.
- Open DevTools → Components → verify no `getSnapshot` or infinite re-render warnings.
- Optionally test cart flow, driver console, and admin KPIs for stability.

**Expected output:**
- ✅ Commit hash, branch name, and deployment URL.
- ⚙️ If a build fails, include the first 10 lines of the error log and abort deployment automatically.

> Note: I cannot deploy or access hosting from this environment. To finish deployment:
> 1. Commit local changes.
> 2. Run your provider’s CLI (`vercel --prod`, `netlify deploy --prod`, or trigger CI).
> 3. After deployment, share the commit hash, branch, and live URL for verification.
