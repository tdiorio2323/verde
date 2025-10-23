# Repository Guidelines

This guide summarizes the expectations for contributors working in this repository. Review it before opening a PR to keep work consistent and efficient.

## Project Structure & Module Organization
- Core app: `src/main.tsx` initializes the Vite + React shell defined in `src/App.tsx`.
- Features live under `src/components/` (with base UI in `src/components/ui/`), route screens in `src/pages/`, and shared hooks or utilities in `src/hooks/` and `src/lib/`.
- Persistent state uses Zustand stores in `src/stores/`; generated Supabase types stay in `src/shared/`.
- Assets and global styles ship from `public/`, `src/index.css`, and `tailwind.config.ts`. Tests reside beside implementations or under `tests/`.

## Build, Test, and Development Commands
- `pnpm check:env` — confirm required environment variables before any run.
- `pnpm dev` — start the Vite development server with hot reload.
- `pnpm build` / `pnpm build:dev` — produce production or debug bundles.
- `pnpm lint && pnpm typecheck && pnpm test:run` — baseline CI suite for formatting, TypeScript, and Vitest respectively.
- `pnpm supabase:types` — refresh generated Supabase typings when schema changes.

## Coding Style & Naming Conventions
- TypeScript with strict mode and 2-space indentation; rely on Prettier via `pnpm lint`.
- Components use PascalCase filenames (e.g., `UserProfile.tsx`); hooks and helpers use camelCase (`useAuthStore.ts`, `formatCurrency.ts`).
- Favor Tailwind utility classes over custom CSS; colocate reusable logic in hooks rather than components.

## Testing Guidelines
- Primary stack: Vitest + React Testing Library (`tests/setup.ts`). Prefer behavior-driven descriptions (e.g., `it('renders invoice totals')`).
- Co-locate specs as `*.test.ts` or `*.test.tsx`; ensure new logic maintains >80% coverage.
- Run `pnpm test:run` before submitting; mock Supabase or external APIs as needed.

## Commit & Pull Request Guidelines
- Use conventional commit prefixes (`feat`, `fix`, `docs`, `chore`, etc.) with imperative summaries, e.g., `fix: resolve session refresh logic`.
- PRs should include problem context, functional or visual changes, linked issues/tickets, screenshots for UI updates, and confirmation of `pnpm lint`, `pnpm typecheck`, and `pnpm test:run`.
- Keep branches rebased on `main`; squash merge after approval.

## Environment & Tooling Notes
- Support Node 18.18–22 and `pnpm`. Copy `.env.example` to `.env` and validate via `pnpm check:env`.
- Store Supabase keys under `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; set `VITE_ROUTES_DEBUG=true` to inspect routing locally.
