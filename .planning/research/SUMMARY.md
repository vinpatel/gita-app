# Project Research Summary

**Project:** Bhagavad Gita Interactive Web Application
**Domain:** Content-heavy interactive scripture / static web application
**Researched:** 2026-03-01
**Confidence:** HIGH (stack + architecture verified against official docs; features MEDIUM via live site analysis; pitfalls MEDIUM via court records and documented incidents)

## Executive Summary

This is a static scripture reading application built with Astro 5 and deployed to GitHub Pages. The core product concept is well-defined and technically straightforward: 700 shlokas across 18 chapters, stored as per-chapter YAML/JSON files in Astro Content Collections, rendered into pre-built static HTML at build time. The competitive differentiation is not in the technology stack but in the content layer — specifically the combination of progressive reveal UX, synthesized multi-tradition commentary, and practical life applications per shloka. No competitor currently offers all three in a static, open-source, no-login product.

The recommended approach is to build content-first. The entire feature surface depends on well-structured, reviewed shloka data before any UI can be built. The critical path is: define the content schema, generate and review chapters 1-2 with AI, establish the content template, then build the UI layer on top of stable data. The progressive reveal interaction is implemented as a lightweight Preact island (client:load) on otherwise fully static pages — this keeps the site fast and SEO-friendly while enabling the core UX differentiator.

The highest-risk areas are not technical but legal and editorial: using copyrighted commentary text (Prabhupada/BBT, Chinmayananda/Chinmaya Mission), AI misattribution of philosophical positions to specific traditions, and inconsistent Sanskrit transliteration across 700 shlokas. All three risks must be addressed in the content pipeline design phase, before any AI generation begins. Technical risks — primarily GitHub Actions build timeouts — are well-documented with clear mitigation strategies.

## Key Findings

### Recommended Stack

Astro 5.18.x is the right framework for this project (confirmed as existing constraint and correct technical choice). It provides native Content Collections with Zod validation, islands architecture for selective hydration, and zero-JS-by-default output — ideal for a content-heavy static site. Tailwind CSS v4 handles utility styling via the Vite plugin (the old `@astrojs/tailwind` integration is deprecated for v4 and must not be used). Preact serves as the islands runtime — 3kB vs React's 45kB, same API, appropriate for the lightweight toggle/reveal interactions required.

**Core technologies:**
- **Astro 5.18.x**: Framework — zero JS by default, Content Layer API, islands architecture
- **TypeScript (strict)**: Type safety — Zod schemas auto-generate types from content collections
- **Tailwind CSS 4.2.x + @tailwindcss/vite**: Styling — CSS-native, fast builds; NOT the deprecated @astrojs/tailwind
- **Preact (@astrojs/preact 4.1.x)**: Interactive islands — 3kB runtime for reveal/accordion/search interactions
- **Astro Content Collections (file() loader)**: Data — per-chapter YAML/JSON files validated at build time by Zod
- **Pagefind (astro-pagefind 1.8.x)**: Search — post-build static indexing, <300kB, no backend required
- **Tiro Devanagari Sanskrit + Noto Serif Devanagari (Fontsource)**: Typography — Sanskrit-specific fonts, self-hosted, no CDN dependency
- **@astrojs/sitemap 3.7.x**: SEO — auto-generated XML sitemap for all 700+ static routes
- **withastro/action v5.2.0**: CI/CD — zero-config GitHub Pages deployment

**Critical version note:** Do NOT use `@astrojs/tailwind` (Tailwind v3 only) or Astro v6 beta (unstable). Node.js 20 LTS required.

### Expected Features

Research confirmed no competitor combines progressive reveal UX + synthesized multi-commentary + practical life applications in a static, open-source product. The gap is real and achievable.

**Must have (table stakes):**
- Full Sanskrit text (Devanagari script) for all 700 shlokas
- Roman transliteration per shloka (IAST standard)
- English translation / curated explanation per shloka
- Chapter grid landing page (18 chapter cards)
- Chapter-by-chapter navigation with shloka list
- Sequential prev/next verse navigation (including cross-chapter boundary)
- Mobile-responsive design (Devanagari at minimum 20px)
- Commentary or explanation per shloka
- Basic verse search (by chapter:verse reference)

**Should have (differentiators — this app's competitive position):**
- Progressive reveal UX: Sanskrit → transliteration → synthesis → commentaries → practical applications
- Practical life applications per shloka across 4 domains (Personal / Career / Health / Relationships)
- Curated synthesis of multiple commentary traditions (Advaita, Vishishtadvaita, Bhakti) as primary reading
- Expandable individual commentaries per tradition (accordion UI)
- Full-text thematic/keyword search via Pagefind
- Serene, minimal, distraction-free design (no ads, no popups, generous whitespace)
- Open source with MIT license and clear contribution path

**Defer to v2+:**
- Audio playback (quality/hosting decisions required)
- Hindi / vernacular translations (content multiplication)
- Word-by-word Sanskrit breakdown / anvaya (Sanskrit NLP complexity)
- User accounts / reading progress tracking (requires backend)
- AI chatbot / Q&A interface (requires backend API, cost)
- Multi-language support beyond English

**MVP definition (v1):** Chapters 1 and 2 fully implemented with all differentiating features. Chapter grid with 16 chapters marked "coming soon." Validates the content template before full-scale generation.

### Architecture Approach

The architecture is a pure static site: Content Collections (per-chapter JSON files) → Zod validation at build time → `getStaticPaths()` generates 700 HTML files → Pagefind indexes the output → GitHub Actions deploys to GitHub Pages. No server, no database, no runtime queries. Interactive features (progressive reveal, commentary accordion, search) are Preact islands hydrated client-side on otherwise static pages. All shloka data is embedded in the HTML at build time — islands receive only control props (layer count), not data.

**Major components:**
1. **Content Collection (shlokas)** — schema-validated source of truth; per-chapter JSON files; Zod enforces all required fields at build time
2. **BaseLayout + ChapterLayout** — two-level layout composition; BaseLayout owns `<html>`, fonts, meta; ChapterLayout adds chapter context and breadcrumb
3. **ChapterGrid page (index.astro)** — static 18-chapter card grid; no JS
4. **Chapter index page ([chapter]/index.astro)** — static shloka list per chapter; no JS
5. **Shloka detail page ([chapter]/[shloka].astro)** — static HTML with all content layers; hosts ProgressiveReveal island
6. **ProgressiveReveal island (.tsx, client:load)** — manages reveal step counter via useState; applies CSS visibility; receives layer count as prop
7. **CommentaryAccordion island (.tsx, client:load)** — expand/collapse individual tradition commentaries
8. **SearchModal island (.tsx, client:idle)** — Pagefind-powered; loads lazily on first interaction
9. **Static Astro components** — ChapterCard, ShlokaNav, ChapterHeader; zero JS shipped
10. **Pagefind integration** — post-build indexer; indexes transliteration and English fields; excludes raw Devanagari from index

**Build order:** Content schema → BaseLayout → static components → dynamic route pages → island components → Pagefind → GitHub Actions CI.

**Key architectural rule:** Anything in `components/astro/` ships no JS. Anything in `components/islands/` ships JS. Physical separation enforces the JavaScript budget.

### Critical Pitfalls

1. **Copyright: Using Prabhupada/BBT commentary text** — The Sanskrit is public domain; the commentary is not. BBT actively litigates (Delhi HC ruling, April 2024). AI synthesis must paraphrase philosophical traditions without reproducing sentence patterns from BBT, Chinmaya Mission, or Eknath Easwaran publications. Establish the legal source list and AI prompt constraints before any generation starts.

2. **AI misattribution of philosophical traditions** — LLMs confidently fabricate nuanced theological positions (e.g., attributing bhakti emphasis to Shankaracharya, who emphasized jnana). Limit AI to synthesizing shared meaning; require human review of all tradition-attribution claims before publishing. Use AI for structure and practical applications, not for precision theological attribution.

3. **Sanskrit transliteration inconsistency** — Without an explicit standard enforced in AI prompts and the Zod schema, the 700 shlokas will end up with mixed IAST/Harvard-Kyoto/casual romanization. This breaks search and looks amateur. Decide on IAST, enforce it in prompts and schema, validate before bulk generation.

4. **Shloka numbering ambiguity** — Multiple manuscript traditions number verses differently (700 vs 745 verses; chapter-internal differences between editions). Declare Gita Press (Gorakhpur) as the canonical authority before any content is generated. URLs become canonical on launch; changing them post-launch requires 301 redirects and re-indexing.

5. **GitHub Actions build timeout (10-minute limit)** — Builds with runtime data fetching or unoptimized image processing can exceed GitHub Pages' 10-minute limit at 700 pages. Never call AI APIs or external services during the Astro build. Enable content collection caching. Cache `.astro/` and `node_modules/` in CI. Target under 5 minutes for the full 700-shloka build.

## Implications for Roadmap

Content is the critical path. The dependency chain is: content schema → content generation → content review → UI. No phase of UI work can begin without stable, reviewed content for at least the two MVP chapters. This shapes the phase structure significantly.

### Phase 1: Foundation and Content Schema

**Rationale:** The entire project depends on a stable content schema. Changing the Zod schema after bulk AI generation requires updating all data files — expensive to fix. Get this right first. Also establishes copyright guardrails before any generation begins.
**Delivers:** Project scaffold (Astro 5 + Tailwind v4 + Preact), content schema (Zod), per-chapter JSON structure, AI prompt templates with legal constraints, edition declaration (Gita Press), transliteration standard (IAST), GitHub Actions CI skeleton
**Addresses:** Table stakes — structured data foundation; pitfalls 1 (copyright), 3 (transliteration), 4 (numbering) all prevented here
**Avoids:** Schema changes during bulk generation; copyright violations baked into content pipeline
**Research flag:** Standard patterns — skip phase research. Astro content collections setup is well-documented.

### Phase 2: Content Generation and Review (Chapters 1-2)

**Rationale:** AI generation of 700 shlokas × 5 content layers = substantial content work. MVP launches with chapters 1-2 to validate the content template before committing to full-scale generation. Human review gate is mandatory — no automated publishing.
**Delivers:** Complete shloka data for chapters 1 and 2 (119 shlokas): Sanskrit, transliteration (IAST), curated synthesis commentary, 2-3 expandable tradition commentaries, practical applications (4 domains × 119 shlokas), chapter summaries
**Addresses:** Practical life applications (core differentiator); multi-commentary synthesis; chapter summaries
**Avoids:** AI misattribution (pitfall 2 — review checklist applied to all tradition-attribution claims); copyright (pitfall 1 — prompts use only public domain sources)
**Research flag:** Needs attention during planning — AI prompt engineering for theological accuracy and legal compliance is not a solved pattern. Plan the review workflow carefully.

### Phase 3: Core UI and Reading Experience

**Rationale:** With stable content data for chapters 1-2, build the full reading UI. This is the phase where all table stakes and primary differentiators come together. The progressive reveal island is the centerpiece.
**Delivers:** Chapter grid (18 cards, 16 "coming soon"), chapter index pages, shloka detail pages with full progressive reveal UX, commentary accordion, prev/next navigation including cross-chapter boundary, mobile-responsive design, Sanskrit typography (Tiro Devanagari, minimum 20px), Open Graph meta per shloka page
**Addresses:** All P1 features from the feature prioritization matrix
**Avoids:** Unnecessary client hydration (anti-pattern 3 — default to .astro components); reveal state in URL (anti-pattern 4 — use useState); font subsetting (do not subset Noto Devanagari — Sanskrit requires full glyph set)
**Research flag:** Standard patterns for Astro islands and layout composition. Progressive reveal is straightforward useState logic.

### Phase 4: Search and SEO

**Rationale:** Search requires content to exist first (Pagefind indexes built HTML). Sitemap generation is automatic but must be configured with the correct site/base values for GitHub Pages. This phase also includes the "looks done but isn't" verification checklist.
**Delivers:** Pagefind full-text search (indexes transliteration + English; excludes raw Devanagari), XML sitemap, search results with explanation excerpts (not just verse numbers), keyboard navigation between shlokas, accessibility audit (prefers-reduced-motion, screen reader flow)
**Addresses:** P1 basic search; P2 full-text thematic search; SEO for organic discovery
**Avoids:** Pagefind before Astro build completes (add last in integrations array); search index gaps on redeploy (Pagefind rebuilds every deploy — verify in CI)
**Research flag:** Standard patterns — Pagefind integration with Astro is well-documented. No phase research needed.

### Phase 5: Full Content Expansion (Chapters 3-18)

**Rationale:** Once the template is validated with chapters 1-2 and there is positive reception, expand content chapter by chapter. Each chapter is an independent content PR — contribution workflow is established in Phase 1.
**Delivers:** All 700 shlokas with consistent content across all 18 chapters; full Pagefind search index at scale; build time verified under 5 minutes for full corpus
**Addresses:** Complete chapter grid (all 18 active); full-text search becomes genuinely valuable at scale
**Avoids:** Build timeout (pitfall 4 — caching active from Phase 1; measure build time at each chapter increment); bulk generation without review (generate chapter by chapter, not all at once)
**Research flag:** No new research needed for content expansion. Build performance monitoring is the only active concern.

### Phase 6: Polish and v1.x Features

**Rationale:** Post-validation polish phase triggered by user feedback and engagement signals.
**Delivers:** Dark mode (localStorage preference), chapter summaries as standalone pages, reading position persistence (sessionStorage), "expand all" shortcut for power users, open source contribution templates, README and CONTRIBUTING.md
**Addresses:** P2 features from the prioritization matrix
**Research flag:** Standard patterns. No phase research needed.

### Phase Ordering Rationale

- **Content before UI:** The dependency chain is absolute — UI cannot be built without stable data. Phases 1-2 must complete before Phase 3 begins.
- **MVP scoping:** Two chapters before 700 shlokas prevents committing to a flawed content template at scale. The content generation pipeline (AI prompts, review process, copyright compliance) is unproven until tested on real shlokas.
- **Search after content:** Pagefind indexes built HTML — it is physically impossible to implement full-text search before content exists.
- **Legal-first:** Copyright and transliteration decisions made in Phase 1 cannot be retrofitted cheaply. Getting them wrong means re-generating all content.

### Research Flags

Phases needing deeper research during planning:
- **Phase 2 (Content Generation):** AI prompt engineering for theological accuracy and legal compliance has no established playbook. The review workflow (who reviews, what checklist, what tools) needs to be designed as part of this phase's planning. This is the highest-uncertainty phase.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Astro 5 + Tailwind v4 + Content Collections setup is thoroughly documented in official docs.
- **Phase 3 (Core UI):** Astro islands, layout composition, and progressive reveal (useState) are standard patterns.
- **Phase 4 (Search):** Pagefind integration with Astro is well-documented.
- **Phase 5 (Content Expansion):** Same pipeline as Phase 2, validated by that point.
- **Phase 6 (Polish):** Standard UI polish patterns, no novel integrations.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core technologies verified against official docs and npm registry. Version compatibility table confirmed. The Tailwind v4 / `@astrojs/tailwind` deprecation is a real gotcha, fully documented. |
| Features | MEDIUM | Live site analysis of 5 competitors verified. Competitor feature matrix is reliable. Feature value judgments (what users want) are inference from analogous apps (Bible apps, existing Gita sites) — not user research. |
| Architecture | HIGH | All patterns verified against official Astro docs. Content Collections, getStaticPaths, islands hydration, Pagefind integration — all standard documented patterns. |
| Pitfalls | MEDIUM | Copyright pitfalls verified against actual court records (Delhi HC, 2024). AI misattribution risks documented in published reporting. Technical pitfalls (build timeout, font rendering) verified against official limits and real-world post-mortems. Transliteration consistency risk is inference from project structure — no prior incident documented for this specific project. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **AI content quality validation:** There is no established benchmark for "good enough" shloka synthesis quality. The review checklist for tradition attributions needs to be defined with someone who has subject matter expertise in Vedantic philosophy. Plan for this in Phase 2 scoping.
- **Target audience specificity:** Research assumes a general English-speaking audience with no Sanskrit background. If the actual target audience shifts (e.g., toward Sanskrit scholars or practicing Hindus), feature priorities change significantly (anvaya becomes more important; practical applications become less central).
- **Font rendering on iOS Safari with Vedic accents:** The Tiro Devanagari Sanskrit font is recommended, but iOS Safari's rendering of Vedic accent marks (svaras) is inconsistent. This needs device testing before committing to the font choice — flagged in PITFALLS.md but unresolved.
- **Content generation tooling:** The AI generation pipeline (which model, which API, what prompting strategy, what the offline batch process looks like) is not designed yet. This is scoped to Phase 2 but has upstream implications for the content schema design in Phase 1.

## Sources

### Primary (HIGH confidence)
- [Astro 5.0 release + Content Layer API docs](https://docs.astro.build/en/guides/content-collections/) — framework, content collections, routing
- [Astro Islands Architecture docs](https://docs.astro.build/en/concepts/islands/) — hydration directives, client:load/idle/visible
- [Astro GitHub Pages deploy guide](https://docs.astro.build/en/guides/deploy/github/) — withastro/action, site/base config
- [Tailwind CSS v4 + Astro guide](https://tailwindcss.com/docs/installation/framework-guides/astro) — Vite plugin approach
- [Pagefind official docs](https://pagefind.app/) — static search, index size, multilingual support
- [Delhi HC Bhaktivedanta Book Trust copyright ruling, 2024](https://www.khuranaandkhurana.com/2024/08/26/case-analysis-bhaktivedanta-book-trust-v-bhagvatam-in/) — copyright scope for commentary
- [GitHub Pages limits (official)](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) — 10-minute build timeout

### Secondary (MEDIUM confidence)
- Live site analysis: Gita Supersite (IITK), Holy Bhagavad Gita, BhagavadGita.com, Bhagavad Gita For All — competitor feature matrix
- [Tiro Devanagari Sanskrit on Fontsource](https://fontsource.org/fonts/tiro-devanagari-sanskrit) — font license and Sanskrit-specific design
- [AntStack: Astro build optimization post-mortem](https://www.antstack.com/blog/how-we-cut-astro-build-time-from-30-minutes-to-5-minutes-83-faster/) — build time mitigation strategies
- [Rest of World: India's religious AI chatbots, 2023](https://restofworld.org/2023/chatgpt-religious-chatbots-india-gitagpt-krishna/) — AI misattribution risk documentation
- npm registry data: astro@5.18.0, tailwindcss@4.2.1, @astrojs/preact@4.1.3, astro-pagefind@1.8.x

### Tertiary (LOW confidence)
- [Srimad Gita App Comparison 2025](https://www.srimadgita.com/bhagavad-gita-app-comparison) — ecosystem feature matrix (single source, marketing site)
- [Way2Wise: 700 vs 745 verses](https://way2wise.com/number-of-verses-in-bhagavad-gita/) — verse count across manuscript traditions

---
*Research completed: 2026-03-01*
*Ready for roadmap: yes*
