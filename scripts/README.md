# Verde Scripts

Utility scripts for analyzing and maintaining the Verde codebase.

## Route Atlas Generator

Comprehensive route analysis tool that parses your routing configuration and detects issues.

### Usage

```bash
# Generate route atlas and reports
pnpm audit:routes

# Generate and open the markdown report
pnpm audit:routes:open
```

### Outputs

- **route-atlas.json** - Machine-readable JSON with full route data
- **ROUTE_ATLAS.md** - Human-readable markdown report with:
  - Route tree visualization
  - Summary metrics (protected routes, dynamic routes, lazy chunks, etc.)
  - Route details table
  - Unknown links report
  - Unmounted pages report
- **unknown-links.csv** - CSV list of navigation targets that don't match any route
- **unmounted-pages.csv** - CSV list of page components not mounted in the router

### Features

The route atlas generator:

1. **Parses Router Configuration**
   - Reads `src/app/router.tsx`
   - Extracts path, component, guards, roles, lazy imports
   - Detects dynamic parameters (`:id`, `:slug`, etc.)
   - Identifies redirects and error boundaries

2. **Scans for Navigation References**
   - Finds all `<Link to="...">` components
   - Finds all `navigate("...")` calls
   - Finds all `useNavigate()` hook usage
   - Validates navigation targets against defined routes

3. **Detects Unmounted Pages**
   - Scans `src/pages/**` for exported components
   - Compares against mounted routes
   - Reports pages that exist but aren't in the router

4. **Identifies Unknown Links**
   - Cross-references all navigation targets with valid routes
   - Flags broken links and invalid paths
   - Helps prevent 404 errors before deployment

## Route Crawler

Automated browser testing tool that visits all routes and reports issues.

### Usage

```bash
# Make sure dev server is running
pnpm dev

# In another terminal, run the crawler
tsx scripts/crawl-routes.ts

# Or with auth bypass to test protected routes
AUTH_BYPASS=1 tsx scripts/crawl-routes.ts

# Run in visible browser mode (not headless)
HEADLESS=0 tsx scripts/crawl-routes.ts

# Configure base URL
BASE_URL=http://localhost:3000 tsx scripts/crawl-routes.ts
```

### Output

- **crawl-report.md** - Markdown report with:
  - Summary metrics (successful visits, errors, load times)
  - Route results table with status, HTTP codes, console errors
  - Detailed error reports
  - Console error logs
  - Missing assets report

### Features

The crawler:

1. **Visits Each Route**
   - Loads each route in a real browser (Playwright/Chromium)
   - Records HTTP status codes
   - Measures page load times
   - Skips protected routes unless `AUTH_BYPASS=1`

2. **Detects Issues**
   - Console errors and warnings
   - Missing assets (404s for JS, CSS, images)
   - Failed HTTP responses
   - Redirect chains

3. **Generates Reports**
   - Visual status indicators (✅❌↪️⏭️)
   - Performance metrics (average load time)
   - Detailed error logs
   - Asset 404 tracking

### Environment Variables

- `BASE_URL` - Dev server URL (default: `http://localhost:8080`)
- `AUTH_BYPASS` - Set to `1` to crawl protected routes
- `HEADLESS` - Set to `0` to see browser UI
- `TIMEOUT` - Page load timeout in ms (default: `10000`)

## Other Scripts

### Environment Variable Audit

```bash
pnpm audit:env
```

Scans codebase for environment variable usage and validates against `.env.example`.

## Development

All scripts are written in TypeScript and use `tsx` for execution (handles ESM modules).

### Adding a New Script

1. Create script in `scripts/` directory
2. Add ESM compatibility:
   ```typescript
   import { fileURLToPath } from 'url';
   import { dirname } from 'path';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);
   ```
3. Add script command to `package.json`:
   ```json
   {
     "scripts": {
       "my-script": "tsx scripts/my-script.ts"
     }
   }
   ```

### Dependencies

- **ts-morph** - TypeScript AST parsing for route analysis
- **playwright** - Browser automation for route crawling
- **tsx** - TypeScript execution with ESM support

## Tips

1. **Before Deployment**: Run `pnpm audit:routes` to catch broken links
2. **During Development**: Use `AUTH_BYPASS=1` crawler to test protected routes locally
3. **CI/CD Integration**: Add route audits to pre-push hooks or CI pipelines
4. **Performance Monitoring**: Track average load times in crawl reports over time

## Troubleshooting

### Route Atlas Not Finding Routes

Make sure `src/app/router.tsx` uses the standard `createBrowserRouter` pattern. The parser expects route objects in an array.

### Crawler Can't Connect

Ensure dev server is running on the expected port (default 8080). Check `BASE_URL` environment variable.

### TypeScript Errors in Scripts

The scripts use `tsx` which handles both CommonJS and ESM. If you see module errors, check that `__dirname` is properly defined using `fileURLToPath`.
