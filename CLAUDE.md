# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project called "TD Canna App" (branded as CABANA Cannabis Marketplace), a cannabis marketplace web application built with shadcn/ui components and Tailwind CSS. The project is a TD Studios showcase platform for dispensary-style storefronts, managed via Lovable.dev, and follows a single-page application (SPA) architecture.

## Development Commands

```bash
# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Application Structure

- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router v6 with `BrowserRouter`
  - Routes are centrally defined in `src/routes.ts` as an array of `RouteItem` objects
  - Each route has: `path`, `component`, `label`, and optional `private` flag
  - App.tsx maps over the routes array to generate `<Route>` elements
  - To add new routes: add entry to `routes` array in `src/routes.ts` ABOVE the catch-all "*" route
  - NotFound page handles 404s
- **State Management**:
  - Custom store implementation using `useSyncExternalStore` (React 18)
  - Store defined in `src/data/store.ts` with `useAppStore` hook
  - Uses derived selectors with memoization to prevent unnecessary re-renders
  - TanStack Query (React Query) for server state (when needed)
  - **IMPORTANT**: All selectors must return stable references (see Zustand Selector Stability section)
- **UI Framework**: shadcn/ui components (~50 components in `src/components/ui/`)
- **Styling**: Tailwind CSS with custom design system

### Directory Structure

```
src/
├── components/        # Feature components (Hero, Footer, etc.)
│   └── ui/           # shadcn/ui components (auto-generated)
├── pages/            # Route pages (LandingPage, Dashboard, NotFound, RoutesDebug)
├── data/             # Data layer and state management
│   ├── store.ts      # Custom state store with useSyncExternalStore
│   ├── products.ts   # Product catalog data
│   ├── categories.ts # Product categories
│   ├── dispensaries.ts # Dispensary locations
│   └── orders.ts     # Order management and mock data
├── hooks/            # Custom React hooks (use-mobile, use-toast)
├── lib/              # Utilities (utils.ts for cn() helper)
└── assets/           # Static assets
```

### Design System

The project uses a **chrome silver luxury glass morphism design system** with metallic silver tones defined in `src/index.css`:

- **Colors**: All colors use HSL format with CSS custom properties
  - Primary: Chrome silver (`--primary: 0 0% 75%`)
  - Secondary: Platinum (`--secondary: 0 0% 60%`)
  - Accent: Steel (`--accent: 0 0% 50%`)
  - Golden: Silver highlight (`--golden: 0 0% 80%`)
  - Background: Deep black (`--background: 0 0% 4%`)
- **Gradients**:
  - `--gradient-chrome-metallic`: Multi-stop chrome silver gradient
  - `--gradient-liquid-glass`: Frosted glass overlay
  - `--gradient-glass-shine`: Shimmer effect for glass cards
- **Shadows**: Chrome glow effects via `--shadow-glow`, `--shadow-silver`, and `--shadow-metallic`
- **Animations**: Custom timing functions (`--transition-smooth`, `--transition-bounce`, `--transition-glass`, `--transition-liquid`)
- **Backdrop Blur**: Five levels from `--blur-sm` (8px) to `--blur-2xl` (40px)
- **Theme**: Uses dark theme by default (no separate dark mode toggle needed)

**IMPORTANT**: When adding new colors, they MUST be defined as HSL values in `src/index.css` and referenced via CSS custom properties. The design system extends into `tailwind.config.ts` where color utilities like `bg-golden` or `text-primary-glow` are defined.

### Glass Morphism Component Classes

The design system includes pre-built glass morphism utility classes in `src/index.css`:

- `.glass`, `.glass-sm`, `.glass-md`, `.glass-lg` - Frosted glass backgrounds with varying opacity
- `.glass-card` - Full glass card with shimmer animation on hover
- `.liquid-glass` - Advanced liquid glass effect with gradient border
- `.btn-holographic` - Chrome metallic button with silver gradient
- `.btn-glass` - Frosted glass button
- `.text-gradient-holographic`, `.text-gradient-chrome` - Metallic text gradients

Use these classes instead of creating custom glass effects.

### Key Technical Details

- **Path Alias**: `@` resolves to `./src` (configured in `vite.config.ts:19`)
- **Component Tagger**: Uses `lovable-tagger` plugin in development mode for Lovable.dev integration
- **Port**: Dev server runs on `:8080` with IPv6 host (`::`)
- **UI Components**: Generated via shadcn/ui CLI (see `components.json`)
- **Form Validation**: Uses `react-hook-form` + `@hookform/resolvers` + `zod`

### Adding New Routes

When adding routes to the application:

1. Create page component in `src/pages/` (should be a default export)
2. Import the component in `src/routes.ts`
3. Add entry to the `routes` array ABOVE the catch-all "*" route

Example:
```tsx
// In src/routes.ts:
import NewPage from "./pages/NewPage";

export const routes: RouteItem[] = [
  { path: "/", component: Index, label: "Landing (OTP)" },
  { path: "/new-page", component: NewPage, label: "New Page", private: false },
  { path: "*", component: NotFound, label: "Not Found" }, // Keep this last
];
```

Note: The `private` flag is for organizational purposes (e.g., routes requiring authentication).

### Working with shadcn/ui

- Components are in `src/components/ui/` (auto-managed)
- Use the `cn()` utility from `src/lib/utils.ts` for conditional className merging
- Import components from `@/components/ui/[component-name]`

### Styling Guidelines

- Use Tailwind utility classes
- Reference design system colors via `bg-primary`, `text-golden`, etc.
- For custom styles, extend in `tailwind.config.ts` or use CSS custom properties in `src/index.css`
- The theme uses a dark background by default (no separate dark mode toggle needed)

## Integration Notes

- **Lovable.dev**: Changes pushed to this repo sync with Lovable project (ID: 80074ec3-bcf4-4664-b8d4-6e22f1506a17)
- **Build Modes**: Use `npm run build:dev` for development builds (includes component tagger)
- **TypeScript**: Configured with separate tsconfig files (app, node, base)
- **Deployment**: Configured for Vercel with SPA rewrites (see `vercel.json`)

## Current Pages

- `/` - Landing page with OTP authentication
- `/dashboard` - Customer Experience storefront (marked as private)
- `/dashboard/driver` - Driver Console (marked as private)
- `/dashboard/admin` - Admin Command center (marked as private)
- `/_routes` - Routes debug page for development
- `*` - 404 Not Found page

## Zustand Selector Stability

The custom store relies on `useSyncExternalStore`, requiring every selector to return a stable reference to prevent infinite re-renders.

### Rules

- **Memoize derived data**: Wrap multi-field selectors with `createDerivedSelector` (see `src/data/store.ts:173`) and supply an equality check (`shallowEqual`, custom equality functions).
- **Avoid inline objects/functions**: Instead of `useAppStore(state => ({ foo: state.foo, bar: state.bar }))`, use individual selectors or pre-defined derived selectors.
- **Cache snapshots**: When adding selectors that compute arrays or objects, ensure they reference existing state objects or return memoized copies.
- **Use pre-defined selectors**: Import from `selectors` object in `src/data/store.ts:645` when possible.

### Example

```tsx
// ❌ BAD: Creates new object on every render
const data = useAppStore(state => ({
  items: state.cart.items,
  total: state.cart.total
}));

// ✅ GOOD: Use separate selectors
const items = useAppStore(state => state.cart.items);
const total = useAppStore(state => state.cart.total);

// ✅ BETTER: Use pre-defined derived selector
const cartTotals = useAppStore(selectors.cartTotals);
```

### Testing

Before merging changes to the store:
1. Run `npm run build` to confirm no TypeScript errors
2. Test in browser DevTools → Console for React's `getSnapshot` warnings
3. Check that components don't re-render unnecessarily

See `CONTRIBUTING.md` for deployment guidelines.
