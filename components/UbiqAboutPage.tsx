'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    motion, AnimatePresence, useInView,
} from 'framer-motion';
import {
    ArrowRight, Check,
    Sparkles, EyeOff, Shuffle, HeartHandshake,
    Radar, Brain, SlidersHorizontal, LifeBuoy,
    BrainCircuit, Box, HeartPulse,
    Sunrise, Moon, ShieldCheck,
    Thermometer, Lightbulb, AudioLines, Wifi,
    type LucideIcon,
} from 'lucide-react';
import styles from './UbiqAboutPage.module.css';

/* ============================================================
 * uBIQ — About page.
 *
 * Concept: "a space that senses you." The page behaves like a smart
 * environment — an ambient sensor mesh, a live scene console that
 * adapts on its own, telemetry that counts up, a scroll-drawn
 * timeline, and a dark control-room pipeline (Sense → Learn → Adapt
 * → Care) that lights up stage by stage. Brand tokens only:
 * --ubiq-gradient, --primary (#8b5cf6), --ubiq-icon.
 * ============================================================ */

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- small scroll reveal ---------- */
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.65, delay, ease }}
        >
            {children}
        </motion.div>
    );
}

/* ============================================================
 * HERO — live scene console
 * ============================================================ */
type Scene = {
    key: string; icon: LucideIcon; mood: string;
    temp: string; light: string; sound: string;
    wash: string; dot: string;
};

const SCENES: Scene[] = [
    { key: 'Morning', icon: Sunrise, mood: 'Gentle wake-up', temp: '21.5°', light: 'Warm · 35%', sound: 'Playlist fading in', wash: 'rgba(244, 162, 97, 0.20)', dot: '#f4a261' },
    { key: 'Focus', icon: Brain, mood: 'Deep work', temp: '22.0°', light: 'Cool · 80%', sound: 'Notifications muted', wash: 'rgba(110, 91, 242, 0.22)', dot: '#6e5bf2' },
    { key: 'Evening', icon: Moon, mood: 'Wind down', temp: '23.0°', light: 'Amber · 20%', sound: 'Low ambient', wash: 'rgba(196, 79, 224, 0.20)', dot: '#c44fe0' },
    { key: 'Away', icon: ShieldCheck, mood: 'Secured', temp: 'Eco · 19°', light: 'All off', sound: 'Perimeter armed', wash: 'rgba(34, 197, 94, 0.18)', dot: '#22c55e' },
];

function SceneConsole() {
    const [i, setI] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setI((v) => (v + 1) % SCENES.length), 3000);
        return () => clearInterval(id);
    }, []);
    const s = SCENES[i];
    const Icon = s.icon;
    const rows: { icon: LucideIcon; label: string; value: string }[] = [
        { icon: Thermometer, label: 'Climate', value: s.temp },
        { icon: Lightbulb, label: 'Lighting', value: s.light },
        { icon: AudioLines, label: 'Sound', value: s.sound },
    ];

    return (
        <motion.div
            className={styles.console}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
        >
            <AnimatePresence>
                <motion.div
                    key={s.key}
                    className={styles.consoleWash}
                    style={{ background: `radial-gradient(120% 120% at 80% 0%, ${s.wash}, transparent 60%)` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            </AnimatePresence>

            <div className={styles.consoleTop}>
                <span className={styles.consolePill}>
                    <span className={styles.livePulse} aria-hidden="true" />
                    uBIQ Senz · live
                </span>
                <span className={styles.consoleWifi}><Wifi size={14} strokeWidth={2} /> mesh</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={s.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease }}
                >
                    <div className={styles.sceneHead}>
                        <span className={styles.sceneIcon} style={{ color: s.dot }}>
                            <Icon size={22} strokeWidth={1.8} />
                        </span>
                        <div>
                            <span className={styles.sceneLabel}>{s.key}</span>
                            <span className={styles.sceneMood}>{s.mood}</span>
                        </div>
                    </div>

                    <div className={styles.sceneRows}>
                        {rows.map((r) => {
                            const RI = r.icon;
                            return (
                                <div key={r.label} className={styles.sceneRow}>
                                    <span className={styles.rowIcon}><RI size={15} strokeWidth={1.8} /></span>
                                    <span className={styles.rowLabel}>{r.label}</span>
                                    <span className={styles.rowValue}>{r.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className={styles.consoleFoot}>
                <span className={styles.footText}>Adapted automatically — no command given</span>
                <div className={styles.sceneDots}>
                    {SCENES.map((sc, idx) => (
                        <button
                            key={sc.key}
                            type="button"
                            aria-label={sc.key}
                            onClick={() => setI(idx)}
                            className={`${styles.sceneDot} ${idx === i ? styles.sceneDotOn : ''}`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/* decorative ambient mesh behind the hero */
function SensorMesh() {
    const nodes = [
        [70, 90], [210, 50], [330, 150], [150, 210], [300, 280], [60, 300], [380, 70],
    ] as const;
    const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [3, 5], [1, 6], [2, 4], [2, 6]];
    return (
        <svg className={styles.mesh} viewBox="0 0 420 340" fill="none" aria-hidden="true">
            {links.map(([a, b], idx) => (
                <line
                    key={idx}
                    x1={nodes[a][0]} y1={nodes[a][1]}
                    x2={nodes[b][0]} y2={nodes[b][1]}
                    className={styles.meshLink}
                    style={{ animationDelay: `${idx * 0.4}s` }}
                />
            ))}
            {nodes.map(([x, y], idx) => (
                <g key={idx}>
                    <circle cx={x} cy={y} r="9" className={styles.meshHalo} style={{ animationDelay: `${idx * 0.3}s` }} />
                    <circle cx={x} cy={y} r="3.2" className={styles.meshNode} />
                </g>
            ))}
        </svg>
    );
}

/* ============================================================
 * STAT — count-up telemetry
 * ============================================================ */
function StatCounter({ to, from = 0, suffix = '', prefix = '', label }: {
    to: number; from?: number; suffix?: string; prefix?: string; label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [val, setVal] = useState(from);

    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const dur = 1500;
        const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(from + (to - from) * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to, from]);

    return (
        <div className={styles.stat} ref={ref}>
            <span className={styles.statNum}>{prefix}{val}{suffix}</span>
            <span className={styles.statLabel}>{label}</span>
        </div>
    );
}

/* ============================================================
 * INTELLIGENCE FLOW — Sense / Learn / Adapt / Care (dark)
 * ============================================================ */
const flow: { icon: LucideIcon; label: string; text: string }[] = [
    { icon: Radar, label: 'Sense', text: 'Occupancy, light, climate and habit — the space reads its own signals in real time.' },
    { icon: Brain, label: 'Learn', text: 'Patterns become understanding. uBIQ learns your rhythms instead of waiting for input.' },
    { icon: SlidersHorizontal, label: 'Adapt', text: 'Lighting, climate, media and security tune themselves around the moment, silently.' },
    { icon: LifeBuoy, label: 'Care', text: 'Health checks and optimisation run for years, so the space keeps getting better.' },
];

function IntelligenceFlow() {
    const [active, setActive] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setActive((v) => (v + 1) % flow.length), 2400);
        return () => clearInterval(id);
    }, []);
    const progress = flow.length > 1 ? (active / (flow.length - 1)) * 100 : 0;

    return (
        <div className={styles.flowWrap}>
            <div className={styles.flowTrack} aria-hidden="true">
                <motion.div
                    className={styles.flowFill}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.7, ease }}
                />
            </div>
            <div className={styles.flowGrid}>
                {flow.map((f, idx) => {
                    const Icon = f.icon;
                    const on = idx === active;
                    return (
                        <div
                            key={f.label}
                            className={`${styles.flowNode} ${on ? styles.flowNodeOn : ''}`}
                            onMouseEnter={() => setActive(idx)}
                        >
                            <span className={styles.flowIcon}><Icon size={22} strokeWidth={1.8} /></span>
                            <span className={styles.flowNum}>0{idx + 1}</span>
                            <h3 className={styles.flowLabel}>{f.label}</h3>
                            <p className={styles.flowText}>{f.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ============================================================
 * STATIC DATA
 * ============================================================ */
const journey: { year: string; title: string; text: string }[] = [
    { year: '2023', title: 'Unntangle Technologies is founded', text: 'An innovation studio built around immersive, interactive and intelligent technology.' },
    { year: '2024', title: 'Intelligence meets the built environment', text: 'We begin applying AI, IoT and immersive design to real, lived-in spaces.' },
    { year: '2025', title: 'uBIQ takes shape', text: 'The smart automation brand for home and office forms around one idea — an intelligence layer for spaces.' },
    { year: '2026', title: 'Connected ecosystems', text: 'Senz, Twin and Care+ unite adaptive automation, digital twins and lifelong care.' },
];

const philosophy: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: Sparkles, title: 'Intelligence over automation', text: 'Automation reacts to commands. Intelligence anticipates needs — uBIQ adds a layer that learns and adapts.' },
    { icon: EyeOff, title: 'Invisible by design', text: 'The best technology disappears. No clutter, no friction — just a space that quietly responds.' },
    { icon: Shuffle, title: 'Vendor-independent', text: 'We choose the right system for each space, never locked to a single manufacturer or product line.' },
    { icon: HeartHandshake, title: 'Designed around people', text: 'Routines, comfort and wellbeing lead — the technology follows how you actually live and work.' },
];

const ecosystem: { icon: LucideIcon; mark: string; cat: string; text: string }[] = [
    { icon: BrainCircuit, mark: 'Senz', cat: 'Adaptive Intelligence', text: 'The behavioural engine that learns routines and personalises every space.' },
    { icon: Box, mark: 'Twin', cat: 'Digital Experience', text: 'An interactive digital twin that visualises and controls your entire space.' },
    { icon: HeartPulse, mark: 'Care+', cat: 'Smart Ownership', text: 'Continuous care that keeps your intelligent environment optimised for years.' },
];

const differentiators: string[] = [
    'We design intelligent ecosystems — not one-off device installs.',
    'Independent of any single manufacturer or platform.',
    'Proven systems (KNX, Matter, Crestron and more) made intelligent.',
    'Backed by Unntangle\u2019s immersive-technology expertise since 2023.',
];

const techStack = ['KNX', 'Matter', 'Crestron', 'Lutron', 'IoT', 'AV', 'AI'];

/* ============================================================
 * PAGE
 * ============================================================ */
export default function UbiqAboutPage() {
    return (
        <>
            {/* ---------------- HERO ---------------- */}
            <section className={`${styles.section} ${styles.hero}`}>
                <div className={styles.heroGlow} />
                <div className={styles.heroGrid} />
                <SensorMesh />
                <div className={`${styles.inner} ${styles.heroInner}`}>
                    <div className={styles.heroCopy}>
                        <Reveal>
                            <span className={styles.eyebrow}>About <span style={{ textTransform: 'none' }}>uBIQ</span></span>
                        </Reveal>
                        <Reveal delay={0.05}>
                            <h1 className={styles.heroTitle}>
                                We don&apos;t install devices.{' '}
                                <span className={styles.accentGradient}>We design spaces that think.</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.12}>
                            <p className={styles.heroLead}>
                                uBIQ is Unntangle&apos;s smart automation brand for home and office. We weave the world&apos;s best
                                automation — KNX, Matter, Crestron, IoT — into a single intelligence layer
                                that senses, learns and quietly shapes itself around the people inside.
                            </p>
                        </Reveal>
                        <Reveal delay={0.18}>
                            <div className={styles.heroActions}>
                                <Link href="/contact" className={styles.heroPrimary}>
                                    Book Experience <ArrowRight size={16} />
                                </Link>
                                <Link href="/" className={styles.heroSecondary}>
                                    Explore uBIQ
                                </Link>
                            </div>
                        </Reveal>
                        <Reveal delay={0.24}>
                            <p className={styles.heroCredit}>Smart automation solutions for home and office by Unntangle Technologies · Since 2023</p>
                        </Reveal>
                    </div>

                    <div className={styles.heroConsoleWrap}>
                        <SceneConsole />
                    </div>
                </div>
            </section>

            {/* ---------------- WHO WE ARE ---------------- */}
            <section className={`${styles.section} ${styles.story}`}>
                <div className={styles.inner}>
                    <div className={styles.split}>
                        <Reveal>
                            <div className={styles.splitLeft}>
                                <span className={styles.tag}>Who we are</span>
                                <h2 className={styles.h2}>Smart automation for home and office, built on an innovation studio.</h2>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <div className={styles.splitRight}>
                                <p className={styles.p}>
                                    uBIQ exists to make spaces genuinely intelligent. Where traditional automation waits for
                                    a command, uBIQ adds a layer that senses, learns and adapts — so the environment quietly
                                    works around the way you live and work.
                                </p>
                                <p className={styles.p}>
                                    We&apos;re not a dealer or a reseller. uBIQ is a vendor-independent integrator and
                                    experience designer: we bring together the best technologies in the world and orchestrate
                                    them into one cohesive ecosystem.
                                </p>
                                <p className={styles.p}>
                                    Every uBIQ environment is composed, not assembled — designed around people first, with the
                                    technology kept quietly in the background.
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal>
                        <div className={styles.stats}>
                            <StatCounter to={2023} from={2018} label="Innovating since" />
                            <StatCounter to={9} suffix="+" label="Technology categories integrated" />
                            <StatCounter to={100} suffix="%" label="Vendor-independent" />
                            <StatCounter to={4} label="Layers · Sense / Learn / Adapt / Care" />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ---------------- POWERED BY UNNTANGLE TECHNOLOGIES ---------------- */}
            <section className={`${styles.section} ${styles.parent}`}>
                <div className={styles.inner}>
                    <Reveal>
                        <div className={styles.center}>
                            <span className={styles.tag}>Powered by Unntangle Technologies</span>
                            <h2 className={styles.h2}>Backed by an innovation company.</h2>

                            <div className={styles.lineage} aria-hidden="true">
                                <span className={styles.lineageNode}>Unntangle Technologies</span>
                                <span className={styles.lineageWire}>
                                    <span className={styles.lineagePulse} />
                                </span>
                                <span className={`${styles.lineageNode} ${styles.lineageNodeBrand}`}>uBIQ</span>
                            </div>

                            <p className={styles.pCenter}>
                                Unntangle Technologies is a technology innovation company established in 2023, building immersive and
                                intelligent experiences. uBIQ channels that expertise into the built environment — applying
                                what Unntangle Technologies knows about interaction, visualisation and AI to physical spaces.
                            </p>
                            <Link href="/" className={styles.textLink}>
                                Visit Unntangle Technologies <ArrowRight size={16} />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ---------------- INNOVATION JOURNEY ---------------- */}
            <section className={`${styles.section} ${styles.journey}`}>
                <div className={styles.inner}>
                    <Reveal>
                        <div className={styles.head}>
                            <span className={styles.tag}>Innovation journey</span>
                            <h2 className={styles.h2}>From immersive experiences to intelligent spaces.</h2>
                        </div>
                    </Reveal>
                    <div className={styles.signal}>
                        <span className={styles.signalLine} aria-hidden="true" />
                        {journey.map((j, i) => (
                            <Reveal
                                key={j.year}
                                delay={i * 0.08}
                                className={`${styles.mItem} ${i % 2 === 0 ? styles.mAbove : styles.mBelow}`}
                            >
                                <span className={styles.mNode} aria-hidden="true" />
                                <span className={styles.mTick} aria-hidden="true" />
                                <div className={styles.mText}>
                                    <span className={styles.jYear}>{j.year}</span>
                                    <h3 className={styles.jTitle}>{j.title}</h3>
                                    <p className={styles.jText}>{j.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- TECHNOLOGY PHILOSOPHY ---------------- */}
            <section className={`${styles.section} ${styles.philosophy}`}>
                <div className={styles.inner}>
                    <Reveal>
                        <div className={styles.head}>
                            <span className={styles.tag}>Technology philosophy</span>
                            <h2 className={styles.h2}>How we think about intelligence.</h2>
                        </div>
                    </Reveal>
                    <div className={styles.philBento}>
                        <Reveal className={styles.pFeature}>
                            <div className={`${styles.philCard} ${styles.philFeature}`}>
                                <span className={styles.philIndex}>01</span>
                                <span className={`${styles.philIcon} ${styles.philIconGrad}`}>
                                    <Sparkles size={22} strokeWidth={1.7} />
                                </span>
                                <h3 className={styles.philFeatureTitle}>Intelligence over automation</h3>
                                <p className={styles.philText}>
                                    Automation reacts to commands. Intelligence anticipates needs — uBIQ adds a
                                    layer that learns the rhythm of a space and adapts before you ask.
                                </p>
                                <div className={styles.philMicro}>
                                    <span className={styles.microMuted}>Reacts</span>
                                    <ArrowRight size={15} className={styles.microArrow} />
                                    <span className={styles.microOn}>Anticipates</span>
                                </div>
                            </div>
                        </Reveal>

                        {philosophy.slice(1).map((c, i) => {
                            const Icon = c.icon;
                            const pos = [styles.pCellA, styles.pCellB, styles.pCellC][i];
                            return (
                                <Reveal key={c.title} delay={0.08 + i * 0.06} className={pos}>
                                    <div className={styles.philCard}>
                                        <span className={styles.philIndex}>0{i + 2}</span>
                                        <span className={styles.philIcon}><Icon size={20} strokeWidth={1.7} /></span>
                                        <h3 className={styles.philTitle}>{c.title}</h3>
                                        <p className={styles.philText}>{c.text}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ---------------- INTEGRATION APPROACH (dark control room) ---------------- */}
            <section className={`${styles.section} ${styles.approach}`}>
                <div className={styles.approachGlow} aria-hidden="true" />
                <div className={styles.approachGrid} aria-hidden="true" />
                <div className={styles.inner}>
                    <Reveal>
                        <div className={styles.head}>
                            <span className={`${styles.tag} ${styles.tagLight}`}>Integration approach</span>
                            <h2 className={`${styles.h2} ${styles.h2Light}`}>We make proven technology intelligent.</h2>
                            <p className={`${styles.pCenter} ${styles.pLight}`}>
                                uBIQ doesn&apos;t replace the systems you trust — KNX, Matter, Crestron, Lutron and more.
                                We sit a layer above them, turning a controllable space into one that understands the people in it.
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <IntelligenceFlow />
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className={styles.techRow}>
                            {techStack.map((t) => (
                                <span key={t} className={styles.techChip}>{t}</span>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ---------------- ECOSYSTEM RECAP ---------------- */}
            <section className={`${styles.section} ${styles.ecosystem}`}>
                <div className={styles.inner}>
                    <Reveal>
                        <div className={styles.head}>
                            <span className={styles.tag}>The ecosystem</span>
                            <h2 className={styles.h2}>Three layers of intelligence.</h2>
                        </div>
                    </Reveal>
                    <div className={styles.ecoGrid}>
                        {ecosystem.map((e, i) => {
                            const Icon = e.icon;
                            return (
                                <Reveal key={e.mark} delay={i * 0.06}>
                                    <div className={styles.ecoCard}>
                                        <span className={styles.cardIcon}><Icon size={20} strokeWidth={1.7} /></span>
                                        <span className={styles.ecoCat}>{e.cat}</span>
                                        <h3 className={styles.ecoName}>uBIQ <span className={styles.accent}>{e.mark}</span></h3>
                                        <p className={styles.cardText}>{e.text}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                    <Reveal>
                        <div className={styles.ecoFootLink}>
                            <Link href="/#platforms" className={styles.textLink}>
                                Explore the platform <ArrowRight size={16} />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ---------------- WHY uBIQ ---------------- */}
            <section className={`${styles.section} ${styles.why}`}>
                <div className={styles.inner}>
                    <div className={styles.split}>
                        <Reveal>
                            <div className={styles.splitLeft}>
                                <span className={styles.tag}>Why <span style={{ textTransform: 'none' }}>uBIQ</span></span>
                                <h2 className={styles.h2}>Not a device installer. An ecosystem designer.</h2>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <ul className={styles.whyList}>
                                {differentiators.map((d) => (
                                    <li key={d} className={styles.whyItem}>
                                        <span className={styles.whyCheck}><Check size={15} strokeWidth={2.6} /></span>
                                        <span>{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ---------------- CTA ---------------- */}
            <section className={`${styles.section} ${styles.ctaSection}`}>
                <div className={styles.inner}>
                    <Reveal>
                        <div className={styles.ctaBand}>
                            <div className={styles.ctaGlow} />
                            <div className={styles.ctaContent}>
                                <span className={styles.tag}>Start the conversation</span>
                                <h2 className={styles.ctaTitle}>
                                    Design your <span className={styles.accent}>intelligent space.</span>
                                </h2>
                                <p className={styles.pCenter}>
                                    Tell us about your home, workplace or project. We&apos;ll walk you through what&apos;s
                                    possible — no pressure, no jargon.
                                </p>
                                <div className={styles.ctaActions}>
                                    <Link href="/contact" className={styles.ctaPrimary}>
                                        Book Experience <ArrowRight size={16} />
                                    </Link>
                                    <Link href="/" className={styles.ctaSecondary}>
                                        Explore uBIQ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
