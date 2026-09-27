import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { Zap, ArrowRight, Compass } from 'lucide-react';
import { useOverclock } from '../context/OverclockContext';
import { HeroMascot } from './HeroMascot';
import HeroCodePanel from './HeroCodePanel';

// Real Strike course tracks — surfaced as a subtle "stack" row so the left
// column carries visual weight against the mascot. These are truthful catalog
// categories, not invented stats or badges.
const STACK = ['DSA', 'System Design', 'GenAI', 'DevOps', 'Web Dev'];

// Decorative code tokens that drift slowly in the hero's empty margins. Purely
// cosmetic (aria-hidden), low-opacity, and disabled under reduced-motion.
const FRAGMENTS = [
  { text: '{ }', top: '16%', left: '4%', delay: 0, dur: 9 },
  { text: '=>', top: '68%', left: '8%', delay: 1.5, dur: 11 },
  { text: '</>', top: '30%', right: '5%', delay: 0.8, dur: 10 },
];

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const { isOverclocked } = useOverclock();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Smooth-scroll to the Courses section. A plain `#courses` hash anchor is
  // unreliable here: the global `overflow-x: hidden` on <body> promotes it to a
  // scroll container, so the browser's native hash jump can target the wrong
  // scroller. We drive window.scrollTo manually (subtracting the fixed navbar's
  // height) — the same pattern the Navbar uses — so "Explore Courses" always
  // opens the actual Courses section. Falls back to the href if the node is
  // missing. The Navbar's scroll-spy then reflects the new active section.
  const scrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('courses');
    if (!el) return; // let the href fallback handle it
    e.preventDefault();
    const NAV_OFFSET = 88;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div id="home" className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-[#08080a] empty-space-zone">
      {/* Layered background: faint dev grid + two soft glows for depth. The grid
          is masked to fade toward the edges so it never competes with content. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 35%, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 35%, black 10%, transparent 75%)'
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Floating code fragments (decorative, reduced-motion safe) */}
      {!shouldReduceMotion && FRAGMENTS.map((f, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute hidden lg:block font-mono text-2xl font-bold text-cyan-500/10 select-none pointer-events-none"
          style={{ top: f.top, left: f.left, right: f.right }}
          animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: f.dur, delay: f.delay, ease: 'easeInOut' }}
        >
          {f.text}
        </motion.span>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 empty-space-zone">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10 empty-space-zone">
          
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left flex-1 max-w-2xl mx-auto lg:mx-0 mt-4 lg:mt-0"
          >
            {/* Premium promo pill — a subtle, honest teaser for the discoverable
                System Overclock easter egg. No countdowns, deadlines, or fake
                urgency: it hints at a hidden perk and, once unlocked, reflects
                the real grant state. Reduced-motion safe (ping dot disabled). */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-6">
              <span
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap backdrop-blur-md transition-colors',
                  isOverclocked
                    ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200'
                    : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-cyan-500/40 hover:text-cyan-200'
                )}
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  {!shouldReduceMotion && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                <Zap size={13} className="text-cyan-300 shrink-0" fill={isOverclocked ? 'currentColor' : 'none'} />
                {isOverclocked
                  ? 'System Overclock engaged — grant live'
                  : 'Hidden System Overclock inside'}
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.08] text-balance">
              Take control of your <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600">
                  Future With Strike
                </span>
                {/* Soft bloom behind the gradient words for depth (decorative) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-2 h-4 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 blur-2xl"
                />
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Master DSA, System Design & AI with interactive coding environments, premium mentorship, and industry-grade projects.
            </motion.p>

            {/* Course-track chips — truthful catalog categories, add left-column presence */}
            <motion.ul variants={itemVariants} className="flex flex-wrap gap-2 justify-center lg:justify-start mb-9" aria-label="Course tracks">
              {STACK.map((s) => (
                <li
                  key={s}
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-300 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  {s}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Primary CTA — bright gradient, clearly the main action */}
              <Link
                to="/login"
                className="group relative overflow-hidden px-7 py-3.5 rounded-full text-base font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_8px_30px_rgba(6,182,212,0.35)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#08080a]"
              >
                {/* Sheen sweep on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative z-10 flex items-center gap-2">
                  Join Us
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              {/* Secondary CTA — glass outline, distinct weight; smooth-scrolls to Courses */}
              <a
                href="#courses"
                onClick={scrollToCourses}
                className="group px-7 py-3.5 rounded-full text-base font-semibold text-gray-200 flex items-center justify-center gap-2 bg-white/[0.04] border border-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-cyan-500/50 hover:text-cyan-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#08080a]"
              >
                <Compass size={18} className="text-cyan-400 transition-transform duration-500 group-hover:rotate-45" />
                Explore Courses
              </a>
            </motion.div>
          </motion.div>

          <HeroMascot />

        </div>

        <HeroCodePanel />
      </div>
    </div>
  );
};

export default Hero;
