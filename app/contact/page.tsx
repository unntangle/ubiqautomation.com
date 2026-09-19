import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import UbiqContactPage from '@/components/UbiqContactPage';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    title: "Book a Smart Home Consultation in Chennai",
    description:
        "Book a uBIQ experience. Tell us about your home, villa, office or hotel and our specialists will design an intelligent space around how you live and work.",
    keywords: [
        "uBIQ contact",
        "book smart home consultation",
        "smart home automation enquiry",
        "home automation Chennai",
        "smart building consultation",
    ],
    alternates: { canonical: "/contact" },
    openGraph: {
        title: "Book an Experience — uBIQ",
        description:
            "Tell us about your space and our specialists will design an intelligent system around how you live and work.",
        url: `${SITE_URL}/contact`,
        type: "website",
        images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "Book a uBIQ Experience" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: "Book a uBIQ Experience",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "Book an Experience", item: `${SITE_URL}/contact` },
        ],
    },
};

export default function UbiqContactRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <UbiqNav />
            <UbiqContactPage />
            <Footer />
        </main>
    );
}
