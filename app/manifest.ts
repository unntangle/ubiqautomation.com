import type { MetadataRoute } from "next";

/**
 * Web App Manifest — served at /manifest.webmanifest.
 *
 * Same rationale as the parent project: not a full PWA, but it gives mobile
 * browsers a real name and icon for "Add to home screen" and keeps Lighthouse
 * happy. Icons use the uBIQ mark rather than the Unntangle one.
 *
 * The 192 and 512 icons are generated from public/uBIQ/fav-icon.png by
 * scripts/optimize-images.mjs. Re-run `npm run optimize-images` after
 * changing the source artwork.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "uBIQ — Smart Space Automation by Unntangle",
        short_name: "uBIQ",
        description:
            "Intelligent spaces, seamless experiences. Automation for homes, workplaces and commercial environments.",
        start_url: "/",
        display: "standalone",
        background_color: "#faf7f2",
        theme_color: "#7b2cbf",
        orientation: "portrait",
        icons: [
            {
                src: "/uBIQ/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/uBIQ/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
        categories: ["business", "lifestyle", "utilities"],
    };
}
