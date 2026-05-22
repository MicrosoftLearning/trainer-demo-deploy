/**
 * Tiny built-in code highlighter for OPX `agent.code` blocks.
 *
 * We deliberately avoid Shiki/Prism to keep the runtime bundle small
 * (≤25 KB gzipped per the perf budget). Each language has ~30 lines
 * of regex rules producing `<span class="opx-tok-*">` wrappers.
 *
 * Supported languages: bash, powershell, typescript, javascript,
 * yaml, json, bicep, csharp. Unknown languages fall back to escaped
 * monospace text.
 */
export type SupportedLang =
  | "bash"
  | "powershell"
  | "typescript"
  | "javascript"
  | "yaml"
  | "json"
  | "bicep"
  | "csharp";

const ESC_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESC_MAP[c] ?? c);
}

const KEYWORDS: Record<string, RegExp> = {
  csharp:
    /\b(using|namespace|class|public|private|protected|internal|static|readonly|sealed|abstract|virtual|override|async|await|return|new|var|if|else|switch|case|for|foreach|while|do|break|continue|try|catch|finally|throw|true|false|null)\b/g,
  bicep:
    /\b(param|var|resource|module|output|targetScope|if|for|in|existing|type|true|false|null)\b/g,
  bash:
    /\b(if|then|else|fi|for|in|do|done|while|case|esac|function|export|local|return|exit|cd|echo|read)\b/g,
  powershell:
    /\b(param|function|return|if|elseif|else|switch|foreach|for|while|do|try|catch|finally|throw|process|begin|end|true|false|null|Get-[A-Za-z]+|Set-[A-Za-z]+|New-[A-Za-z]+|Remove-[A-Za-z]+|Add-[A-Za-z]+)\b/g,
  typescript:
    /\b(import|export|from|default|const|let|var|function|return|class|interface|type|extends|implements|public|private|protected|readonly|static|async|await|new|if|else|switch|case|for|while|do|break|continue|try|catch|finally|throw|true|false|null|undefined|void|any|never|unknown)\b/g,
  javascript:
    /\b(import|export|from|default|const|let|var|function|return|class|extends|new|if|else|switch|case|for|while|do|break|continue|try|catch|finally|throw|true|false|null|undefined|async|await)\b/g,
  yaml: /^(\s*-?\s*)([A-Za-z_][\w-]*)(\s*:)/gm,
  json: /\b(true|false|null)\b/g,
};

const TYPES: Partial<Record<SupportedLang, RegExp>> = {
  csharp: /\b([A-Z][A-Za-z0-9_]*)\b/g,
  bicep: /\b(Microsoft\.[A-Za-z]+\/[A-Za-z]+)\b/g,
  typescript: /\b([A-Z][A-Za-z0-9_]*)\b/g,
};

const COMMENTS: Partial<Record<SupportedLang, RegExp>> = {
  csharp: /\/\/[^\n]*/g,
  bicep: /\/\/[^\n]*/g,
  typescript: /\/\/[^\n]*/g,
  javascript: /\/\/[^\n]*/g,
  bash: /#[^\n]*/g,
  powershell: /#[^\n]*/g,
  yaml: /#[^\n]*/g,
};

const STRINGS = /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/g;
const NUMBERS = /\b(\d+(?:\.\d+)?)\b/g;

interface Slot {
  start: number;
  end: number;
  cls: string;
}

function highlight(src: string, lang: SupportedLang): string {
  const slots: Slot[] = [];
  const add = (re: RegExp, cls: string, captureGroup = 0) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const idx = captureGroup ? m.index + (m[0].indexOf(m[captureGroup]!) ?? 0) : m.index;
      const text = captureGroup ? m[captureGroup]! : m[0];
      slots.push({ start: idx, end: idx + text.length, cls });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  };

  if (COMMENTS[lang]) add(COMMENTS[lang]!, "opx-tok-comment");
  add(STRINGS, "opx-tok-string");
  if (KEYWORDS[lang]) {
    if (lang === "yaml") {
      // Yaml: keys highlighted (group 2)
      add(KEYWORDS[lang]!, "opx-tok-keyword", 2);
    } else {
      add(KEYWORDS[lang]!, "opx-tok-keyword");
    }
  }
  if (TYPES[lang]) add(TYPES[lang]!, "opx-tok-type");
  add(NUMBERS, "opx-tok-number");

  // Resolve overlaps: prefer earliest, then longest, then earlier-pushed.
  slots.sort((a, b) => a.start - b.start || b.end - a.end);
  const filtered: Slot[] = [];
  let cursor = 0;
  for (const slot of slots) {
    if (slot.start < cursor) continue;
    filtered.push(slot);
    cursor = slot.end;
  }

  let out = "";
  cursor = 0;
  for (const slot of filtered) {
    out += escapeHtml(src.slice(cursor, slot.start));
    out += `<span class="${slot.cls}">${escapeHtml(src.slice(slot.start, slot.end))}</span>`;
    cursor = slot.end;
  }
  out += escapeHtml(src.slice(cursor));
  return out;
}

export function highlightCode(source: string, lang?: string): string {
  const supported: SupportedLang[] = [
    "bash",
    "powershell",
    "typescript",
    "javascript",
    "yaml",
    "json",
    "bicep",
    "csharp",
  ];
  if (lang && supported.includes(lang as SupportedLang)) {
    return highlight(source, lang as SupportedLang);
  }
  return escapeHtml(source);
}
