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
        absolute: "uBIQ Twin - Interactive 3D Digital Twin for Spaces",
    },
    description:
        "uBIQ Twin is the digital experience layer — an interactive 3D digital twin of your space where every room, device and system is visualised and controllable in real time, from anywhere.",
    keywords: [
        "uBIQ Twin",
        "digital twin",
        "3D space visualization",
        "smart home dashboard",
        "interactive home control",
        "digital walkthrough",
        "space planning",
    ],
    alternates: { canonical: "/twin" },
    openGraph: {
        title: "uBIQ Twin — Your entire space, alive in 3D",
        description:
            "An interactive digital twin of your space — every room, device and system visualised and controllable in real time.",
        url: `${SITE_URL}/twin`,
        type: "website",
        images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "uBIQ Twin — Digital Twin Experience" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/twin#webpage`,
    url: `${SITE_URL}/twin`,
    name: "uBIQ Twin — Digital Twin Experience",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Twin", item: `${SITE_URL}/twin` },
        ],
    },
};

export default function UbiqTwinRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <UbiqNav />
            <UbiqProductPage product="twin" />
            <Footer />
        </main>
    );
}
