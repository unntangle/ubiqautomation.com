'use client';

import { motion, Variants } from 'framer-motion';
import { Home, Building, Building2, BedDouble } from 'lucide-react';
import styles from './UbiqSpaces.module.css';

/* uBIQ Smart Automation Solutions — the environments uBIQ makes intelligent. */

const spaces = [
    { icon: <Home size={22} strokeWidth={1.7} />, title: 'Smart Villas', note: 'Whole-property intelligence for luxury residences.' },
    { icon: <Building size={22} strokeWidth={1.7} />, title: 'Luxury Apartments', note: 'Premium smart living, beautifully scaled per unit.' },
    { icon: <Building2 size={22} strokeWidth={1.7} />, title: 'Workspaces', note: 'Connected, efficient, future-ready offices.' },
    { icon: <BedDouble size={22} strokeWidth={1.7} />, title: 'Hospitality', note: 'Guest experiences that anticipate and delight.' },
];

const REVEAL = { once: true, margin: '-70px 0px' };
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function UbiqSpaces() {
    return (
        <section id="spaces" className={styles.section}>
            <div className={styles.inner}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={REVEAL}
                    transition={{ duration: 0.6 }}
                >
                    <span className={styles.eyebrow}>Smart Automation Solutions</span>
                    <h2 className={styles.title}>Intelligence, shaped to the space</h2>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={REVEAL}
                >
                    {spaces.map((s) => (
                        <motion.div key={s.title} className={styles.card} variants={item}>
                            <div className={styles.icon}>{s.icon}</div>
                            <h3 className={styles.cardTitle}>{s.title}</h3>
                            <p className={styles.cardNote}>{s.note}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
