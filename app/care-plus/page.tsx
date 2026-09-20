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
        absolute: "uBIQ Care+ - Smart Home Maintenance & Support Plan",
    },
    description:
        "uBIQ Care+ is the smart ownership program — continuous device health monitoring, predictive maintenance, energy optimisation and priority human support that keeps your intelligent space at its best for years.",
    keywords: [
        "uBIQ Care+",
        "smart home maintenance",
        "predictive maintenance",
        "device health monitoring",
        "energy optimisation",
        "priority support",
        "smart ownership program",
    ],
    alternates: { canonical: "/care-plus" },
    openGraph: {
        title: "uBIQ Care+ — Care that keeps your space at its best",
        description:
            "Continuous monitoring, predictive maintenance and priority support that keep your intelligent environment optimised for years.",
        url: `${SITE_URL}/care-plus`,
        type: "website",
        images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "uBIQ Care+ — Smart Ownership" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/care-plus#webpage`,
    url: `${SITE_URL}/care-plus`,
    name: "uBIQ Care+ — Smart Ownership",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Care+", item: `${SITE_URL}/care-plus` },
        ],
    },
};

export default function UbiqCareRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <UbiqNav />
            <UbiqProductPage product="care" />
            <Footer />
        </main>
    );
}
