import type { MetadataRoute } from "next";

/**
 * robots.txt for ubiqautomation.com.
 *
 * This is a separate domain from the parent unntangle.com, so it needs its
 * own robots.txt and its own Search Console property — the parent's
 * robots.txt has no authority here.
 */

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
            {
                userAgent: ["Googlebot", "Bingbot"],
                allow: "/",
                disallow: ["/api/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
