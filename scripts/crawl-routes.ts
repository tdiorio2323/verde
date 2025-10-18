#!/usr/bin/env ts-node
/**
 * Route Crawler for Verde Cannabis Marketplace
 *
 * Uses Playwright to visit all routes defined in route-atlas.json
 * and report on:
 * - HTTP status codes
 * - Console errors
 * - Missing assets (404s for images, scripts, etc.)
 * - Page load times
 *
 * Usage:
 *   ts-node scripts/crawl-routes.ts
 *   AUTH_BYPASS=1 ts-node scripts/crawl-routes.ts  # Skip auth checks
 */

import { chromium, Browser, Page, ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ATLAS_FILE = path.join(PROJECT_ROOT, 'route-atlas.json');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const AUTH_BYPASS = process.env.AUTH_BYPASS === '1';
const HEADLESS = process.env.HEADLESS !== '0';
const TIMEOUT = parseInt(process.env.TIMEOUT || '10000', 10);

interface RouteInfo {
  path: string;
  component: string;
  isProtected: boolean;
  requiredRoles: string[];
  isRedirect: boolean;
  redirectTo?: string;
  isConditional?: boolean;
}

interface AtlasData {
  routes: RouteInfo[];
}

interface CrawlResult {
  path: string;
  url: string;
  status: 'success' | 'error' | 'skipped' | 'redirect';
  httpStatus?: number;
  loadTime: number;
  consoleErrors: string[];
  consoleWarnings: string[];
  missingAssets: string[];
  redirectedTo?: string;
  error?: string;
  skippedReason?: string;
}

interface CrawlReport {
  generated: string;
  baseUrl: string;
  authBypass: boolean;
  results: CrawlResult[];
  summary: {
    totalRoutes: number;
    successfulVisits: number;
    errors: number;
    skipped: number;
    redirects: number;
    totalConsoleErrors: number;
    totalMissingAssets: number;
    avgLoadTime: number;
  };
}

/**
 * Load route atlas
 */
function loadAtlas(): AtlasData {
  if (!fs.existsSync(ATLAS_FILE)) {
    throw new Error(
      'route-atlas.json not found. Run "pnpm audit:routes" first.'
    );
  }

  const content = fs.readFileSync(ATLAS_FILE, 'utf-8');
  return JSON.parse(content);
}

/**
 * Should skip this route?
 */
function shouldSkip(route: RouteInfo): { skip: boolean; reason?: string } {
  // Skip protected routes if not in bypass mode
  if (route.isProtected && !AUTH_BYPASS) {
    return {
      skip: true,
      reason: 'Protected route (use AUTH_BYPASS=1 to test)',
    };
  }

  // Skip redirects
  if (route.isRedirect) {
    return {
      skip: true,
      reason: 'Redirect route',
    };
  }

  // Skip wildcard routes
  if (route.path === '*') {
    return {
      skip: true,
      reason: 'Wildcard catch-all route',
    };
  }

  // Skip conditional routes with dev-only flags
  if (route.isConditional) {
    return {
      skip: true,
      reason: 'Conditional route (may require specific env vars)',
    };
  }

  // Skip dynamic routes without param values
  if (route.path.includes(':')) {
    return {
      skip: true,
      reason: 'Dynamic route (requires parameter values)',
    };
  }

  return { skip: false };
}

/**
 * Crawl a single route
 */
async function crawlRoute(
  page: Page,
  route: RouteInfo
): Promise<CrawlResult> {
  const url = `${BASE_URL}${route.path}`;
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  const missingAssets: string[] = [];

  const result: CrawlResult = {
    path: route.path,
    url,
    status: 'success',
    loadTime: 0,
    consoleErrors,
    consoleWarnings,
    missingAssets,
  };

  // Check if should skip
  const skipCheck = shouldSkip(route);
  if (skipCheck.skip) {
    result.status = 'skipped';
    result.skippedReason = skipCheck.reason;
    return result;
  }

  // Set up console listeners
  page.on('console', (msg: ConsoleMessage) => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      consoleErrors.push(text);
    } else if (type === 'warning') {
      consoleWarnings.push(text);
    }
  });

  // Track 404 responses for assets
  page.on('response', (response) => {
    if (response.status() === 404) {
      const url = response.url();
      // Filter out API calls, only track asset 404s
      if (
        url.includes('.js') ||
        url.includes('.css') ||
        url.includes('.png') ||
        url.includes('.jpg') ||
        url.includes('.svg') ||
        url.includes('.woff') ||
        url.includes('.ttf')
      ) {
        missingAssets.push(url);
      }
    }
  });

  const startTime = Date.now();

  try {
    const response = await page.goto(url, {
      timeout: TIMEOUT,
      waitUntil: 'domcontentloaded',
    });

    result.loadTime = Date.now() - startTime;

    if (!response) {
      result.status = 'error';
      result.error = 'No response received';
      return result;
    }

    result.httpStatus = response.status();

    // Check for redirects
    if (response.status() >= 300 && response.status() < 400) {
      result.status = 'redirect';
      result.redirectedTo = response.url();
    } else if (response.status() >= 400) {
      result.status = 'error';
      result.error = `HTTP ${response.status()}`;
    } else {
      result.status = 'success';
    }

    // Wait a bit for dynamic content and console messages
    await page.waitForTimeout(500);
  } catch (error) {
    result.status = 'error';
    result.loadTime = Date.now() - startTime;
    result.error =
      error instanceof Error ? error.message : String(error);
  }

  return result;
}

/**
 * Generate markdown report
 */
function generateReport(report: CrawlReport): string {
  let md = '# Route Crawl Report\n\n';
  md += `> Generated: ${report.generated}\n`;
  md += `> Base URL: ${report.baseUrl}\n`;
  md += `> Auth Bypass: ${report.authBypass ? 'Enabled' : 'Disabled'}\n\n`;

  // Summary
  md += '## Summary\n\n';
  md += '| Metric | Count |\n';
  md += '|--------|-------|\n';
  md += `| Total Routes | ${report.summary.totalRoutes} |\n`;
  md += `| Successful Visits | ${report.summary.successfulVisits} |\n`;
  md += `| Errors | ${report.summary.errors} |\n`;
  md += `| Skipped | ${report.summary.skipped} |\n`;
  md += `| Redirects | ${report.summary.redirects} |\n`;
  md += `| Console Errors | ${report.summary.totalConsoleErrors} |\n`;
  md += `| Missing Assets | ${report.summary.totalMissingAssets} |\n`;
  md += `| Avg Load Time | ${report.summary.avgLoadTime}ms |\n\n`;

  // Results table
  md += '## Route Results\n\n';
  md +=
    '| Path | Status | HTTP | Load Time | Console Errors | Missing Assets | Notes |\n';
  md +=
    '|------|--------|------|-----------|----------------|----------------|-------|\n';

  for (const result of report.results) {
    const statusEmoji =
      result.status === 'success'
        ? '✅'
        : result.status === 'error'
        ? '❌'
        : result.status === 'redirect'
        ? '↪️'
        : '⏭️';

    const httpStatus = result.httpStatus || '-';
    const loadTime =
      result.loadTime > 0 ? `${result.loadTime}ms` : '-';
    const errCount = result.consoleErrors.length;
    const assetCount = result.missingAssets.length;
    const notes =
      result.error ||
      result.skippedReason ||
      result.redirectedTo ||
      '';

    md += `| ${result.path} | ${statusEmoji} ${result.status} | ${httpStatus} | ${loadTime} | ${errCount} | ${assetCount} | ${notes} |\n`;
  }
  md += '\n';

  // Errors detail
  const errResults = report.results.filter((r) => r.status === 'error');
  if (errResults.length > 0) {
    md += '## Errors Detail\n\n';
    for (const result of errResults) {
      md += `### ${result.path}\n\n`;
      md += `- **Error**: ${result.error}\n`;
      md += `- **URL**: ${result.url}\n`;

      if (result.consoleErrors.length > 0) {
        md += `- **Console Errors**:\n`;
        result.consoleErrors.forEach((err) => {
          md += `  - ${err}\n`;
        });
      }

      md += '\n';
    }
  }

  // Console errors detail
  const consoleErrResults = report.results.filter(
    (r) => r.consoleErrors.length > 0 && r.status !== 'error'
  );
  if (consoleErrResults.length > 0) {
    md += '## Console Errors\n\n';
    for (const result of consoleErrResults) {
      md += `### ${result.path}\n\n`;
      result.consoleErrors.forEach((err) => {
        md += `- ${err}\n`;
      });
      md += '\n';
    }
  }

  // Missing assets detail
  const missingAssetResults = report.results.filter(
    (r) => r.missingAssets.length > 0
  );
  if (missingAssetResults.length > 0) {
    md += '## Missing Assets\n\n';
    for (const result of missingAssetResults) {
      md += `### ${result.path}\n\n`;
      result.missingAssets.forEach((asset) => {
        md += `- ${asset}\n`;
      });
      md += '\n';
    }
  }

  return md;
}

/**
 * Main execution
 */
async function main() {
  console.log('🕷️  Starting Route Crawler...\n');

  // Check if dev server is running
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Dev server returned ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Cannot connect to ${BASE_URL}`);
    console.error(
      '   Make sure the dev server is running: pnpm dev\n'
    );
    process.exit(1);
  }

  console.log(`✓ Connected to ${BASE_URL}\n`);

  // Load atlas
  console.log('📖 Loading route atlas...');
  const atlas = loadAtlas();
  console.log(`   Found ${atlas.routes.length} routes\n`);

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  console.log('   Browser ready\n');

  // Crawl routes
  console.log('🔍 Crawling routes...\n');
  const results: CrawlResult[] = [];

  for (let i = 0; i < atlas.routes.length; i++) {
    const route = atlas.routes[i];
    console.log(
      `   [${i + 1}/${atlas.routes.length}] ${route.path}`
    );

    const result = await crawlRoute(page, route);
    results.push(result);

    const statusEmoji =
      result.status === 'success'
        ? '✅'
        : result.status === 'error'
        ? '❌'
        : result.status === 'redirect'
        ? '↪️'
        : '⏭️';

    console.log(
      `      ${statusEmoji} ${result.status} (${result.loadTime}ms)`
    );

    if (result.consoleErrors.length > 0) {
      console.log(
        `         ⚠️  ${result.consoleErrors.length} console error(s)`
      );
    }
  }

  console.log('');

  // Close browser
  await browser.close();

  // Calculate summary
  const successCount = results.filter(
    (r) => r.status === 'success'
  ).length;
  const errorCount = results.filter((r) => r.status === 'error').length;
  const skippedCount = results.filter(
    (r) => r.status === 'skipped'
  ).length;
  const redirectCount = results.filter(
    (r) => r.status === 'redirect'
  ).length;
  const totalConsoleErrors = results.reduce(
    (sum, r) => sum + r.consoleErrors.length,
    0
  );
  const totalMissingAssets = results.reduce(
    (sum, r) => sum + r.missingAssets.length,
    0
  );
  const avgLoadTime = Math.round(
    results
      .filter((r) => r.loadTime > 0)
      .reduce((sum, r) => sum + r.loadTime, 0) /
      results.filter((r) => r.loadTime > 0).length || 0
  );

  const report: CrawlReport = {
    generated: new Date().toISOString(),
    baseUrl: BASE_URL,
    authBypass: AUTH_BYPASS,
    results,
    summary: {
      totalRoutes: atlas.routes.length,
      successfulVisits: successCount,
      errors: errorCount,
      skipped: skippedCount,
      redirects: redirectCount,
      totalConsoleErrors,
      totalMissingAssets,
      avgLoadTime,
    },
  };

  // Write report
  console.log('💾 Writing report...');
  const markdown = generateReport(report);
  fs.writeFileSync(
    path.join(PROJECT_ROOT, 'crawl-report.md'),
    markdown
  );
  console.log('   ✓ crawl-report.md\n');

  // Summary
  console.log('✅ Crawl complete!\n');
  console.log(`   ${successCount} successful`);
  console.log(`   ${errorCount} errors`);
  console.log(`   ${skippedCount} skipped`);
  console.log(`   ${redirectCount} redirects`);

  if (totalConsoleErrors > 0) {
    console.log(
      `   ⚠️  ${totalConsoleErrors} console error(s) detected`
    );
  }
  if (totalMissingAssets > 0) {
    console.log(`   ⚠️  ${totalMissingAssets} missing asset(s)`);
  }

  // Exit with error if any route failed
  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run
main().catch((err) => {
  console.error('❌ Crawler error:', err);
  process.exit(1);
});
