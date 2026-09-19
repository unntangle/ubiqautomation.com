import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import UbiqSolutionsPage from '@/components/UbiqSolutionsPage';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    // Layout template appends " | uBIQ".
    title: "Smart Home & Commercial Automation Solutions",
    description:
        "uBIQ smart space solutions — smart home automation, lighting and climate intelligence, smart shades, audio & entertainment, security & access, energy intelligence, networking and commercial automation. Designed, integrated and unified.",
    keywords: [
        "uBIQ solutions",
        "smart home automation",
        "lighting automation",
        "climate automation",
        "home cinema automation",
        "security and access automation",
        "energy management",
        "smart networking",
        "commercial automation",
    ],
    alternates: { canonical: "/solutions" },
    openGraph: {
        title: "uBIQ Solutions — Intelligent automation for every part of your space",
        description:
            "From lighting and climate to security, energy and enterprise-scale automation — each solution designed and unified into one intelligent experience.",
        url: `${SITE_URL}/solutions`,
        type: "website",
        images: [
            {
                url: "/images/hero.png",
                width: 1200,
                height: 630,
                alt: "uBIQ Solutions — Smart space automation by Unntangle",
            },
        ],
    },
};

const solutionSlugs = [
    { name: "Smart Home Automation", slug: "smart-home-automation" },
    { name: "Lighting Intelligence", slug: "lighting-intelligence" },
    { name: "Climate Automation", slug: "climate-automation" },
    { name: "Smart Curtains & Shades", slug: "smart-curtains-shades" },
    { name: "Audio & Entertainment", slug: "audio-entertainment" },
    { name: "Security & Access Intelligence", slug: "security-access" },
    { name: "Energy Intelligence", slug: "energy-intelligence" },
    { name: "Networking & Connectivity", slug: "networking-connectivity" },
    { name: "Commercial Automation", slug: "commercial-automation" },
];

const solutionsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/solutions#webpage`,
    url: `${SITE_URL}/solutions`,
    name: "uBIQ Solutions",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Solutions", item: `${SITE_URL}/solutions` },
        ],
    },
    mainEntity: {
        "@type": "ItemList",
        itemListElement: solutionSlugs.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `${SITE_URL}/solutions#${s.slug}`,
        })),
    },
};

export default function UbiqSolutionsRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(solutionsJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <UbiqNav />
            <UbiqSolutionsPage />
            <Footer />
        </main>
    );
}
