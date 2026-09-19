import type { MetadataRoute } from "next";

/**
 * sitemap.xml for ubiqautomation.com.
 *
 * Written for this project (the migration script won't overwrite it).
 * The parent site's sitemap no longer lists /ubiq at all — that subtree is
 * switched off there — so this file is now the only place uBIQ pages are
 * declared to crawlers.
 *
 * Routes here mirror the folders under app/. If you add a route, add it here.
 */

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

type Entry = {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const routes: Entry[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
    { path: "/technologies", priority: 0.8, changeFrequency: "monthly" },
    { path: "/experiences", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },

    // Product pages
    { path: "/senz", priority: 0.7, changeFrequency: "monthly" },
    { path: "/twin", priority: 0.7, changeFrequency: "monthly" },
    { path: "/care-plus", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return routes.map(({ path, priority, changeFrequency }) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));
}
