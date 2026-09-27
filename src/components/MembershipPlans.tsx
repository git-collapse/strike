import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useOverclock } from '../context/OverclockContext';
import { Check, ArrowRight, Sparkles, Crown, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PriceReveal } from './PriceReveal';

const membershipData = [
  {
    id: "6a9330626d983b17987de723",
    name: "Strike Plus",
    tier: "silver",
    image: "/membership-plus.svg",
    imageAlt: "Futuristic digital workspace with glowing cyan code — Strike Plus",
    tagline: "Everything you need to master the courses available today.",
    variants: [
      { label: "2 Years", originalPrice: 19999, sellingPrice: 9999, buyUrl: "https://rohittnegi.akamai.net.in/new-courses/21" },
      { label: "3 Years", originalPrice: 19999, sellingPrice: 11999, buyUrl: "https://rohittnegi.akamai.net.in/new-courses/22" },
      { label: "4 Years", originalPrice: 19999, sellingPrice: 12499, buyUrl: "https://rohittnegi.akamai.net.in/new-courses/23", isPopular: true }
    ],
    features: [
      "All current courses included",
      "HD recordings",
      "Live class access during plan",
      "Notes",
      "Resume Review",
      "Certificates",
      "System Design Platform",
      "DSA Platform",
      "Coder Arena Platform"
    ]
  },
  {
    id: "6a9330aa6d983b17987de724",
    name: "Strike Ultra",
    tier: "gold",
    image: "/membership-ultra.svg",
    imageAlt: "Exclusive cyberpunk emblem with glowing gold accents — Strike Ultra",
    tagline: "Go beyond today's courses with access to existing and upcoming learning experiences.",
    isBestValue: true,
    variants: [
      { label: "2 Years", originalPrice: 24999, sellingPrice: 11999, buyUrl: "https://rohittnegi.akamai.net.in/new-courses/24" },
      { label: "3 Years", originalPrice: 24999, sellingPrice: 12999, buyUrl: "https://rohittnegi.akamai.net.in/new-courses/25" },
      { label: "4 Years", originalPrice: 24999, sellingPrice: 13499, buyUrl: "https://rohittnegi.akamai.net.in/new-courses/26", isPopular: true }
    ],
    features: [
      "Everything in Strike Plus",
      "Upcoming batches included",
      "Certificates",
      "Resume Review",
      "Notes",
      "System Design Platform",
      "DSA platform",
      "Coder Arena Platform"
    ]
  }
];

// Instructors for the hero showcase. Roles reuse the authentic titles from the
// "Meet With Our Mentors" section — not invented. Source photos are 200×200, so
// they are framed at a size that keeps faces sharp rather than upscaled cutouts.
const INSTRUCTORS = [
  { name: 'Rohit Negi', role: 'Founder & Lead Instructor', image: '/rohit_negi.jpg', accent: 'cyan' as const },
  { name: 'Aditya Tandon', role: 'Co-Founder & Senior Instructor', image: '/aditya_tandon.jpg', accent: 'gold' as const },
];

// Featured mentors shown at the top of each membership card (reuse of the same
// authentic portraits used across the site — no new/unrelated imagery).
const CARD_MENTORS = [
  { name: 'Rohit Negi', image: '/rohit_negi.jpg', initials: 'RN' },
  { name: 'Aditya Tandon', image: '/aditya_tandon.jpg', initials: 'AT' },
];

// Comparison rows — ONLY verified differences derived from the plan data above.
// `plus`/`ultra`: true = included, false = not included, string = detail.
const COMPARISON = [
  { feature: 'Access to existing Strike courses', plus: true, ultra: true },
  { feature: 'Upcoming courses & batches', plus: false, ultra: true },
  { feature: 'Live class access during plan', plus: true, ultra: true },
  { feature: 'HD recordings & notes', plus: true, ultra: true },
  { feature: 'Resume review & certificates', plus: true, ultra: true },
  { feature: 'DSA, System Design & Coder Arena platforms', plus: true, ultra: true },
  { feature: 'Membership duration', plus: '2 / 3 / 4 Years', ultra: '2 / 3 / 4 Years' },
];

// Metallic tier treatments: Strike Plus = silver/cyan, Strike Ultra = gold,
// matching how the real strikes.in distinguishes the two membership tiers.
type Tier = 'silver' | 'gold';
const TIER_THEME: Record<Tier, { border: string; name: string; pill: string; check: string; cta: string; banner: string; bannerTint: string; glow: string; ring: string; accentText: string }> = {
  silver: {
    border: 'border-cyan-300/20 hover:border-cyan-300/50 hover:shadow-[0_0_45px_rgba(34,211,238,0.18)]',
    name: 'bg-gradient-to-r from-cyan-100 via-cyan-300 to-blue-400',
    pill: 'text-cyan-200 bg-cyan-300/10 border-cyan-300/25',
    check: 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/25',
    cta: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_22px_rgba(34,211,238,0.3)]',
    banner: 'border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.28)]',
    bannerTint: 'bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent',
    glow: 'bg-cyan-500/25',
    ring: 'from-cyan-400 to-blue-600',
    accentText: 'text-cyan-300',
  },
  gold: {
    border: 'border-amber-400/40 shadow-[0_0_35px_rgba(251,191,36,0.15)] hover:shadow-[0_0_48px_rgba(251,191,36,0.3)] hover:border-amber-300',
    name: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500',
    pill: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
    check: 'bg-amber-400/15 text-amber-300 border border-amber-400/25',
    cta: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_22px_rgba(251,191,36,0.35)] hover:shadow-[0_0_32px_rgba(251,191,36,0.5)]',
    banner: 'border-amber-400/25 group-hover:border-amber-300/60 group-hover:shadow-[0_0_32px_rgba(251,191,36,0.35)]',
    bannerTint: 'bg-gradient-to-br from-amber-400/20 via-yellow-600/10 to-transparent',
    glow: 'bg-amber-400/25',
    ring: 'from-amber-300 to-yellow-600',
    accentText: 'text-amber-300',
  },
};

// Smooth-scroll to the plans grid. Uses window.scrollTo (not scrollIntoView)
// because the global `overflow-x: hidden` on <body> promotes it to a scroll
// container, and subtracts the fixed navbar height so the heading isn't hidden.
const scrollToPlans = () => {
  const el = document.getElementById('membership-plans');
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

// A single framed instructor portrait for the hero showcase. Kept at a modest
// size (source is 200×200) so the face stays sharp — no stretched upscaling.
const InstructorFrame = ({ name, role, image, accent, reduce }: typeof INSTRUCTORS[number] & { reduce: boolean | null }) => {
  const isCyan = accent === 'cyan';
  return (
    <motion.figure
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: isCyan ? 0.1 : 0.22 }}
      className="group/inst relative"
    >
      {/* accent glow */}
      <div className={clsx('pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl opacity-50 transition-opacity duration-500 group-hover/inst:opacity-80', isCyan ? 'bg-cyan-500/25' : 'bg-amber-400/25')} />
      <div className={clsx('relative overflow-hidden rounded-3xl border bg-[#0a0a0c] p-1.5 transition-transform duration-500 group-hover/inst:-translate-y-1.5', isCyan ? 'border-cyan-400/30' : 'border-amber-400/30')}>
        <div className="relative overflow-hidden rounded-[1.35rem]">
          <img src={image} alt={`${name} — ${role}`} width={200} height={200} loading="lazy" decoding="async" className="h-44 w-40 sm:h-52 sm:w-48 object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
          <div className={clsx('absolute inset-0 mix-blend-overlay opacity-40', isCyan ? 'bg-gradient-to-t from-cyan-500/40 to-transparent' : 'bg-gradient-to-t from-amber-500/40 to-transparent')} />
        </div>
        <figcaption className="px-2.5 pt-2.5 pb-1.5">
          <div className="text-sm font-bold text-white leading-tight">{name}</div>
          <div className={clsx('text-[11px] font-semibold', isCyan ? 'text-cyan-300' : 'text-amber-300')}>{role}</div>
        </figcaption>
      </div>
    </motion.figure>
  );
};

// Cinematic membership hero — editorial instructor showcase + brand headline.
const MembershipHero = ({ reduce }: { reduce: boolean | null }) => (
  <div className="relative mb-24 lg:mb-28">
    {/* ambient backdrop: grid + dual-accent glow */}
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      aria-hidden="true"
      style={{
        backgroundImage:
          'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 75% 70% at 50% 40%, black, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 40%, black, transparent 78%)',
      }}
    />
    <div className="pointer-events-none absolute -top-10 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[100px]" />
    <div className="pointer-events-none absolute top-10 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-amber-400/12 blur-[100px]" />

    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
      {/* copy */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center lg:text-left"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
          <Sparkles size={13} /> Membership · Premium Access
        </span>
        <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
          Choose Your Level.
          <span className="block bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent">Own Your Future.</span>
        </h2>
        <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
          Unlock your potential with structured learning, expert guidance, and a clear path toward becoming a better developer.
        </p>
        <button
          onClick={scrollToPlans}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all hover:shadow-[0_0_28px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-[0.98]"
        >
          Explore Membership Plans
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>

      {/* instructor showcase */}
      <div className="relative flex items-center justify-center lg:justify-end gap-4 sm:gap-6">
        <div className="mt-8">
          <InstructorFrame {...INSTRUCTORS[0]} reduce={reduce} />
        </div>
        <div className="-mt-8">
          <InstructorFrame {...INSTRUCTORS[1]} reduce={reduce} />
        </div>
        {/* floating geometric accent */}
        <div className="pointer-events-none absolute -top-6 right-2 h-16 w-16 rounded-2xl border border-white/10 rotate-12 hidden sm:block" />
        <div className="pointer-events-none absolute -bottom-6 left-0 h-10 w-10 rounded-full border border-cyan-400/20 hidden sm:block" />
      </div>
    </div>
  </div>
);

const MembershipPlans = () => {
  const { isOverclocked } = useOverclock();
  const reduce = useReducedMotion();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({
    "6a9330626d983b17987de723": 2, // Default to 4 Years (index 2)
    "6a9330aa6d983b17987de724": 2,
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="memberships">
      <MembershipHero reduce={reduce} />

      {/* PLANS HEADER */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 empty-space-zone"
        id="membership-plans"
      >
        <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">The Strike Membership</h4>
        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Membership Plans</h3>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          One focused investment in your engineering career. <br/>
          Every course. Present and future. Pay once, learn forever.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto empty-space-zone"
      >
        {membershipData.map(plan => {
          const selectedIdx = selectedVariants[plan.id];
          const variant = plan.variants[selectedIdx];
          const t = TIER_THEME[plan.tier as Tier];
          const finalPrice = isOverclocked ? Math.floor(variant.sellingPrice * 0.85) : variant.sellingPrice;
          const discountPercent = Math.round((1 - (finalPrice / variant.originalPrice)) * 100);

          return (
            <motion.div
              variants={fadeUp}
              key={plan.id}
              className={twMerge(clsx(
                "group relative flex flex-col bg-[#0a0a0c] rounded-3xl p-8 border transition-all duration-300 transform w-full hover:-translate-y-2",
                t.border,
                isOverclocked && !plan.isBestValue && "ring-1 ring-cyan-500/30"
              ))}
            >
              {plan.isBestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-sm px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                  <Crown size={13} /> Best Value
                </div>
              )}

              {/* ZONE 1+2 — plan identity + cinematic instructor composition */}
              <div className={twMerge(clsx(
                "relative -mx-2 -mt-2 mb-6 h-56 sm:h-60 overflow-hidden rounded-2xl border bg-[#050505] transition-all duration-300",
                t.banner
              ))}>
                <img src={plan.image} alt="" aria-hidden="true" loading="lazy" decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 ease-out group-hover:scale-105" />
                <div className={twMerge(clsx("absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-90", t.glow))} />
                <div className={twMerge(clsx("absolute inset-0", t.bannerTint))} />

                {CARD_MENTORS.map((m, i) => (
                  <div key={m.name} className={clsx(
                    "absolute bottom-0 w-1/2 h-[88%] transition-transform duration-500 ease-out group-hover:scale-[1.04]",
                    i === 0 ? "left-0 origin-bottom-left" : "right-0 origin-bottom-right"
                  )}>
                    <img src={m.image} alt={`${m.name} — Strike mentor`} loading="lazy" decoding="async"
                      className="h-full w-full object-cover object-top"
                      style={{
                        maskImage: i === 0 ? 'radial-gradient(120% 130% at 70% 40%, #000 45%, transparent 78%)' : 'radial-gradient(120% 130% at 30% 40%, #000 45%, transparent 78%)',
                        WebkitMaskImage: i === 0 ? 'radial-gradient(120% 130% at 70% 40%, #000 45%, transparent 78%)' : 'radial-gradient(120% 130% at 30% 40%, #000 45%, transparent 78%)',
                      }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                ))}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/25 to-[#0a0a0c]/40" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0c] to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-4 text-center">
                  <h3 className={twMerge(clsx("text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]", t.name))}>
                    {plan.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-gray-300 tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {CARD_MENTORS.map((m) => m.name).join(' · ')}
                  </div>
                </div>
              </div>

              {/* ZONE 3 — title + description */}
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Membership Plan</div>
              <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{plan.tagline}</p>

              {/* ZONE 5 — interactive duration selector */}
              <div role="radiogroup" aria-label={`${plan.name} duration`} className="flex bg-[#111] p-1.5 rounded-xl mb-8 border border-white/5 relative z-10">
                {plan.variants.map((v, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={v.label}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [plan.id]: idx }))}
                      className={twMerge(clsx(
                        "flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-cyan-500",
                        isSelected ? "text-white" : "text-gray-500 hover:text-gray-300"
                      ))}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId={`duration-pill-${plan.id}`}
                          className="absolute inset-0 bg-white/10 rounded-lg shadow-sm pointer-events-none"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">{v.label}</span>
                      {v.isPopular && (
                        <span className="absolute -top-3 -right-2 bg-green-500 text-black text-[9px] px-1.5 py-0.5 rounded-full uppercase z-20 shadow-sm border border-green-400">
                          Popular
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ZONE 6 — pricing */}
              <div className="flex flex-col gap-2 mb-8">
                <PriceReveal normalPrice={variant.sellingPrice} overclockedPrice={finalPrice} isOverclocked={isOverclocked} className="text-5xl sm:text-6xl" />
                <div className="flex flex-row items-center gap-3">
                  <AnimatePresence mode="popLayout">
                    <motion.div key={variant.originalPrice} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-3">
                      <span className="text-gray-500 line-through text-base font-medium">₹{variant.originalPrice.toLocaleString('en-IN')}</span>
                      <span className={twMerge(clsx(
                        "font-bold text-sm border px-2.5 py-0.5 rounded-full whitespace-nowrap",
                        isOverclocked ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" : t.pill
                      ))}>
                        {discountPercent}% OFF
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ZONE 7 — enrollment CTA (existing checkout URL preserved) */}
              <a
                href={variant.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={twMerge(clsx(
                  "group/cta w-full py-4 rounded-xl font-bold text-center transition-all mb-8 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 active:scale-[0.98] flex items-center justify-center gap-2",
                  isOverclocked
                    ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
                    : t.cta
                ))}
              >
                {isOverclocked ? "Deploy Grant" : `Get ${plan.name}`}
                <ArrowRight size={18} className="transition-transform group-hover/cta:translate-x-0.5" />
              </a>

              {/* ZONE 4 — benefits */}
              <div className="flex flex-col gap-4 mt-auto border-t border-white/10 pt-8">
                <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  What's included <span className="flex-1 h-px bg-white/10"></span>
                </div>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={twMerge(clsx("flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center", t.check))}>
                      <Check size={12} />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* COMPARISON — "Find Your Perfect Plan" */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mt-28 max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">Find Your Perfect Plan</h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Compare what each membership includes and choose the learning experience that fits your goals.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0c]">
          {/* header row */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr] bg-white/[0.03] border-b border-white/10">
            <div className="p-4 sm:p-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500">Feature</div>
            <div className="p-4 sm:p-5 text-center text-sm sm:text-base font-extrabold text-cyan-300 flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="hidden sm:block" /> Plus
            </div>
            <div className="p-4 sm:p-5 text-center text-sm sm:text-base font-extrabold text-amber-300 flex items-center justify-center gap-1.5">
              <Crown size={14} className="hidden sm:block" /> Ultra
            </div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={clsx("grid grid-cols-[1.6fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr] items-center", i !== COMPARISON.length - 1 && "border-b border-white/5")}>
              <div className="p-4 sm:p-5 text-sm text-gray-300 leading-snug">{row.feature}</div>
              {(['plus', 'ultra'] as const).map((col) => {
                const val = row[col];
                const isUltra = col === 'ultra';
                return (
                  <div key={col} className="p-4 sm:p-5 flex items-center justify-center text-center">
                    {typeof val === 'string' ? (
                      <span className={clsx("text-xs sm:text-sm font-semibold", isUltra ? "text-amber-200" : "text-cyan-200")}>{val}</span>
                    ) : val ? (
                      <span className={clsx("flex h-6 w-6 items-center justify-center rounded-full", isUltra ? "bg-amber-400/15 text-amber-300" : "bg-cyan-400/15 text-cyan-300")}>
                        <Check size={13} />
                      </span>
                    ) : (
                      <span className="text-gray-600 text-lg leading-none">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CLOSING CTA — "Your Next Chapter Starts Here." */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative mt-28 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0f16] via-[#0a0a0c] to-[#0a0a0c] p-10 sm:p-16 text-center"
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-amber-400/10 blur-[100px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 60% 80% at 50% 50%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 50% 50%, black, transparent 80%)',
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            <InfinityIcon size={13} /> Pay once · learn forever
          </span>
          <h3 className="mt-6 text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Your Next Chapter <br className="hidden sm:block" /> Starts Here.
          </h3>
          <p className="mt-5 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Choose your membership and take the next step in your developer journey.
          </p>
          <button
            onClick={scrollToPlans}
            className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-base font-bold text-black shadow-[0_0_24px_rgba(34,211,238,0.3)] transition-all hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_36px_rgba(34,211,238,0.45)] focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-[0.98]"
          >
            <ShieldCheck size={18} /> Choose Your Plan
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default MembershipPlans;
