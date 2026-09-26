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

// Metallic tier treatments: Strike Plus = silver, Strike Ultra = gold,
// matching how the real strikes.in distinguishes the two membership tiers.
type Tier = 'silver' | 'gold';
const TIER_THEME: Record<Tier, { border: string; name: string; pill: string; check: string; cta: string }> = {
  silver: {
    border: 'border-slate-300/25 hover:border-slate-200/50 hover:shadow-[0_0_35px_rgba(203,213,225,0.18)]',
    name: 'bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400',
    pill: 'text-slate-200 bg-slate-300/10 border-slate-300/25',
    check: 'bg-slate-300/20 text-slate-200',
    cta: 'bg-gradient-to-r from-slate-200 to-slate-400 text-black hover:from-slate-100 hover:to-slate-300 shadow-[0_0_18px_rgba(203,213,225,0.25)]',
  },
  gold: {
    border: 'border-amber-400/40 shadow-[0_0_35px_rgba(251,191,36,0.15)] hover:shadow-[0_0_48px_rgba(251,191,36,0.3)] hover:border-amber-300',
    name: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500',
    pill: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
    check: 'bg-amber-400/20 text-amber-300',
    cta: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:shadow-[0_0_32px_rgba(251,191,36,0.5)]',
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
                  "relative flex flex-col bg-[#0a0a0c] rounded-3xl p-8 border transition-all duration-300 transform w-full",
                  "hover:-translate-y-2",
                  t.border,
                  isOverclocked && !plan.isBestValue && "ring-1 ring-cyan-500/30"
                )
              )}
            >
              {plan.isBestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-sm px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Best Value
                </div>
              )}

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
                    "w-full py-4 rounded-xl font-bold text-center transition-all mb-8 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500",
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
