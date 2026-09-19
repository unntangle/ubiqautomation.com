import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import UbiqExperiencesPage from '@/components/UbiqExperiencesPage';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    title: "Automation for Homes, Villas, Offices & Hotels",
    description:
        "Intelligent environments shaped to how people live, work and host — uBIQ experiences for luxury homes, premium villas, smart apartments, future-ready offices, hotels & hospitality and immersive experience centres.",
    keywords: [
        "uBIQ experiences",
        "smart luxury homes",
        "smart villa automation",
        "smart apartments",
        "smart office automation",
        "hotel automation",
        "hospitality technology",
        "experience centre",
    ],
    alternates: { canonical: "/experiences" },
    openGraph: {
        title: "uBIQ Experiences — Designed for every space you live in",
        description:
            "From private homes to hotels and workplaces, uBIQ shapes intelligent environments around how people live, work and host.",
        url: `${SITE_URL}/experiences`,
        type: "website",
        images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "uBIQ Experiences" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/experiences#webpage`,
    url: `${SITE_URL}/experiences`,
    name: "uBIQ Experiences",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Experiences", item: `${SITE_URL}/experiences` },
        ],
    },
};

export default function UbiqExperiencesRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <UbiqNav />
            <UbiqExperiencesPage />
            <Footer />
        </main>
    );
}
