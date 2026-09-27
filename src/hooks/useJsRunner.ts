import { useCallback, useEffect, useRef, useState } from 'react';

// Real, sandboxed JavaScript execution for CodeArena. Code runs inside a Web
// Worker (its own global scope, no DOM, no access to the page), console output
// is captured, and a hard timeout terminates runaway/infinite loops. Nothing is
// sent over the network — execution is entirely in-browser. Only synchronous
// code and returned promises are awaited; logs emitted from stray async
// callbacks after completion are not captured (documented limitation).

export type LogLine = { type: 'log' | 'error' | 'warn' | 'info'; text: string };
export type RunStatus = 'idle' | 'running' | 'done' | 'error';

export interface RunState {
  status: RunStatus;
  logs: LogLine[];
  error: string | null;
  ms: number | null;
}

const TIMEOUT_MS = 3000;

// Worker body as a string so it can be spun up from a Blob URL (no separate file
// or bundler worker plumbing needed).
const WORKER_SRC = `
self.onmessage = (e) => {
  const logs = [];
  const fmt = (args) => args.map((a) => {
    if (typeof a === 'string') return a;
    try { return JSON.stringify(a); } catch { return String(a); }
  }).join(' ');
  const sandboxConsole = {
    log: (...a) => logs.push({ type: 'log', text: fmt(a) }),
    info: (...a) => logs.push({ type: 'info', text: fmt(a) }),
    warn: (...a) => logs.push({ type: 'warn', text: fmt(a) }),
    error: (...a) => logs.push({ type: 'error', text: fmt(a) }),
  };
  const start = performance.now();
  const done = (patch) => self.postMessage({ logs, ms: performance.now() - start, ...patch });
  try {
    const fn = new Function('console', e.data.code + '\\n//# sourceURL=codearena-user.js');
    Promise.resolve(fn(sandboxConsole))
      .then(() => done({ ok: true, error: null }))
      .catch((err) => done({ ok: false, error: String((err && err.stack) || err) }));
  } catch (err) {
    done({ ok: false, error: String((err && err.stack) || err) });
  }
};
`;

export const useJsRunner = () => {
  const [state, setState] = useState<RunState>({ status: 'idle', logs: [], error: null, ms: null });
  const workerRef = useRef<Worker | null>(null);
  const urlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null; }
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; }
  }, []);

  const run = useCallback((code: string) => {
    cleanup();
    setState({ status: 'running', logs: [], error: null, ms: null });
    const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'application/javascript' }));
    const worker = new Worker(url);
    urlRef.current = url;
    workerRef.current = worker;

    timerRef.current = window.setTimeout(() => {
      cleanup();
      setState({ status: 'error', logs: [], error: `Execution timed out — exceeded ${TIMEOUT_MS}ms (possible infinite loop).`, ms: TIMEOUT_MS });
    }, TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent) => {
      const { ok, logs, error, ms } = e.data as { ok: boolean; logs: LogLine[]; error: string | null; ms: number };
      cleanup();
      setState({ status: ok ? 'done' : 'error', logs: logs ?? [], error: error ?? null, ms: Math.round(ms) });
    };
    worker.onerror = (e: ErrorEvent) => {
      cleanup();
      setState({ status: 'error', logs: [], error: e.message || 'Worker error', ms: null });
    };
    worker.postMessage({ code });
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setState({ status: 'idle', logs: [], error: null, ms: null });
  }, [cleanup]);

  useEffect(() => cleanup, [cleanup]);

  return { ...state, run, reset };
};
