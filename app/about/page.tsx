import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import UbiqAboutPage from '@/components/UbiqAboutPage';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    // Layout template appends " | uBIQ".
    title: "About uBIQ - Vendor-Independent Automation Integrator",
    description:
        "About uBIQ - Unntangle Technologies's smart space automation brand. A vendor-independent integrator that designs intelligent, connected ecosystems for homes, workplaces and commercial spaces. Built on Unntangle Technologies's innovation expertise since 2023.",
    keywords: [
        "about uBIQ",
        "uBIQ brand",
        "smart space automation brand",
        "powered by Unntangle Technologies",
        "vendor-independent integrator",
        "intelligent spaces",
        "smart home integrator India",
    ],
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About uBIQ - Smart Space Automation by Unntangle Technologies",
        description:
            "We design intelligent spaces, not just install devices. uBIQ by Unntangle Technologies unites world-class technologies into one seamless intelligence layer.",
        url: `${SITE_URL}/about`,
        type: "website",
        images: [
            {
                url: "/images/hero.png",
                width: 1200,
                height: 630,
                alt: "About uBIQ - Smart Space Automation by Unntangle Technologies",
            },
        ],
    },
};

const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#webpage`,
    url: `${SITE_URL}/about`,
    name: "About uBIQ - Smart Space Automation by Unntangle Technologies",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "uBIQ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 3, name: "About", item: `${SITE_URL}/about` },
        ],
    },
};

export default function UbiqAboutRoute() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutPageJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <UbiqNav />
            <UbiqAboutPage />
            <Footer />
        </main>
    );
}
