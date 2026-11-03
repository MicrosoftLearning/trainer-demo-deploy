/**
 * Tiny inline-only markdown renderer for OPX bodies, status text,
 * tool details, etc.
 *
 * Supported syntax:
 *   `code`              → <code>
 *   **bold**            → <strong>
 *   _italic_            → <em>
 *   [text](url)         → <a>
 *   @mention            → <span class="opx-mention">
 *   blank line          → paragraph break
 *   single newline      → <br>
 *
 * Hard rules (security): all input is HTML-escaped before tokens are
 * applied. Links are restricted to http(s)/mailto and have rel/target
 * set defensively.
 *
 * Anything else (headings, lists, fences, raw HTML) is rendered as
 * literal text. Block-level features are handled by the OPX step
 * components, not this renderer.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Safe URL: http(s)|mailto only, otherwise empty (which renders link as text). */
function safeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^(https?:|mailto:)/i.test(trimmed)) return escapeHtml(trimmed);
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("./")) {
    return escapeHtml(trimmed);
  }
  return "";
}

/**
 * Apply inline transformations to an already-HTML-escaped string.
 *
 * Order matters: code first (so its contents don't get further parsed),
 * then links, then mentions, then bold/italic.
 */
function applyInline(escaped: string): string {
  // 1. Inline code: `…`  → must come before other transforms so its
  //    contents aren't re-parsed. We swap each occurrence for a
  //    placeholder, then restore at the end.
  const codeStash: string[] = [];
  let s = escaped.replace(/`([^`\n]+)`/g, (_m, body: string) => {
    codeStash.push(`<code class="opx-inline-code">${body}</code>`);
    return `\u0000C${codeStash.length - 1}\u0000`;
  });

  // 2. Links: [text](url). Both halves were already escaped.
  s = s.replace(/\[([^\]\n]+)\]\(([^)\n]+)\)/g, (_m, text: string, href: string) => {
    const url = safeUrl(href);
    if (!url) return text;
    return `<a href="${url}" rel="noopener noreferrer" target="_blank">${text}</a>`;
  });

  // 3. Mentions: @word (letters, digits, hyphen, underscore — no dots).
  //    Avoid matching inside email-ish strings by requiring a preceding
  //    boundary that isn't an alphanum.
  s = s.replace(/(^|[^A-Za-z0-9])@([A-Za-z][A-Za-z0-9_-]{0,30})/g,
    (_m, pre: string, name: string) => `${pre}<span class="opx-mention">@${name}</span>`);

  // 4. Bold: **text**  → <strong>
  s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");

  // 5. Italic: _text_  → <em>  (intentionally NOT `*text*` to avoid
  //    collisions with bold and the common "x * y" math notation).
  s = s.replace(/(^|[^A-Za-z0-9_])_([^_\n]+)_(?=$|[^A-Za-z0-9_])/g,
    (_m, pre: string, body: string) => `${pre}<em>${body}</em>`);

  // 6. Restore stashed code spans.
  s = s.replace(/\u0000C(\d+)\u0000/g, (_m, idx: string) => codeStash[Number(idx)] ?? "");

  return s;
}

/**
 * Render an inline markdown string to safe HTML.
 *
 * Paragraph rules:
 *   - "\n\n" splits paragraphs (rendered as separate <p> blocks
 *     joined by the caller, but here we yield a single string with
 *     "</p><p>" between).
 *   - Single "\n" becomes <br>.
 */
export function renderInlineMarkdown(input: string | null | undefined): string {
  if (!input) return "";
  const escaped = escapeHtml(input);
  const paragraphs = escaped.split(/\n{2,}/).map((p) => {
    const inlined = applyInline(p);
    return inlined.replace(/\n/g, "<br>");
  });
  return paragraphs.join("</p><p>");
}

/**
 * Like `renderInlineMarkdown`, but wraps the result in a single <p>
 * unless the body is empty.
 */
export function renderParagraph(input: string | null | undefined): string {
  const inner = renderInlineMarkdown(input);
  return inner ? `<p>${inner}</p>` : "";
}
