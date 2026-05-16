# Astro + Tailwind v4 spike

Time-boxed exploration of the alternative stack used by [bradygaster.github.io/squad](https://bradygaster.github.io/squad/),
on a separate branch (`spike/astro`) so the existing Docusaurus work on `fabricTemplate` is untouched.

## What's here

A single page (`/`) that mirrors the `/getting-started/` page of the main Docusaurus site:

- Ambient radial gradient hero (Microsoft purple + magenta), with smooth falloff
- Pill badge + gradient headline ("Trainer demos, ready in minutes.")
- Primary `azd up`-themed CTA + outlined secondary CTA
- 6-card responsive grid with cycling gradient stripes (purple→magenta, blue→teal, teal→magenta, magenta→purple, teal→blue, light-purple→purple)
- Backdrop-blur sticky header with brand mark + nav + theme toggle
- Tri-column footer
- Light + dark mode via `.dark` class on `<html>` (localStorage + `prefers-color-scheme` first-visit)

## Stack

| Piece | Version |
|---|---|
| Astro | 5.18.1 |
| Tailwind CSS | 4.3.0 (via `@tailwindcss/vite`) |
| TypeScript base | `astro/tsconfigs/strict` |

No JS framework (React/Vue/etc.) — the page is plain Astro components + Tailwind utilities.

## Running it

```pwsh
cd spike-astro
npm install         # one-time
npm run dev         # http://localhost:4321/
```

## Side-by-side vs the Docusaurus retrofit on `fabricTemplate`

| Aspect | Docusaurus + Fluent UI retrofit | Astro + Tailwind v4 spike |
|---|---|---|
| Lines of code for the redesign | ~120 CSS changes across 4 files, fighting Fluent UI specificity | ~150 lines of one `.astro` page + one tiny `global.css` |
| Card styling | Doubled selector `.card, .card.card` needed to beat Fluent's atomic classes; defensive text-color rule needed because Fluent's `FluentProvider` theme can desync from `data-theme` attribute during SSR | Direct utility classes; no library specificity to fight |
| Dark mode | Three-way coordination: Infima `data-theme`, Fluent `FluentProvider` theme prop via `useColorMode()`, and our own CSS | Single source of truth: `.dark` class on `<html>` |
| Hero gradient | CSS variables in `custom.css`, applied to `.heroBanner` via module class | Inline `style=` on two divs |
| Per-card stripes | 6 separate `:nth-child` rules + verifying which element is "the direct child" of `.row` (had to fix once) | 6-element JS array of Tailwind class strings, applied via `${stripes[i % 6]}` template literal |
| Bundle JS at runtime | Docusaurus + React + MDX runtime + Fluent UI components | Zero JS by default (just the 8-line theme toggle inline script) |
| Build/dev startup | Webpack 5, ~20s first compile | Vite, ~7s ready |
| Search | Algolia DocSearch (Docusaurus default) | Would need Pagefind (Squad uses it) |
| Content authoring | MDX + Docusaurus plugins | MDX via `@astrojs/mdx`, or `.astro` files |
| i18n, versioning, doc sidebars | Built in | Build it yourself or use Starlight |

## What this proves

- The "Squad feel" is mostly achievable on either stack. The Astro version reaches a more polished final state with materially less CSS combat because there's no component library to fight.
- The hero radial-gradient + gradient title + cycling stripe cards translate directly. Visual fidelity is comparable.
- Astro's zero-JS-by-default means the same page is faster and lighter than the Docusaurus equivalent.

## What this does NOT prove

- **Migration cost.** This is a 1-page proof of concept. Porting the full Docusaurus site (the showcase gallery in `src/components/gallery/`, the Fluent UI cards with filters, the templates JSON-driven catalog, MDX docs under `docs/`, search) would be a substantial rewrite. Days of work, not hours.
- **Search.** Algolia DocSearch is already wired up on the Docusaurus side. Switching to Pagefind (Squad's choice) is fine but the index has to be rebuilt at deploy time.
- **i18n & versioned docs.** Docusaurus has these out of the box; on Astro you'd reach for Starlight or hand-roll.
- **Sidebars / docs structure.** The `docs/` folder + auto-sidebar that Docusaurus gives for free is not in this spike.

## Honest recommendation

If the team wants the "Squad feel" and is **willing to migrate**, Astro + Tailwind v4 is the right stack — it's lighter, faster, and the code is less defensive. Squad itself doesn't even use Starlight; the docs theme is hand-rolled on plain Astro.

If migration is off the table, the `fabricTemplate` retrofit gets you ~80% of the visual feel without losing Algolia search, MDX docs plumbing, or the existing showcase gallery component tree.

## Caveats from building this

- **Parent `tsconfig.json` had to be touched.** Vite's `tsconfck` walks up looking for tsconfigs; the workspace root `tsconfig.json` used the legacy form `extends: "@tsconfig/docusaurus/tsconfig.json"`, which newer tsconfck mis-resolves as `…/tsconfig.json/tsconfig.json`. Changed to `extends: "@tsconfig/docusaurus"` on this branch — that form works on both old and new TypeScript versions, so it's safe to keep, but it's a real cross-stack-side-effect that wouldn't exist in a greenfield repo.
- **Tailwind v4 dark variant.** v4 defaults `dark:` to `prefers-color-scheme`. Used `@custom-variant dark (&:where(.dark, .dark *));` to opt into class-based toggling. Took one iteration to spot.
