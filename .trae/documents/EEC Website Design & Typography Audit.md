## Scope & Objectives
- Audit https://eec.eaeunion.org for typography, color, spacing, layout, and UI patterns
- Produce a detailed report + reusable design tokens + implementation snippets
- Focus on font families, weights, sizes, hierarchy, color palette (hex), spacing scale, grid/columns, and interaction styles

## Method & Data Collection
- Inspect global stylesheets and inline CSS to extract font-family stacks, weights, and size rules
- Capture computed styles across key templates: homepage, news/article, listing, search, footer
- Record color variables and computed hex values for backgrounds, text, links, buttons, alerts, borders
- Identify spacing scale from margin/padding utilities and component CSS; infer baseline grid and column behavior
- Document header levels (H1–H6), body text, captions, metadata, and interactive states (hover/focus/active)

## Analysis & Cataloging
- Map all font families to usage (headings, body, UI labels, numerals) with example selectors and CSS properties
- Build a typography scale: base size, ratio, line-heights, tracking; show hierarchy across breakpoints
- Define design patterns: header blocks, article cards, navigation, breadcrumbs, tables, forms, buttons, tags/badges
- Compile color palette: brand primaries, neutrals, semantic colors; include hex codes and contrast notes (WCAG AA/AAA)
- Derive spacing system: base unit, step increments, container widths, gutters, breakpoints
- Summarize mood/personality: institutional vs. friendly, seriousness, warmth, clarity; justify with visual evidence

## Deliverables
- Report: six sections matching your request (fonts, hierarchy, patterns, palette, spacing/layout, emotional/brand analysis)
- Design tokens (JSON): fonts, sizes, weights, colors, spacing, radii, shadows
- Implementation snippets: CSS variables, @font-face (if web fonts are used), utility classes for scale
- Usage guidelines: do/don’t for headings, body, interactive elements; accessibility notes (contrast, focus states)

## Example Implementation Snippets
- CSS variables skeleton for tokens

```css
:root {
  /* Typography */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
  --font-serif: "Georgia", "Times New Roman", serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --font-size-100: 12px;
  --font-size-200: 14px;
  --font-size-300: 16px;
  --font-size-400: 18px;
  --font-size-500: 24px;
  --font-size-600: 32px;
  --line-compact: 1.25;
  --line-standard: 1.5;

  /* Colors */
  --color-brand-600: #1a4f8b; /* primary */
  --color-brand-400: #2f73c5; /* hover */
  --color-accent-500: #c28b2c; /* accent */
  --color-text-900: #1a1a1a;
  --color-text-600: #4a4a4a;
  --color-bg-000: #ffffff;
  --color-bg-050: #f6f7f9;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
}

h1 { font-family: var(--font-sans); font-weight: 700; font-size: var(--font-size-600); line-height: var(--line-compact); }
p  { font-family: var(--font-sans); font-weight: 400; font-size: var(--font-size-300); line-height: var(--line-standard); }
.btn-primary { background: var(--color-brand-600); color: var(--bg-000); padding: var(--space-3) var(--space-5); }
```

- Typography scale usage

```css
:root { --ratio: 1.25; --base: 16px; }
.h1 { font-size: calc(var(--base) * var(--ratio) * var(--ratio) * var(--ratio)); }
.h2 { font-size: calc(var(--base) * var(--ratio) * var(--ratio)); }
.h3 { font-size: calc(var(--base) * var(--ratio)); }
.body { font-size: var(--base); }
.small { font-size: calc(var(--base) / var(--ratio)); }
```

## Application to Similar Projects
- Provide a mapped set of tokens to your stack (CSS/SCSS, Tailwind config, or design system docs)
- Recommend font pairing and hierarchy tailored to institutional/news contexts
- Supply accessibility checks (contrast, focus outlines, readable line-length)

## Review & Next Steps
- I will run the site audit, compile the catalog and tokens, and share the full report with implementation-ready snippets
- Confirm if you prefer output as PDF + Markdown + JSON tokens, and if Tailwind or plain CSS variables should be targeted