import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { Zap, ArrowRight, Compass } from 'lucide-react';
import { useOverclock } from '../context/OverclockContext';
import { HeroMascot } from './HeroMascot';
import HeroCodePanel from './HeroCodePanel';

// Real Strike course tracks — truthful catalog categories, not invented stats.
const STACK = ['DSA', 'System Design', 'GenAI', 'DevOps', 'Web Dev'];

// Decorative code tokens that drift in the hero margins (cosmetic, aria-hidden).
const FRAGMENTS = [
  { text: '{ }', top: '16%', left: '4%', delay: 0, dur: 9 },
  { text: '=>', top: '68%', left: '8%', delay: 1.5, dur: 11 },
  { text: '</>', top: '30%', right: '5%', delay: 0.8, dur: 10 },
];

// Headline composed line-by-line so each row reveals on its own, editorial-style.
const HEADLINE = [
  { text: 'Take control', gradient: false },
  { text: 'of your Future', gradient: false },
  { text: 'With Strike', gradient: true },
];

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const { isOverclocked } = useOverclock();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  // Each headline line slides up out of an overflow-clipped row (curtain reveal).
  const lineVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
      };

  // Smooth-scroll to Courses. A bare `#courses` hash is unreliable because the
  // global `overflow-x: hidden` on <body> makes it a scroll container; we drive
  // window.scrollTo with the navbar offset (same pattern as the Navbar), and
  // keep the href as a fallback so the link still works without JS.
  const scrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('courses');
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: Math.max(top, 0), behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div id="home" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#08080a] empty-space-zone">
      {/* ===== Layered futuristic background ===== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59,130,246,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.045) 1px, transparent 1px)`,
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(ellipse at 62% 28%, black 5%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 62% 28%, black 5%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.10), transparent 60%)' }}
      />
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[6%] w-[26rem] h-[26rem] bg-blue-600/12 rounded-full blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="absolute left-0 right-0 top-[64%] h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none hidden lg:block" />

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-center gap-14 lg:gap-8">

          {/* ===== LEFT: editorial headline column ===== */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/90">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Developer Platform
              </span>
              <span
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold whitespace-nowrap backdrop-blur-md transition-colors',
                  isOverclocked
                    ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200'
                    : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-cyan-500/40 hover:text-cyan-200'
                )}
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  {!shouldReduceMotion && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                <Zap size={12} className="text-cyan-300 shrink-0" fill={isOverclocked ? 'currentColor' : 'none'} />
                {isOverclocked ? 'System Overclock engaged' : 'Hidden System Overclock inside'}
              </span>
            </motion.div>

            {/* Oversized, line-by-line display headline */}
            <h1 className="font-extrabold tracking-tight leading-[1.02] text-white mb-6">
              {HEADLINE.map((ln, i) => (
                <span key={i} className="block overflow-hidden py-0.5">
                  <motion.span
                    variants={lineVariants}
                    className={clsx(
                      'block text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5rem]',
                      ln.gradient && 'relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600'
                    )}
                  >
                    {ln.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-400 mb-7 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Master DSA, System Design & AI with interactive coding environments, premium mentorship, and industry-grade projects.
            </motion.p>

            <motion.ul variants={itemVariants} className="flex flex-wrap gap-2 justify-center lg:justify-start mb-9" aria-label="Course tracks">
              {STACK.map((s) => (
                <li key={s} className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-300 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full transition-colors hover:border-cyan-500/40 hover:text-cyan-300">
                  {s}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/login"
                className="group relative overflow-hidden px-7 py-3.5 rounded-full text-base font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_8px_30px_rgba(6,182,212,0.35)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#08080a]"
              >
                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-2">
                  Join Us
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
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

          {/* ===== RIGHT: holographic robot stage ===== */}
          <div className="relative flex items-center justify-center mt-6 lg:mt-0">
            {/* Orbiting rings behind the mascot (desktop; reduced-motion safe) */}
            <div aria-hidden="true" className="absolute hidden sm:block w-[112%] max-w-[540px] aspect-square rounded-full border border-dashed border-cyan-400/15">
              {!shouldReduceMotion && (
                <motion.div className="absolute inset-0 rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}>
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                </motion.div>
              )}
            </div>
            <motion.div
              aria-hidden="true"
              className="absolute hidden sm:block w-[86%] max-w-[440px] aspect-square rounded-full border border-cyan-400/10"
              animate={shouldReduceMotion ? undefined : { rotate: -360 }}
              transition={shouldReduceMotion ? undefined : { repeat: Infinity, duration: 90, ease: 'linear' }}
            />

            {/* Holo frame with corner brackets + HUD readouts */}
            <div className="relative w-full max-w-md">
              {['top-0 left-0 border-t-2 border-l-2 rounded-tl-xl', 'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl', 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl', 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl'].map((c) => (
                <span key={c} aria-hidden="true" className={clsx('absolute w-9 h-9 sm:w-11 sm:h-11 border-cyan-400/40 pointer-events-none z-30', c)} />
              ))}

              <div aria-hidden="true" className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-cyan-300 whitespace-nowrap">
                <span className={clsx('w-1.5 h-1.5 rounded-full bg-emerald-400', !shouldReduceMotion && 'animate-pulse')} /> Volt // Online
              </div>

              <HeroMascot />

              <div aria-hidden="true" className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 backdrop-blur px-3 py-1.5 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                <span className="text-cyan-400">tracks</span> DSA · SYS · GENAI · DEVOPS
              </div>
            </div>
          </div>


        </div>

        <HeroCodePanel />
      </div>

    </div>
  );
};

export default Hero;
