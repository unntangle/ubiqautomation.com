import type { Metadata } from "next";
import UbiqNav from '@/components/UbiqNav';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import UbiqIntelligence from '@/components/UbiqIntelligence';
import UbiqPillars from '@/components/UbiqPillars';
import UbiqSpaces from '@/components/UbiqSpaces';
import UbiqAutomation from '@/components/UbiqAutomation';
import UbiqTech from '@/components/UbiqTech';
import UbiqModes from '@/components/UbiqModes';
import UbiqCTA from '@/components/UbiqCTA';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://ubiqautomation.com";

export const metadata: Metadata = {
    // Absolute: this is the home page of its own domain, so it opts out of
    // the "%s | uBIQ" template in app/layout.tsx (which would stutter).
    title: {
        absolute: "uBIQ | Smart Home Automation",
    },
    description:
        "uBIQ is Unntangle Technologies's smart space automation brand — intelligent automation for homes, workplaces and commercial spaces: smart home, lighting, KNX, AV, climate, security, energy management and building automation. Built on Unntangle Technologies's innovation expertise since 2023.",
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
        "IoT",
        "luxury home automation",
        "home automation Chennai",
        "smart building integrator India",
    ],
    alternates: { canonical: "/" },
    openGraph: {
        title: "uBIQ — Smart Space Automation by Unntangle Technologies",
        description:
            "Intelligent spaces, seamless experiences. uBIQ by Unntangle Technologies automates homes, workplaces and commercial environments — smart home, KNX, lighting, AV, climate, security and energy.",
        url: `${SITE_URL}/`,
        type: "website",
        images: [
            {
                url: "/images/hero.png",
                width: 1200,
                height: 630,
                alt: "uBIQ — Smart Space Automation by Unntangle",
            },
        ],
    },
};

// Brand schema for uBIQ as a sub-brand of Unntangle, plus a Service node
// describing the integration offering. Combined with the Organization
// JSON-LD in layout.tsx this lets Google resolve uBIQ as a distinct brand
// under the parent studio.
const ubiqBrandJsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": `${SITE_URL}/#brand`,
    name: "uBIQ",
    url: `${SITE_URL}/`,
    description:
        "uBIQ is Unntangle's smart space automation brand: design, integration and support of intelligent automation for homes, workplaces and commercial spaces, including KNX, lighting, AV, climate, security and energy management.",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    slogan: "Your Space. Now Intelligent.",
};

const ubiqServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    serviceType: "Smart Space Automation Design & Integration",
    brand: { "@id": `${SITE_URL}/#brand` },
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["IN"],
    description:
        "End-to-end smart space automation: consultation, design, installation, programming and support across smart home, lighting, KNX, AV, climate, security, energy management and commercial building automation.",
};

const ubiqWebpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: "uBIQ — Smart Space Automation by Unntangle",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#brand` },
    breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
                "@type": "ListItem",
                position: 2,
                name: "uBIQ",
                item: `${SITE_URL}/`,
            },
        ],
    },
};

export default function UbiqBrandPage() {
    return (
        <main className="ubiqTheme">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(ubiqBrandJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(ubiqServiceJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(ubiqWebpageJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <UbiqNav />
            <div style={{ paddingTop: '76px' }}>
                <PageHero
                    eyebrow="The Intelligence Layer for Spaces"
                    titleParts={[
                        'Intelligent Spaces. ',
                        { accent: 'Seamless Experiences.' },
                    ]}
                    description="uBIQ by Unntangle transforms homes, workplaces and commercial environments into adaptive, connected spaces — through intelligent automation and immersive technologies."
                    primaryCta={{ label: 'Book Experience', href: '/contact' }}
                    secondaryCta={{ label: 'Explore Ecosystem', href: '#platforms' }}
                    image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=75"
                    images={[
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=75',
                        'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=700&q=75',
                        'https://images.unsplash.com/photo-1633194883650-df448a10d554?auto=format&fit=crop&w=700&q=75',
                    ]}
                    imageAlt="Intelligent connected living space"
                    gradient="purple-pink"
                    imageLayout="bento"
                    pills={[
                        { text: 'All secure' },
                        { text: '22.5° climate' },
                        { text: 'Evening scene' },
                    ]}
                />
            </div>
            <UbiqIntelligence />
            <UbiqPillars />
            <UbiqSpaces />
            <UbiqAutomation />
            <UbiqTech />
            <UbiqModes />
            <UbiqCTA />
            <Footer />
        </main>
    );
}
