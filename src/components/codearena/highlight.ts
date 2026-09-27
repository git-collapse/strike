// Lightweight, dependency-free JavaScript syntax highlighter for the CodeArena
// editor. It emits an HTML string rendered in a <pre> layer behind a transparent
// <textarea>, so the caret and selection stay native while the text is colored.
// This is intentionally small (no tokenizer library) — it covers the constructs
// common in playground snippets, not a full ECMAScript grammar.

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'typeof', 'instanceof', 'in', 'of',
  'try', 'catch', 'finally', 'throw', 'class', 'extends', 'super', 'this', 'async',
  'await', 'yield', 'delete', 'void', 'export', 'import', 'from', 'default', 'static',
]);

const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Token pattern order matters: comments and strings are matched before words so
// keywords inside them are never recolored.
const TOKEN = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1: comments
    '(`(?:\\\\.|[^`\\\\])*`|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')', // 2: strings
    '(\\b\\d[\\d_]*(?:\\.\\d+)?(?:e[+-]?\\d+)?\\b)', // 3: numbers
    '([A-Za-z_$][A-Za-z0-9_$]*)', // 4: identifiers/keywords
  ].join('|'),
  'gi'
);

export const highlightJs = (code: string): string => {
  let out = '';
  let last = 0;
  code.replace(TOKEN, (match, comment, str, num, word, offset: number) => {
    out += escapeHtml(code.slice(last, offset));
    if (comment) out += `<span class="tok-comment">${escapeHtml(match)}</span>`;
    else if (str) out += `<span class="tok-string">${escapeHtml(match)}</span>`;
    else if (num) out += `<span class="tok-number">${escapeHtml(match)}</span>`;
    else if (word) {
      const cls = KEYWORDS.has(word) ? 'tok-keyword' : LITERALS.has(word) ? 'tok-literal' : null;
      out += cls ? `<span class="${cls}">${escapeHtml(match)}</span>` : escapeHtml(match);
    } else out += escapeHtml(match);
    last = offset + match.length;
    return match;
  });
  out += escapeHtml(code.slice(last));
  // Trailing newline needs a placeholder so the <pre> height matches the textarea.
  return out + '\n';
};
