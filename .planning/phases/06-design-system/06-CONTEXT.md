# Phase 6: Design System - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 delivers a bold, 37signals-inspired visual language and a life-lesson-first homepage. Solid primary colors, sans-serif bold headings, full-page search takeover, and 18 numbered life lessons as the front door. Light + Dark modes only. All codified in CSS custom properties and Tailwind v4 theme blocks.

</domain>

<decisions>
## Implementation Decisions

### Color Palette & Mood
- **D-01:** Bold primary colors like 37signals/HEY/Basecamp — saturated blue, warm yellow, forest green, burnt orange. Solid color blocks, not gradients or warm creams.
- **D-02:** Each section or chapter can get a bold solid background color with white or dark text on top. No transparency, no blur, no gradients.
- **D-03:** Saffron (#C4832D) remains the brand accent but lives alongside the bold primaries, not as the dominant palette.

### Theme Modes
- **D-04:** Two modes only: Light (default) + Dark. Drop sepia entirely.
- **D-05:** Light mode: bold solid colors on white/light neutral backgrounds. Dark mode: same bold colors, brighter/more saturated on dark backgrounds.
- **D-06:** Theme toggle: simple Dark/Light switch. Persisted in localStorage key 'theme'. Applied via class on `<html>`.

### Homepage Layout
- **D-07:** Homepage = bold numbered list of 18 life lessons. Full-width rows, huge numbers (1-18), lesson text large and prominent. Like a manifesto.
- **D-08:** Search box at top of homepage, above the lessons list.
- **D-09:** Each lesson is a direct link to the chapter page — no expand, no accordion, no hover preview. Click lesson → chapter page.
- **D-10:** Chapter grid (current design) becomes secondary — the 18 life lessons ARE the primary navigation.

### Search
- **D-11:** Full-page takeover when user types in search box. Like Spotlight/Alfred overlay.
- **D-12:** Shows matching life questions from the database, grouped by life area.
- **D-13:** Accepts freeform queries — user can type any question and get matched to relevant verses.
- **D-14:** Existing LifeSearch.tsx Preact island with Fuse.js can be adapted for the full-page takeover behavior.

### Typography
- **D-15:** Mix approach: Inter Bold for headings and UI elements. Source Serif 4 for body/reading text (verse translations, explanations).
- **D-16:** Noto Sans Devanagari stays for Sanskrit text at 110% scale.
- **D-17:** Drop Cormorant Garamond — Inter replaces it for display headings.
- **D-18:** Fluid type scale still applies — headings should be large and bold.

### Animation & Motion
- **D-19:** Keep Astro View Transitions (ClientRouter) for page transitions — crossfade 300ms.
- **D-20:** prefers-reduced-motion: disable all animation without breaking layout.
- **D-21:** Minimal animation overall — the bold colors and typography do the work, not motion.

### Claude's Discretion
- Exact primary color values (specific hex/oklch for the bold palette)
- CSS custom property naming
- Responsive breakpoints and spacing
- 18-chapter color assignment (which bold color for which chapter)
- Search overlay implementation details (z-index, animation, close behavior)
- Whether theme toggle is Preact island or vanilla JS

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints
- `.planning/REQUIREMENTS.md` — DES-01 through DES-08 are this phase's requirements
- `.planning/ROADMAP.md` — Phase 6 success criteria and dependency map

### Existing Code
- `src/styles/global.css` — Current Tailwind v4 theme block. Will be heavily rewritten with bold palette.
- `src/layouts/BaseLayout.astro` — Current font imports and page structure. Needs font changes, theme toggle update.
- `src/pages/index.astro` — Current homepage with chapter grid. Has `chapterMeta` array with lesson fields. Will be redesigned.
- `src/components/islands/LifeSearch.tsx` — 403-line Preact island with Fuse.js search. Adapt for full-page takeover.
- `src/styles/global-version-a.css` — Backup of pre-Phase 6 global.css (keep as reference).

### Design Reference
- 37signals.com, hey.com, basecamp.com — Bold solid color blocks, clean sans-serif typography, confident layout

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LifeSearch.tsx` — Fuse.js fuzzy search with question index, curated themes, verse grouping. Core search logic reusable — needs UI overhaul for full-page takeover.
- `chapterMeta` in `index.astro` — Already has lesson text per chapter. Direct data source for the new homepage.
- `global.css` @theme{} block — Tailwind v4 theme tokens pattern established. Rewrite with bold palette.
- Existing animations (fade-in, slide-up) — Keep for transitions.

### Established Patterns
- Tailwind v4 CSS-native config via `@theme{}` blocks
- Self-hosted fonts via `@fontsource` packages
- Preact islands with `client:load` / `client:visible` / `client:idle`
- CSS custom properties for design tokens

### Integration Points
- Theme toggle needs to work with future header (Phase 7)
- Bold chapter colors consumed by chapter pages, verse pages, commentary panels
- Typography scale used across all subsequent phases
- Search takeover component used site-wide

</code_context>

<specifics>
## Specific Ideas

- 37signals aesthetic: solid bold color blocks, not gradients or transparency
- Homepage feels like a manifesto — "18 life lessons" with huge numbers
- Search feels like Spotlight/Alfred — full-page takeover, immediate, powerful
- Direct chapter links — no friction, click and go
- Confident, opinionated design — not trying to look like every other spiritual site

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-design-system*
*Context gathered: 2026-04-10*
