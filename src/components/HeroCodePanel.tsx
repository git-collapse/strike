import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Loader2, Sparkles, Bug, CheckCircle2 } from 'lucide-react';

type Tok = { t: string; c?: string };

// Code sample, tab labels, and Quick Suggestions are transcribed from the
// strikes.in hero screenshots. "Run Code" simulates the sample's console output.
const CODE: Tok[][] = [
  [{ t: '// Strike Platform - Welcome Code', c: 'text-emerald-400/80' }],
  [{ t: 'const ', c: 'text-purple-400' }, { t: 'welcome', c: 'text-cyan-300' }, { t: ' = ' }, { t: 'async', c: 'text-purple-400' }, { t: ' () => {' }],
  [{ t: '  const ', c: 'text-purple-400' }, { t: 'user', c: 'text-cyan-300' }, { t: ' = ' }, { t: 'await', c: 'text-purple-400' }, { t: ' getUser();' }],
  [{ t: '  console.log(', c: 'text-slate-300' }, { t: '`Welcome ${user.name}!`', c: 'text-amber-300' }, { t: ');', c: 'text-slate-300' }],
  [{ t: '  console.log(', c: 'text-slate-300' }, { t: '`Level: ${user.level}`', c: 'text-amber-300' }, { t: ');', c: 'text-slate-300' }],
  [{ t: '  return', c: 'text-purple-400' }, { t: ' { status: ', c: 'text-slate-300' }, { t: '"success"', c: 'text-amber-300' }, { t: ' };', c: 'text-slate-300' }],
  [{ t: '};', c: 'text-slate-300' }],
  [{ t: '' }],
  [{ t: 'const ', c: 'text-purple-400' }, { t: 'getUser', c: 'text-cyan-300' }, { t: ' = ' }, { t: 'async', c: 'text-purple-400' }, { t: ' () => ({' }],
  [{ t: '  name: ', c: 'text-slate-300' }, { t: '"Guest User"', c: 'text-amber-300' }, { t: ',', c: 'text-slate-300' }],
  [{ t: '  level: ', c: 'text-slate-300' }, { t: '"Beginner"', c: 'text-amber-300' }],
  [{ t: '});', c: 'text-slate-300' }],
];

const SUGGESTIONS = [
  { title: 'Refactor welcome()', desc: 'Extract user fetch and logging into separate utils for better testability.' },
  { title: 'Add input validation', desc: 'Validate user.level against enum: Beginner | Advanced | Expert.' },
  { title: 'Improve typing', desc: 'Define User type and return type for getUser and welcome functions.' },
  { title: 'Implement error handling', desc: 'Wrap the awaited getUser() call in try/catch and surface failures.' },
];

const BUGS = [
  'getUser() has no error handling for network failures.',
  'user is implicitly typed as any — add a User interface.',
  'console.log statements left inside welcome().',
];

const OUTPUT = ['Welcome Guest User!', 'Level: Beginner'];

const HeroCodePanel = () => {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<'ai' | 'bugs'>('ai');
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');

  const runCode = () => {
    if (phase === 'running') return;
    setPhase('running');
    if (reduce) { setPhase('done'); return; }
    setTimeout(() => setPhase('done'), 650);
  };

  return (
    <motion.div
      className="mt-16 max-w-6xl mx-auto px-1"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="grid lg:grid-cols-[1.4fr_1fr] rounded-2xl border border-white/10 bg-[#0b0b0f] overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.08)]">
        {/* Editor pane */}
        <div className="border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0e0e13]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 rounded-md px-2.5 py-1">
              <span className="text-cyan-400 font-mono">&lt;/&gt;</span> strike.js
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
          </div>
          <pre className="font-mono text-[12.5px] sm:text-[13px] leading-6 p-4 overflow-x-auto text-slate-300">
            {CODE.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-7 shrink-0 text-right pr-3 text-slate-600 select-none">{line[0].t === '' ? '' : i + 1}</span>
                <span className="whitespace-pre">{line.map((tok, j) => <span key={j} className={tok.c}>{tok.t}</span>)}</span>
              </div>
            ))}
          </pre>
          <AnimatePresence>
            {phase === 'done' && (
              <motion.div
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reduce ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="border-t border-white/10 bg-black/50 px-4 py-3 font-mono text-[12.5px] leading-6 overflow-hidden"
              >
                {OUTPUT.map((o) => (
                  <div key={o} className="text-slate-300"><span className="text-cyan-500">&gt;</span> {o}</div>
                ))}
                <div className="text-emerald-400 flex items-center gap-1.5 mt-1"><CheckCircle2 size={14} /> {'{ status: "success" }'}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* AI Assistant pane */}
        <div className="flex flex-col bg-[#0a0a0e]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${phase === 'running' ? 'text-amber-400' : 'text-emerald-400'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" /> {phase === 'running' ? 'Running' : phase === 'done' ? 'Done' : 'Ready'}
            </span>
            <motion.button onClick={runCode} whileTap={reduce ? undefined : { scale: 0.95 }} aria-label="Run code" className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {phase === 'running' ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} className="text-cyan-400" />} Run Code
            </motion.button>
          </div>
          <div className="flex items-center gap-1 px-3 pt-3">
            <button onClick={() => setTab('ai')} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === 'ai' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Sparkles size={14} className="text-cyan-400" /> AI Assistant</button>
            <button onClick={() => setTab('bugs')} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === 'bugs' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Bug size={14} className="text-fuchsia-400" /> Bug Shots</button>
            <span className="ml-auto text-[10px] uppercase tracking-widest text-slate-500 pr-1">Static</span>
          </div>
          <div className="p-3 flex-1">
            {tab === 'ai' ? (
              <>
                <p className="text-[11px] uppercase tracking-widest text-slate-500 px-1 mb-2">Quick Suggestions</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <div key={s.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:border-cyan-500/30 transition-colors">
                      <p className="text-sm font-semibold text-white">{s.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {BUGS.map((b) => (
                  <div key={b} className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <Bug size={14} className="text-fuchsia-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroCodePanel;
