import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import UbiqProductPage from '@/components/UbiqProductPage';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    // Absolute: the title already leads with the brand, so appending the
    // " | uBIQ" template would stutter.
    title: {
        absolute: "uBIQ Senz — Adaptive Intelligence for Smart Spaces",
    },
    description:
        "uBIQ Senz is the adaptive intelligence layer behind uBIQ — a behavioural engine that senses occupancy, light, climate and habit, learns your routines, and adapts your space automatically.",
    keywords: [
        "uBIQ Senz",
        "adaptive intelligence",
        "behavioural automation",
        "occupancy intelligence",
        "smart home AI",
        "predictive automation",
        "intelligent spaces",
    ],
    alternates: { canonical: "/senz" },
    openGraph: {
        title: "uBIQ Senz — The brain that learns how you live",
        description:
            "The adaptive intelligence layer that senses, learns and quietly adapts your space before you ask.",
        url: `${SITE_URL}/senz`,
        type: "website",
        images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "uBIQ Senz — Adaptive Intelligence" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/senz#webpage`,
    url: `${SITE_URL}/senz`,
    name: "uBIQ Senz — Adaptive Intelligence",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Senz", item: `${SITE_URL}/senz` },
        ],
    },
};

export default function UbiqSenzRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <UbiqNav />
            <UbiqProductPage product="senz" />
            <Footer />
        </main>
    );
}
