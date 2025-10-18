#!/usr/bin/env ts-node
/**
 * Route Atlas Generator for Verde Cannabis Marketplace
 *
 * Analyzes routing structure by:
 * - Parsing router.tsx for route definitions
 * - Scanning pages and features for components
 * - Finding Link and navigate() references
 * - Detecting unmounted pages
 *
 * Outputs:
 * - route-atlas.json (machine-readable)
 * - ROUTE_ATLAS.md (human-readable report)
 * - unknown-links.csv
 * - unmounted-pages.csv
 */

import { Project, SyntaxKind, Node } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types
interface RouteInfo {
  path: string;
  component: string;
  lazyImport?: string;
  lazyChunk?: string;
  hasErrorElement: boolean;
  errorElement?: string;
  isProtected: boolean;
  requiredRoles: string[];
  featureFlags: string[];
  params: string[];
  isDynamic: boolean;
  isRedirect: boolean;
  redirectTo?: string;
  fileLocation: string;
  children: RouteInfo[];
  isConditional?: boolean;
  condition?: string;
}

interface LinkReference {
  file: string;
  line: number;
  target: string;
  type: 'Link' | 'navigate' | 'useNavigate';
}

interface UnmountedPage {
  component: string;
  file: string;
  exports: string[];
}

interface AtlasData {
  generated: string;
  routes: RouteInfo[];
  linkReferences: LinkReference[];
  unmountedPages: UnmountedPage[];
  unknownLinks: LinkReference[];
  summary: {
    totalRoutes: number;
    protectedRoutes: number;
    dynamicRoutes: number;
    lazyRoutes: number;
    redirects: number;
    conditionalRoutes: number;
    totalLinks: number;
    unknownLinksCount: number;
    unmountedPagesCount: number;
  };
}

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ROUTER_FILE = path.join(PROJECT_ROOT, 'src/app/router.tsx');
const PAGES_DIR = path.join(PROJECT_ROOT, 'src/pages');
const FEATURES_DIR = path.join(PROJECT_ROOT, 'src/features');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Initialize ts-morph project
const project = new Project({
  tsConfigFilePath: path.join(PROJECT_ROOT, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

// Add source files
project.addSourceFilesAtPaths([
  'src/**/*.tsx',
  'src/**/*.ts',
  '!src/**/*.test.tsx',
  '!src/**/*.test.ts',
]);

/**
 * Extract path parameters from a route path
 * e.g., "/shop/:slug" -> ["slug"]
 */
function extractParams(routePath: string): string[] {
  const paramRegex = /:(\w+)/g;
  const params: string[] = [];
  let match;
  while ((match = paramRegex.exec(routePath)) !== null) {
    params.push(match[1]);
  }
  return params;
}

/**
 * Parse lazy import to get chunk file path
 * e.g., lazy(() => import("@/pages/Dashboard")) -> "src/pages/Dashboard"
 */
function parseLazyImport(lazyCall: string): { importPath: string; chunkFile: string } | null {
  const match = lazyCall.match(/import\s*\(\s*["']([^"']+)["']\s*\)/);
  if (!match) return null;

  const importPath = match[1];
  // Resolve @ alias
  const resolved = importPath.replace(/^@\//, 'src/');
  return {
    importPath,
    chunkFile: resolved,
  };
}

/**
 * Extract ProtectedRoute props to determine roles
 */
function extractProtectedRouteRoles(element: Node): string[] {
  const roles: string[] = [];

  // Look for requireRole prop
  const jsxElement = element.asKind(SyntaxKind.JsxElement) ||
                     element.asKind(SyntaxKind.JsxSelfClosingElement);

  if (!jsxElement) {
    // Check parent and children
    element.forEachDescendant((node) => {
      const jsx = node.asKind(SyntaxKind.JsxElement) ||
                  node.asKind(SyntaxKind.JsxSelfClosingElement);
      if (jsx) {
        const name = jsx.asKind(SyntaxKind.JsxElement)?.getOpeningElement().getTagNameNode().getText() ||
                     jsx.asKind(SyntaxKind.JsxSelfClosingElement)?.getTagNameNode().getText();

        if (name === 'ProtectedRoute') {
          const attrs = jsx.asKind(SyntaxKind.JsxElement)?.getOpeningElement().getAttributes() ||
                       jsx.asKind(SyntaxKind.JsxSelfClosingElement)?.getAttributes();

          attrs?.forEach((attr) => {
            if (attr.asKind(SyntaxKind.JsxAttribute)) {
              const attrName = attr.asKind(SyntaxKind.JsxAttribute)?.getNameNode().getText();
              if (attrName === 'requireRole') {
                const init = attr.asKind(SyntaxKind.JsxAttribute)?.getInitializer();
                if (init) {
                  const roleText = init.getText().replace(/[{}'"]/g, '');
                  // Extract ROLES.XXX pattern
                  const roleMatch = roleText.match(/ROLES\.(\w+)/);
                  if (roleMatch) {
                    roles.push(roleMatch[1].toLowerCase());
                  } else {
                    roles.push(roleText);
                  }
                }
              }
            }
          });
        }
      }
    });
  }

  return roles;
}

/**
 * Check if element contains ProtectedRoute wrapper
 */
function hasProtectedRoute(element: Node): boolean {
  let found = false;
  element.forEachDescendant((node) => {
    const jsx = node.asKind(SyntaxKind.JsxElement) ||
                node.asKind(SyntaxKind.JsxSelfClosingElement);
    if (jsx) {
      const name = jsx.asKind(SyntaxKind.JsxElement)?.getOpeningElement().getTagNameNode().getText() ||
                   jsx.asKind(SyntaxKind.JsxSelfClosingElement)?.getTagNameNode().getText();
      if (name === 'ProtectedRoute') {
        found = true;
      }
    }
  });
  return found;
}

/**
 * Extract component name from element
 */
function extractComponentName(element: Node): string {
  let componentName = 'Unknown';

  element.forEachDescendant((node) => {
    const jsx = node.asKind(SyntaxKind.JsxElement) ||
                node.asKind(SyntaxKind.JsxSelfClosingElement);
    if (jsx) {
      const name = jsx.asKind(SyntaxKind.JsxElement)?.getOpeningElement().getTagNameNode().getText() ||
                   jsx.asKind(SyntaxKind.JsxSelfClosingElement)?.getTagNameNode().getText();

      // Skip wrappers
      if (name && !['Suspense', 'ProtectedRoute', 'Fragment'].includes(name)) {
        componentName = name;
      }
    }
  });

  return componentName;
}

/**
 * Parse routes from router.tsx
 */
function parseRoutes(): RouteInfo[] {
  const sourceFile = project.getSourceFile(ROUTER_FILE);
  if (!sourceFile) {
    throw new Error(`Router file not found: ${ROUTER_FILE}`);
  }

  const routes: RouteInfo[] = [];

  // Find router configuration
  const routerVar = sourceFile.getVariableDeclaration('router');
  if (!routerVar) {
    throw new Error('Could not find router variable in router.tsx');
  }

  const initializer = routerVar.getInitializer();
  if (!initializer) {
    throw new Error('Router variable has no initializer');
  }

  // Get the array argument to createBrowserRouter
  const callExpr = initializer.asKind(SyntaxKind.CallExpression);
  if (!callExpr) {
    throw new Error('Router is not a call expression');
  }

  const args = callExpr.getArguments();
  if (args.length === 0) {
    throw new Error('createBrowserRouter has no arguments');
  }

  const routesArray = args[0].asKind(SyntaxKind.ArrayLiteralExpression);
  if (!routesArray) {
    throw new Error('Routes argument is not an array');
  }

  // Parse each route object
  const elements = routesArray.getElements();

  for (const element of elements) {
    // Handle spread operator for conditional routes
    if (element.asKind(SyntaxKind.SpreadElement)) {
      const spreadExpr = element.asKind(SyntaxKind.SpreadElement)?.getExpression();
      if (spreadExpr) {
        const conditional = spreadExpr.asKind(SyntaxKind.ConditionalExpression);
        if (conditional) {
          const condition = conditional.getCondition().getText();
          const whenTrue = conditional.getWhenTrue();

          if (whenTrue.asKind(SyntaxKind.ArrayLiteralExpression)) {
            const conditionalRoutes = whenTrue.asKind(SyntaxKind.ArrayLiteralExpression)?.getElements() || [];
            for (const cr of conditionalRoutes) {
              const routeInfo = parseRouteObject(cr);
              if (routeInfo) {
                routeInfo.isConditional = true;
                routeInfo.condition = condition;
                routes.push(routeInfo);
              }
            }
          }
        }
      }
      continue;
    }

    const routeInfo = parseRouteObject(element);
    if (routeInfo) {
      routes.push(routeInfo);
    }
  }

  return routes;
}

/**
 * Parse a single route object
 */
function parseRouteObject(node: Node): RouteInfo | null {
  const objLiteral = node.asKind(SyntaxKind.ObjectLiteralExpression);
  if (!objLiteral) return null;

  let routePath = '';
  let component = '';
  let lazyImport = '';
  let lazyChunk = '';
  let hasErrorElement = false;
  let errorElement = '';
  let isProtected = false;
  let requiredRoles: string[] = [];
  let isRedirect = false;
  let redirectTo = '';

  const properties = objLiteral.getProperties();

  for (const prop of properties) {
    if (prop.asKind(SyntaxKind.PropertyAssignment)) {
      const propAssignment = prop.asKind(SyntaxKind.PropertyAssignment)!;
      const propName = propAssignment.getName();
      const initializer = propAssignment.getInitializer();

      if (!initializer) continue;

      switch (propName) {
        case 'path':
          routePath = initializer.getText().replace(/['"]/g, '');
          break;

        case 'element':
          component = extractComponentName(initializer);
          isProtected = hasProtectedRoute(initializer);
          requiredRoles = extractProtectedRouteRoles(initializer);

          // Check for Navigate (redirect)
          if (initializer.getText().includes('Navigate')) {
            isRedirect = true;
          }
          break;

        case 'errorElement':
          hasErrorElement = true;
          errorElement = extractComponentName(initializer);
          break;
      }
    }
  }

  // If redirect, extract the 'to' prop
  if (isRedirect) {
    const elementProp = properties.find(p => {
      const pa = p.asKind(SyntaxKind.PropertyAssignment);
      return pa && pa.getName() === 'element';
    });

    if (elementProp) {
      const init = elementProp.asKind(SyntaxKind.PropertyAssignment)?.getInitializer();
      if (init) {
        const text = init.getText();
        const toMatch = text.match(/to=["']([^"']+)["']/);
        if (toMatch) {
          redirectTo = toMatch[1];
        }
      }
    }
  }

  // Find lazy import from source file
  const sourceFile = node.getSourceFile();
  const lazyVarName = component;

  if (lazyVarName && lazyVarName !== 'Navigate') {
    const lazyVar = sourceFile.getVariableDeclaration(lazyVarName);
    if (lazyVar) {
      const lazyInit = lazyVar.getInitializer();
      if (lazyInit) {
        const lazyText = lazyInit.getText();
        const parsed = parseLazyImport(lazyText);
        if (parsed) {
          lazyImport = parsed.importPath;
          lazyChunk = parsed.chunkFile;
        }
      }
    }
  }

  const params = extractParams(routePath);

  return {
    path: routePath,
    component,
    lazyImport,
    lazyChunk,
    hasErrorElement,
    errorElement,
    isProtected,
    requiredRoles,
    featureFlags: [], // TODO: detect from env checks
    params,
    isDynamic: params.length > 0,
    isRedirect,
    redirectTo,
    fileLocation: ROUTER_FILE,
    children: [], // TODO: nested routes
  };
}

/**
 * Find all Link and navigate() references
 */
function findLinkReferences(): LinkReference[] {
  const references: LinkReference[] = [];

  const sourceFiles = project.getSourceFiles();

  for (const file of sourceFiles) {
    const filePath = file.getFilePath();

    // Find <Link to="..." />
    const jsxElements = file.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
    for (const jsx of jsxElements) {
      const tagName = jsx.getTagNameNode().getText();
      if (tagName === 'Link') {
        const attrs = jsx.getAttributes();
        for (const attr of attrs) {
          const attrNode = attr.asKind(SyntaxKind.JsxAttribute);
          if (attrNode && attrNode.getNameNode().getText() === 'to') {
            const init = attrNode.getInitializer();
            if (init) {
              let target = init.getText().replace(/['"{}]/g, '');
              // Remove backticks for template literals
              target = target.replace(/`/g, '');
              // Simplify template expressions
              target = target.replace(/\$\{[^}]+\}/g, ':param');

              references.push({
                file: filePath.replace(PROJECT_ROOT, ''),
                line: jsx.getStartLineNumber(),
                target,
                type: 'Link',
              });
            }
          }
        }
      }
    }

    // Find navigate("...") calls
    const callExpressions = file.getDescendantsOfKind(SyntaxKind.CallExpression);
    for (const call of callExpressions) {
      const expr = call.getExpression();
      const exprText = expr.getText();

      if (exprText === 'navigate' || exprText.endsWith('.navigate')) {
        const args = call.getArguments();
        if (args.length > 0) {
          let target = args[0].getText().replace(/['"]/g, '');
          // Simplify template literals
          target = target.replace(/`/g, '').replace(/\$\{[^}]+\}/g, ':param');

          references.push({
            file: filePath.replace(PROJECT_ROOT, ''),
            line: call.getStartLineNumber(),
            target,
            type: 'navigate',
          });
        }
      }
    }

    // Find useNavigate() hook usage
    const identifiers = file.getDescendantsOfKind(SyntaxKind.Identifier);
    for (const id of identifiers) {
      if (id.getText() === 'useNavigate') {
        const parent = id.getParent();
        if (parent?.asKind(SyntaxKind.CallExpression)) {
          references.push({
            file: filePath.replace(PROJECT_ROOT, ''),
            line: id.getStartLineNumber(),
            target: '[dynamic]',
            type: 'useNavigate',
          });
        }
      }
    }
  }

  return references;
}

/**
 * Find all page components that are exported but not mounted
 */
function findUnmountedPages(routes: RouteInfo[]): UnmountedPage[] {
  const mountedComponents = new Set<string>();

  // Collect all mounted components
  function collectMounted(routeList: RouteInfo[]) {
    for (const route of routeList) {
      if (route.component) {
        mountedComponents.add(route.component);
      }
      if (route.children.length > 0) {
        collectMounted(route.children);
      }
    }
  }
  collectMounted(routes);

  const unmounted: UnmountedPage[] = [];

  // Scan pages directory
  const pagesFiles = project.getSourceFiles(`${PAGES_DIR}/**/*.tsx`);
  for (const file of pagesFiles) {
    const filePath = file.getFilePath();
    const exportDecls = file.getExportedDeclarations();

    const exportNames: string[] = [];
    exportDecls.forEach((decls, name) => {
      exportNames.push(name);
    });

    // Check for default export
    const defaultExport = file.getDefaultExportSymbol();
    if (defaultExport) {
      const declNode = defaultExport.getValueDeclaration();
      if (declNode) {
        let componentName = 'default';

        // Try to get actual component name
        const funcDecl = declNode.asKind(SyntaxKind.FunctionDeclaration);
        const varDecl = declNode.asKind(SyntaxKind.VariableDeclaration);

        if (funcDecl) {
          componentName = funcDecl.getName() || 'default';
        } else if (varDecl) {
          componentName = varDecl.getName();
        }

        // Extract from filename if still default
        if (componentName === 'default') {
          const filename = path.basename(filePath, '.tsx');
          componentName = filename;
        }

        if (!mountedComponents.has(componentName)) {
          unmounted.push({
            component: componentName,
            file: filePath.replace(PROJECT_ROOT, ''),
            exports: exportNames,
          });
        }
      }
    }
  }

  return unmounted;
}

/**
 * Identify unknown links
 */
function findUnknownLinks(routes: RouteInfo[], references: LinkReference[]): LinkReference[] {
  const validPaths = new Set<string>();

  function collectPaths(routeList: RouteInfo[]) {
    for (const route of routeList) {
      validPaths.add(route.path);

      // Add variations for dynamic routes
      if (route.isDynamic) {
        // Add pattern without params for partial matching
        const pattern = route.path.replace(/:[^/]+/g, ':param');
        validPaths.add(pattern);
      }

      if (route.children.length > 0) {
        collectPaths(route.children);
      }
    }
  }
  collectPaths(routes);

  const unknown: LinkReference[] = [];

  for (const ref of references) {
    if (ref.target === '[dynamic]') continue;

    // Check if exact match
    if (validPaths.has(ref.target)) continue;

    // Check if matches dynamic pattern
    let found = false;
    for (const validPath of validPaths) {
      if (validPath.includes(':param')) {
        const regex = new RegExp('^' + validPath.replace(/:[^/]+/g, '[^/]+') + '$');
        if (regex.test(ref.target)) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      unknown.push(ref);
    }
  }

  return unknown;
}

/**
 * Generate markdown report
 */
function generateMarkdown(data: AtlasData): string {
  let md = '# Route Atlas\n\n';
  md += `> Generated: ${data.generated}\n\n`;

  // Summary
  md += '## Summary\n\n';
  md += '| Metric | Count |\n';
  md += '|--------|-------|\n';
  md += `| Total Routes | ${data.summary.totalRoutes} |\n`;
  md += `| Protected Routes | ${data.summary.protectedRoutes} |\n`;
  md += `| Dynamic Routes | ${data.summary.dynamicRoutes} |\n`;
  md += `| Lazy-Loaded Routes | ${data.summary.lazyRoutes} |\n`;
  md += `| Redirects | ${data.summary.redirects} |\n`;
  md += `| Conditional Routes | ${data.summary.conditionalRoutes} |\n`;
  md += `| Total Link References | ${data.summary.totalLinks} |\n`;
  md += `| Unknown Links | ${data.summary.unknownLinksCount} |\n`;
  md += `| Unmounted Pages | ${data.summary.unmountedPagesCount} |\n\n`;

  // Route Tree
  md += '## Route Tree\n\n';
  md += '```\n';
  for (const route of data.routes) {
    const badges = [];
    if (route.isProtected) badges.push('[GUARDED]');
    if (route.lazyChunk) badges.push('[LAZY]');
    if (route.isDynamic) badges.push('[PARAM]');
    if (route.hasErrorElement) badges.push('[ERROR_ELEM]');
    if (route.isRedirect) badges.push('[REDIRECT]');
    if (route.isConditional) badges.push('[CONDITIONAL]');

    const badgeStr = badges.length > 0 ? ' ' + badges.join(' ') : '';
    const roleStr = route.requiredRoles.length > 0 ? ` (roles: ${route.requiredRoles.join(', ')})` : '';
    const redirectStr = route.redirectTo ? ` → ${route.redirectTo}` : '';

    md += `${route.path}${badgeStr}${roleStr}${redirectStr}\n`;
    md += `  └─ ${route.component}\n`;
  }
  md += '```\n\n';

  // Routes Table
  md += '## Routes Detail\n\n';
  md += '| Path | Component | Protected | Roles | Lazy Chunk | Params |\n';
  md += '|------|-----------|-----------|-------|------------|--------|\n';
  for (const route of data.routes) {
    const protectedStr = route.isProtected ? 'Yes' : 'No';
    const rolesStr = route.requiredRoles.length > 0 ? route.requiredRoles.join(', ') : '-';
    const lazyStr = route.lazyChunk ? `\`${route.lazyChunk}\`` : '-';
    const paramsStr = route.params.length > 0 ? route.params.join(', ') : '-';

    md += `| ${route.path} | ${route.component} | ${protectedStr} | ${rolesStr} | ${lazyStr} | ${paramsStr} |\n`;
  }
  md += '\n';

  // Unknown Links
  if (data.unknownLinks.length > 0) {
    md += '## Unknown Links\n\n';
    md += '| File | Line | Target | Type |\n';
    md += '|------|------|--------|------|\n';
    for (const link of data.unknownLinks) {
      md += `| ${link.file} | ${link.line} | \`${link.target}\` | ${link.type} |\n`;
    }
    md += '\n';
  } else {
    md += '## Unknown Links\n\n';
    md += 'No unknown links found. All navigation targets are valid routes.\n\n';
  }

  // Unmounted Pages
  if (data.unmountedPages.length > 0) {
    md += '## Unmounted Pages\n\n';
    md += '| Component | File | Exports |\n';
    md += '|-----------|------|----------|\n';
    for (const page of data.unmountedPages) {
      const exportsStr = page.exports.join(', ');
      md += `| ${page.component} | ${page.file} | ${exportsStr} |\n`;
    }
    md += '\n';
  } else {
    md += '## Unmounted Pages\n\n';
    md += 'No unmounted pages found. All page components are mounted in the router.\n\n';
  }

  return md;
}

/**
 * Generate CSV for unknown links
 */
function generateUnknownLinksCSV(links: LinkReference[]): string {
  let csv = 'File,Line,Target,Type\n';
  for (const link of links) {
    csv += `"${link.file}",${link.line},"${link.target}",${link.type}\n`;
  }
  return csv;
}

/**
 * Generate CSV for unmounted pages
 */
function generateUnmountedPagesCSV(pages: UnmountedPage[]): string {
  let csv = 'Component,File,Exports\n';
  for (const page of pages) {
    const exportsStr = page.exports.join('; ');
    csv += `"${page.component}","${page.file}","${exportsStr}"\n`;
  }
  return csv;
}

/**
 * Main execution
 */
async function main() {
  console.log('🗺️  Generating Route Atlas...\n');

  console.log('📖 Parsing routes from router.tsx...');
  const routes = parseRoutes();
  console.log(`   Found ${routes.length} routes\n`);

  console.log('🔗 Finding link references...');
  const linkReferences = findLinkReferences();
  console.log(`   Found ${linkReferences.length} link references\n`);

  console.log('🔍 Detecting unmounted pages...');
  const unmountedPages = findUnmountedPages(routes);
  console.log(`   Found ${unmountedPages.length} unmounted pages\n`);

  console.log('❓ Identifying unknown links...');
  const unknownLinks = findUnknownLinks(routes, linkReferences);
  console.log(`   Found ${unknownLinks.length} unknown links\n`);

  // Calculate summary
  const summary = {
    totalRoutes: routes.length,
    protectedRoutes: routes.filter(r => r.isProtected).length,
    dynamicRoutes: routes.filter(r => r.isDynamic).length,
    lazyRoutes: routes.filter(r => r.lazyChunk).length,
    redirects: routes.filter(r => r.isRedirect).length,
    conditionalRoutes: routes.filter(r => r.isConditional).length,
    totalLinks: linkReferences.length,
    unknownLinksCount: unknownLinks.length,
    unmountedPagesCount: unmountedPages.length,
  };

  const atlasData: AtlasData = {
    generated: new Date().toISOString(),
    routes,
    linkReferences,
    unmountedPages,
    unknownLinks,
    summary,
  };

  // Write outputs
  console.log('💾 Writing outputs...');

  const outputDir = PROJECT_ROOT;

  // JSON output
  fs.writeFileSync(
    path.join(outputDir, 'route-atlas.json'),
    JSON.stringify(atlasData, null, 2)
  );
  console.log('   ✓ route-atlas.json');

  // Markdown report
  const markdown = generateMarkdown(atlasData);
  fs.writeFileSync(
    path.join(outputDir, 'ROUTE_ATLAS.md'),
    markdown
  );
  console.log('   ✓ ROUTE_ATLAS.md');

  // Unknown links CSV
  if (unknownLinks.length > 0) {
    const unknownCSV = generateUnknownLinksCSV(unknownLinks);
    fs.writeFileSync(
      path.join(outputDir, 'unknown-links.csv'),
      unknownCSV
    );
    console.log('   ✓ unknown-links.csv');
  }

  // Unmounted pages CSV
  if (unmountedPages.length > 0) {
    const unmountedCSV = generateUnmountedPagesCSV(unmountedPages);
    fs.writeFileSync(
      path.join(outputDir, 'unmounted-pages.csv'),
      unmountedCSV
    );
    console.log('   ✓ unmounted-pages.csv');
  }

  console.log('\n✅ Route Atlas generation complete!');

  // Summary message
  if (unknownLinks.length > 0) {
    console.log(`\n⚠️  Warning: ${unknownLinks.length} unknown link(s) detected`);
  }
  if (unmountedPages.length > 0) {
    console.log(`\n💡 Info: ${unmountedPages.length} unmounted page(s) detected`);
  }
}

// Run
main().catch((err) => {
  console.error('❌ Error generating route atlas:', err);
  process.exit(1);
});
