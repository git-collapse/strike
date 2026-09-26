import { motion, useReducedMotion } from 'framer-motion';
import { FolderGit2, Target, Rocket, Flame } from 'lucide-react';

// "Track Your Progress / Grow With Strike" — mirrors the real strikes.in section
// (animated green streak line + Mon–Sun activity bars). The chart is an
// ILLUSTRATIVE product-feature preview of the learner dashboard, not real user
// data or a platform statistic — it is explicitly labelled "Preview" so it
// reads as a UI demo (same convention as the hero code panel's "Static" tag).
const WEEK = [
  { d: 'Mon', v: 42 },
  { d: 'Tue', v: 68 },
  { d: 'Wed', v: 54 },
  { d: 'Thu', v: 86 },
  { d: 'Fri', v: 61 },
  { d: 'Sat', v: 95 },
  { d: 'Sun', v: 73 },
];

// Project-based-learning pillars — truthful descriptions of how Strike tracks
// teach (build → milestones → ship), not invented metrics.
const PILLARS = [
  { icon: FolderGit2, title: 'Project-Based Learning', desc: 'Build real, production-style projects module by module — not throwaway exercises.' },
  { icon: Target, title: 'Guided Milestones', desc: 'Every track breaks into clear checkpoints, so you always know the next step.' },
  { icon: Rocket, title: 'Ship & Deploy', desc: 'Take work all the way to deployment and a portfolio you can actually show.' },
];

// Build a smooth-ish polyline path across the chart in a 100×100 viewBox so it
// overlays the bars (bar height = value%, so the line's y = 100 − value).
const LINE_PATH = WEEK.map((w, i) => {
  const x = (i / (WEEK.length - 1)) * 100;
  const y = 100 - w.v;
  return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ');

const ProgressTracker = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="progress">
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Grow With Strike</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Track Your Progress</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Learn by building. Strike turns every track into hands-on projects with clear milestones —
          and a dashboard that keeps your momentum visible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {/* LEFT — project-based learning pillars */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-4"
        >
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } } }}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0a0a0c] p-5 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Icon size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT — weekly activity dashboard preview */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-7 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              <span className="text-sm font-bold text-white tracking-tight">Weekly Activity</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Preview</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-6">
            <Flame size={14} /> Consistency streak
          </div>

          {/* Chart: animated bars with an overlaid streak line */}
          <div className="relative flex-1 min-h-[200px]">
            <div className="relative h-48 flex items-end justify-between gap-2 sm:gap-3">
              {/* Streak line overlay (drawn on scroll into view) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="streak-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={LINE_PATH}
                  fill="none"
                  stroke="url(#streak-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 }}
                />
              </svg>

              {WEEK.map((w, i) => (
                <div key={w.d} className="relative flex-1 h-full flex items-end">
                  <motion.div
                    className="w-full rounded-t-md bg-gradient-to-t from-cyan-600/30 to-cyan-400/80 border-t border-cyan-300/40"
                    style={{ transformOrigin: 'bottom' }}
                    initial={reduce ? { height: `${w.v}%` } : { height: 0 }}
                    whileInView={{ height: `${w.v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: reduce ? 0 : i * 0.07 }}
                  />
                </div>
              ))}
            </div>
            {/* Day labels */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 mt-3">
              {WEEK.map((w) => (
                <span key={w.d} className="flex-1 text-center text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  {w.d}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-5 leading-relaxed">
            Illustrative preview of your Strike learner dashboard.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgressTracker;
