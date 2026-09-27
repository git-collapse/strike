import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FolderGit2, Target, Rocket, Flame, Clock, CheckCircle2,
  ArrowRight, Circle, Layers, GitBranch,
} from 'lucide-react';

// "Track Your Progress / Grow With Strike" — a premium learner-dashboard preview
// mirroring the real strikes.in section. IMPORTANT: Strike has no user-tracking
// backend here, so EVERY figure below is clearly-labelled DEMO data illustrating
// what the dashboard shows — never presented as a live statistic (same honesty
// convention as the existing "Preview" tag and the hero code panel's "Static" tag).
// Real integration points are called out in the summary.

// Weekly learning activity — hours per day. `active: false` marks a rest day so
// the chart can visually distinguish active vs inactive days.
const WEEK = [
  { d: 'Mon', h: 2.0, active: true },
  { d: 'Tue', h: 3.5, active: true },
  { d: 'Wed', h: 1.0, active: true },
  { d: 'Thu', h: 4.0, active: true },
  { d: 'Fri', h: 2.5, active: true },
  { d: 'Sat', h: 0, active: false },
  { d: 'Sun', h: 3.0, active: true },
];
const WEEK_TOTAL = WEEK.reduce((s, w) => s + w.h, 0);
const WEEK_AVG = WEEK_TOTAL / WEEK.length;
const WEEK_MAX = Math.max(...WEEK.map((w) => w.h));

// Headline dashboard figures (demo).
const OVERALL = { percent: 68, milestonesDone: 17, milestonesTotal: 25, activeTracks: 3, streak: 6 };

// Overview stat tiles (demo).
const STATS = [
  { icon: Clock, label: 'Learning hours', value: '128', sub: 'across all tracks' },
  { icon: FolderGit2, label: 'Projects done', value: '4', sub: 'production-style' },
  { icon: CheckCircle2, label: 'Milestones', value: '17', sub: 'of 25 completed' },
  { icon: Flame, label: 'Current streak', value: '6', sub: 'days in a row' },
];

// Real, existing destinations only — the on-page Courses section (#courses) and
// Strike's live practice site. No fake per-project routes are invented.
const COURSES_ANCHOR = '#courses';
const STRIKE_PRACTICE = 'https://strikes.in/practice';

// Project-based learning (demo). Each links to a REAL destination so the CTA is
// meaningful navigation, not a dead/fake link.
const PROJECTS = [
  {
    icon: Layers,
    title: 'DSA Mastery Track',
    desc: 'Arrays to graphs, learned by building and solving — not throwaway exercises.',
    progress: 82, done: 9, total: 11, status: 'In progress', href: COURSES_ANCHOR,
  },
  {
    icon: GitBranch,
    title: 'Full-Stack Web App',
    desc: 'A MERN project taken from authentication all the way to a deployable build.',
    progress: 45, done: 5, total: 12, status: 'In progress', href: COURSES_ANCHOR,
  },
  {
    icon: Target,
    title: 'System Design Capstone',
    desc: 'Design, document and defend a scalable service as your portfolio centrepiece.',
    progress: 12, done: 1, total: 8, status: 'Just started', href: COURSES_ANCHOR,
  },
];

// Guided milestones (demo) — completed → current → upcoming.
const MILESTONES = [
  { title: 'Environment setup', desc: 'Toolchain, editor and repo ready to go.', state: 'done' as const },
  { title: 'Core fundamentals', desc: 'The building blocks for your first real project.', state: 'done' as const },
  { title: 'First project build', desc: 'Ship a working module end to end.', state: 'done' as const },
  { title: 'Advanced patterns', desc: 'Level up with production-grade techniques.', state: 'current' as const },
  { title: 'Capstone project', desc: 'Combine everything into one portfolio piece.', state: 'upcoming' as const },
  { title: 'Ship & deploy', desc: 'Take it live and share it with the world.', state: 'upcoming' as const },
];

// Small "Demo data" chip — reused so no figure is ever mistaken for a live stat.
const DemoBadge = ({ className = '' }: { className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Demo data
  </span>
);

// Animated circular progress ring (SVG). Honors reduced motion.
const ProgressRing = ({ percent, reduce }: { percent: number; reduce: boolean | null }) => {
  const R = 52;
  const C = 2 * Math.PI * R;
  const offset = C - (percent / 100) * C;
  return (
    <div className="relative w-[132px] h-[132px] shrink-0">
      <svg viewBox="0 0 132 132" className="w-full h-full -rotate-90">
        <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="66" cy="66" r={R} fill="none" stroke="url(#ring-grad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C}
          initial={reduce ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{percent}%</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Complete</span>
      </div>
    </div>
  );
};

// Shared entrance variant.
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

// Interactive weekly activity chart — hover/tap a bar for its hours, with a
// total + daily-average summary and an active/inactive-day distinction.
const WeeklyChart = ({ reduce }: { reduce: boolean | null }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
            <span className="text-sm font-bold text-white tracking-tight">Weekly Activity</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Learning hours, last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white tabular-nums leading-none">{WEEK_TOTAL.toFixed(1)}<span className="text-sm text-slate-500 font-bold">h</span></div>
          <div className="text-[11px] text-slate-500 mt-1">avg {WEEK_AVG.toFixed(1)}h/day</div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[180px] flex items-end justify-between gap-2 sm:gap-3">
        {WEEK.map((w, i) => {
          const pct = WEEK_MAX ? (w.h / WEEK_MAX) * 100 : 0;
          const isHover = hovered === i;
          return (
            <button
              key={w.d}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="group/bar relative flex-1 h-full flex flex-col justify-end items-center focus:outline-none"
              aria-label={`${w.d}: ${w.h} hours`}
            >
              {/* tooltip */}
              <div className={`pointer-events-none absolute -top-1 z-20 rounded-lg border border-white/10 bg-[#0d0d12] px-2 py-1 text-[11px] font-bold text-white shadow-lg transition-all duration-200 ${isHover ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'}`}>
                {w.h}h
              </div>
              <motion.div
                className={`w-full max-w-[42px] rounded-t-md border-t ${w.active ? 'bg-gradient-to-t from-cyan-600/30 to-cyan-400/80 border-cyan-300/40' : 'bg-white/[0.06] border-white/10'} ${isHover && w.active ? 'shadow-[0_0_18px_rgba(34,211,238,0.45)]' : ''}`}
                style={{ transformOrigin: 'bottom' }}
                initial={reduce ? { height: `${Math.max(pct, 4)}%` } : { height: 0 }}
                whileInView={{ height: `${Math.max(pct, 4)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: reduce ? 0 : i * 0.06 }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-3 mt-3">
        {WEEK.map((w, i) => (
          <span key={w.d} className={`flex-1 text-center text-[10px] font-mono uppercase tracking-wider transition-colors ${hovered === i ? 'text-cyan-400' : w.active ? 'text-slate-400' : 'text-slate-600'}`}>
            {w.d}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProgressTracker = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="progress">
      {/* subtle grid + cyan glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)',
        }}
      />

      <div className="relative">
        {/* HEADER */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Grow With Strike</h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">Track Your Progress</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-5">
            Turn your learning into measurable progress. Build projects, complete milestones, and track your growth.
          </p>
          <DemoBadge />
        </motion.div>

        {/* HERO PROGRESS CARD */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0b0f16] to-[#0a0a0c] p-6 sm:p-8 mb-6 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <ProgressRing percent={OVERALL.percent} reduce={reduce} />
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <h3 className="text-xl font-bold text-white tracking-tight">Your learning journey</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <Flame size={13} /> {OVERALL.streak}-day streak
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Milestones', value: `${OVERALL.milestonesDone}/${OVERALL.milestonesTotal}` },
                  { label: 'Active tracks', value: `${OVERALL.activeTracks}` },
                  { label: 'This week', value: `${WEEK_TOTAL.toFixed(0)}h` },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* OVERVIEW STAT TILES */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {STATS.map(({ icon: Icon, label, value, sub }) => (
            <motion.div
              key={label}
              variants={rise}
              className="group rounded-2xl border border-white/10 bg-[#0a0a0c] p-5 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <Icon size={18} className="text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{value}</div>
              <div className="text-sm font-bold text-white mt-1">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* WEEKLY ACTIVITY + CONSISTENCY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-7"
          >
            <WeeklyChart reduce={reduce} />
          </motion.div>
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="relative rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-7 overflow-hidden flex flex-col"
          >
            <div className="pointer-events-none absolute -bottom-10 -right-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative flex items-center gap-2 mb-4">
              <Flame size={18} className="text-emerald-400" />
              <span className="text-sm font-bold text-white tracking-tight">Consistency</span>
            </div>
            <div className="relative flex-1 flex flex-col justify-center">
              <div className="text-5xl font-extrabold text-white tabular-nums tracking-tight">{OVERALL.streak}<span className="text-lg text-slate-500 font-bold ml-1">days</span></div>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Longest active day this week hit <span className="text-emerald-300 font-semibold">{WEEK_MAX}h</span>. Keep the streak alive to compound your growth.
              </p>
            </div>
            <div className="relative mt-4 flex gap-1.5">
              {WEEK.map((w) => (
                <div key={w.d} className={`h-1.5 flex-1 rounded-full ${w.active ? 'bg-emerald-400/70' : 'bg-white/10'}`} title={`${w.d}: ${w.h}h`} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* PROJECT-BASED LEARNING */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-5">
            <FolderGit2 size={20} className="text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Project-based learning</h3>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {PROJECTS.map(({ icon: Icon, title, desc, progress, done, total, status, href }) => (
              <motion.div
                key={title}
                variants={rise}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Icon size={20} className="text-cyan-400" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{status}</span>
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight mb-1.5">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed flex-grow">{desc}</p>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-400">{done}/{total} milestones</span>
                    <span className="text-cyan-400 tabular-nums">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={reduce ? { width: `${progress}%` } : { width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>

                <a
                  href={href}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-sm font-bold text-cyan-300 transition-all hover:bg-cyan-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {progress > 0 ? 'Continue learning' : 'View project'}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* GUIDED MILESTONES TIMELINE */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center gap-2 mb-7">
            <Target size={20} className="text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Guided milestones</h3>
          </div>
          <ol className="relative">
            {MILESTONES.map((m, i) => {
              const isLast = i === MILESTONES.length - 1;
              const done = m.state === 'done';
              const current = m.state === 'current';
              return (
                <li key={m.title} className="relative flex gap-4 pb-7 last:pb-0">
                  {/* connector line */}
                  {!isLast && (
                    <span className={`absolute left-[15px] top-8 bottom-0 w-px ${done ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
                  )}
                  {/* node */}
                  <span className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                    done ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                    : current ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                    : 'bg-white/[0.03] border-white/10 text-slate-600'
                  }`}>
                    {done ? <CheckCircle2 size={16} /> : <Circle size={current ? 10 : 8} className={current ? 'fill-cyan-400 text-cyan-400' : ''} />}
                    {current && <span className="absolute inset-0 rounded-full border border-cyan-400/60 animate-ping" />}
                  </span>
                  {/* content */}
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-bold tracking-tight ${done || current ? 'text-white' : 'text-slate-400'}`}>{m.title}</h4>
                      {current && <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300">In progress</span>}
                      {done && <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Completed</span>}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{m.desc}</p>
                    {current && (
                      <a href={COURSES_ANCHOR} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                        Continue to next step <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>

        {/* SHIP & DEPLOY */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.07] via-[#0a0a0c] to-[#0a0a0c] p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="shrink-0">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/30">
                <Rocket size={26} className="text-cyan-300" />
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-xl font-bold text-white tracking-tight">Ship &amp; deploy</h3>
                <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Final phase
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                The last milestone in your track. Complete the capstone to unlock your deploy step —
                push your project live and share it with the world.
              </p>
              {/* honest completion indicator — derived from milestone data, no invented deploy status */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 max-w-xs rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${OVERALL.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 tabular-nums">{OVERALL.percent}% to launch</span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              <a
                href={COURSES_ANCHOR}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-black hover:from-cyan-300 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-[0.98]"
              >
                Continue building <ArrowRight size={16} />
              </a>
              <a
                href={STRIKE_PRACTICE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-gray-300 hover:text-white hover:border-white/20 transition-colors"
              >
                <GitBranch size={16} /> Practice arena
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgressTracker;
