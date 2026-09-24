'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, ChevronDown, MapPin, Home, Building2, Hotel,
    Clock, ShieldCheck, Sparkles, CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react';
import styles from './UbiqContactPage.module.css';

/* ============================================================
 * uBIQ — dedicated contact / "Book an Experience" page.
 * On-brand (purple) booking experience, distinct from the parent
 * Unntangle Technologies /contact page.
 *
 * SUBMISSION: posts to Web3Forms (https://web3forms.com), a free
 * no-backend form service. Submissions are delivered by email to
 * the address tied to the access key below. To change the
 * destination inbox or regenerate the key, sign in at web3forms.com.
 *
 * Set the key via NEXT_PUBLIC_WEB3FORMS_KEY in the environment;
 * the inline fallback keeps it working if the env var isn't set.
 * The key is a public submit-only token (safe to expose client-side)
 * — it cannot read past submissions, only create new ones.
 * ============================================================ */

const WEB3FORMS_ACCESS_KEY =
    process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY';

const ease = [0.16, 1, 0.3, 1] as const;

const spaceTypes = [
    { icon: Home, label: 'Home / Villa' },
    { icon: Building2, label: 'Office / Commercial' },
    { icon: Hotel, label: 'Hotel / Hospitality' },
];

const assurances = [
    { icon: Clock, title: 'Reply within 24h', text: 'A specialist responds within one business day.' },
    { icon: ShieldCheck, title: 'No-pressure consult', text: 'A conversation about your space — not a sales pitch.' },
    { icon: Sparkles, title: 'Tailored proposal', text: 'A system designed around how you actually live and work.' },
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function UbiqContactPage() {
    const [space, setSpace] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [interest, setInterest] = useState('');
    const [message, setMessage] = useState('');

    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const resetForm = () => {
        setSpace(''); setName(''); setEmail(''); setPhone(''); setInterest(''); setMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'submitting') return;

        // Lightweight client-side validation.
        if (!email.trim()) { setStatus('error'); setErrorMsg('Please enter your email so we can reach you.'); return; }
        if (phone.length !== 10) { setStatus('error'); setErrorMsg('Please enter a valid 10-digit phone number.'); return; }

        setStatus('submitting');
        setErrorMsg('');

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: 'New uBIQ Experience booking',
                    from_name: 'uBIQ Website',
                    // Submitted fields
                    name: name || 'Not provided',
                    email,
                    phone: `+91 ${phone}`,
                    space_type: space || 'Not specified',
                    interested_in: interest || 'Not specified',
                    message: message || 'No message provided',
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                resetForm();
            } else {
                setStatus('error');
                setErrorMsg(data.message || 'Something went wrong. Please try again or email us directly.');
            }
        } catch {
            setStatus('error');
            setErrorMsg('Couldn\u2019t reach the server. Please check your connection or email us directly.');
        }
    };

    return (
        <div className={styles.page}>
            <section className={`${styles.section} ${styles.hero}`}>
                <div className={styles.heroGlow} aria-hidden="true" />
                <div className={styles.heroGrid} aria-hidden="true" />
                <div className={`${styles.inner} ${styles.grid}`}>
                    {/* LEFT — copy + details */}
                    <motion.div
                        className={styles.left}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease }}
                    >
                        <span className={styles.eyebrow}>Book an Experience</span>
                        <h1 className={styles.h1}>
                            Let&apos;s design your <span className={styles.accent}>intelligent space.</span>
                        </h1>
                        <p className={styles.lead}>
                            Tell us about your home, workplace or project. We&apos;ll walk you through what&apos;s
                            possible and propose a system shaped entirely around how you live and work.
                        </p>

                        <div className={styles.assurances}>
                            {assurances.map((a) => {
                                const Icon = a.icon;
                                return (
                                    <div key={a.title} className={styles.assurance}>
                                        <span className={styles.assuranceIcon}><Icon size={18} strokeWidth={1.8} /></span>
                                        <div>
                                            <span className={styles.assuranceTitle}>{a.title}</span>
                                            <span className={styles.assuranceText}>{a.text}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.details}>
                            {/* Email and phone intentionally not shown here.
                                Visitors reach us through the form on this page. */}
                            {/* HIDDEN-CONTACT: office address
                            <a
                                className={styles.detail}
                                href="https://www.google.com/maps/search/?api=1&query=SBS+Office+Space+Old+No+470+New+No+700+Anna+Salai+Nandanam+Chennai+600035"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className={styles.detailIcon}><MapPin size={17} /></span>
                                <div className={styles.detailText}><span>Visit</span><p>SBS Office Space, Anna Salai, Nandanam, Chennai 600035.</p></div>
                            </a>
                            */}
                        </div>
                    </motion.div>

                    {/* RIGHT — form */}
                    <motion.div
                        className={styles.right}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease }}
                    >
                        <div className={styles.card}>
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        className={styles.successState}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4, ease }}
                                    >
                                        <span className={styles.successIcon}><CheckCircle2 size={32} strokeWidth={1.8} /></span>
                                        <h2 className={styles.successTitle}>Request received</h2>
                                        <p className={styles.successText}>
                                            Thanks{name ? `, ${name.split(' ')[0]}` : ''} — your enquiry is on its way to our team.
                                            A specialist will reach out within one business day.
                                        </p>
                                        <button
                                            type="button"
                                            className={styles.successBtn}
                                            onClick={() => setStatus('idle')}
                                        >
                                            Send another request
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <h2 className={styles.cardTitle}>Tell us about your space</h2>

                                        <div className={styles.field}>
                                            <label className={styles.label}>What kind of space?</label>
                                            <div className={styles.spaceRow}>
                                                {spaceTypes.map((s) => {
                                                    const Icon = s.icon;
                                                    const on = space === s.label;
                                                    return (
                                                        <button
                                                            key={s.label}
                                                            type="button"
                                                            className={`${styles.spaceBtn} ${on ? styles.spaceBtnOn : ''}`}
                                                            onClick={() => setSpace(on ? '' : s.label)}
                                                            aria-pressed={on}
                                                        >
                                                            <Icon size={18} strokeWidth={1.8} />
                                                            {s.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <form className={styles.form} onSubmit={handleSubmit}>
                                            <div className={styles.row}>
                                                <div className={styles.field}>
                                                    <label className={styles.label}>Full name</label>
                                                    <input
                                                        className={styles.input}
                                                        type="text"
                                                        placeholder="Your name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </div>
                                                <div className={styles.field}>
                                                    <label className={styles.label}>Email*</label>
                                                    <input
                                                        className={styles.input}
                                                        type="email"
                                                        placeholder="you@email.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.row}>
                                                <div className={styles.field}>
                                                    <label className={styles.label}>Phone*</label>
                                                    <input
                                                        className={styles.input}
                                                        type="tel"
                                                        inputMode="numeric"
                                                        maxLength={10}
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                        placeholder="00000 00000"
                                                        required
                                                    />
                                                </div>
                                                <div className={styles.field}>
                                                    <label className={styles.label}>Interested in</label>
                                                    <div className={styles.selectWrap}>
                                                        <select
                                                            className={styles.select}
                                                            value={interest}
                                                            onChange={(e) => setInterest(e.target.value)}
                                                        >
                                                            <option value="" disabled>Select</option>
                                                            <option>uBIQ Senz — adaptive intelligence</option>
                                                            <option>uBIQ Twin — 3D digital twin</option>
                                                            <option>uBIQ Care+ — ownership program</option>
                                                            <option>Whole home or office automation</option>
                                                            <option>Not sure yet</option>
                                                        </select>
                                                        <ChevronDown size={15} className={styles.selectChev} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.field}>
                                                <label className={styles.label}>Tell us a little about your project</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    rows={3}
                                                    placeholder="Rooms, scale, timeline, what you'd love your space to do..."
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </div>

                                            {status === 'error' && (
                                                <p className={styles.errorMsg}>
                                                    <AlertCircle size={15} strokeWidth={2} />
                                                    {errorMsg}
                                                </p>
                                            )}

                                            <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                                                {status === 'submitting' ? (
                                                    <><Loader2 size={16} className={styles.spin} /> Sending…</>
                                                ) : (
                                                    <>Book Experience <ArrowRight size={16} /></>
                                                )}
                                            </button>
                                            <p className={styles.formNote}>
                                                By submitting, you agree to be contacted about your enquiry. We never share your details.
                                            </p>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
