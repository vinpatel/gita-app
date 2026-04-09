# Roadmap: The Bhagavad Gita

## Milestones

- [x] **v1.0 Foundation** - Phases 1-5 (foundation, content pipeline, core UI, search, open source)
- [x] **v1.1 Life Problem Search** - Phase 01.1 (curated question-to-verse search with typeahead)
- [ ] **v2.0 Redesign** - Phases 6-13 (premium visual redesign, depth system, shareability, authority)

---

<details>
<summary>v1.0 + v1.1 (Phases 1-5 + 01.1) - COMPLETE</summary>

## Overview (v1.0)

Build a static Bhagavad Gita web application that makes every shloka actionable wisdom. The critical path is content-first: schema and infrastructure before content generation, content before UI, search after content exists. V1 delivers chapters 1 and 2 fully polished — progressive reveal UX, synthesized multi-tradition commentary, and practical life applications — proving the template before scaling to all 700 shlokas.

## Phases (v1.0)

- [x] **Phase 1: Foundation** - Astro 5 project scaffold, content schema, CI/CD, and legal guardrails
- [x] **Phase 01.1: Life Problem Search** - Curated question-to-verse mappings with client-side fuzzy search and typeahead (INSERTED)
- [ ] **Phase 2: Content Pipeline** - AI generation and human review of all 119 shlokas for chapters 1 and 2
- [ ] **Phase 3: Core Reading UI** - Chapter grid, shloka pages, progressive reveal, and mobile-responsive design
- [ ] **Phase 4: Search and SEO** - Pagefind full-text search, problem-based search, sitemap, and accessibility
- [ ] **Phase 5: Open Source Readiness** - CONTRIBUTING.md, README, MIT license, and contribution templates

## Phase Details (v1.0)

### Phase 1: Foundation
**Goal**: A working Astro 5 project exists with a validated content schema, functional CI/CD, and legal guardrails established — so content generation can begin without risk of schema churn or copyright violation
**Depends on**: Nothing (first phase)
**Requirements**: INF-01, INF-02, INF-03, INF-05, CONT-08, CONT-10
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` produces a static site with zero errors and deploys to GitHub Pages via GitHub Actions
  2. A per-chapter JSON file for chapter 1 with one test shloka passes Zod schema validation at build time (all required fields: Sanskrit, IAST transliteration, synthesis, commentaries, applications, themes)
  3. The schema enforces IAST transliteration standard and Gita Press verse numbering — a file with Harvard-Kyoto or wrong verse numbers fails validation
  4. The build completes in under 5 minutes on GitHub Actions with node_modules and .astro caching active
  5. The repository is public with MIT license and Gita Press declared as canonical source in project docs
**Plans**: 4 plans in 3 waves

Plans:
- [x] 01-01-PLAN.md — Astro 5 project init with Tailwind v4, Preact, TypeScript strict, and folder structure (Wave 1)
- [x] 01-02-PLAN.md — Content Collection schema (Zod) for shloka data with IAST enforcement and test shloka (Wave 2)
- [x] 01-03-PLAN.md — GitHub Actions CI/CD pipeline with caching and GitHub Pages deploy (Wave 3)
- [x] 01-04-PLAN.md — MIT license, canonical source declaration, and AI content policy (Wave 1)

### Phase 01.1: Life Problem Search (INSERTED)

**Goal:** Users can type a real-life problem into a search box with typeahead suggestions and find relevant Gita verses — curated life-questions.json, client-side fuzzy search Preact island, and results with life applications
**Requirements**: UX-03, UX-04, CONT-09
**Depends on:** Phase 1
**Plans:** 2/2 plans complete

Plans:
- [x] 01.1-01-PLAN.md — Install Fuse.js, build-time search index endpoint, and LifeSearch Preact island (Wave 1)
- [x] 01.1-02-PLAN.md — /explore/ search page, homepage search integration, and human verification (Wave 2)

### Phase 2: Content Pipeline
**Goal**: All 119 shlokas across chapters 1 and 2 exist as validated JSON files — reviewed for copyright compliance, theological accuracy, and transliteration consistency — ready for the UI to render
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-09, DES-04
**Success Criteria** (what must be TRUE):
  1. All 47 chapter 1 shlokas and all 72 chapter 2 shlokas exist as schema-valid JSON files with no build errors
  2. Every shloka has Sanskrit (Devanagari), IAST transliteration, plain-language explanation, curated synthesis, at least 2 tradition-specific commentaries, and 4-domain practical applications
  3. Every shloka has at least 3 life-theme tags (e.g., grief, duty, fear, decision-making) enabling problem-based search
  4. A human reviewer has checked all tradition-attribution claims — no philosophical position is misattributed to the wrong school (e.g., bhakti emphasis not attributed to Shankaracharya)
  5. Both chapter summaries exist with theme overview and key teachings
**Plans**: TBD

Plans:
- [ ] 02-01: AI generation pipeline — prompt templates, batch workflow, chapter 1 generation
- [ ] 02-02: Chapter 1 human review — theology check, copyright audit, transliteration audit
- [ ] 02-03: Chapter 2 generation and review (same pipeline, validated by chapter 1 experience)
- [ ] 02-04: Chapter summaries, theme tagging pass, and schema validation of full dataset

### Phase 3: Core Reading UI
**Goal**: Users can read any shloka in chapters 1 and 2 with the full progressive reveal experience — Sanskrit first, then each layer revealed on demand — across all devices
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, UX-01, UX-02, DES-01, DES-02, DES-03
**Success Criteria** (what must be TRUE):
  1. The home page shows 18 chapter cards; clicking chapters 1 or 2 opens them; chapters 3-18 are visibly marked "coming soon"
  2. A user visiting a shloka page sees Sanskrit text first; tapping/clicking reveals transliteration, then synthesis explanation, then individual commentaries (each expandable independently), then practical applications — each layer hidden until revealed
  3. A user can navigate from the last shloka of chapter 1 to the first shloka of chapter 2 using the "next" button
  4. A user on an iPhone SE (375px) can read Devanagari script at minimum 20px with no horizontal scroll
  5. Sanskrit text renders in Tiro Devanagari Sanskrit font with correct glyph rendering (not fallback system font)
**Plans**: TBD

Plans:
- [ ] 03-01: BaseLayout, ChapterLayout, and global typography (font loading, Tailwind v4 tokens)
- [ ] 03-02: ChapterGrid page (index.astro) — 18 chapter cards, coming soon states
- [ ] 03-03: Chapter index page ([chapter]/index.astro) — shloka list with brief previews
- [ ] 03-04: Shloka detail page ([chapter]/[shloka].astro) — static HTML with all content layers
- [ ] 03-05: ProgressiveReveal island (Preact, client:load) — reveal step counter, CSS visibility
- [ ] 03-06: CommentaryAccordion island (Preact, client:load) — expand/collapse per tradition
- [ ] 03-07: ShlokaNav component — prev/next with cross-chapter boundary logic
- [ ] 03-08: Mobile responsiveness pass and Devanagari rendering verification

### Phase 4: Search and SEO
**Goal**: Users can find shlokas by typing a life problem, keyword, or theme — and the site is discoverable by search engines with per-shloka Open Graph metadata
**Depends on**: Phase 3
**Requirements**: UX-03, UX-04
**Success Criteria** (what must be TRUE):
  1. A user typing "I'm dealing with grief" or "how to make a hard decision" into the search box gets a list of relevant shlokas with a sentence explaining why each is relevant to their query
  2. A user searching for "duty" or "arjuna" gets shloka results with their transliteration and English explanation excerpted in the result
  3. Every shloka page has an Open Graph title and description — sharing a shloka link on social media shows a meaningful preview (not just the site name)
  4. An XML sitemap exists at /sitemap.xml listing all shloka URLs for chapters 1 and 2
**Plans**: TBD

Plans:
- [ ] 04-01: Pagefind integration — post-build indexing, field configuration (index transliteration + English + themes, exclude raw Devanagari)
- [ ] 04-02: SearchModal island (Preact, client:idle) — Pagefind query, results display with relevance context
- [ ] 04-03: Open Graph and sitemap — per-shloka meta tags, @astrojs/sitemap configuration
- [ ] 04-04: Accessibility and keyboard navigation audit (prefers-reduced-motion, screen reader flow, keyboard search)

### Phase 5: Open Source Readiness
**Goal**: The repository is ready for external contributors — clear guidelines, working local setup, and a published site that demonstrates the content template
**Depends on**: Phase 4
**Requirements**: INF-04
**Success Criteria** (what must be TRUE):
  1. A developer unfamiliar with the project can clone the repo, run `npm install && npm run dev`, and see a working local site in under 10 minutes following only the README
  2. CONTRIBUTING.md explains how to add a new chapter's content — the schema, the review checklist, and the PR process — clearly enough that a content contributor without Astro knowledge can follow it
  3. The live GitHub Pages site is publicly accessible at the configured URL with all chapters 1 and 2 content rendering correctly
**Plans**: TBD

Plans:
- [ ] 05-01: README.md — project overview, local setup, tech stack, and project structure
- [ ] 05-02: CONTRIBUTING.md — content contribution guide, schema reference, review checklist, PR process
- [ ] 05-03: Final deployment verification — live site audit, broken links check, build time confirmation

## Progress (v1.0)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 4/4 | Complete | 2026-03-28 |
| 01.1. Life Problem Search | 2/2 | Complete | 2026-03-28 |
| 2. Content Pipeline | 0/4 | Not started | - |
| 3. Core Reading UI | 0/8 | Not started | - |
| 4. Search and SEO | 0/4 | Not started | - |
| 5. Open Source Readiness | 0/3 | Not started | - |

</details>

---

## v2.0 Redesign Milestone

**Milestone Goal:** Transform the functional site into the most beautiful and authoritative Bhagavad Gita resource on the internet — premium dark-default design, scholar-grade depth system, built-in shareability, and Wikipedia-citable methodology infrastructure.

This is a brownfield reskin and extension: existing content collections, routing (`/verse/{chapter}/{verse}/`, `/chapter/{n}/`), and Preact islands remain intact. We add tokens, new components, and new routes on top.

## Phases (v2.0 Redesign)

- [ ] **Phase 6: Design System** - Dark-default tokens, OKLCH chapter colors, typography scale, animation baseline, responsive foundation
- [ ] **Phase 7: Homepage & Navigation** - Search-first homepage, redesigned chapter grid, persistent header with depth/theme controls
- [ ] **Phase 8: Verse Depth & Content Layers** - 3-level depth toggle (Simple/Study/Scholar), content visibility control, localStorage persistence
- [ ] **Phase 9: Commentary Panel** - Sefaria-style linked side panel, source attribution line, cross-chapter prev/next navigation
- [ ] **Phase 10: Authority & Credibility** - Methodology + sources pages, Schema.org markup, SEO metadata, URL stability guarantee
- [ ] **Phase 11: OG Image Pipeline** - Build-time per-verse OG images via Satori + resvg-js, /today deterministic verse route
- [ ] **Phase 12: Share & Cite** - "Share as image" card generator (1:1 and 4:5 formats), "Cite this verse" widget (APA/MLA/Chicago)
- [ ] **Phase 13: Reading Experience Polish** - Chapter progress tracking, explore/search continuity verification, Sanskrit rendering audit

## Phase Details (v2.0 Redesign)

### Phase 6: Design System
**Goal**: A consistent visual language is available for all subsequent phases to consume — tokens, typography, chapter colors, animation rules, and responsive breakpoints all codified in CSS custom properties and Tailwind v4 theme blocks
**Depends on**: Nothing (brownfield foundation — existing site continues to work throughout)
**Requirements**: DES-01, DES-02, DES-03, DES-04, DES-05, DES-06, DES-07, DES-08
**Success Criteria** (what must be TRUE):
  1. Any page renders with a dark-default theme using warm off-white text; light mode and sepia mode toggle correctly via a persistent control that survives page navigation
  2. Source Serif 4 appears for English translations, Noto Sans Devanagari (at 110% scale) for Sanskrit, and Inter for UI chrome across all pages
  3. Each of the 18 chapters can display its unique OKLCH hue as an accent color — visible in headers, borders, and badges — without that color bleeding into full-page backgrounds
  4. All pages are readable and scroll without horizontal overflow on a 375px viewport (iPhone SE)
  5. Hover states, reveal interactions, and page transitions animate; prefers-reduced-motion disables all animation without breaking layout
**Plans**: TBD
**UI hint**: yes

### Phase 7: Homepage & Navigation
**Goal**: Users land on a search-first homepage that communicates the site's encyclopedic scope and provides both question-driven and chapter-driven entry points, with consistent site-wide navigation
**Depends on**: Phase 6
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. The homepage leads with a prominent search input ("What's troubling you?") and topic pills (anxiety, purpose, duty, loss, etc.) visible without scrolling on desktop and mobile
  2. All 18 chapter cards appear below the search section with each card wearing its chapter accent color and showing the verse count
  3. The site header on every page shows the "The Bhagavad Gita" wordmark, a theme toggle, and a depth-level selector
  4. A tagline communicating multi-tradition encyclopedic scope (e.g., "18 Chapters. 700 Verses. 8 Traditions.") is visible on the homepage
**Plans**: TBD
**UI hint**: yes

### Phase 8: Verse Depth & Content Layers
**Goal**: Users can choose their reading depth on any verse page and see only the content appropriate to that level, with their preference persisted across sessions
**Depends on**: Phase 6
**Requirements**: VRS-01, VRS-02, VRS-03, VRS-04, VRS-05
**Success Criteria** (what must be TRUE):
  1. Every verse page has a clearly visible Simple / Study / Scholar toggle in or near the page header
  2. Simple mode shows only the English translation and the life application section — all other content (transliteration, commentary, Sanskrit apparatus) is visually hidden
  3. Study mode additionally shows IAST transliteration and word-by-word meanings
  4. Scholar mode reveals all 8 tradition commentaries and the full Sanskrit apparatus
  5. Choosing a depth level on one verse, then navigating to a different verse, shows the same depth level without re-selecting
**Plans**: TBD
**UI hint**: yes

### Phase 9: Commentary Panel
**Goal**: Users can explore tradition-specific commentary in context without a page reload and navigate fluidly between verses across chapter boundaries
**Depends on**: Phase 8
**Requirements**: VRS-06, VRS-07, VRS-08
**Success Criteria** (what must be TRUE):
  1. On desktop (Scholar mode), clicking a tradition name opens a side panel showing that tradition's commentary without navigating away from the verse page
  2. On mobile, tradition commentaries are accessible as expandable sections within the page — no overlay required
  3. Every verse page displays a source attribution line listing which of the 8 traditions contributed to the synthesis for that verse
  4. The previous and next verse navigation buttons work at chapter boundaries — last verse of chapter N links forward to first verse of chapter N+1, first verse of chapter N links back to last verse of chapter N-1
**Plans**: TBD
**UI hint**: yes

### Phase 10: Authority & Credibility
**Goal**: Scholars and editors can verify the site's methodology and sources, and search engines can index and surface verse pages as high-authority results
**Depends on**: Phase 6
**Requirements**: AUT-01, AUT-02, AUT-03, AUT-04, AUT-05
**Success Criteria** (what must be TRUE):
  1. `/about/methodology` exists and documents the 5-layer content pipeline and 8-tradition synthesis process in readable prose with section headers
  2. `/about/sources` exists and lists all classical and modern sources with full bibliographic citations (author, title, publisher, date)
  3. Every verse page contains valid Schema.org `CreativeWork` or `ScholarlyArticle` structured data verifiable via Google's Rich Results Test tool
  4. All existing URLs (`/verse/{chapter}/{verse}/`, `/chapter/{n}/`) resolve with 200 status — no regressions introduced
  5. Every page carries a unique `<title>`, a `<meta name="description">`, and a canonical URL tag
**Plans**: TBD

### Phase 11: OG Image Pipeline
**Goal**: Every verse page generates a share-ready preview image at build time, and a deterministic daily verse route provides a recurring social sharing hook
**Depends on**: Phase 6
**Requirements**: SHR-01, SHR-03
**Success Criteria** (what must be TRUE):
  1. Pasting any verse URL into Twitter, iMessage, or Slack shows a preview card displaying the translation line, verse reference (e.g., "BG 2.47"), and the chapter's accent color as background
  2. The `/today` route resolves to a specific verse that is the same for all visitors on a given calendar date, with a share-ready card layout
  3. OG image generation runs entirely at build time — no image service or CDN is required at runtime
**Plans**: TBD

### Phase 12: Share & Cite
**Goal**: Users can generate a styled verse image for social media and a formatted academic citation directly from any verse page without leaving it
**Depends on**: Phase 11
**Requirements**: SHR-02, SHR-04
**Success Criteria** (what must be TRUE):
  1. A "Share as image" button on every verse page produces a downloadable or copyable styled card in 1:1 ratio (Instagram feed) and 4:5 ratio (Instagram Stories)
  2. A "Cite this verse" control on every verse page generates ready-to-copy APA, MLA, and Chicago formatted citations
  3. Both features operate entirely in-browser — no network requests beyond loading the current page are needed
**Plans**: TBD
**UI hint**: yes

### Phase 13: Reading Experience Polish
**Goal**: Users see their chapter reading progress on the homepage and the explore/search experience works seamlessly within the redesigned site
**Depends on**: Phase 7
**Requirements**: RDX-01, RDX-02, RDX-03
**Success Criteria** (what must be TRUE):
  1. The chapter grid on the homepage shows a visual progress indicator (e.g., filled arc or progress bar) for any chapter where at least one verse has been visited, driven entirely by localStorage
  2. The `/explore/` page and its typeahead search function correctly under the new design with no broken styles or regressions in search behavior
  3. Sanskrit Devanagari text on verse pages renders without tofu (missing glyph boxes) in Chrome, Firefox, and Safari on both desktop and mobile
**Plans**: TBD
**UI hint**: yes

## Progress (v2.0 Redesign)

**Execution Order:**
6 → (7, 8 parallel) → 9 → (10, 11 parallel) → 12 → 13

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Design System | 0/? | Not started | - |
| 7. Homepage & Navigation | 0/? | Not started | - |
| 8. Verse Depth & Content Layers | 0/? | Not started | - |
| 9. Commentary Panel | 0/? | Not started | - |
| 10. Authority & Credibility | 0/? | Not started | - |
| 11. OG Image Pipeline | 0/? | Not started | - |
| 12. Share & Cite | 0/? | Not started | - |
| 13. Reading Experience Polish | 0/? | Not started | - |
