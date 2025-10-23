# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project called "Verde" (branded as CABANA Cannabis Marketplace), a cannabis marketplace web application built with shadcn/ui components and Tailwind CSS. The project is a TD Studios platform for dispensary-style storefronts, managed via Lovable.dev, and follows a single-page application (SPA) architecture.

## Development Commands

**Package Manager**: Use `pnpm` (preferred) or `npm`. Install dependencies with `pnpm install` or `npm install`.

**Node.js Requirement**: Node.js >= 18.18 and <= 22 (see `package.json` engines field)

```bash
# Start development server (runs on port 8080)
pnpm dev  # or: npm run dev

# Build for production
pnpm build  # or: npm run build

# Build for development mode
pnpm build:dev  # or: npm run build:dev

# Lint the codebase
pnpm lint  # or: npm run lint

# Preview production build
pnpm preview  # or: npm run preview

# Run tests (watch mode)
pnpm test  # or: npm test

# Run tests once
pnpm test:run  # or: npm run test:run

# Type check without emitting files
pnpm typecheck  # or: npm run typecheck

# Format code with Prettier
pnpm format  # or: npm run format

# Generate Supabase types (requires SUPABASE_PROJECT_ID env var)
pnpm generate:types  # or: npm run generate:types

# Run full audit (typecheck + lint + tests + build)
pnpm audit:full  # or: npm run audit:full

# Run quick audit (typecheck + lint)
pnpm audit:quick  # or: npm run audit:quick

# Audit environment variables usage
pnpm audit:env  # or: npm run audit:env

# Audit routes inventory (generates ROUTE_ATLAS.md)
pnpm audit:routes  # or: npm run audit:routes

# Audit routes and open the report
pnpm audit:routes:open  # or: npm run audit:routes:open

# Prepare git hooks (run after clone)
pnpm prepare  # or: npm run prepare

# Check environment variables are configured
pnpm check:env  # or: npm run check:env
```

**Route Auditing**: The `audit:routes` command uses ts-morph to analyze `src/app/router.tsx` and generate:
- `ROUTE_ATLAS.md` - Human-readable route documentation with protection status, roles, and lazy chunks
- `route-atlas.json` - Machine-readable route data
- `unknown-links.csv` - Links/navigations that don't match defined routes (if any)
- `unmounted-pages.csv` - Page components not mounted in router (if any)

**Environment Variable Auditing**: The `audit:env` command scans all source files for `import.meta.env.*` usage and lists all referenced environment variables.

**Git Hooks**: The project uses Husky for pre-push hooks. After cloning, run `pnpm prepare` to install hooks that run type checking and linting before pushing.

## Architecture

### Application Structure

- **Entry Point**: `src/app/main.tsx` (application initialization and providers)
- **Routing**: React Router v6 with `createBrowserRouter`
  - Routes defined in `src/app/router.tsx` using `createBrowserRouter`
  - All route components are lazy-loaded for optimal performance
  - To add new routes: add entry to the routes array in `src/app/router.tsx` ABOVE the catch-all "\*" route
  - NotFound page handles 404s
- **Authentication**: Supabase Auth with phone/OTP
  - AuthContext in `src/contexts/AuthContext.tsx` provides auth state
  - ProtectedRoute component enforces authentication and role-based access
  - User profiles stored in Supabase `profiles` table
  - Roles: customer, driver, admin, brand (see `src/shared/config/roles.ts`)
- **State Management**:
  - Zustand store with devtools middleware
  - Store defined in `src/stores/appStore.ts` with `useAppStore` hook
  - Feature-specific stores:
    - `src/features/cart/store.ts` - Shopping cart for products
    - `src/stores/designCartStore.ts` - Design selection cart
  - Utility stores:
    - `src/shared/stores/session.ts` - Session state
    - `src/data/store.ts` - Store utilities including `createDerivedSelector` for memoized selectors
  - Uses Zustand's built-in selector patterns for optimal re-render performance
  - **IMPORTANT**: Follow Zustand best practices - prefer atomic selectors over object selectors (see Selector Best Practices section)
- **UI Framework**: shadcn/ui components (~50 components in `src/components/ui/`)
- **Styling**: Tailwind CSS with custom chrome silver glass morphism design system
- **Testing**: Vitest with React Testing Library
  - Test files use `.test.tsx` or `.test.ts` extension
  - Setup file at `tests/setup.ts` configures jsdom environment with @testing-library/jest-dom matchers
  - Run tests with `pnpm test` (watch mode) or `pnpm test:run` (single run)
  - Run specific test: `pnpm test src/path/to/file.test.tsx`

### Directory Structure

```
src/
├── app/                     # Application entry and core setup
│   ├── main.tsx            # Application entry point
│   ├── router.tsx          # Centralized routing configuration
│   ├── providers.tsx       # Application-wide context providers
│   └── index.css          # Global styles and design system
│
├── pages/                   # Route-level page components
├── components/              # Feature components and UI components
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── auth/               # Authentication components (LoginModal, ProtectedRoute)
│   └── errors/             # Error handling components
├── contexts/                # React Context providers (AuthContext)
├── stores/                  # Zustand state management stores
│   └── appStore.ts         # Main application store
│
├── shared/                  # Shared utilities and infrastructure
│   ├── components/         # Shared components (ErrorBoundary)
│   ├── hooks/              # Shared hooks (use-mobile, use-toast)
│   ├── lib/                # Shared utilities & Supabase client
│   ├── config/             # Configuration (env, roles)
│   ├── stores/             # Shared state (session)
│   └── types/              # Shared TypeScript types (app.ts, supabase.ts)
│
├── features/                # Feature-specific modules
│   └── cart/
│       └── store.ts        # Cart state management
│
├── entities/                # Domain entities (for future use)
├── data/                    # Static data and type definitions
└── lib/                     # Utilities (shop queries, utils.ts)

tests/                       # Root-level tests directory
└── setup.ts                # Vitest configuration
```

### Environment Configuration

**IMPORTANT**: Before running the application, you must configure environment variables.

1. Copy `.env.example` to `.env.local`
2. Fill in required Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (or `NEXT_PUBLIC_SUPABASE_URL` as alternative)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `SUPABASE_PROJECT_ID`: Optional, required for `pnpm generate:types` command
3. Optional variables:
   - `VITE_APP_ENV`: Application environment (development/staging/production)
   - `VITE_ENABLE_ROUTES_DEBUG`: Enable routes debug page (true/false)
4. Environment validation:
   - Runtime validation via Zod schema in `src/shared/config/env.ts` will throw errors if required variables are missing
   - Run `pnpm check:env` to validate all environment variables before starting development

### Design System

The project uses a **chrome silver luxury glass morphism design system** with metallic silver tones defined in `src/app/index.css`:

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

**IMPORTANT**: When adding new colors, they MUST be defined as HSL values in `src/app/index.css` and referenced via CSS custom properties. The design system extends into `tailwind.config.ts` where color utilities like `bg-golden` or `text-primary-glow` are defined.

### Glass Morphism Component Classes

The design system includes pre-built glass morphism utility classes in `src/app/index.css`:

- `.glass`, `.glass-sm`, `.glass-md`, `.glass-lg` - Frosted glass backgrounds with varying opacity
- `.glass-card` - Full glass card with shimmer animation on hover
- `.liquid-glass` - Advanced liquid glass effect with gradient border
- `.btn-holographic` - Chrome metallic button with silver gradient
- `.btn-glass` - Frosted glass button
- `.text-gradient-holographic`, `.text-gradient-chrome` - Metallic text gradients

Use these classes instead of creating custom glass effects.

### Key Technical Details

- **Path Alias**: `@` resolves to `./src` (configured in `vite.config.ts`)
- **Component Tagger**: Uses `lovable-tagger` plugin in development mode for Lovable.dev integration
- **Port**: Dev server runs on `:8080` with IPv6 host (`::`)
- **UI Components**: Generated via shadcn/ui CLI (see `components.json`)
- **Form Validation**: Uses `react-hook-form` + `@hookform/resolvers` + `zod`
- **Build Optimization**: Manual code splitting configured in `vite.config.ts`:
  - `vendor` chunk: React core libraries (react, react-dom, react-router-dom)
  - `ui` chunk: Radix UI primitives (accordion, dialog, dropdown-menu)
  - `utils` chunk: Animation and utility libraries (framer-motion, date-fns, lucide-react)
- **Browser Targets**: ES2020, Chrome 100+, Safari 15+ (see `vite.config.ts` build.target)

### Adding New Routes

When adding routes to the application:

1. Create page component in `src/pages/` (should be a default export)
2. Import the component with lazy loading in `src/app/router.tsx`
3. Add route object to the routes array ABOVE the catch-all "\*" route

Example:

```tsx
// In src/app/router.tsx:
import { lazy, Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";

const NewPage = lazy(() => import("@/pages/NewPage"));

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/new-page",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NewPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  { path: "*", element: <NotFound /> }, // Keep this last
]);
```

**Important**:

- All route components should be lazy-loaded using React's `lazy()` for optimal bundle splitting
- Wrap lazy components in `<Suspense>` with `<LoadingFallback />`
- Include `errorElement: <RouteErrorBoundary />` for error handling

### Working with shadcn/ui

- Components are in `src/components/ui/` (auto-managed)
- Use the `cn()` utility from `src/lib/utils.ts` for conditional className merging
- Import components from `@/components/ui/[component-name]`

### Styling Guidelines

- Use Tailwind utility classes
- Reference design system colors via `bg-primary`, `text-golden`, etc.
- For custom styles, extend in `tailwind.config.ts` or use CSS custom properties in `src/app/index.css`
- The theme uses a dark background by default (no separate dark mode toggle needed)

### Supabase Integration

- **Client**: Centralized Supabase client in `src/shared/lib/supabaseClient.ts`
- **Authentication**: Phone/OTP flow via Supabase Auth
- **Database**: Shop items stored in `shop_items` and `shop_item_tags` tables
- **Storage**: `designs` bucket for design assets (requires public read access or signed URLs)
- **Queries**: Shop queries centralized in `src/lib/shop.ts`
- **Type Generation**: Run `pnpm generate:types` to generate TypeScript types from Supabase schema
- **Profiles**: User profiles in `profiles` table with role-based access control

### Design Cart System

The application includes a design cart feature with WhatsApp/Telegram checkout integration:

- **Store**: Zustand store in `src/stores/designCartStore.ts` manages selected designs
- **Flow**: Users browse `/designs` → add to cart → checkout via `/designs/checkout`
- **Checkout Options**:
  - WhatsApp: Formats order as WhatsApp message with customer details and design list
  - Telegram: Sends order via Telegram bot integration
- **Customer Info**: Collects name, Instagram handle, phone, email, and order notes
- **Storage**: Design assets stored in Supabase `designs` bucket (see `SUPABASE_SETUP.md`)

### Import Path Guidelines

The codebase uses a layered architecture with specific import conventions:

- `@/app/*` - Application entry, router, providers (imported by pages/features)
- `@/shared/*` - Shared utilities, hooks, config, Supabase client (imported everywhere)
- `@/stores/*` - Zustand state management stores (appStore, etc.)
- `@/features/*` - Feature-specific modules (cart, etc.)
- `@/components/*` - UI components (including shadcn/ui components)
- `@/pages/*` - Route pages (imported by router)
- `@/contexts/*` - React Context providers (AuthContext)
- `@/data/*` - Static data and type definitions
- `@/lib/*` - Utilities and shop queries

**Always import**:

- App store from `@/stores/appStore`
- Design cart store from `@/stores/designCartStore`
- Cart store from `@/features/cart/store`
- Supabase client from `@/shared/lib/supabaseClient`
- Roles from `@/shared/config/roles`
- Hooks from `@/shared/hooks/*`
- Store utilities (createDerivedSelector) from `@/data/store`

## Integration Notes

- **Lovable.dev**: Changes pushed to this repo sync with Lovable project (ID: 80074ec3-bcf4-4664-b8d4-6e22f1506a17)
- **Build Modes**: Use `npm run build:dev` for development builds (includes component tagger)
- **TypeScript**: Configured with separate tsconfig files (app, node, base)
- **Deployment**: Configured for Vercel with SPA rewrites (see `vercel.json`)

## Current Routes

- `/` - Landing page with OTP authentication (public)
- `/dashboard` - Customer Experience storefront (protected)
- `/dashboard/driver` - Driver Console (protected, driver role)
- `/dashboard/admin` - Admin Command center (protected, admin role)
- `/dashboard/brand` - Brand Dashboard (protected, brand role)
- `/shop` - Public shop listing page
- `/shop/:slug` - Public shop detail page (dynamic parameter)
- `/designs` - Designs library with Supabase storage integration (public)
- `/designs/checkout` - Design cart checkout with WhatsApp/Telegram integration (public)
- `/designs-test` - Designs test/debug page (public)
- `/cart` - Shopping cart page
- `/accept-brand-invite` - Brand invite acceptance (public)
- `/accept-invite` - Customer invite acceptance (public)
- `/admin` → `/dashboard/admin` - Convenience redirect
- `/driver` → `/dashboard/driver` - Convenience redirect
- `/brand` → `/dashboard/brand` - Convenience redirect
- `/_routes` - Routes debug page (development only, gated by VITE_ENABLE_ROUTES_DEBUG)
- `*` - 404 Not Found page

## Zustand State Management Best Practices

The application uses Zustand with strict patterns to prevent unnecessary re-renders and React's `useSyncExternalStore` warnings.

### Selector Stability Rules

- **Prefer atomic selectors**: Instead of selecting multiple fields in one selector, use separate selectors for each field
- **Avoid inline object creation**: Don't create new objects in selectors unless necessary
- **Use shallow equality**: For objects/arrays, use Zustand's `shallow` comparison or custom equality functions
- **Keep selectors simple**: Complex computations should be memoized outside the selector
- **Memoize derived data**: For multi-field selectors, wrap with `createDerivedSelector` (see `src/data/store.ts`) and supply equality checks like `shallowEqual` or domain-specific comparators (e.g., `areCartTotalsEqual`)
- **Cache snapshots**: When adding selectors that compute arrays or objects, ensure they reference existing state objects or return memoized copies

### Example

```tsx
// ❌ BAD: Creates new object on every render
const data = useAppStore((state) => ({
  items: state.cart.items,
  total: state.cart.total,
}));

// ✅ GOOD: Use separate atomic selectors
const items = useAppStore((state) => state.cart.items);
const total = useAppStore((state) => state.cart.total);

// ✅ ALSO GOOD: Use shallow comparison for objects
import { shallow } from 'zustand/shallow';
const { items, total } = useAppStore(
  (state) => ({ items: state.cart.items, total: state.cart.total }),
  shallow
);

// ✅ BEST: Use createDerivedSelector for complex derived state
const useCartTotals = createDerivedSelector(
  (state) => ({ items: state.cart.items, total: state.cart.total }),
  areCartTotalsEqual
);
```

### Store Validation

Before merging changes to any store:

1. Run `pnpm typecheck` to confirm no TypeScript errors
2. Run `pnpm build` to ensure React's `getSnapshot` warning stays silent
3. Test in browser DevTools → Components → verify no infinite re-render warnings
4. Run `pnpm audit:quick` for quick validation

See `CONTRIBUTING.md` for detailed deployment guidelines.
