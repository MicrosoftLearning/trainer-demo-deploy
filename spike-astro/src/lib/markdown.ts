// Minimal, safe Markdown → HTML for Orchestrator Preview step bodies.
// Supports: paragraphs, inline `code`, **bold**, _italic_, [text](url),
// HTML escapes, and a small set of inline span colors via the syntax map.
// Intentionally NOT a general-purpose md renderer — keep it predictable.

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(s: string): string {
  // escape first, then re-introduce safe inline markup
  let out = escapeHtml(s);
  // `code` (must precede ** because of underscores)
  out = out.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-[#161b22] border border-[#30363d] font-mono text-[11px] text-[#a5d6ff]">$1</code>');
  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // _italic_ (single underscore, no surrounding word chars)
  out = out.replace(/(^|\s)_([^_]+)_(?=\s|$|[.,;:!?])/g, "$1<em>$2</em>");
  // [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-[#58a6ff] underline" href="$2">$1</a>');
  // @mention (Copilot-Chat style highlight: @workspace, @terminal, etc.)
  out = out.replace(/(^|\s)@(\w+)/g, '$1<span class="text-[#58a6ff]">@$2</span>');
  return out;
}

export function renderMarkdown(src: string): string {
  if (!src) return "";
  const blocks = src.trim().split(/\n{2,}/);
  return blocks.map((b) => `<p>${inline(b.trim()).replace(/\n/g, "<br/>")}</p>`).join("");
}

// Tiny syntax highlighter for code blocks. Not perfect — produces a colored
// look that matches the GitHub Dark theme used elsewhere in the panel.
// Supported langs: csharp, bicep, json, yaml, bash, text.
const COLORS = {
  keyword: "#ff7b72",
  type: "#d2a8ff",
  string: "#a5d6ff",
  comment: "#8b949e",
  text: "#c9d1d9",
};

const KEYWORDS: Record<string, RegExp> = {
  csharp: /\b(var|new|async|await|return|using|namespace|public|private|class|record|if|else|foreach|in|true|false|null)\b/g,
  bicep:  /\b(param|var|resource|module|output|targetScope|if|for|in)\b/g,
  json:   /\b(true|false|null)\b/g,
  yaml:   /\b(true|false|null)\b/g,
  bash:   /\b(if|then|fi|for|do|done|while|in|exit|return|export)\b/g,
};

const TYPES: Record<string, RegExp> = {
  csharp: /\b([A-Z][A-Za-z0-9_]+)(?=[\s.<(])/g,
  bicep:  /\b([A-Z][A-Za-z0-9_]+)(?=[\s.@(])/g,
};

export function highlight(lang: string, source: string): string {
  let out = escapeHtml(source);
  // strings (greedy on doublequote)
  out = out.replace(/(&quot;[^&]*?&quot;)/g, `<span style="color:${COLORS.string}">$1</span>`);
  // line comments
  out = out.replace(/(^|\n)([ \t]*\/\/[^\n]*)/g, `$1<span style="color:${COLORS.comment}">$2</span>`);
  out = out.replace(/(^|\n)([ \t]*#[^\n]*)/g, `$1<span style="color:${COLORS.comment}">$2</span>`);
  if (TYPES[lang]) out = out.replace(TYPES[lang], `<span style="color:${COLORS.type}">$1</span>`);
  if (KEYWORDS[lang]) out = out.replace(KEYWORDS[lang], `<span style="color:${COLORS.keyword}">$&</span>`);
  return out;
}
