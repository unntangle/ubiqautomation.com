'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, ArrowUp, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

/**
 * uBIQ sitewide footer.
 *
 * Mirrors the uBIQ site structure (nav + ecosystem + solutions) rather than
 * the parent Unntangle Technologies footer. Legal pages live on the parent
 * domain, so those links point there.
 */

const PARENT_SITE_URL = 'https://unntangle.com';

const exploreLinks = [
    { label: 'Home', href: '/' },
    { label: 'About uBIQ', href: '/about' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Technologies', href: '/technologies' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Contact', href: '/contact' },
];

const ecosystemLinks = [
    { label: 'uBIQ Senz', href: '/senz' },
    { label: 'uBIQ Twin', href: '/twin' },
    { label: 'uBIQ Care+', href: '/care-plus' },
];

const solutionLinks = [
    { label: 'Smart Home Automation', href: '/solutions#smart-home-automation' },
    { label: 'Lighting Intelligence', href: '/solutions#lighting-intelligence' },
    { label: 'Climate Automation', href: '/solutions#climate-automation' },
    { label: 'Audio & Entertainment', href: '/solutions#audio-entertainment' },
    { label: 'Security & Access', href: '/solutions#security-access' },
    { label: 'Commercial Automation', href: '/solutions#commercial-automation' },
];

const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/ubiq_automation/', icon: Instagram },
    { label: 'Facebook', href: 'https://www.facebook.com/people/UBIQ-Automation/61594209613014/', icon: Facebook },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ubiq-automation/', icon: Linkedin },
];

export default function Footer() {
    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.footerWrapper}>
            <footer className={styles.footer}>
                <div className={styles.container}>
                    {/* Top: brand + CTA */}
                    <div className={styles.topBar}>
                        <div className={styles.brand}>
                            <Link href="/" className={styles.logoLink} aria-label="uBIQ home">
                                <Image
                                    src="/uBIQ/uBIQ-logo.svg"
                                    alt="uBIQ Smart Automation"
                                    width={932}
                                    height={306}
                                    unoptimized
                                    className={styles.footerLogo}
                                />
                            </Link>
                            <p className={styles.tagline}>Where Spaces Become Intelligent.</p>
                        </div>

                        <Link href="/contact" className={styles.topCta}>
                            Book Experience <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Link columns */}
                    <div className={styles.linksGrid}>
                        <div className={styles.column}>
                            <h4>Explore</h4>
                            {exploreLinks.map((l) => (
                                <Link key={l.label} href={l.href}>{l.label}</Link>
                            ))}
                        </div>

                        <div className={styles.column}>
                            <h4>Ecosystem</h4>
                            {ecosystemLinks.map((l) => (
                                <Link key={l.label} href={l.href}>{l.label}</Link>
                            ))}
                        </div>

                        <div className={styles.column}>
                            <h4>Solutions</h4>
                            {solutionLinks.map((l) => (
                                <Link key={l.label} href={l.href}>{l.label}</Link>
                            ))}
                        </div>

                        <div className={styles.column}>
                            <h4>Follow us</h4>
                            <div className={styles.socialCol}>
                                {socialLinks.map((s) => {
                                    const Icon = s.icon;
                                    const external = s.href.startsWith('http');
                                    return (
                                        <Link
                                            key={s.label}
                                            href={s.href}
                                            className={styles.socialLink}
                                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            <Icon size={18} /> <span>{s.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={styles.backToTop}>
                        <button onClick={scrollToTop} aria-label="Back to top">
                            <ArrowUp size={20} />
                        </button>
                    </div>

                    {/* Bottom Bar */}
                    <div className={styles.bottomBar}>
                        <div className={styles.splitRow}>
                            <div className={styles.legalLinks}>
                                <Link href={`${PARENT_SITE_URL}/privacy`}>Privacy</Link>
                                <Link href={`${PARENT_SITE_URL}/terms`}>Site Terms</Link>
                                <Link href={`${PARENT_SITE_URL}/cookie-preferences`}>Cookie Preferences</Link>
                            </div>

                            <p className={styles.copyright}>
                                © {new Date().getFullYear()}{' '}
                                <Link href="/" className={styles.accent}>uBIQ Automation</Link>
                                . An{' '}
                                <Link href={PARENT_SITE_URL} className={styles.accent} target="_blank" rel="noopener noreferrer">
                                    Unntangle Technologies
                                </Link>
                                {' '}company. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
