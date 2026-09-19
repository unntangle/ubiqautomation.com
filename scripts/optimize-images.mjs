/**
 * optimize-images.mjs
 * ---------------------------------------------------------------------------
 * Compresses everything under public/ and emits WebP siblings.
 *
 * WHAT IT DOES
 *
 *   1. Walks public/ recursively for .png / .jpg / .jpeg.
 *
 *   2. Writes a .webp sibling next to each one (same basename). Originals are
 *      NEVER deleted — nothing in the app breaks the moment you run this. Swap
 *      the references over in your own time, then delete the originals by hand.
 *
 *   3. Re-compresses the original PNG/JPG in place when --lossy is passed.
 *      Useful for the files that must stay PNG/JPG (see SKIP_WEBP below).
 *
 *   4. Generates a proper favicon set from public/uBIQ/fav-icon.png:
 *          favicon-32.png     browser tab
 *          apple-icon-180.png iOS home screen
 *          icon-192.png       PWA / manifest
 *          icon-512.png       PWA / manifest, splash screen
 *      Square, centred, transparent background. Run with --favicon-bg "#7b2cbf"
 *      to fill the letterboxing with a solid colour instead, which reads far
 *      better at 16px for a wide wordmark.
 *
 * WHAT IT DELIBERATELY WON'T CONVERT
 *
 *   Some files must keep their original format regardless of file size:
 *
 *     images/hero.png    the Open Graph image used by every page. LinkedIn and
 *                        WhatsApp render WebP OG images unreliably or not at
 *                        all, so converting it breaks your link previews.
 *     uBIQ/fav-icon.png  favicon source. WebP favicon support is patchy and
 *                        saves nothing at 32x32.
 *
 *   These still get compressed in place under --lossy, just not converted.
 *
 * USAGE
 *
 *   npm i -D sharp
 *   node scripts/optimize-images.mjs --dry-run     # report only, writes nothing
 *   node scripts/optimize-images.mjs               # write .webp siblings
 *   node scripts/optimize-images.mjs --lossy       # also recompress originals
 *   node scripts/optimize-images.mjs --favicon-bg "#7b2cbf"
 *
 * Re-running is safe. A .webp newer than its source is left alone.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let sharp;
try {
    sharp = (await import("sharp")).default;
} catch {
    console.error(
        "\n  sharp is not installed.\n\n" +
        "      npm i -D sharp\n\n" +
        "  Then run this script again.\n"
    );
    process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

/** Paths (relative to public/) that keep their original format. */
const SKIP_WEBP = new Set([
    "images/hero.png",
    "uBIQ/fav-icon.png",
]);

const CONVERTIBLE = new Set([".png", ".jpg", ".jpeg"]);

const WEBP_QUALITY = 80;
const PNG_QUALITY = 80;
const JPEG_QUALITY = 82;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LOSSY = args.includes("--lossy");
const bgIndex = args.indexOf("--favicon-bg");
const FAVICON_BG = bgIndex !== -1 ? args[bgIndex + 1] : null;

const toPosix = (p) => p.split(path.sep).join("/");
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const results = [];
let totalBefore = 0;
let totalAfter = 0;

// ---------------------------------------------------------------------------
// Walk
// ---------------------------------------------------------------------------

function walk(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...walk(abs));
        } else if (CONVERTIBLE.has(path.extname(entry.name).toLowerCase())) {
            out.push(abs);
        }
    }
    return out;
}

/** True when dest exists and is at least as new as src. */
function isFresh(src, dest) {
    if (!fs.existsSync(dest)) return false;
    return fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs;
}

// ---------------------------------------------------------------------------
// Convert
// ---------------------------------------------------------------------------

async function toWebp(abs, rel) {
    const dest = abs.replace(/\.(png|jpe?g)$/i, ".webp");
    const before = fs.statSync(abs).size;

    if (isFresh(abs, dest)) {
        results.push({ rel, status: "up to date", before, after: fs.statSync(dest).size });
        return;
    }

    if (DRY_RUN) {
        results.push({ rel, status: "would convert", before, after: null });
        return;
    }

    await sharp(abs).webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(dest);

    const after = fs.statSync(dest).size;
    totalBefore += before;
    totalAfter += after;
    results.push({ rel, status: "-> webp", before, after });
}

/**
 * Recompresses a PNG/JPG in place. sharp cannot read and write the same path
 * in one pass, so this goes via a temp file and only replaces the original
 * when the result is actually smaller.
 */
async function recompress(abs, rel) {
    const before = fs.statSync(abs).size;
    const ext = path.extname(abs).toLowerCase();

    if (DRY_RUN) {
        results.push({ rel, status: "would recompress", before, after: null });
        return;
    }

    const tmp = abs + ".tmp";
    const pipeline = sharp(abs);

    if (ext === ".png") {
        await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 }).toFile(tmp);
    } else {
        await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
    }

    const after = fs.statSync(tmp).size;

    if (after < before) {
        fs.renameSync(tmp, abs);
        totalBefore += before;
        totalAfter += after;
        results.push({ rel, status: "recompressed", before, after });
    } else {
        fs.unlinkSync(tmp);
        results.push({ rel, status: "already optimal", before, after: before });
    }
}

// ---------------------------------------------------------------------------
// Favicons
// ---------------------------------------------------------------------------

const FAVICON_SIZES = [
    { size: 32, name: "favicon-32.png" },
    { size: 180, name: "apple-icon-180.png" },
    { size: 192, name: "icon-192.png" },
    { size: 512, name: "icon-512.png" },
];

async function buildFavicons() {
    const src = path.join(PUBLIC, "uBIQ", "fav-icon.png");
    if (!fs.existsSync(src)) {
        console.log("\n  favicons     skipped (public/uBIQ/fav-icon.png not found)");
        return;
    }

    const meta = await sharp(src).metadata();
    console.log(`\n  favicon source  ${meta.width}x${meta.height}, ${kb(fs.statSync(src).size)}`);

    if (meta.width !== meta.height) {
        console.log(
            `  note            source is not square (${meta.width}x${meta.height}).\n` +
            `                  It will be letterboxed into the square canvas, which is\n` +
            `                  why a wide wordmark reads as tiny in a browser tab.\n` +
            `                  Pass --favicon-bg "#7b2cbf" to fill the gap, or better,\n` +
            `                  crop the source to a square mark first.`
        );
    }

    const background = FAVICON_BG
        ? FAVICON_BG
        : { r: 0, g: 0, b: 0, alpha: 0 };

    for (const { size, name } of FAVICON_SIZES) {
        const dest = path.join(PUBLIC, "uBIQ", name);
        if (DRY_RUN) {
            results.push({ rel: `uBIQ/${name}`, status: "would generate", before: 0, after: null });
            continue;
        }
        await sharp(src)
            .resize(size, size, { fit: "contain", background })
            .png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 })
            .toFile(dest);
        results.push({
            rel: `uBIQ/${name}`,
            status: "generated",
            before: 0,
            after: fs.statSync(dest).size,
        });
    }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function main() {
    if (!fs.existsSync(PUBLIC)) {
        console.error(`\n  No public/ directory at ${PUBLIC}\n`);
        process.exit(1);
    }

    console.log(
        `\n  Image optimisation${DRY_RUN ? "  (dry run - nothing written)" : ""}` +
        `${LOSSY ? "  [--lossy]" : ""}`
    );
    console.log(`  target: ${PUBLIC}\n`);

    const files = walk(PUBLIC);

    for (const abs of files) {
        const rel = toPosix(path.relative(PUBLIC, abs));

        if (SKIP_WEBP.has(rel)) {
            if (LOSSY) await recompress(abs, rel);
            else results.push({ rel, status: "kept (format locked)", before: fs.statSync(abs).size, after: fs.statSync(abs).size });
            continue;
        }

        await toWebp(abs, rel);
        if (LOSSY) await recompress(abs, rel);
    }

    await buildFavicons();

    // Report
    const width = Math.max(...results.map((r) => r.rel.length), 20);
    console.log(`\n  ${"file".padEnd(width)}  ${"status".padEnd(22)}  before -> after`);
    console.log(`  ${"-".repeat(width)}  ${"-".repeat(22)}  ---------------`);

    for (const r of results.sort((a, b) => a.rel.localeCompare(b.rel))) {
        const sizes =
            r.after === null
                ? kb(r.before)
                : r.before === 0
                    ? kb(r.after)
                    : `${kb(r.before)} -> ${kb(r.after)}`;
        console.log(`  ${r.rel.padEnd(width)}  ${r.status.padEnd(22)}  ${sizes}`);
    }

    if (!DRY_RUN && totalBefore > 0) {
        const saved = totalBefore - totalAfter;
        const pct = ((saved / totalBefore) * 100).toFixed(1);
        console.log(`\n  Saved ${kb(saved)} of ${kb(totalBefore)}  (${pct}%)`);
    }

    console.log(
        DRY_RUN
            ? `\n  Dry run complete. Re-run without --dry-run to write.\n`
            : `\n  Done. Originals kept - update your image references, then delete them.\n`
    );
}

main().catch((err) => {
    console.error("\n  Failed:", err.message, "\n");
    process.exit(1);
});
