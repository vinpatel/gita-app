# Phase 1: Foundation - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning
**Source:** User input + existing project research

<domain>
## Phase Boundary

Phase 1 delivers the project scaffold, content schema, CI/CD pipeline, and legal guardrails. After this phase, content generation (Phase 2) can begin on stable foundations with no risk of schema churn or copyright violation.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack
- Astro 5 with TypeScript strict mode
- Tailwind CSS v4 via `@tailwindcss/vite` plugin — NOT deprecated `@astrojs/tailwind`
- Preact for interactive islands (3kB runtime)
- Node.js 20 LTS

### Content Schema
- Per-chapter JSON files in Astro Content Collections with `file()` loader
- Zod schema validates all fields at build time: Sanskrit (Devanagari), IAST transliteration, plain-language explanation, curated synthesis, tradition commentaries (2-3), practical applications (4 domains), life-theme tags
- IAST is the mandatory transliteration standard — schema must reject non-IAST input
- Gita Press (Gorakhpur) is the canonical source for verse numbering (700-verse structure)

### Content Architecture
- Content-first critical path: schema before generation, generation before UI
- Progressive reveal structure: Sanskrit → transliteration → explanation → commentaries → practical applications
- Practical life applications across domains: Personal Growth, Career/Business, Health, Relationships
- Problem-based discovery: each verse tagged with life themes (stress, decision-making, loss, duty, etc.)

### Design Philosophy
- Clean, serene, minimal — breathing room for spiritual text
- No ads, no popups, no clutter
- Mobile-responsive, Devanagari at minimum 20px

### Legal Guardrails
- AI-generated content uses only public domain sources
- No copyrighted commentary text reproduced (BBT, Chinmaya Mission)
- AI prompts must paraphrase philosophical traditions, not reproduce
- MIT license for open source

### CI/CD
- GitHub Actions with `withastro/action` for zero-config GitHub Pages deploy
- Cache `node_modules/` and `.astro/` directory
- Build target: under 5 minutes

### Claude's Discretion
- Folder structure and naming conventions within Astro project
- Specific Zod schema field types and validation patterns
- Test shloka content for schema validation
- GitHub Actions workflow YAML specifics

</decisions>

<specifics>
## Specific Ideas

- Include one test shloka (e.g., BG 1.1) in chapter 1 JSON to validate schema end-to-end at build time
- Components directory split: `components/astro/` (zero JS) vs `components/islands/` (ships JS) — physical separation enforces JS budget
- Self-hosted fonts via Fontsource: Tiro Devanagari Sanskrit + Noto Serif Devanagari
- Pagefind (astro-pagefind) added to dependencies now but configured in Phase 4

</specifics>

<deferred>
## Deferred Ideas

- Audio playback — v2+
- User accounts / login — static site, no backend
- AI chatbot — requires backend API
- Dark mode — Phase 5/6

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-01 from user input + project research*
