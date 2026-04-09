# Phase 6: Design System - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 delivers a consistent visual language for all subsequent v2.0 phases to consume: dark-default theme with light and sepia alternatives, OKLCH chapter color system, typography scale, animation baseline, and responsive foundation. All codified in CSS custom properties and Tailwind v4 theme blocks.

</domain>

<decisions>
## Implementation Decisions

### Theme Modes & Switching
- **D-01:** 3-way theme toggle: Dark (default) / Light / Sepia. Cycling control in the site header. Applied via class on `<html>` element (`dark` | `light` | `sepia`). Persisted in localStorage key `theme`.
- **D-02:** Dark mode palette: warm charcoal background (#1a1714), warm off-white text (#f5f0e8), secondary text (#a89b88), saffron gold accent (#C4832D). Vibe: "ancient library at night."
- **D-03:** Light mode palette: current cream (#FAF7F2) base with warm-800 text. Existing warm palette carries over.
- **D-04:** Sepia mode palette: aged parchment background (#f4e8c1), dark brown text (#3b2f1e), secondary (#6b5a42), saffron gold accent. Vibe: "reading a physical manuscript."
- **D-05:** Theme toggle lives in the persistent site header bar, next to the depth-level selector (Phase 7 wires it up; Phase 6 provides the component and token infrastructure).

### Chapter Color System
- **D-06:** 18 chapter colors generated using OKLCH color space with 20-degree hue increments. Used as accent touches only: header accent bar/border, chapter card left border/badge, verse page top stripe. Never full-page backgrounds. Saffron gold remains the global accent.
- **D-07:** Chapter colors adapt per theme mode via auto lightness shift: same OKLCH hue, but lightness/chroma adjust — dark mode = brighter/more saturated, light mode = muted/deeper, sepia = warm-shifted. One `--chapter-hue` CSS custom property per chapter, lightness/chroma derived in CSS.

### Typography & Type Scale
- **D-08:** Font stack: Cormorant Garamond (display headings — chapter titles, hero text), Source Serif 4 (body/translations/prose), Inter (UI chrome — nav, buttons, labels, metadata), Noto Sans Devanagari at 110% scale (Sanskrit/Devanagari text).
- **D-09:** Replace Tiro Devanagari Sanskrit + Noto Serif Devanagari with Noto Sans Devanagari. Install `@fontsource/noto-sans-devanagari` (or variable variant). Remove Tiro and Noto Serif Devanagari packages.
- **D-10:** 9-level fluid type scale using CSS clamp() — responsive sizes that scale between mobile and desktop with no breakpoint jumps. Headings reach 40px+ on desktop. Scale: text-xs through text-hero.
- **D-11:** Headings use `text-wrap: balance` for visual harmony.

### Animation & Motion
- **D-12:** Contemplative & subtle animation personality: slow, gentle transitions (300-500ms). Fade + slight vertical shift for page enters. Staggered fade-in for lists (50ms delay between items). No bouncing, springs, or overshoots. Easing: ease-out for enters, ease-in for exits.
- **D-13:** prefers-reduced-motion: instant swap — all animation/transition durations set to ~0ms. Content still appears/disappears but without movement or fading.
- **D-14:** Use Astro View Transitions API (`<ViewTransitions />` component) for cross-page transitions. Crossfade (300ms) for page changes, morph for shared elements (chapter headers, verse refs). Graceful degradation in unsupported browsers.

### Claude's Discretion
- Exact OKLCH hue values for each of 18 chapters (within the 20-degree increment constraint)
- Exact clamp() values for the 9-level type scale (within the 40px+ heading constraint)
- CSS custom property naming conventions
- Semantic color token naming (primary/secondary/tertiary/quaternary text tokens)
- Responsive breakpoints and spacing scale
- Whether theme toggle is Preact island or vanilla JS `<script>`
- Structure of design system files (single global.css vs split partials)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` -- Core value, constraints, design inspiration references (Sefaria, Quran.com, Linear, Daily Stoic, 37signals)
- `.planning/REQUIREMENTS.md` -- DES-01 through DES-08 are this phase's requirements
- `.planning/ROADMAP.md` -- Phase 6 success criteria and dependency map

### Existing Code
- `src/styles/global.css` -- Current Tailwind v4 theme block with warm palette tokens, animations. Will be heavily modified.
- `src/layouts/BaseLayout.astro` -- Current font imports and page structure. Needs ViewTransitions, theme class, font changes.
- `src/components/islands/` -- 3 existing Preact islands (ApplicationCards, CommentaryTabs, LifeSearch) that must work with new tokens.

### No External Specs
No external design specs or ADRs exist. Requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `global.css` @theme{} block: Tailwind v4 theme tokens already in place — extend with dark/sepia modes and chapter colors
- `BaseLayout.astro`: Font loading pattern established — add Inter, swap Devanagari fonts, add ViewTransitions
- Existing animations (fade-in, slide-up, breathe): Keep and extend with the contemplative motion system

### Established Patterns
- Tailwind v4 CSS-native config via `@theme{}` blocks — no tailwind.config.js (Phase 1 decision)
- Self-hosted fonts via `@fontsource` packages (Phase 1 decision)
- Preact islands in `src/components/islands/` with `client:load` / `client:visible` directives
- CSS custom properties for design tokens (already used for colors, fonts, animations)

### Integration Points
- Theme toggle component needs to work with future header (Phase 7)
- Chapter color tokens consumed by chapter grid (Phase 7), verse pages (Phase 8), commentary panel (Phase 9)
- Typography scale used across all subsequent phases
- View Transitions in BaseLayout.astro affect all page navigation site-wide

</code_context>

<specifics>
## Specific Ideas

- Dark mode vibe: "ancient library at night" — warm charcoal, not cold/tech
- Sepia mode vibe: "reading a physical manuscript" — parchment, not just tinted white
- Chapter colors as accent touches only (left borders, top stripes, badges) — never full-page backgrounds
- Saffron gold (#C4832D) remains the global accent across all modes

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 06-design-system*
*Context gathered: 2026-04-09*
