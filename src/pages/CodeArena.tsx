import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Play, RotateCcw, Copy, Check, Maximize2, Minimize2, Plus, Minus,
  Terminal, Sparkles, Clock, AlertTriangle, Loader2, Info, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/codearena/CodeEditor';
import { useJsRunner, type LogLine } from '../hooks/useJsRunner';

// ===== Supported languages =====
// Only JavaScript actually executes (real, sandboxed Web Worker — see
// useJsRunner). The others are honest editor-only: syntax entry with no
// execution, because this build has no server-side runtime. This is surfaced
// in the UI, never faked.
type LangId = 'javascript' | 'python' | 'cpp' | 'java';
interface Lang { id: LangId; label: string; runnable: boolean; sample: string; }

const LANGS: Lang[] = [
  {
    id: 'javascript', label: 'JavaScript', runnable: true,
    sample: `// Real execution — this runs in a sandboxed Web Worker.
// Try editing, then press Run (Ctrl/Cmd + Enter).

function fib(n) {
  let [a, b] = [0, 1];
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

const seq = Array.from({ length: 10 }, (_, i) => fib(i));
console.log('Fibonacci:', seq.join(', '));
console.info('10th term =', fib(10));
`,
  },
  { id: 'python', label: 'Python', runnable: false, sample: `# Editor-only preview — Python isn't executed in this build.\nprint("Hello from STRIKE CodeArena")\n` },
  { id: 'cpp', label: 'C++', runnable: false, sample: `// Editor-only preview — C++ isn't executed in this build.\n#include <iostream>\nint main() { std::cout << "Hello"; }\n` },
  { id: 'java', label: 'Java', runnable: false, sample: `// Editor-only preview — Java isn't executed in this build.\nclass Main { public static void main(String[] a){ System.out.println("Hello"); } }\n` },
];

const FONT_MIN = 12, FONT_MAX = 22, FONT_DEFAULT = 14;
const LS_KEY = 'codearena:v1';

// Honest, static client-side snippets. NOT AI — no model, no network. Clicking
// "Insert" performs a real editor edit (appends the template), which is why it's
// truthful to offer while an AI backend does not exist.
const SNIPPETS: { id: string; label: string; desc: string; code: string }[] = [
  { id: 'log', label: 'Console log', desc: 'Print a value to the output', code: `console.log('value:', 42);\n` },
  { id: 'loop', label: 'For loop', desc: 'Iterate a fixed number of times', code: `for (let i = 0; i < 5; i++) {\n  console.log('i =', i);\n}\n` },
  { id: 'fn', label: 'Function', desc: 'Reusable function scaffold', code: `function greet(name) {\n  return 'Hello, ' + name;\n}\nconsole.log(greet('STRIKE'));\n` },
  { id: 'map', label: 'Array map/filter', desc: 'Transform a collection', code: `const nums = [1, 2, 3, 4, 5];\nconst evens = nums.filter((n) => n % 2 === 0);\nconsole.log('evens:', evens);\n` },
  { id: 'async', label: 'Async / await', desc: 'Awaited promise (return it to capture logs)', code: `async function main() {\n  const wait = (ms) => new Promise((r) => setTimeout(r, ms));\n  await wait(50);\n  console.log('done waiting');\n}\nreturn main();\n` },
];

interface Persisted { lang: LangId; code: Record<string, string>; fontSize: number; }

const loadPersisted = (): Persisted => {
  const fallback: Persisted = { lang: 'javascript', code: {}, fontSize: FONT_DEFAULT };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<Persisted>;
    return {
      lang: LANGS.some((l) => l.id === p.lang) ? (p.lang as LangId) : 'javascript',
      code: p.code && typeof p.code === 'object' ? p.code : {},
      fontSize: typeof p.fontSize === 'number' ? Math.min(FONT_MAX, Math.max(FONT_MIN, p.fontSize)) : FONT_DEFAULT,
    };
  } catch {
    return fallback;
  }
};

const logColor: Record<LogLine['type'], string> = {
  log: 'text-slate-200',
  info: 'text-cyan-300',
  warn: 'text-amber-300',
  error: 'text-rose-400',
};

const CodeArena = () => {
  const reduce = useReducedMotion();
  const initial = useMemo(loadPersisted, []);
  const [langId, setLangId] = useState<LangId>(initial.lang);
  const [codeMap, setCodeMap] = useState<Record<string, string>>(initial.code);
  const [fontSize, setFontSize] = useState(initial.fontSize);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [split, setSplit] = useState(58); // editor width %
  const shellRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const { status, logs, error, ms, run, reset } = useJsRunner();
  const lang = LANGS.find((l) => l.id === langId)!;
  const code = codeMap[langId] ?? lang.sample;

  const setCode = useCallback((v: string) => {
    setCodeMap((prev) => ({ ...prev, [langId]: v }));
  }, [langId]);

  // Persist prefs + per-language code.
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ lang: langId, code: codeMap, fontSize })); } catch { /* quota / private mode */ }
    }, 300);
    return () => clearTimeout(t);
  }, [langId, codeMap, fontSize]);

  const doRun = useCallback(() => { if (lang.runnable) run(code); }, [lang.runnable, run, code]);

  const doReset = useCallback(() => {
    setCodeMap((prev) => ({ ...prev, [langId]: lang.sample }));
    reset();
  }, [langId, lang.sample, reset]);

  const doCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }, [code]);

  const insertSnippet = useCallback((snippet: string) => {
    setCode((code ? code.replace(/\n?$/, '\n') : '') + snippet);
  }, [code, setCode]);

  // Global shortcuts: Ctrl/Cmd+Enter run, Esc exit fullscreen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); doRun(); }
      else if (e.key === 'Escape' && fullscreen) setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doRun, fullscreen]);

  // Draggable split divider.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !shellRef.current) return;
      const r = shellRef.current.getBoundingClientRect();
      const pct = ((e.clientX - r.left) / r.width) * 100;
      setSplit(Math.min(78, Math.max(30, pct)));
    };
    const onUp = () => { draggingRef.current = false; document.body.style.cursor = ''; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, []);

  const running = status === 'running';

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-[200]' : 'relative min-h-screen pt-20'} flex flex-col bg-black text-white`}>
      {!fullscreen && <Navbar />}
      {/* ===== Toolbar ===== */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#0b0b0f] px-4 py-3">
        <div className="flex items-center gap-2 pr-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-black"><Terminal size={16} /></span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold tracking-tight">CodeArena</p>
            <p className="text-[10px] text-slate-500">In-browser IDE</p>
          </div>
        </div>

        {/* Language selector */}
        <label className="sr-only" htmlFor="ca-lang">Language</label>
        <select
          id="ca-lang"
          value={langId}
          onChange={(e) => { setLangId(e.target.value as LangId); reset(); }}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        >
          {LANGS.map((l) => (
            <option key={l.id} value={l.id} className="bg-[#111]">{l.label}{l.runnable ? '' : ' (editor-only)'}</option>
          ))}
        </select>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* Font size */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-1">
            <button type="button" onClick={() => setFontSize((f) => Math.max(FONT_MIN, f - 1))} aria-label="Decrease font size" className="rounded p-1.5 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"><Minus size={14} /></button>
            <span className="w-8 text-center text-xs tabular-nums text-slate-400">{fontSize}px</span>
            <button type="button" onClick={() => setFontSize((f) => Math.min(FONT_MAX, f + 1))} aria-label="Increase font size" className="rounded p-1.5 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"><Plus size={14} /></button>
          </div>

          <button type="button" onClick={doCopy} title="Copy code" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" onClick={doReset} title="Reset to sample" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            <RotateCcw size={14} /> Reset
          </button>
          <button type="button" onClick={() => setFullscreen((v) => !v)} title={fullscreen ? 'Exit full screen (Esc)' : 'Full screen'} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            type="button"
            onClick={doRun}
            disabled={!lang.runnable || running}
            title={lang.runnable ? 'Run (Ctrl/Cmd + Enter)' : 'This language is editor-only'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-bold text-white transition-all hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run
          </button>
        </div>
      </div>

      {/* ===== Workspace ===== */}
      <div ref={shellRef} className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Editor pane */}
        <div className="min-h-[300px] flex-1 lg:min-h-0" style={{ flexBasis: `${split}%` }}>
          <CodeEditor value={code} onChange={setCode} language={langId} fontSize={fontSize} />
        </div>

        {/* Divider (drag to resize on lg+) */}
        <div
          onPointerDown={() => { draggingRef.current = true; document.body.style.cursor = 'col-resize'; }}
          className="hidden w-1.5 shrink-0 cursor-col-resize bg-white/5 transition-colors hover:bg-cyan-500/40 lg:block"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        />

        {/* Output + assistant pane */}
        <div className="flex min-h-[280px] min-w-0 flex-1 flex-col border-t border-white/10 lg:min-h-0 lg:border-l lg:border-t-0" style={{ flexBasis: `${100 - split}%` }}>
          {/* Output */}
          <div className="flex min-h-0 flex-1 flex-col bg-[#0b0b0f]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Terminal size={13} /> Output
              {status === 'done' && ms != null && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400"><Clock size={10} /> {ms} ms</span>
              )}
              {status === 'error' && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400"><AlertTriangle size={10} /> Error</span>
              )}
              {running && (
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400"><Loader2 size={10} className="animate-spin" /> Running…</span>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
              {!lang.runnable ? (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3 text-amber-200">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <p><span className="font-semibold">{lang.label} is editor-only.</span> This build has no server runtime, so only JavaScript executes (in a sandboxed in-browser Web Worker). Switch to JavaScript to run code.</p>
                </div>
              ) : status === 'idle' ? (
                <p className="text-slate-600">Press <span className="text-slate-400">Run</span> (or Ctrl/Cmd + Enter) to execute. Output, errors and timing appear here.</p>
              ) : running ? (
                <p className="text-cyan-400/80">Executing in sandboxed worker…</p>
              ) : (
                <>
                  {logs.map((l, i) => (
                    <div key={i} className={`whitespace-pre-wrap ${logColor[l.type]}`}>
                      <span className="select-none text-slate-700">{l.type === 'error' ? '✕ ' : l.type === 'warn' ? '⚠ ' : '› '}</span>{l.text}
                    </div>
                  ))}
                  {error && (
                    <div className="mt-2 whitespace-pre-wrap rounded-lg border border-rose-500/20 bg-rose-500/[0.06] p-2 text-rose-300">{error}</div>
                  )}
                  {status === 'done' && logs.length === 0 && !error && (
                    <p className="text-slate-600">Program finished with no console output.</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Assistant / snippets — honest static templates, not AI */}
          <div className="border-t border-white/10 bg-[#0c0c11]">
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles size={13} className="text-cyan-400" /> Snippets
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-medium normal-case tracking-normal text-slate-500">static templates · not AI</span>
            </div>
            <div className="max-h-40 overflow-auto px-3 pb-3">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {SNIPPETS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => insertSnippet(s.code)}
                    disabled={!lang.runnable}
                    title={lang.runnable ? `Insert: ${s.desc}` : 'Switch to JavaScript to insert'}
                    className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2 text-left transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={13} className="shrink-0 text-cyan-400" />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-200">{s.label}</span>
                      <span className="block truncate text-[10px] text-slate-500">{s.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Honest footer note */}
      <AnimatePresence>
        {!fullscreen && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#0b0b0f] px-4 py-2 text-[11px] text-slate-500"
          >
            <span>JavaScript runs locally in a sandboxed Web Worker — nothing is sent to a server.</span>
            <Link to="/" className="shrink-0 font-semibold text-cyan-400 hover:text-cyan-300">← Home</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeArena;
