import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
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
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
              Take control of your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Future With Strike</span>
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
              <Link to="/login" className="px-6 py-2 sm:px-8 sm:py-3.5 rounded-full text-white font-medium cursor-pointer text-base bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/40 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white">
                Join Us
              </Link>
              <a href="#courses" className="px-6 py-2 sm:px-8 sm:py-3.5 rounded-full text-gray-300 font-medium text-base bg-transparent border border-white/10 transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400">
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
