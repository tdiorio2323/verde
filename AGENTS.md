# Repository Guidelines

## Project Structure & Module Organization
The Vite + React codebase lives in `src/`, with entry wiring in `src/main.tsx` and app shell logic in `src/App.tsx`. Feature UI resides under `src/components/` and reusable utilities sit in `src/lib/` and `src/hooks/`. Route-level views live in `src/pages/`, while static data objects are kept in `src/data/`. Shared styling is managed through Tailwind configuration (`tailwind.config.ts`) and global styles in `src/index.css`. Public assets that ship as-is belong in `public/`, and built artifacts land in `dist/`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (preferred) or `npm install` if pnpm is unavailable. Use `pnpm dev` to run the Vite dev server with hot reloading. Execute `pnpm build` for the production bundle, and `pnpm build --mode development` when a development-targeted build is needed. Preview the production build locally via `pnpm preview` after running a build. Run `pnpm lint` to apply ESLint across the repo.

## Coding Style & Naming Conventions
Follow TypeScript strictness defaults and React functional components. Use PascalCase for component files (e.g., `UserCard.tsx`), camelCase for helpers, and kebab-case only for asset filenames. Keep component folders co-located with their styles or utilities when tightly coupled. Tailwind classes should favor design tokens defined in `tailwind.config.ts`, and avoid arbitrary values unless prototyping. Run `pnpm lint` before committing to ensure ESLint and TypeScript catch issues.

## Testing Guidelines
A formal test suite is not yet present; when adding coverage, create colocated `*.test.tsx` files that exercise component behavior with Vitest and React Testing Library. Prefer descriptive `describe` blocks that mirror page or component names. Smoke-test critical flows (navigation, forms, data fetching) before opening a pull request, and document manual test steps in the PR description until automated tests exist.

## Commit & Pull Request Guidelines
Commits should stay focused, use imperative summaries (e.g., `Add product carousel hover states`), and mention scope only when it aids clarity. Reference related issues in the body when applicable. Pull requests must include a clear problem statement, screenshots or clips for visual updates, and notes on testing performed. Tag reviewers familiar with the touched area and wait for at least one approval before merging. Keep branches up to date with `main` to minimize rebase churn.
