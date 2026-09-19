import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

/**
 * Root layout for ubiqautomation.com.
 *
 * This file is authored for THIS project and is deliberately not copied from
 * the parent unntangle.com app — it's the main thing that differs. The
 * migration script (scripts/migrate-from-parent.mjs) treats it as protected
 * and will never overwrite it.
 *
 * What's different from the parent layout:
 *   - Title template is "%s | uBIQ" (was "%s | Unntangle"), so the child
 *     pages copied over from app/ubiq/* read correctly on this domain.
 *   - JSON-LD describes uBIQ as the primary Brand/Organization for this
 *     site, with Unntangle as the parent organization, instead of the
 *     other way round.
 *   - Favicon and OG imagery use the uBIQ mark.
 *
 * Font loading matches the parent exactly, on purpose: the copied component
 * CSS references var(--font-outfit) and var(--font-plus-jakarta-sans)
 * throughout, so those variable names must resolve to the same faces or the
 * whole site retypesets. --font-outfit intentionally serves DM Sans (see the
 * parent project's note: DM Sans is the closest free match to Google Sans).
 */

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
});

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

/** The parent studio's site, referenced from JSON-LD. */
const PARENT_SITE_URL = "https://unntangle.com";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
        { media: "(prefers-color-scheme: dark)", color: "#140b1f" },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        // Child pages copied from the parent set a bare name ("Solutions",
        // "About uBIQ") and this template completes it. The home page opts
        // out via title.absolute.
        template: "%s | uBIQ",
        default: "uBIQ — Smart Space Automation by Unntangle",
    },
    description:
        "uBIQ by Unntangle turns homes, workplaces and commercial environments into adaptive, connected spaces — smart home, lighting, KNX, AV, climate, security, energy management and building automation.",
    applicationName: "uBIQ",
    authors: [{ name: "Unntangle", url: PARENT_SITE_URL }],
    creator: "Unntangle",
    publisher: "Unntangle",
    generator: "Next.js",
    keywords: [
        "uBIQ",
        "smart space automation",
        "home automation",
        "smart home automation",
        "KNX",
        "KNX automation",
        "lighting automation",
        "AV integration",
        "building automation",
        "commercial automation",
        "smart curtains",
        "energy intelligence",
        "security and access automation",
        "IoT",
        "luxury home automation",
        "home automation Chennai",
        "smart building integrator India",
        "Unntangle",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        siteName: "uBIQ",
        title: "uBIQ — Smart Space Automation by Unntangle",
        description:
            "Intelligent spaces, seamless experiences. Automation for homes, workplaces and commercial environments — designed, integrated and unified.",
        url: SITE_URL,
        locale: "en_US",
        images: [
            {
                url: "/images/hero.png",
                width: 1200,
                height: 630,
                alt: "uBIQ — Smart Space Automation by Unntangle",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "uBIQ — Smart Space Automation by Unntangle",
        description:
            "Intelligent spaces, seamless experiences. Automation for homes, workplaces and commercial environments.",
        images: ["/images/hero.png"],
    },
    icons: {
        icon: [
            { url: "/uBIQ/favicon-32.png", sizes: "32x32", type: "image/png" },
            { url: "/uBIQ/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
        shortcut: "/uBIQ/favicon-32.png",
        apple: { url: "/uBIQ/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    },
    manifest: "/manifest.webmanifest",
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    category: "technology",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

/**
 * On this domain uBIQ is the subject, not a sub-brand mentioned in passing.
 * The Organization node therefore describes uBIQ directly and hangs
 * Unntangle off it as parentOrganization — the inverse of how the parent
 * site models the relationship. Both sites pointing at the same entity URLs
 * is what lets Google reconcile them as one brand family rather than two
 * unrelated businesses.
 */
const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "uBIQ",
    alternateName: "uBIQ by Unntangle",
    url: SITE_URL,
    logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/uBIQ/uBIQ-logo.png`,
    },
    image: `${SITE_URL}/images/hero.png`,
    description:
        "uBIQ is Unntangle's smart space automation brand — design, integration and support of intelligent automation for homes, workplaces and commercial spaces.",
    foundingDate: "2023",
    sameAs: [
        "https://www.instagram.com/ubiq_automation/",
        "https://www.facebook.com/people/UBIQ-Automation/61594209613014/",
        "https://www.linkedin.com/company/ubiq-automation/",
    ],
    parentOrganization: {
        "@type": "Organization",
        name: "Unntangle",
        url: PARENT_SITE_URL,
        "@id": `${PARENT_SITE_URL}/#organization`,
    },
    address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
    },
    areaServed: ["IN"],
    contactPoint: [
        {
            "@type": "ContactPoint",
            contactType: "sales",
            email: "gokul@unntangle.com",
            url: `${SITE_URL}/contact`,
            availableLanguage: ["English"],
        },
    ],
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "uBIQ",
    description:
        "Smart space automation for homes, workplaces and commercial environments.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://images.unsplash.com" />
                <link rel="dns-prefetch" href="https://images.unsplash.com" />
            </head>
            <body
                className={`${plusJakartaSans.variable} ${dmSans.variable}`}
            >
                {children}

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationJsonLd).replace(
                            /</g,
                            "\\u003c"
                        ),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteJsonLd).replace(
                            /</g,
                            "\\u003c"
                        ),
                    }}
                />
            </body>
        </html>
    );
}
