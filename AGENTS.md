# Repository Guidelines

## Project Structure & Module Organization
- `src/main.tsx` boots the Vite + React app; `src/App.tsx` houses the shell.
- Feature UI lives in `src/components/`, routes in `src/pages/`, shared hooks and logic in `src/hooks/` and `src/lib/`.
- Reusable data belongs in `src/data/`; generated Supabase typings stay in `src/shared/`.
- Global styling is managed via `tailwind.config.ts` and `src/index.css`; public assets ship from `public/`.
- Tests, docs, automation, and Supabase assets belong in `tests/`, `docs/`, `scripts/`, and `supabase/` respectively.

## Build, Test, and Development Commands
```bash
pnpm install        # install dependencies (npm install as fallback)
pnpm dev            # start the Vite dev server
pnpm build          # produce production bundles (use pnpm build:dev for debug)
pnpm preview        # serve the latest build locally
pnpm lint           # run ESLint + Prettier checks
pnpm typecheck      # run TypeScript in strict mode
pnpm test / test:run  # execute Vitest suites (watch / CI)
pnpm audit:quick    # minimal dependency audit; audit:full for release
pnpm generate:types # refresh Supabase typings
```

## Coding Style & Naming Conventions
- TypeScript is strict; keep components functional and colocate logic inside hooks when reusable.
- Follow 2-space indentation, Prettier formatting, and Tailwind utility tokens over arbitrary values.
- PascalCase component files (`StoreCard.tsx`), camelCase helpers, kebab-case only for raw assets.
- Run `pnpm lint` and `pnpm format` before committing to catch style drift.

## Testing Guidelines
- Vitest with React Testing Library (`tests/setup.ts`) powers unit coverage.
- Co-locate specs as `*.test.ts(x)` beside the implementation; focus on user-facing behavior and state edges.
- Use `pnpm test:run` for deterministic CI output, and document any manual Supabase or navigation checks until automated.

## Commit & Pull Request Guidelines
- Craft focused commits with imperative summaries (e.g., `Add cart drawer badge totals`) and link tickets when available.
- PRs should describe the problem, list functional or visual changes, note tests run, and attach screenshots for UI updates.
- Keep branches rebased on `main` and wait for at least one approval before merging.

## Environment & Tooling Notes
- Pin Node between 18.18 and 22, prefer pnpm to respect workspace resolution, and let Husky install through `pnpm prepare`.
- Store Supabase secrets in `.env`; run `pnpm audit:env` to verify required keys. Either `VITE_SUPABASE_*` or `NEXT_PUBLIC_SUPABASE_*` env names are accepted.
