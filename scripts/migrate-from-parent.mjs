/**
 * migrate-from-parent.mjs
 * ---------------------------------------------------------------------------
 * One-time (and safely re-runnable) migration that pulls the uBIQ brand site
 * out of the parent unntangle.com project and into this standalone app.
 *
 * WHAT IT DOES
 *
 *   1. Copies every route under  <parent>/app/ubiq/**  into  ./app/**,
 *      dropping the "ubiq" path segment. So:
 *
 *          <parent>/app/ubiq/page.tsx          ->  ./app/page.tsx
 *          <parent>/app/ubiq/about/page.tsx    ->  ./app/about/page.tsx
 *          <parent>/app/ubiq/senz/page.tsx     ->  ./app/senz/page.tsx
 *
 *   2. Walks the import graph out of those pages and copies every local
 *      dependency it finds (components, their co-located *.module.css,
 *      anything under data/ or lib/). Transitive — a component that imports
 *      another component pulls that one in too. Nothing is copied that the
 *      uBIQ pages don't actually reach, so none of the parent's marketing-site
 *      components come along for the ride.
 *
 *   3. Copies app/globals.css (shared design tokens + the .ubiqTheme scope).
 *
 *   4. Copies the public/ asset folders the site needs, binaries included.
 *
 *   5. Rewrites the /ubiq route prefix to root inside every copied .ts/.tsx
 *      file, and repoints the SITE_URL fallback at this site's domain.
 *
 * WHAT IT DOES NOT TOUCH
 *
 *   The parent project is opened strictly read-only. Nothing is written
 *   outside this directory.
 *
 *   These files are authored for this project and are never overwritten:
 *       app/layout.tsx, app/sitemap.ts, app/robots.ts, app/manifest.ts
 *
 * USAGE
 *
 *   node scripts/migrate-from-parent.mjs            # copy
 *   node scripts/migrate-from-parent.mjs --dry-run  # show plan, write nothing
 *
 * Re-running overwrites the copied files with fresh ones from the parent,
 * which is what you want while the parent is still the source of truth.
 * Once this project owns the uBIQ code outright, delete this script.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEST = path.resolve(__dirname, "..");
const PARENT = path.resolve(DEST, "..", "unntangle.com");

/** Route subtree in the parent that becomes the root of this site. */
const SOURCE_ROUTE_DIR = path.join(PARENT, "app", "ubiq");

/** Public folders copied wholesale (binaries and all). */
const PUBLIC_DIRS = ["uBIQ", "images"];

/** Never overwritten — these are this project's own. */
const PROTECTED = new Set([
  "app/layout.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "app/manifest.ts",
]);

/** Module specifiers resolved as local source rather than npm packages. */
const RESOLVE_EXTENSIONS = ["", ".tsx", ".ts", ".jsx", ".js", ".css"];

const DRY_RUN = process.argv.includes("--dry-run");

const copied = [];
const skipped = [];
const missing = [];

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

const toPosix = (p) => p.split(path.sep).join("/");

function assertParentExists() {
  if (!fs.existsSync(SOURCE_ROUTE_DIR)) {
    console.error(
      `\n  Could not find the parent project's uBIQ routes.\n` +
        `  Looked in: ${SOURCE_ROUTE_DIR}\n\n` +
        `  This script expects the two projects to be siblings:\n\n` +
        `      Client Websites/\n` +
        `        unntangle.com/          <- parent (source)\n` +
        `        ubiqautomation.com/     <- this project\n\n` +
        `  If the parent lives elsewhere, edit PARENT at the top of this file.\n`
    );
    process.exit(1);
  }
}

function writeFileSafe(relDest, contents, { binary = false } = {}) {
  const rel = toPosix(relDest);

  if (PROTECTED.has(rel)) {
    skipped.push(`${rel}  (protected — this project's own version kept)`);
    return;
  }

  const abs = path.join(DEST, relDest);

  if (DRY_RUN) {
    copied.push(rel);
    return;
  }

  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents, binary ? undefined : "utf8");
  copied.push(rel);
}

// ---------------------------------------------------------------------------
// Source rewriting
// ---------------------------------------------------------------------------

/**
 * Rewrites the /ubiq route prefix to root.
 *
 * Case-sensitivity is doing real work here. Only the lowercase, slash-prefixed
 * form "/ubiq" is a route. These must all survive untouched:
 *
 *     @/components/UbiqNav        <- capital U, component import
 *     /uBIQ/uBIQ-logo.svg         <- capital BIQ, public asset path
 *     className="ubiqTheme"       <- no leading slash, CSS class
 *
 * Two passes, because the replacement differs by what follows:
 *
 *     "/ubiq/contact"          -> "/contact"        (drop the segment)
 *     "/ubiq"                  -> "/"               (it was the root)
 *     "${SITE_URL}/ubiq#brand" -> "${SITE_URL}/#brand"
 */
function rewriteRoutes(source) {
  return source
    .replace(/\/ubiq(?=\/)/g, "")
    .replace(/\/ubiq(?=["'`#\s)])/g, "/");
}

/** Repoints the SITE_URL fallback from the parent domain to this site's domain. */
function rewriteSiteUrl(source) {
  return source.replace(
    /"https:\/\/unntangle\.com"/g,
    '"https://ubiqautomation.com"'
  );
}

/**
 * The old /ubiq page was a child of unntangle.com, so its title relied on the
 * parent layout's "%s | Unntangle" template. As this site's home page that
 * would render as "uBIQ — Smart Space Automation | uBIQ", which stutters.
 * Pin it absolute instead. Guarded — if the string has changed upstream this
 * silently does nothing rather than corrupting the file.
 */
function rewriteHomeTitle(source) {
  const needle = `title: "uBIQ — Smart Space Automation",`;
  const replacement = `title: {
        // Absolute: this is the home page of its own domain now, so it
        // opts out of the "%s | uBIQ" template in app/layout.tsx.
        absolute: "uBIQ — Smart Space Automation by Unntangle",
    },`;
  return source.includes(needle) ? source.replace(needle, replacement) : source;
}

function transformSource(source, { isHomePage = false } = {}) {
  let out = rewriteRoutes(source);
  out = rewriteSiteUrl(out);
  if (isHomePage) out = rewriteHomeTitle(out);
  return out;
}

// ---------------------------------------------------------------------------
// Import graph walk
// ---------------------------------------------------------------------------

/** Pulls every module specifier out of a source file. */
function extractSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\bfrom\s+["']([^"']+)["']/g, // import x from 'y'  /  export * from 'y'
    /\bimport\s+["']([^"']+)["']/g, // side-effect import 'y'
    /\bimport\(\s*["']([^"']+)["']\s*\)/g, // dynamic import('y')
    /\brequire\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(source)) !== null) specifiers.add(m[1]);
  }
  return [...specifiers];
}

/**
 * Resolves a specifier to a file inside the parent project, or null if it's
 * an npm package / built-in (those come from package.json instead).
 */
function resolveLocal(specifier, importerAbs) {
  let base;

  if (specifier.startsWith("@/")) {
    base = path.join(PARENT, specifier.slice(2));
  } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
    base = path.resolve(path.dirname(importerAbs), specifier);
  } else {
    return null; // bare specifier -> npm package
  }

  for (const ext of RESOLVE_EXTENSIONS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  for (const ext of [".tsx", ".ts", ".jsx", ".js"]) {
    const candidate = path.join(base, "index" + ext);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mts"]);

/**
 * Breadth-first copy of every local dependency reachable from the seed files.
 * `seeds` maps an absolute parent path -> the relative destination path here.
 */
function copyDependencyGraph(seeds) {
  const queue = [...seeds];
  const visited = new Set();

  while (queue.length > 0) {
    const { abs, dest } = queue.shift();
    if (visited.has(abs)) continue;
    visited.add(abs);

    const ext = path.extname(abs);

    if (!CODE_EXT.has(ext)) {
      // CSS modules and other assets copy through byte-for-byte. They can
      // reference /uBIQ/* image paths, which are already correct.
      writeFileSafe(dest, fs.readFileSync(abs), { binary: true });
      continue;
    }

    const raw = fs.readFileSync(abs, "utf8");
    writeFileSafe(dest, transformSource(raw));

    for (const specifier of extractSpecifiers(raw)) {
      const resolved = resolveLocal(specifier, abs);
      if (!resolved) continue;
      if (visited.has(resolved)) continue;

      const relFromParent = path.relative(PARENT, resolved);
      if (relFromParent.startsWith("..")) {
        missing.push(`${specifier}  (resolves outside the parent project)`);
        continue;
      }
      queue.push({ abs: resolved, dest: relFromParent });
    }
  }
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

/** Every page/layout/loading/error file under the parent's app/ubiq tree. */
function collectRouteFiles(dir, segments = []) {
  const seeds = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      seeds.push(...collectRouteFiles(abs, [...segments, entry.name]));
    } else if (CODE_EXT.has(path.extname(entry.name))) {
      // app/ubiq/about/page.tsx -> app/about/page.tsx (the "ubiq" level is gone)
      seeds.push({
        abs,
        dest: path.join("app", ...segments, entry.name),
        isHomePage: segments.length === 0 && entry.name === "page.tsx",
      });
    }
  }
  return seeds;
}

function copyRoutes() {
  const seeds = collectRouteFiles(SOURCE_ROUTE_DIR);

  // Seeds get transformed with the home-page title special case; the graph
  // walk then handles everything they import.
  for (const seed of seeds) {
    const raw = fs.readFileSync(seed.abs, "utf8");
    writeFileSafe(seed.dest, transformSource(raw, { isHomePage: seed.isHomePage }));
  }

  copyDependencyGraph(seeds.map(({ abs, dest }) => ({ abs, dest })));
}

function copyGlobalsCss() {
  const abs = path.join(PARENT, "app", "globals.css");
  if (!fs.existsSync(abs)) {
    missing.push("app/globals.css");
    return;
  }
  writeFileSafe(path.join("app", "globals.css"), fs.readFileSync(abs), {
    binary: true,
  });
}

function copyDirRecursive(absFrom, relTo) {
  if (!fs.existsSync(absFrom)) {
    missing.push(toPosix(relTo));
    return;
  }
  for (const entry of fs.readdirSync(absFrom, { withFileTypes: true })) {
    const from = path.join(absFrom, entry.name);
    const to = path.join(relTo, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(from, to);
    } else {
      writeFileSafe(to, fs.readFileSync(from), { binary: true });
    }
  }
}

function copyPublicAssets() {
  for (const dir of PUBLIC_DIRS) {
    copyDirRecursive(path.join(PARENT, "public", dir), path.join("public", dir));
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

function main() {
  assertParentExists();

  console.log(`\n  uBIQ migration${DRY_RUN ? "  (dry run — nothing written)" : ""}`);
  console.log(`  source: ${PARENT}`);
  console.log(`  target: ${DEST}\n`);

  copyRoutes();
  copyGlobalsCss();
  copyPublicAssets();

  const routes = copied.filter((f) => f.startsWith("app/"));
  const components = copied.filter((f) => f.startsWith("components/"));
  const assets = copied.filter((f) => f.startsWith("public/"));
  const other = copied.filter(
    (f) =>
      !f.startsWith("app/") &&
      !f.startsWith("components/") &&
      !f.startsWith("public/")
  );

  console.log(`  routes      ${routes.length}`);
  for (const f of routes.sort()) console.log(`    ${f}`);
  console.log(`\n  components  ${components.length}`);
  for (const f of components.sort()) console.log(`    ${f}`);
  if (other.length) {
    console.log(`\n  other       ${other.length}`);
    for (const f of other.sort()) console.log(`    ${f}`);
  }
  console.log(`\n  assets      ${assets.length} file(s)`);

  if (skipped.length) {
    console.log(`\n  kept as-is  ${skipped.length}`);
    for (const f of skipped) console.log(`    ${f}`);
  }

  if (missing.length) {
    console.log(`\n  could not resolve ${missing.length}:`);
    for (const f of missing) console.log(`    ${f}`);
    console.log(`  (check these by hand)`);
  }

  console.log(
    DRY_RUN
      ? `\n  Dry run complete. Re-run without --dry-run to write.\n`
      : `\n  Done. Next: npm install && npm run dev  (http://localhost:3001)\n`
  );
}

main();
