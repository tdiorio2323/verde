# Verde Cannabis Marketplace

## Project Overview

This project is a modern cannabis delivery platform named Verde. It's built with a React and TypeScript frontend, utilizing Vite for the build tooling. The backend is powered by Supabase, which handles the database, authentication, and storage. The user interface is styled with Tailwind CSS and shadcn/ui components, and features a modern, glassmorphism-inspired design aesthetic. State management is handled with Zustand.

## Building and Running

### Prerequisites

- Node.js (version >=18.18 <=22)
- pnpm

### Installation

```bash
pnpm install
```

### Environment Setup

1.  Copy the environment variable template:

    ```bash
    cp .env.example .env.local
    ```

2.  Edit `.env.local` with your Supabase credentials:

    ```
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
    ```

### Development

To start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:8080`.

### Building for Production

To create a production build:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

### Testing

The project uses Vitest for testing. To run the tests:

```bash
pnpm test
```

To run the tests once without watching for changes:

```bash
pnpm test:run
```

### Linting and Type-checking

To run the linter:

```bash
pnpm lint
```

To perform a static type-check:

```bash
pnpm typecheck
```

## Development Conventions

### Routing

The application uses React Router v6 for routing. All routes are defined in `src/app/router.tsx` and are lazy-loaded for optimal performance.

### Styling

The project uses Tailwind CSS for styling, with a custom theme defined in `tailwind.config.ts`. The theme is designed to create a modern, glassmorphism-inspired UI. It also utilizes `shadcn/ui` for a set of pre-built components.

### State Management

Zustand is used for global state management, particularly for the shopping cart functionality.

### Environment Variables

The project supports both `VITE_` and `NEXT_PUBLIC_` prefixes for environment variables. The recommended prefix is `VITE_`.

### Supabase

The application is tightly integrated with Supabase for its backend services. This includes:

-   **Database:** PostgreSQL database for storing application data.
-   **Authentication:** User authentication and management.
-   **Storage:** File storage for assets like product images and designs.

The Supabase schema and types can be generated using the following command:

```bash
pnpm generate:types
```
