# Verde Cannabis Marketplace

A modern cannabis delivery platform built with React, TypeScript, and Supabase.

## Quickstart

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
pnpm dev
```

## Build & Preview

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

## Environment

This project supports both Vite and Next.js environment variable prefixes due to the `envPrefix` configuration in `vite.config.ts`:

- **VITE_*** (recommended): Standard Vite environment variables
- **NEXT_PUBLIC_*** (alternative): Next.js compatibility mode

Either prefix works interchangeably. The environment schema in `src/shared/config/env.ts` validates and resolves both formats.

Required variables:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Supabase Storage: designs/

The `/designs` route connects to a Supabase storage bucket named "designs":

- **Required bucket**: `designs` (must exist in your Supabase project)
- **Access**: Public read access or signed URLs supported
- **Testing**: Visit `/designs` and expect asset count > 0

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed bucket configuration.

## Troubleshooting

### Empty designs list
- **Missing environment variables**: Ensure `VITE_SUPABASE_*` or `NEXT_PUBLIC_SUPABASE_*` are set
- **Check console**: Debug logs show environment status and API responses

### 403 errors on storage objects
- **Storage policy missing**: Run the SQL in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Bucket not public**: Enable public access or use signed URLs

### Runtime environment inspection
In development, check `window.__APP_ENV` in browser console for environment validation.

## Project Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Backend**: Supabase (database, auth, storage)
- **State**: Zustand for cart management
- **Testing**: Vitest + React Testing Library

## Repository Guidelines

Refer to [AGENTS.md](./AGENTS.md) for structure, workflows, and coding standards.

## Deployment

Deploy via Vercel or your preferred platform. Ensure environment variables are configured in your deployment settings.

## How can I edit this code?

**Use Lovable**

Visit the [Lovable Project](https://lovable.dev/projects/80074ec3-bcf4-4664-b8d4-6e22f1506a17) and start prompting.

**Use your preferred IDE**

Clone this repo and push changes. Requirements: Node.js 18.18+ and pnpm.

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
pnpm install
pnpm dev
```

**GitHub Codespaces**

Click "Code" → "Codespaces" → "New codespace" for a cloud development environment.
