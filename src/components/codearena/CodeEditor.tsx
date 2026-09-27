import { useEffect, useLayoutEffect, useRef } from 'react';
import { highlightJs } from './highlight';

interface CodeEditorProps {
  value: string;
  onChange: (v: string) => void;
  language: string;
  fontSize: number;
  readOnly?: boolean;
}

// A dependency-free code editor: a transparent <textarea> layered over a
// syntax-highlighted <pre> (JavaScript only), with a synced line-number gutter,
// tab-to-indent and auto-indent. Native caret/selection are preserved because
// the textarea itself is never replaced.
const CodeEditor = ({ value, onChange, language, fontSize, readOnly }: CodeEditorProps) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<number | null>(null);

  const lineCount = Math.max(1, value.split('\n').length);
  const isJs = language === 'javascript';

  // Restore caret after a programmatic value change (tab / auto-indent).
  useLayoutEffect(() => {
    if (caretRef.current != null && taRef.current) {
      taRef.current.selectionStart = taRef.current.selectionEnd = caretRef.current;
      caretRef.current = null;
    }
  }, [value]);

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) { preRef.current.scrollTop = ta.scrollTop; preRef.current.scrollLeft = ta.scrollLeft; }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };
  useEffect(syncScroll, [value, fontSize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const { selectionStart: s, selectionEnd: eSel, value: v } = ta;
    if (e.key === 'Tab') {
      e.preventDefault();
      const next = v.slice(0, s) + '  ' + v.slice(eSel);
      caretRef.current = s + 2;
      onChange(next);
    } else if (e.key === 'Enter') {
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const indent = (v.slice(lineStart, s).match(/^[ \t]*/) || [''])[0];
      const extra = /[{([]\s*$/.test(v.slice(lineStart, s)) ? '  ' : '';
      e.preventDefault();
      const insert = '\n' + indent + extra;
      const next = v.slice(0, s) + insert + v.slice(eSel);
      caretRef.current = s + insert.length;
      onChange(next);
    }
  };

  const pad = 'p-4';
  const type = { fontSize: `${fontSize}px`, lineHeight: 1.6, tabSize: 2 } as React.CSSProperties;

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden bg-[#0b0b0f] font-mono">
      {/* Line-number gutter */}
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden border-r border-white/5 py-4 pl-3 pr-2 text-right text-slate-600"
        style={type}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        {isJs && (
          <pre
            ref={preRef}
            aria-hidden="true"
            className={`ca-highlight pointer-events-none absolute inset-0 overflow-auto whitespace-pre ${pad} text-slate-300`}
            style={type}
            dangerouslySetInnerHTML={{ __html: highlightJs(value) }}
          />
        )}
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Code editor"
          className={`absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre bg-transparent ${pad} caret-cyan-300 outline-none ${isJs ? 'text-transparent' : 'text-slate-300'}`}
          style={type}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
