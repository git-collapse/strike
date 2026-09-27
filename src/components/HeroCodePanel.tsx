import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Loader2, Sparkles, Bug, CheckCircle2, FileCode2, Terminal, Search, GitBranch, Boxes, Settings, Zap } from 'lucide-react';

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

// Decorative VS Code-style activity rail. Non-interactive chrome (aria-hidden) —
// it sets the IDE mood without pretending to be a working control.
const RAIL = [FileCode2, Search, GitBranch, Boxes];

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

  const outContainer = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.14, delayChildren: 0.05 } } };
  const outLine = { hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -6 }, show: { opacity: 1, x: 0, transition: { duration: 0.25 } } };

  return (
    <motion.div
      className="mt-20 max-w-6xl mx-auto px-1"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Section heading */}
      <div className="text-center mb-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400/80">Signature Feature</p>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your AI-Powered Coding Workspace</h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b0b0f] overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.08)] transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(6,182,212,0.16)]">
        {/* Window title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-gradient-to-r from-[#0e0e13] to-[#0b0b0f]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            <Terminal size={13} className="text-cyan-400" /> Strike Playground
          </div>
          <span className="ml-auto text-[10px] font-mono text-slate-500 hidden sm:inline">interactive demo</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3.25rem_1.4fr_1fr]">
          {/* Activity rail (decorative IDE chrome) */}
          <div aria-hidden="true" className="hidden lg:flex flex-col items-center gap-5 py-4 bg-[#0e0e13] border-r border-white/10">
            <Zap size={18} className="text-cyan-400" fill="currentColor" />
            {RAIL.map((Icon, i) => (
              <span key={i} className="relative">
                {i === 0 && <span className="absolute -left-4 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-cyan-400" />}
                <Icon size={18} className={i === 0 ? 'text-white' : 'text-slate-500'} />
              </span>
            ))}
            <Settings size={18} className="text-slate-500 mt-auto" />
          </div>

          {/* Editor pane */}
          <div className="border-b lg:border-b-0 lg:border-r border-white/10 min-w-0">
            <div className="flex items-stretch border-b border-white/10 bg-[#0e0e13]">
              <div className="flex items-center gap-2 px-4 py-2.5 text-xs text-white bg-[#0b0b0f] border-r border-white/10 border-t-2 border-t-cyan-400">
                <FileCode2 size={13} className="text-cyan-400" /> strike.js
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
              </div>
              <div aria-hidden="true" className="flex items-center px-4 text-xs text-slate-600 font-mono select-none">welcome.demo</div>
            </div>
            <pre className="font-mono text-[12.5px] sm:text-[13px] leading-6 p-4 overflow-x-auto text-slate-300">
              {CODE.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-7 shrink-0 text-right pr-3 text-slate-600 select-none">{line[0].t === '' ? '' : i + 1}</span>
                  <span className="whitespace-pre">{line.map((tok, j) => <span key={j} className={tok.c}>{tok.t}</span>)}</span>
                </div>
              ))}
              <div className="flex" aria-hidden="true">
                <span className="w-7 shrink-0" />
                <span className={`inline-block w-[7px] h-[15px] translate-y-0.5 bg-cyan-400/80 ${reduce ? '' : 'animate-pulse'}`} />
              </div>
            </pre>
            <AnimatePresence>
              {phase !== 'ready' && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="border-t border-white/10 bg-black/50 px-4 py-3 font-mono text-[12.5px] leading-6 overflow-hidden"
                >
                  {phase === 'running' ? (
                    <div className="text-amber-400 flex items-center gap-2">
                      <Loader2 size={13} className="animate-spin" /> executing strike.js
                      <span className="inline-flex gap-0.5">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse [animation-delay:150ms]">.</span>
                        <span className="animate-pulse [animation-delay:300ms]">.</span>
                      </span>
                    </div>
                  ) : (
                    <motion.div variants={outContainer} initial="hidden" animate="show">
                      {OUTPUT.map((o) => (
                        <motion.div key={o} variants={outLine} className="text-slate-300">
                          <span className="text-cyan-500">&gt;</span> {o}
                        </motion.div>
                      ))}
                      <motion.div variants={outLine} className="text-emerald-400 flex items-center gap-1.5 mt-1">
                        <CheckCircle2 size={14} /> {'{ status: "success" }'}
                        <span className={`inline-block w-[7px] h-[14px] bg-emerald-400/70 ml-0.5 ${reduce ? '' : 'animate-pulse'}`} aria-hidden="true" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-3 px-4 py-1.5 border-t border-white/10 bg-[#0e0e13] text-[10.5px] font-mono text-slate-500">
              <span className="text-cyan-400/80">JavaScript</span>
              <span className="hidden sm:inline">UTF-8</span>
              <span className="hidden sm:inline">Spaces: 2</span>
              <span className="ml-auto">Ln 12, Col 4</span>
            </div>
          </div>

          {/* AI Assistant pane */}
          <div className="flex flex-col bg-[#0a0a0e] min-w-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${phase === 'running' ? 'text-amber-400' : 'text-emerald-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${phase === 'running' && !reduce ? 'animate-pulse' : ''}`} /> {phase === 'running' ? 'Running' : phase === 'done' ? 'Done' : 'Ready'}
              </span>
              <motion.button onClick={runCode} whileTap={reduce ? undefined : { scale: 0.95 }} aria-label="Run code" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-400 hover:to-blue-500 border border-cyan-400/30 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(6,182,212,0.25)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400">
                {phase === 'running' ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />} Run Code
              </motion.button>
            </div>
            <div className="flex items-center gap-1 px-3 pt-3">
              <button onClick={() => setTab('ai')} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === 'ai' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Sparkles size={14} className="text-cyan-400" /> AI Assistant</button>
              <button onClick={() => setTab('bugs')} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === 'bugs' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}><Bug size={14} className="text-fuchsia-400" /> Bug Shots</button>
              <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-slate-500 border border-white/10 rounded-full px-2 py-0.5" title="Sample suggestions — not a live model">Sample</span>
            </div>
            <div className="p-3 flex-1">
              {tab === 'ai' ? (
                <>
                  <p className="text-[11px] uppercase tracking-widest text-slate-500 px-1 mb-2">Quick Suggestions</p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <div key={s.title} className="group rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] transition-colors">
                        <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <Sparkles size={12} className="text-cyan-400/70 shrink-0" /> {s.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-widest text-slate-500 px-1 mb-2">Detected Issues</p>
                  <div className="flex flex-col gap-2">
                    {BUGS.map((b) => (
                      <div key={b} className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                        <Bug size={14} className="text-fuchsia-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 leading-relaxed">{b}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
};

export default HeroCodePanel;
