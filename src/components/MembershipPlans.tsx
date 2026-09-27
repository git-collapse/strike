import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useOverclock } from '../context/OverclockContext';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceReveal } from './PriceReveal';

const membershipData = [
  {
    id: "6a9330626d983b17987de723",
    name: "Strike Plus",
    tier: "silver",
    image: "/membership-plus.svg",
    imageAlt: "Futuristic digital workspace with glowing cyan code — Strike Plus",
    tagline: "All existing Strike courses with access for your selected duration.",
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
    tagline: "This plan includes all existing courses, plus upcoming courses for your selected duration.",
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

// Featured mentors shown at the top of each membership card. These reuse the
// authentic portraits already in the project (public/), the same photos used by
// the "Meet With Our Mentors" section — no new/unrelated imagery.
const CARD_MENTORS = [
  { name: 'Rohit Negi', image: '/rohit_negi.jpg', initials: 'RN' },
  { name: 'Aditya Tandon', image: '/aditya_tandon.jpg', initials: 'AT' },
];

// Metallic tier treatments: Strike Plus = silver, Strike Ultra = gold,
// matching how the real strikes.in distinguishes the two membership tiers.
type Tier = 'silver' | 'gold';
const TIER_THEME: Record<Tier, { border: string; name: string; pill: string; check: string; cta: string; banner: string; bannerTint: string; avatarRing: string }> = {
  silver: {
    border: 'border-slate-300/25 hover:border-slate-200/50 hover:shadow-[0_0_35px_rgba(203,213,225,0.18)]',
    name: 'bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400',
    pill: 'text-slate-200 bg-slate-300/10 border-slate-300/25',
    check: 'bg-slate-300/20 text-slate-200',
    cta: 'bg-gradient-to-r from-slate-200 to-slate-400 text-black hover:from-slate-100 hover:to-slate-300 shadow-[0_0_18px_rgba(203,213,225,0.25)]',
    banner: 'border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.28)]',
    bannerTint: 'bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent',
    avatarRing: 'from-cyan-400 to-blue-600',
  },
  gold: {
    border: 'border-amber-400/40 shadow-[0_0_35px_rgba(251,191,36,0.15)] hover:shadow-[0_0_48px_rgba(251,191,36,0.3)] hover:border-amber-300',
    name: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500',
    pill: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
    check: 'bg-amber-400/20 text-amber-300',
    cta: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:shadow-[0_0_32px_rgba(251,191,36,0.5)]',
    banner: 'border-amber-400/25 group-hover:border-amber-300/60 group-hover:shadow-[0_0_32px_rgba(251,191,36,0.35)]',
    bannerTint: 'bg-gradient-to-br from-amber-400/20 via-yellow-600/10 to-transparent',
    avatarRing: 'from-amber-300 to-yellow-600',
  },
};

const MembershipPlans = () => {
  const { isOverclocked } = useOverclock();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({
    "6a9330626d983b17987de723": 2, // Default to 4 Years (index 2)
    "6a9330aa6d983b17987de724": 2,
  });

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } }
      }}
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" 
      id="memberships"
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
        className="text-center mb-16 empty-space-zone"
      >
        <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">The Strike Membership</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Membership Plans</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          One focused investment in your engineering career. <br/>
          Every course. Present and future. Pay once, learn forever.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto empty-space-zone">
        {membershipData.map(plan => {
          const selectedIdx = selectedVariants[plan.id];
          const variant = plan.variants[selectedIdx];
          const t = TIER_THEME[plan.tier as Tier];
          
          // Apply Overclock 15% discount if active
          const finalPrice = isOverclocked 
            ? Math.floor(variant.sellingPrice * 0.85) 
            : variant.sellingPrice;
            
          const discountPercent = Math.round((1 - (finalPrice / variant.originalPrice)) * 100);

          return (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
              key={plan.id}
              className={twMerge(
                clsx(
                  "group relative flex flex-col bg-[#0a0a0c] rounded-3xl p-8 border transition-all duration-300 transform w-full",
                  "hover:-translate-y-2",
                  t.border,
                  isOverclocked && !plan.isBestValue && "ring-1 ring-cyan-500/30"
                )
              )}
            >
              {plan.isBestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-sm px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                  Best Value
                </div>
              )}

              {/* PREMIUM TIER VISUAL — authentic mentor portraits over a futuristic tier background */}
              <div className={twMerge(clsx(
                "relative -mx-2 -mt-2 mb-6 overflow-hidden rounded-2xl border bg-[#050505] transition-all duration-300",
                t.banner
              ))}>
                {/* futuristic tier background illustration */}
                <img
                  src={plan.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className={twMerge(clsx("absolute inset-0", t.bannerTint))} />
                {/* fade the art into the card surface so portraits blend naturally */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/35 to-transparent" />

                {/* mentor portraits */}
                <div className="relative flex items-end justify-center gap-6 sm:gap-10 px-6 pt-7 pb-5">
                  {CARD_MENTORS.map((m) => (
                    <div key={m.name} className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="relative">
                        <div className={twMerge(clsx(
                          "absolute -inset-1 rounded-full bg-gradient-to-br blur-md opacity-50 transition-opacity duration-300 group-hover:opacity-90",
                          t.avatarRing
                        ))} />
                        <div className={twMerge(clsx("relative rounded-full p-[2.5px] bg-gradient-to-br", t.avatarRing))}>
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0d0d12] overflow-hidden flex items-center justify-center">
                            <span className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-black text-white tracking-wide">{m.initials}</span>
                            <img
                              src={m.image}
                              alt={`${m.name} — Strike mentor`}
                              loading="lazy"
                              decoding="async"
                              className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-100 tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Membership Plan</div>
              <h3 className={twMerge(clsx("text-3xl font-extrabold mb-3 tracking-tight text-transparent bg-clip-text", t.name))}>{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{plan.tagline}</p>

              {/* DURATION SELECTOR */}
              <div className="flex bg-[#111] p-1.5 rounded-xl mb-8 border border-white/5 relative z-10">
                {plan.variants.map((v, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={v.label}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [plan.id]: idx }))}
                      className={twMerge(
                        clsx(
                          "flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-cyan-500",
                          isSelected ? "text-white" : "text-gray-500 hover:text-gray-300"
                        )
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId={`duration-pill-${plan.id}`}
                          className="absolute inset-0 bg-white/10 rounded-lg shadow-sm pointer-events-none"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {v.label}
                      </span>
                      
                      {v.isPopular && (
                        <span className="absolute -top-3 -right-2 bg-green-500 text-black text-[9px] px-1.5 py-0.5 rounded-full uppercase z-20 shadow-sm border border-green-400">
                          Popular
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* VERTICAL PRICING BLOCK */}
              <div className="flex flex-col gap-2 mb-8">
                {/* Main Large Price */}
                <PriceReveal 
                  normalPrice={variant.sellingPrice}
                  overclockedPrice={finalPrice}
                  isOverclocked={isOverclocked}
                  className="text-5xl sm:text-6xl"
                />
                
                {/* Original Price & Discount Row */}
                <div className="flex flex-row items-center gap-3">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={variant.originalPrice}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-gray-500 line-through text-base font-medium">
                        ₹{variant.originalPrice.toLocaleString('en-IN')}
                      </span>
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

              {/* CTA */}
              <a
                href={variant.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={twMerge(
                  clsx(
                    "w-full py-4 rounded-xl font-bold text-center transition-all mb-8 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 active:scale-[0.98]",
                    isOverclocked
                      ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
                      : t.cta
                  )
                )}
              >
                {isOverclocked ? "Deploy Grant" : `Get ${plan.name}`}
              </a>

              {/* FEATURES */}
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
      </div>
    </motion.section>
  );
};

export default MembershipPlans;
