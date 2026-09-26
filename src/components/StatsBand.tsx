import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Code2, GraduationCap, Star } from 'lucide-react';

// NOTE: These figures are illustrative/representative for this frontend
// demo — they are not verified live metrics from strikes.in (see README).
const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Learners on Strike', decimals: 0 },
  { icon: Code2, value: 1200000, suffix: '+', label: 'Problems Solved', decimals: 0 },
  { icon: GraduationCap, value: 15, suffix: '+', label: 'Industry-Grade Courses', decimals: 0 },
  { icon: Star, value: 4.8, suffix: '/5', label: 'Average Learner Rating', decimals: 1 },
];

const formatValue = (n: number, decimals: number) => {
  if (decimals > 0) return n.toFixed(decimals);
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return Math.round(n).toString();
};

const CountUp = ({ target, decimals }: { target: number; decimals: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic for a snappy settle
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref} className="tabular-nums">{formatValue(display, decimals)}</span>;
};

const StatsBand = () => {
  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 empty-space-zone" aria-label="Strike by the numbers">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c0c10] to-[#050506] overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-48 bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="relative grid grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-white/5 lg:divide-y-0"
          >
            {stats.map(({ icon: Icon, value, suffix, label, decimals }) => (
              <motion.div
                key={label}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="flex flex-col items-center text-center gap-2 p-6 sm:p-8 group"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-1 transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <Icon size={20} className="text-cyan-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline">
                  <CountUp target={value} decimals={decimals} />
                  <span className="text-cyan-400">{suffix}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
