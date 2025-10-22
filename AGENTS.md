# Repository Guidelines

## Project Structure & Module Organization
Verde is a Vite + React TypeScript app rooted in `src/`. Entry code lives in `src/main.tsx`, the shell in `src/App.tsx`, feature UI in `src/components/`, route screens in `src/pages/`, shared logic in `src/hooks/` and `src/lib/`, and reusable data in `src/data/`. Place generated Supabase types under `src/shared/`, Tailwind theming in `tailwind.config.ts`, and global styles in `src/index.css`. Use `scripts/` for automation, `tests/` for Vitest or Playwright setup, `docs/` for documentation variants, `public/` for shipped assets, `dist/` for build artifacts, and `supabase/` for environment templates or SQL.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (fallback: `npm install`). Run `pnpm dev` for the Vite dev server. Create bundles with `pnpm build` or `pnpm build:dev`, and serve them locally using `pnpm preview`. Lint via `pnpm lint`, type-check with `pnpm typecheck`, and execute specs using `pnpm test` (watch) or `pnpm test:run` (CI-friendly). Gate changes with `pnpm audit:quick`, perform full release checks with `pnpm audit:full`, and refresh Supabase typings through `pnpm generate:types`.

## Coding Style & Naming Conventions
Keep TypeScript strict and components functional. Use PascalCase for component files (`StoreCard.tsx`), camelCase for helpers, and kebab-case only for raw assets. Favor Tailwind token classes over arbitrary values. Run `pnpm lint` and `pnpm format` (Prettier, default 2-space indent) before committing, and honor the Node range in `package.json` (`>=18.18 <=22`).

## Testing Guidelines
Vitest with React Testing Library underpins unit coverage; shared config sits in `tests/setup.ts`. Co-locate specs beside source as `*.test.tsx` or `*.test.ts`, focusing on user-visible behavior and state edges. Use `pnpm test:run` for deterministic output in CI and log manual checks for navigation, auth, or Supabase flows until they gain automated coverage.

## Commit & Pull Request Guidelines
Write focused commits with imperative summaries such as `Add cart drawer badge totals`, and reference tickets or docs as needed. PRs should explain the problem, list functional or visual changes, include screenshots for UI updates, and note tests run. Request review from domain owners, keep branches rebased on `main`, and wait for at least one approval before merging.

## Environment & Tooling Notes
Prefer pnpm to respect workspace resolution. Husky installs via the `prepare` script; adjust `core.hooksPath` only with team consensus. Store Supabase secrets in `.env` (never commit) and run `pnpm audit:env` to confirm required keys. Add new automation in `scripts/` with a pointer in `README` so future agents can reproduce the workflow.

Both `VITE_SUPABASE_*` and `NEXT_PUBLIC_SUPABASE_*` environment names are accepted; use whichever matches your deployment tooling, ensuring the publishable key maps to the Supabase “designs” bucket.
