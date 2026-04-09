# Phase 6: Design System - Research

**Researched:** 2026-04-09
**Domain:** CSS design tokens, Tailwind v4 theming, typography, OKLCH color, Astro View Transitions
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** 3-way theme toggle: Dark (default) / Light / Sepia. Cycling control in the site header. Applied via class on `<html>` element (`dark` | `light` | `sepia`). Persisted in `localStorage` key `theme`.
- **D-02:** Dark mode palette: warm charcoal background (#1a1714), warm off-white text (#f5f0e8), secondary text (#a89b88), saffron gold accent (#C4832D). Vibe: "ancient library at night."
- **D-03:** Light mode palette: current cream (#FAF7F2) base with warm-800 text. Existing warm palette carries over.
- **D-04:** Sepia mode palette: aged parchment background (#f4e8c1), dark brown text (#3b2f1e), secondary (#6b5a42), saffron gold accent. Vibe: "reading a physical manuscript."
- **D-05:** Theme toggle lives in the persistent site header bar, next to the depth-level selector (Phase 7 wires it up; Phase 6 provides the component and token infrastructure).
- **D-06:** 18 chapter colors generated using OKLCH color space with 20-degree hue increments. Used as accent touches only: header accent bar/border, chapter card left border/badge, verse page top stripe. Never full-page backgrounds. Saffron gold remains the global accent.
- **D-07:** Chapter colors adapt per theme mode via auto lightness shift: same OKLCH hue, but lightness/chroma adjust — dark mode = brighter/more saturated, light mode = muted/deeper, sepia = warm-shifted. One `--chapter-hue` CSS custom property per chapter, lightness/chroma derived in CSS.
- **D-08:** Font stack: Cormorant Garamond (display headings — chapter titles, hero text), Source Serif 4 (body/translations/prose), Inter (UI chrome — nav, buttons, labels, metadata), Noto Sans Devanagari at 110% scale (Sanskrit/Devanagari text).
- **D-09:** Replace Tiro Devanagari Sanskrit + Noto Serif Devanagari with Noto Sans Devanagari. Install `@fontsource/noto-sans-devanagari` (or variable variant). Remove Tiro and Noto Serif Devanagari packages.
- **D-10:** 9-level fluid type scale using CSS clamp() — responsive sizes that scale between mobile and desktop with no breakpoint jumps. Headings reach 40px+ on desktop. Scale: text-xs through text-hero.
- **D-11:** Headings use `text-wrap: balance` for visual harmony.
- **D-12:** Contemplative & subtle animation personality: slow, gentle transitions (300-500ms). Fade + slight vertical shift for page enters. Staggered fade-in for lists (50ms delay between items). No bouncing, springs, or overshoots. Easing: ease-out for enters, ease-in for exits.
- **D-13:** prefers-reduced-motion: instant swap — all animation/transition durations set to ~0ms. Content still appears/disappears but without movement or fading.
- **D-14:** Use Astro View Transitions API (`ClientRouter` component from `astro:transitions`) for cross-page transitions. Crossfade (300ms) for page changes, morph for shared elements (chapter headers, verse refs). Graceful degradation in unsupported browsers.

### Claude's Discretion

- Exact OKLCH hue values for each of 18 chapters (within the 20-degree increment constraint)
- Exact clamp() values for the 9-level type scale (within the 40px+ heading constraint)
- CSS custom property naming conventions
- Semantic color token naming (primary/secondary/tertiary/quaternary text tokens)
- Responsive breakpoints and spacing scale
- Whether theme toggle is Preact island or vanilla JS `<script>`
- Structure of design system files (single global.css vs split partials)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DES-01 | Site uses a dark-default theme with warm off-white text (not pure white) and a contemplative visual mood | D-02 palette, Tailwind @custom-variant pattern, FOUC-prevention inline script |
| DES-02 | Light mode and sepia mode are available as alternatives, toggled via a persistent control | D-01/D-03/D-04, 3-way toggle component, localStorage persistence, astro:after-swap listener |
| DES-03 | Typography uses Source Serif 4 for English translations, Noto Sans Devanagari (at 110% scale) for Sanskrit, and Inter for UI elements | D-08/D-09, @fontsource-variable packages, font removal plan |
| DES-04 | Headings are 40px+ with `text-wrap: balance` and a 9-level type scale | D-10/D-11, CSS clamp() values from Utopia calculator |
| DES-05 | Each of 18 chapters has a unique accent color derived from OKLCH color space (20-degree hue increments), used in headers, borders, and badges — never full-page backgrounds | D-06/D-07, OKLCH relative color syntax, --chapter-hue pattern |
| DES-06 | CSS uses semantic color tokens (primary/secondary/tertiary/quaternary text) with dark-mode-first custom properties | D-02 through D-04, semantic token naming, @custom-variant approach |
| DES-07 | Micro-animations exist for page transitions, reveal interactions, and hover states (respects prefers-reduced-motion) | D-12/D-13/D-14, ClientRouter, prefers-reduced-motion media query in CSS |
| DES-08 | All pages are mobile-first responsive, readable on iPhone SE (375px) with no horizontal scroll | Fluid type scale starts at 375px, mobile-first breakpoints |
</phase_requirements>

---

## Summary

Phase 6 installs the visual foundation that every subsequent phase consumes. The work divides into four orthogonal tracks: (1) the three-theme token system (dark/light/sepia) using CSS custom properties and Tailwind v4 `@custom-variant`, (2) the 18-chapter OKLCH accent color system using CSS relative colors, (3) the typography refresh (add Inter and Noto Sans Devanagari variable, remove Tiro and Noto Serif Devanagari), and (4) the Astro `ClientRouter` (View Transitions) integration with a FOUC-proof inline theme script.

The biggest risk is FOUC (flash of unstyled content) when the dark theme class is applied after page transitions. Astro's `ClientRouter` replaces `document.documentElement` on every navigation, dropping any classes set on it. The fix is well-documented: an `is:inline` script in `<head>` that reads localStorage and applies the theme class before paint, plus `astro:after-swap` and `astro:page-load` listeners that re-apply it. This pattern is mandatory — any implementation that skips the inline head script will flash white on navigation to a new page.

The existing `global.css` `@theme {}` block already establishes the token pattern — Phase 6 extends it heavily without changing the structural approach. The three Preact islands (`ApplicationCards`, `CommentaryTabs`, `LifeSearch`) all use `var(--color-*)` custom properties directly, so they will automatically inherit the new theme tokens once the properties are redefined per theme class.

**Primary recommendation:** Build the token layer first (tokens → theme switching → chapter colors → typography → animation → View Transitions), validate each layer independently, and let downstream components consume passively via CSS custom properties.

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 6 |
|-----------|-------------------|
| Astro 5 + Tailwind v4 + Preact — no migration | `@custom-variant` (v4 syntax), no tailwind.config.js, Preact for any interactive toggle island |
| Fully static — GitHub Pages, no server | Theme toggle must be purely client-side (localStorage + inline script); no SSR session storage |
| No `@astrojs/tailwind` | Already using `@tailwindcss/vite` — confirmed in astro.config.mjs |
| No Tailwind v3 | `@custom-variant` is a v4-only feature — safe to use |
| IAST only | No change from Phase 6 scope — typography preserves IAST rendering |
| Self-hosted fonts via `@fontsource` | All new fonts (`@fontsource-variable/noto-sans-devanagari`, `@fontsource-variable/inter`) must be Fontsource packages |
| Existing URLs must not break | Phase 6 is CSS/token only — no route changes; URL stability unaffected |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.1 (installed) | Utility classes + `@theme` tokens | Already in project; v4 `@custom-variant` enables multi-theme without JS |
| `@tailwindcss/vite` | 4.x (installed) | Vite plugin — wires Tailwind into Astro build | Already in astro.config.mjs |
| `astro:transitions` | built-in Astro 5.18 | `ClientRouter` for page transitions | Official Astro API; replaces community view-transition libraries |
| CSS custom properties (native) | browser-native | Theme tokens, chapter hue vars | Zero dependency; consumed by both Tailwind utilities and Preact island inline styles |

### Font Packages to Add

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `@fontsource-variable/noto-sans-devanagari` | 5.2.8 | Sanskrit/Devanagari text | Variable font — weights 100-900 in one file; import `wght.css`; replaces both Tiro and Noto Serif Devanagari |
| `@fontsource-variable/inter` | 5.2.8 | UI chrome (nav, buttons, labels, metadata) | Variable font; already widely used in spiritual/content sites for UI text |

### Font Packages to Remove

| Package | Reason |
|---------|--------|
| `@fontsource/tiro-devanagari-sanskrit` | Replaced by Noto Sans Devanagari per D-09 |
| `@fontsource/noto-serif-devanagari` | Replaced by Noto Sans Devanagari per D-09 |

### Fonts Already in Project (Keep)

| Package | Version | Purpose |
|---------|---------|---------|
| `@fontsource-variable/cormorant-garamond` | 5.2.6 | Display headings — confirmed in D-08 |
| `@fontsource-variable/source-serif-4` | 5.2.9 | Body/translations/prose — confirmed in D-08 |

**Installation:**
```bash
pnpm add @fontsource-variable/noto-sans-devanagari @fontsource-variable/inter
pnpm remove @fontsource/tiro-devanagari-sanskrit @fontsource/noto-serif-devanagari
```

**Version verification:** [VERIFIED: npm registry]
- `@fontsource-variable/noto-sans-devanagari`: 5.2.8
- `@fontsource-variable/inter`: 5.2.8
- `@fontsource/noto-sans-devanagari`: 5.2.8 (static fallback available)

---

## Architecture Patterns

### Recommended File Structure

```
src/
├── styles/
│   └── global.css             # Single file — extend existing @theme{} block
├── layouts/
│   └── BaseLayout.astro       # Add ClientRouter, FOUC-prevention script, new font imports
├── components/
│   ├── islands/
│   │   └── ThemeToggle.tsx    # New: Preact island for 3-way toggle (dark/light/sepia)
│   └── astro/
│       └── (future phase components consume tokens automatically)
└── data/
    └── chapters/              # Chapter-specific hue values encoded here or in global.css
```

**Rationale for single global.css:** The existing project uses a single file. Splitting into partials (tokens.css, themes.css, typography.css) adds complexity with marginal benefit at this scale. Keep single file, use section comments.

---

### Pattern 1: Multi-Theme with Tailwind v4 `@custom-variant`

**What:** Define `dark`, `light`, and `sepia` variants in CSS, then use `dark:` prefix classes in markup or redefine CSS custom properties per theme class.

**When to use:** When Tailwind utility classes need to respond to theme — e.g., `dark:bg-[--color-bg] sepia:bg-[--color-sepia-bg]`. However, for this project the preferred approach is: **redefine the semantic CSS custom properties in each theme class**, so components use a single `var(--color-bg)` that automatically updates. This keeps islands and Astro components theme-agnostic.

**Recommended approach — semantic token redefinition:**

```css
/* Source: Tailwind v4 docs + verified via WebFetch 2026-04-09 */

/* STEP 1: Register variants so Tailwind recognizes them */
@custom-variant dark (&:where(.dark, .dark *));
@custom-variant sepia (&:where(.sepia, .sepia *));
/* 'light' is default :root — no variant needed */

/* STEP 2: Define semantic tokens in @theme (Tailwind-visible) */
@theme {
  --color-bg:          #FAF7F2;   /* light default */
  --color-text:        #332D24;
  --color-text-2:      #8A7D6B;
  --color-text-3:      #A89B88;
  --color-text-4:      #CCC3B2;
  /* ... */
}

/* STEP 3: Override tokens per theme class on <html> */
html.dark {
  --color-bg:          #1a1714;
  --color-text:        #f5f0e8;
  --color-text-2:      #a89b88;
  --color-text-3:      #6B5F4E;
  --color-text-4:      #4A4035;
}

html.sepia {
  --color-bg:          #f4e8c1;
  --color-text:        #3b2f1e;
  --color-text-2:      #6b5a42;
  --color-text-3:      #8A7D6B;
  --color-text-4:      #A89B88;
}
```

**Key insight:** Tokens defined in `@theme` are visible to Tailwind utilities AND to `var()` in CSS. When the class changes on `<html>`, every `var(--color-bg)` reference across all components re-resolves instantly — no JS needed per component.

[VERIFIED: Tailwind v4 docs at tailwindcss.com/docs/dark-mode, tailwindcss.com/docs/theme]

---

### Pattern 2: OKLCH Chapter Color System

**What:** Each of 18 chapters gets a `--chapter-hue-N` custom property (a bare number, 0-360). CSS rules for chapter accent elements derive the actual color using `oklch()` with different lightness/chroma per theme.

**When to use:** Anywhere a chapter-specific accent appears — left border, badge, top stripe, chapter card header.

**Hue assignments (Claude's Discretion — 20-degree increments starting at 50):**

| Chapter | Hue | Color Region |
|---------|-----|--------------|
| 1 | 50 | Warm amber (near saffron) |
| 2 | 70 | Gold-green |
| 3 | 90 | Yellow-green |
| 4 | 110 | Green |
| 5 | 130 | Teal-green |
| 6 | 150 | Teal |
| 7 | 170 | Cyan-teal |
| 8 | 190 | Cyan |
| 9 | 210 | Sky blue |
| 10 | 230 | Blue |
| 11 | 250 | Blue-violet |
| 12 | 270 | Violet |
| 13 | 290 | Purple |
| 14 | 310 | Magenta-purple |
| 15 | 330 | Pink-magenta |
| 16 | 350 | Red-pink |
| 17 | 10 | Red-orange |
| 18 | 30 | Orange |

[ASSUMED: Starting hue 50 chosen to align Ch1 with saffron-adjacent warmth — planner may adjust]

**CSS implementation pattern:**

```css
/* Source: MDN oklch() relative colors, verified WebFetch 2026-04-09 */

/* Per-chapter hue — set in page-level style or class */
.chapter-1  { --chapter-hue: 50; }
.chapter-2  { --chapter-hue: 70; }
/* ...etc for all 18 chapters */

/* Derive chapter accent per theme */
:root {
  --chapter-accent: oklch(55% 0.14 var(--chapter-hue));   /* light: muted, deeper */
}

html.dark {
  --chapter-accent: oklch(72% 0.18 var(--chapter-hue));   /* dark: brighter, saturated */
}

html.sepia {
  --chapter-accent: oklch(58% 0.12 calc(var(--chapter-hue) + 10));  /* sepia: warm-shifted */
}

/* Usage on elements: */
.chapter-accent-border { border-left-color: var(--chapter-accent); }
.chapter-accent-badge  { background-color: oklch(from var(--chapter-accent) l c h / 0.15); }
```

[VERIFIED: OKLCH relative color syntax from MDN docs, WebFetch 2026-04-09]
[VERIFIED: Browser support for `oklch(from ...)` relative colors — CSS relative color syntax landed in all major browsers in 2024]

---

### Pattern 3: Fluid Type Scale (9-level with CSS clamp)

**What:** 9 type scale steps defined as `--text-*` custom properties using `clamp(min, preferred, max)`. Values are responsive between 375px (mobile) and 1280px (desktop).

**When to use:** Every text element — headings, body, labels, small print.

**Recommended scale (from Utopia generator, 375px@16px/1.2 → 1280px@18px/1.25):**

```css
/* Source: Utopia type calculator (utopia.fyi), verified 2026-04-09 */
@theme {
  /* 9 steps: xs, sm, base, md, lg, xl, 2xl, 3xl, hero */
  --text-xs:   clamp(0.78rem, 0.77rem + 0.03vw, 0.80rem);   /* ~12.5px → 12.8px */
  --text-sm:   clamp(0.94rem, 0.91rem + 0.11vw, 1.00rem);   /* ~15px → 16px */
  --text-base: clamp(1.13rem, 1.07rem + 0.23vw, 1.25rem);   /* ~18px → 20px */
  --text-md:   clamp(1.35rem, 1.26rem + 0.39vw, 1.56rem);   /* ~21.6px → 25px */
  --text-lg:   clamp(1.62rem, 1.48rem + 0.61vw, 1.95rem);   /* ~25.9px → 31.2px */
  --text-xl:   clamp(1.94rem, 1.74rem + 0.90vw, 2.44rem);   /* ~31px → 39px */
  --text-2xl:  clamp(2.33rem, 2.04rem + 1.31vw, 3.05rem);   /* ~37.3px → 48.8px */
  --text-3xl:  clamp(2.80rem, 2.38rem + 1.85vw, 3.81rem);   /* ~44.8px → 61px */
  --text-hero: clamp(3.35rem, 2.81rem + 2.43vw, 4.77rem);   /* ~53.6px → 76.3px */
}
```

**All headings (h1-h4 at minimum) must use `text-wrap: balance`:**

```css
@layer base {
  h1, h2, h3, h4 {
    text-wrap: balance;
  }
}
```

[VERIFIED: `text-wrap: balance` is supported in all modern browsers as of 2023; Tailwind v4 has `text-balance` utility class]

---

### Pattern 4: FOUC-Proof Theme Persistence with Astro ClientRouter

**What:** Inline `is:inline` script in `<head>` reads localStorage and applies theme class before first paint. Event listeners re-apply after Astro page transitions.

**Critical:** Without this, every navigation causes a white flash on dark pages. Astro's `ClientRouter` replaces `document.documentElement` on swap, dropping all classes.

```astro
<!-- In BaseLayout.astro <head> — MUST be before any style rendering -->
<!-- Source: Verified via simonporter.co.uk FOUC article + Astro docs, 2026-04-09 -->
<script is:inline>
  (function() {
    const saved = localStorage.getItem('theme');
    const theme = saved || 'dark'; // dark is default per D-01
    document.documentElement.classList.remove('dark', 'light', 'sepia');
    document.documentElement.classList.add(theme);
  })();
</script>
```

**Re-apply after transitions:**

```astro
<script>
  // Re-apply theme class after Astro ClientRouter swaps documentElement
  function applyTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.remove('dark', 'light', 'sepia');
    document.documentElement.classList.add(theme);
  }
  document.addEventListener('astro:after-swap', applyTheme);
  document.addEventListener('astro:page-load', applyTheme);
</script>
```

[VERIFIED: Astro docs confirm `ClientRouter` replaces documentElement; `astro:after-swap` is the correct event for re-applying classes]
[VERIFIED: `is:inline` prevents Astro from bundling the script, ensuring immediate execution]

---

### Pattern 5: View Transitions (ClientRouter)

**What:** Astro's `ClientRouter` enables SPA-style page transitions with fallback for unsupported browsers.

```astro
---
// In BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---
<head>
  <!-- FOUC script first, then ClientRouter -->
  <ClientRouter />
</head>
```

**Note:** In Astro 5, `<ViewTransitions />` was renamed to `<ClientRouter />`. The import is `from 'astro:transitions'`. [VERIFIED: Astro docs 2026-04-09]

**Shared element morphing (chapter headers, verse refs):**

```astro
<!-- Chapter header that morphs across page transitions -->
<h1 transition:name={`chapter-title-${chapter}`} transition:animate="morph">
  Chapter {chapter}
</h1>
```

**prefers-reduced-motion:** Astro's ClientRouter automatically disables all transition animations when `prefers-reduced-motion: reduce` is detected. The CSS rule `@media (prefers-reduced-motion: reduce)` must also zero out all custom animation durations. [VERIFIED: Astro docs]

---

### Pattern 6: ThemeToggle Component Architecture

**What:** 3-way cycling toggle (Dark → Light → Sepia → Dark). Preact island or vanilla JS.

**Recommendation (Claude's Discretion):** Use a vanilla `<script>` in BaseLayout rather than a Preact island. Rationale: the toggle has zero render-time state — it reads localStorage, applies a class, saves to storage. No JSX or component tree is needed. A Preact island adds ~3kB and a `client:load` hydration cycle for a `<button>` with an `onclick`.

```astro
<!-- In BaseLayout.astro or a shared header component -->
<button id="theme-toggle" aria-label="Toggle theme" title="Toggle display theme">
  <!-- Icon updates via JS -->
</button>

<script>
  const THEMES = ['dark', 'light', 'sepia'] as const;
  const btn = document.getElementById('theme-toggle');

  function cycleTheme() {
    const current = localStorage.getItem('theme') || 'dark';
    const idx = THEMES.indexOf(current as typeof THEMES[number]);
    const next = THEMES[(idx + 1) % THEMES.length];
    localStorage.setItem('theme', next);
    document.documentElement.classList.remove(...THEMES);
    document.documentElement.classList.add(next);
    updateIcon(next);
  }

  function updateIcon(theme: string) {
    if (btn) btn.textContent = theme === 'dark' ? '🌙' : theme === 'sepia' ? '📜' : '☀️';
  }

  btn?.addEventListener('click', cycleTheme);
  // Initialize icon on load and after transitions
  document.addEventListener('astro:page-load', () =>
    updateIcon(localStorage.getItem('theme') || 'dark'));
</script>
```

[ASSUMED: Vanilla JS recommended over Preact island for theme toggle — if Phase 7 header integration requires Preact state management, reconsider]

---

### Anti-Patterns to Avoid

- **`@theme` tokens inside `.dark {}` blocks:** `@theme` must be at the top level — Tailwind ignores tokens inside selectors or media queries. Redefine raw CSS custom properties (without `@theme`) inside `.dark {}` blocks.
- **Calling `ClientRouter` `ViewTransitions`:** The API was renamed in Astro 5. Import from `astro:transitions`, not `astro:client-routing`.
- **Applying theme class only in `astro:page-load`:** This fires after the swap, causing a 1-frame flash. Use `astro:after-swap` for immediate class application.
- **Using `@fontsource/noto-serif-devanagari` (serif) when Noto Sans Devanagari (sans) is specified:** Different font families. Decision D-09 explicitly specifies the sans variant.
- **Defining `--chapter-hue` globally:** This should be scoped to the chapter — either via a `.chapter-N` CSS class, an inline style on the page body, or a data attribute. Do not set it on `:root`.
- **Full-page OKLCH chapter colors:** D-06 explicitly says "Never full-page backgrounds." Chapter colors go on borders, stripes, badges only.
- **`text-balance` Tailwind utility vs `text-wrap: balance` CSS:** Tailwind v4 has `text-balance` as a utility class. Either works; prefer the utility class for consistency with Tailwind patterns.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page transitions | Custom JS animation system | `ClientRouter` from `astro:transitions` | Browser View Transitions API handles diff, morph, fallback automatically |
| OKLCH color math | CSS-in-JS color libraries, color calculations at build time | `oklch(from var(...) l c h)` native CSS | Relative colors are now browser-native; zero dependency |
| Fluid type scale values | Manual calculation per breakpoint | CSS `clamp()` with Utopia-derived values | Clamp eliminates breakpoint jumps; Utopia generates valid values |
| Font loading | Custom `@font-face` declarations | `@fontsource-variable/*` packages | Fontsource handles unicode-range subsetting, format variants, self-hosting automatically |
| Theme class persistence | Reading/writing DOM across all pages | Single `is:inline` head script + `astro:after-swap` listener | Astro's lifecycle events are the sanctioned integration point |

**Key insight:** The browser platform now natively handles most "fancy" design system features (color math, fluid sizing, transitions). The implementation work is orchestration — wiring the right CSS APIs together — not algorithm implementation.

---

## Common Pitfalls

### Pitfall 1: FOUC on Dark Theme Navigation
**What goes wrong:** User navigates between pages; a white/cream flash appears on each navigation even in dark mode.
**Why it happens:** Astro `ClientRouter` replaces `document.documentElement` during page swap, dropping the `.dark` class. If the theme class is only applied by JavaScript that runs after swap, there's a one-frame flash of the default (light) style.
**How to avoid:** Place an `is:inline` script in `<head>` (before any `<link>` or `<style>` that renders the page) that reads localStorage and applies the class synchronously. Also add an `astro:after-swap` listener that re-applies the class immediately when the new document is swapped in.
**Warning signs:** Dark → page link click → white flash → dark again. Visible on slow networks or slow CPUs.

### Pitfall 2: `@theme` Token Overrides Inside Selectors Don't Work
**What goes wrong:** Tokens defined inside `.dark { @theme { --color-bg: #1a1714; } }` are silently ignored by Tailwind.
**Why it happens:** Tailwind v4's `@theme` directive is a compile-time construct that must live at the top level of the CSS file. Nesting it inside a selector is not supported.
**How to avoid:** Put `@theme` at the top level for the base (light) theme values only. Override by redefining raw CSS custom properties inside `.dark {}`, `.sepia {}` blocks. The CSS variable cascade handles the rest.
**Warning signs:** `bg-[--color-bg]` shows the same value regardless of dark/light class on `<html>`.

### Pitfall 3: Script Re-execution with ClientRouter
**What goes wrong:** A Preact island or inline script initializes once on first load but doesn't re-run after navigation — leading to stale state, broken event listeners, or missing DOM setup.
**Why it happens:** Bundled module scripts in Astro run once per session, not once per page. Inline scripts may re-run unpredictably.
**How to avoid:** Wrap initialization code in `document.addEventListener('astro:page-load', () => {...})`. Use `data-astro-rerun` on inline scripts that must re-execute. For the theme toggle, attach listeners in `astro:page-load` rather than at module top-level.
**Warning signs:** Theme toggle button stops working after navigating away and back.

### Pitfall 4: Noto Sans Devanagari Variable Font Import Path
**What goes wrong:** Importing `@fontsource-variable/noto-sans-devanagari` without specifying the subset file loads all subsets (Latin + Devanagari), doubling download size.
**Why it happens:** Fontsource variable packages have axis-specific CSS files. The default import may include all axes.
**How to avoid:** Import `@fontsource-variable/noto-sans-devanagari/wght.css` explicitly, which loads only the weight axis with proper `unicode-range` subsetting. [VERIFIED: Fontsource docs]
**Warning signs:** Large font download in DevTools Network panel where only the Devanagari subset should load.

### Pitfall 5: `--chapter-hue` on `:root` Causing Color Bleed
**What goes wrong:** All pages show the same chapter color (e.g., Chapter 1's amber) because `--chapter-hue` is set globally.
**Why it happens:** If `--chapter-hue` is defined in `:root` or `@theme`, it applies site-wide. Chapter pages need to scope this to their specific value.
**How to avoid:** Set `--chapter-hue` as an inline style on the `<body>` or `<main>` element from the page's frontmatter, or via a `.chapter-N` class. Example: `<body style={`--chapter-hue: ${chapter.hue}`}>`.
**Warning signs:** Chapter 3 page shows Chapter 1's color in headers/badges.

### Pitfall 6: Existing Island Colors Hardcoded to Light Palette
**What goes wrong:** `ApplicationCards.tsx` and other islands use `var(--color-warm-50)`, `var(--color-warm-100)`, etc. — which are not redefined per theme, so they stay cream in dark mode.
**Why it happens:** The existing `global.css` defines `--color-warm-*` as absolute values in `@theme`. They don't automatically invert.
**How to avoid:** Add semantic alias tokens (e.g., `--color-surface`, `--color-surface-raised`, `--color-border`) that map to the right warm values per theme. Update islands to use semantic tokens, or override `--color-warm-*` values per theme class.
**Warning signs:** Cards appear light-colored on dark backgrounds after enabling dark mode.

---

## Code Examples

### Complete Theme Token Structure in global.css

```css
/* Source: Tailwind v4 docs + verified patterns, 2026-04-09 */
@import "tailwindcss";
@source "../../src/**/*.{astro,tsx,ts}";

/* Register multi-theme variants */
@custom-variant dark (&:where(.dark, .dark *));
@custom-variant sepia (&:where(.sepia, .sepia *));

@theme {
  /* === FONTS === */
  --font-display:    'Cormorant Garamond Variable', Georgia, serif;
  --font-body:       'Source Serif 4 Variable', Georgia, serif;
  --font-ui:         'Inter Variable', system-ui, sans-serif;
  --font-devanagari: 'Noto Sans Devanagari Variable', sans-serif;

  /* === SEMANTIC COLOR TOKENS (light/default) === */
  --color-bg:         #FAF7F2;
  --color-bg-raised:  #F0EBE1;
  --color-border:     #E4DDD0;
  --color-text:       #332D24;
  --color-text-2:     #6B5F4E;
  --color-text-3:     #8A7D6B;
  --color-text-4:     #A89B88;
  --color-accent:     #C4832D;   /* saffron — consistent across all themes */
  --color-accent-dim: #C4832D20;

  /* === WARM PALETTE (raw — keep for backward compat) === */
  --color-cream:      #FAF7F2;
  --color-warm-50:    #F8F5EF;
  --color-warm-100:   #F0EBE1;
  --color-warm-200:   #E4DDD0;
  --color-warm-300:   #CCC3B2;
  --color-warm-400:   #A89B88;
  --color-warm-500:   #8A7D6B;
  --color-warm-600:   #6B5F4E;
  --color-warm-700:   #4A4035;
  --color-warm-800:   #332D24;
  --color-warm-900:   #1E1A14;
  --color-saffron:    #C4832D;

  /* === FLUID TYPE SCALE === */
  --text-xs:   clamp(0.78rem, 0.77rem + 0.03vw, 0.80rem);
  --text-sm:   clamp(0.94rem, 0.91rem + 0.11vw, 1.00rem);
  --text-base: clamp(1.13rem, 1.07rem + 0.23vw, 1.25rem);
  --text-md:   clamp(1.35rem, 1.26rem + 0.39vw, 1.56rem);
  --text-lg:   clamp(1.62rem, 1.48rem + 0.61vw, 1.95rem);
  --text-xl:   clamp(1.94rem, 1.74rem + 0.90vw, 2.44rem);
  --text-2xl:  clamp(2.33rem, 2.04rem + 1.31vw, 3.05rem);
  --text-3xl:  clamp(2.80rem, 2.38rem + 1.85vw, 3.81rem);
  --text-hero: clamp(3.35rem, 2.81rem + 2.43vw, 4.77rem);

  /* === ANIMATIONS === */
  --animate-fade-in:  fade-in 0.35s ease-out;
  --animate-slide-up: slide-up 0.4s ease-out;
  --animate-breathe:  breathe 6s ease-in-out infinite;
  --animate-page-in:  page-enter 0.3s ease-out;
}

/* === DARK THEME OVERRIDES === */
html.dark {
  --color-bg:         #1a1714;
  --color-bg-raised:  #231f1b;
  --color-border:     #2e2925;
  --color-text:       #f5f0e8;
  --color-text-2:     #c8bba8;
  --color-text-3:     #a89b88;
  --color-text-4:     #6B5F4E;
}

/* === SEPIA THEME OVERRIDES === */
html.sepia {
  --color-bg:         #f4e8c1;
  --color-bg-raised:  #ecdcac;
  --color-border:     #d4c28a;
  --color-text:       #3b2f1e;
  --color-text-2:     #5a4535;
  --color-text-3:     #6b5a42;
  --color-text-4:     #8A7D6B;
}
```

### BaseLayout.astro Updates

```astro
---
import '../styles/global.css';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/noto-sans-devanagari/wght.css';
import '@fontsource-variable/inter';
import { ClientRouter } from 'astro:transitions';
---
<!doctype html>
<html lang="en">
  <head>
    <!-- FOUC prevention — must be first script in head -->
    <script is:inline>
      (function() {
        const t = localStorage.getItem('theme') || 'dark';
        document.documentElement.classList.remove('dark', 'light', 'sepia');
        document.documentElement.classList.add(t);
      })();
    </script>
    <ClientRouter />
    <!-- rest of head -->
  </head>
  <body class="min-h-screen flex flex-col bg-[--color-bg] text-[--color-text]">
    <script>
      // Re-apply theme after ClientRouter page swaps
      function applyTheme() {
        const t = localStorage.getItem('theme') || 'dark';
        document.documentElement.classList.remove('dark', 'light', 'sepia');
        document.documentElement.classList.add(t);
      }
      document.addEventListener('astro:after-swap', applyTheme);
      document.addEventListener('astro:page-load', applyTheme);
    </script>
    <slot />
  </body>
</html>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ViewTransitions` import | `ClientRouter` from `astro:transitions` | Astro 5 | Must use new name — old name may throw or not exist |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 + Astro 5.2 | Already done in this project; no change needed |
| `tailwind.config.js` dark mode | `@custom-variant dark` in CSS | Tailwind v4 | No JS config file; all CSS-native |
| Media-query dark mode | Class-based with `@custom-variant` | Tailwind v4 | Allows manual toggle (not just OS preference) |
| `calc()` breakpoint type scaling | `clamp()` fluid type | 2021-present | No breakpoint jumps; smoother reading experience |
| Tiro Devanagari Sanskrit | Noto Sans Devanagari | D-09 decision | Sans style chosen over serif for Sanskrit rendering |

**Deprecated/outdated:**
- `@fontsource/tiro-devanagari-sanskrit`: Remove per D-09
- `@fontsource/noto-serif-devanagari`: Remove per D-09
- `<ViewTransitions />`: Use `<ClientRouter />` in Astro 5

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Starting OKLCH hue at 50° (warm amber) for Chapter 1 | Architecture Patterns / Pattern 2 | Planner may want different starting hue; colors still mathematically valid at any start |
| A2 | Vanilla JS `<script>` preferred over Preact island for theme toggle | Pattern 6 | If Phase 7 header integration requires Preact component tree, will need to convert to island |
| A3 | Single `global.css` file recommended (no splitting into partials) | Recommended Project Structure | If file grows beyond ~300 lines, split becomes preferable |
| A4 | `--color-warm-*` raw tokens kept for backward compatibility with existing islands | Code Examples | Islands may need targeted updates if raw tokens conflict with dark theme |

---

## Open Questions

1. **Island backward compatibility with dark mode**
   - What we know: `ApplicationCards.tsx` and others use `var(--color-warm-50)`, `var(--color-warm-100)` which are defined as fixed light-mode values
   - What's unclear: Whether these raw token usages will look acceptable in dark mode, or whether islands need token updates in this phase
   - Recommendation: Plan a "token audit" task that lists all raw `--color-warm-*` usages in islands, and either redefine them per theme or replace with semantic tokens. This is likely a Wave 1 task.

2. **Chapter hue assignment in pages**
   - What we know: Each verse/chapter page needs `--chapter-hue` scoped to that chapter
   - What's unclear: Best mechanism — inline style on `<body>`, a `.chapter-N` class, or a data attribute
   - Recommendation: Use `style={`--chapter-hue: ${chapterHue}`}` on `<body>` or `<main>` from frontmatter — simplest, no extra class names needed

3. **Cormorant Garamond display headings**
   - What we know: D-08 lists Cormorant Garamond for display headings (chapter titles, hero text) and already installed
   - What's unclear: No change is needed to install it, but the `--font-display` token must be wired to Tailwind `font-display` class
   - Recommendation: Confirm `font-display` utility class works in Tailwind v4 — already defined in current @theme, confirmed working

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | ✓ | 20.x (Astro requirement) | — |
| Astro | Framework | ✓ | 5.18.0 [VERIFIED: node_modules] | — |
| Tailwind CSS | Design tokens | ✓ | 4.2.1 [VERIFIED: node_modules] | — |
| `@tailwindcss/vite` | Vite plugin | ✓ | installed [VERIFIED: astro.config.mjs] | — |
| `@fontsource-variable/cormorant-garamond` | Display font | ✓ | 5.2.6 [VERIFIED: package.json] | — |
| `@fontsource-variable/source-serif-4` | Body font | ✓ | 5.2.9 [VERIFIED: package.json] | — |
| `@fontsource-variable/noto-sans-devanagari` | Devanagari font | ✗ | — | Must install |
| `@fontsource-variable/inter` | UI font | ✗ | — | Must install |
| `oklch()` relative colors | Chapter colors | ✓ | All modern browsers 2024+ | Fall back to static OKLCH values per theme |
| CSS View Transitions API | ClientRouter | ✓ | Chrome/Edge/Firefox 2024+; graceful degradation in Safari ≤15 | ClientRouter degrades to instant navigation automatically |

**Missing dependencies requiring installation:**
- `@fontsource-variable/noto-sans-devanagari` — required for DES-03 (Sanskrit typography)
- `@fontsource-variable/inter` — required for DES-03 (UI chrome typography)

---

## Validation Architecture

Nyquist validation is enabled (no explicit `false` in config.json).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — Phase 6 is CSS/visual only |
| Config file | Not applicable |
| Quick run | `pnpm build` (Astro build catches CSS syntax errors) |
| Full suite | `pnpm build && pnpm preview` (visual inspection) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| DES-01 | Dark theme active by default; warm charcoal bg, off-white text | Manual | `pnpm dev` → open browser → confirm dark renders | Build must not error |
| DES-02 | Theme toggle cycles dark→light→sepia; persists on reload | Manual | Click toggle 3 times, reload between each | localStorage key `theme` confirmed |
| DES-03 | Source Serif 4, Noto Sans Devanagari, Inter load on pages | Manual | DevTools Network → Font filter → confirm 3 families | No Google Fonts CDN calls |
| DES-04 | Headings reach 40px+ on desktop; fluid on resize | Manual | Chrome DevTools Computed tab on h1 at 1280px | `clamp()` math verifiable |
| DES-05 | 18 chapters show distinct accent colors | Manual | Visit chapter 1 and chapter 10 pages; left border colors differ | OKLCH hue delta = 200deg between those two |
| DES-06 | Semantic tokens resolve correctly per theme | Manual | DevTools → Inspect → computed `--color-bg` changes with theme class | |
| DES-07 | Page transitions fade; `prefers-reduced-motion` disables animation | Manual | Chrome DevTools → Rendering → Emulate prefers-reduced-motion | Transitions should instant-swap |
| DES-08 | 375px viewport no horizontal scroll | Manual | DevTools device emulation → iPhone SE → no horizontal scroll | Check all main page types |

### Wave 0 Gaps

No new test files needed — this phase has no automated test surface. Visual regression tests are out of scope for v1.

---

## Security Domain

Phase 6 introduces no server-side logic, no user input processing, and no new attack surface. The only new JS is:
- An `is:inline` head script reading `localStorage` (same-origin, no XSS vector)
- A theme toggle script writing to `localStorage` (string enum values only, no eval)

ASVS not applicable to this phase. localStorage values are strictly enum-constrained (`'dark' | 'light' | 'sepia'`); no sanitization needed beyond ignoring unknown values (treat as default 'dark').

---

## Sources

### Primary (HIGH confidence)
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) — `ClientRouter`, lifecycle events, `is:inline`, `astro:after-swap`
- [Tailwind v4 dark mode docs](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark`, class-based dark mode, multi-theme
- [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme) — `@theme` namespace semantics, `@custom-variant` syntax
- [MDN CSS relative colors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors) — `oklch(from ...)` syntax
- [Fontsource Noto Sans Devanagari](https://fontsource.org/fonts/noto-sans-devanagari/install) — import path, variable font, subsets
- `node_modules/astro/package.json` — confirmed Astro 5.18.0
- `node_modules/tailwindcss/package.json` — confirmed Tailwind 4.2.1

### Secondary (MEDIUM confidence)
- [Simon Porter: FOUC with Astro + Tailwind](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/) — `astro:after-swap` + `is:inline` pattern
- [Utopia type calculator](https://utopia.fyi/) — 9-step `clamp()` values, 375px→1280px range
- [DEV: Create Custom Themes in Tailwind v4](https://dev.to/vrauuss_softwares/-create-custom-themes-in-tailwind-css-v4-custom-variant-12-2nf0) — `@custom-variant` with data attributes and class-based themes

### Tertiary (LOW confidence)
- npm registry query — `@fontsource-variable/noto-sans-devanagari@5.2.8`, `@fontsource-variable/inter@5.2.8` [VERIFIED: npm view]

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in node_modules or npm registry
- Theme architecture: HIGH — Tailwind v4 docs + working code examples verified
- OKLCH color system: HIGH — MDN verified; CSS relative colors browser-supported since 2024
- FOUC prevention: HIGH — Astro docs + community article both confirm same pattern
- Fluid type scale: MEDIUM — Utopia calculator values used; exact pixel fit needs visual verification
- Animation/transitions: HIGH — Astro docs confirm prefers-reduced-motion behavior

**Research date:** 2026-04-09
**Valid until:** 2026-07-09 (stable APIs — Astro 5.x, Tailwind 4.x; check for Astro 6 stable release)
