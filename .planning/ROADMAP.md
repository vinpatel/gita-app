# Roadmap: Gita App

## Overview

Build a static Bhagavad Gita web application that makes every shloka actionable wisdom. The critical path is content-first: schema and infrastructure before content generation, content before UI, search after content exists. V1 delivers chapters 1 and 2 fully polished — progressive reveal UX, synthesized multi-tradition commentary, and practical life applications — proving the template before scaling to all 700 shlokas.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Astro 5 project scaffold, content schema, CI/CD, and legal guardrails
- [ ] **Phase 2: Content Pipeline** - AI generation and human review of all 119 shlokas for chapters 1 and 2
- [ ] **Phase 3: Core Reading UI** - Chapter grid, shloka pages, progressive reveal, and mobile-responsive design
- [ ] **Phase 4: Search and SEO** - Pagefind full-text search, problem-based search, sitemap, and accessibility
- [ ] **Phase 5: Open Source Readiness** - CONTRIBUTING.md, README, MIT license, and contribution templates

## Phase Details

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
- [ ] 01-02-PLAN.md — Content Collection schema (Zod) for shloka data with IAST enforcement and test shloka (Wave 2)
- [ ] 01-03-PLAN.md — GitHub Actions CI/CD pipeline with caching and GitHub Pages deploy (Wave 3)
- [x] 01-04-PLAN.md — MIT license, canonical source declaration, and AI content policy (Wave 1)

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

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/4 | In Progress|  |
| 2. Content Pipeline | 0/4 | Not started | - |
| 3. Core Reading UI | 0/8 | Not started | - |
| 4. Search and SEO | 0/4 | Not started | - |
| 5. Open Source Readiness | 0/3 | Not started | - |
