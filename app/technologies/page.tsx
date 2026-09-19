import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import UbiqTechnologiesPage from '@/components/UbiqTechnologiesPage';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    title: "KNX, Crestron, Control4 & Lutron Integration",
    description:
        "The technologies uBIQ integrates — automation platforms (KNX, Crestron, Control4, Lutron, Savant), lighting, voice & AI assistants, AV & entertainment, security, networking, climate, energy and connectivity protocols (Matter, Zigbee, Z-Wave, Thread). A vendor-independent integrator.",
    keywords: [
        "uBIQ technologies",
        "KNX integration",
        "Crestron",
        "Control4",
        "Lutron",
        "Matter",
        "Zigbee",
        "smart home protocols",
        "AV integration",
        "vendor-independent integrator",
    ],
    alternates: { canonical: "/technologies" },
    openGraph: {
        title: "uBIQ Technologies — The world's best systems, woven into one",
        description:
            "A vendor-independent integrator. uBIQ designs with and unifies leading automation, lighting, AV, security, networking, climate, energy and connectivity technologies.",
        url: `${SITE_URL}/technologies`,
        type: "website",
        images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "uBIQ Technologies" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/technologies#webpage`,
    url: `${SITE_URL}/technologies`,
    name: "uBIQ Technologies",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Technologies", item: `${SITE_URL}/technologies` },
        ],
    },
};

export default function UbiqTechnologiesRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <UbiqNav />
            <UbiqTechnologiesPage />
            <Footer />
        </main>
    );
}
