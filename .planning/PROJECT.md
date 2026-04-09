# The Bhagavad Gita — Definitive Modern Resource

## What This Is

The most comprehensive, beautiful, and authoritative Bhagavad Gita resource on the internet. A static web application presenting all 700 shlokas with multi-tradition synthesis (8 schools of thought), life-problem navigation, progressive disclosure for all audiences (seekers to scholars), and Wikipedia-citable methodology. Built to be the reference that displaces single-tradition sites as the default Gita resource online.

## Core Value

Every person — from a curious Gen Z seeker to an academic scholar — finds exactly the depth they need, enters through their own question, and trusts the source enough to cite it.

## Requirements

### Validated

- ✓ All 18 chapters with 700 shlokas in structured JSON — existing
- ✓ 8-tradition commentary synthesis (advaita, vishishtadvaita, dvaita, bhakti, kashmir-shaivism, shuddhadvaita, karma-yoga, practical-vedanta) — existing (most chapters)
- ✓ IAST transliteration standard enforced — existing
- ✓ Life-problem search with curated questions — existing
- ✓ Per-shloka life applications (4 domains) — existing
- ✓ Static site on GitHub Pages via Astro 5 — existing
- ✓ Chapter grid homepage with all 18 chapters — existing
- ✓ /explore/ search page with typeahead — existing

### Active

- [ ] Premium visual redesign — dark-default, Linear-quality CSS, contemplative mood
- [ ] Search-first homepage — life-problem search as primary entry point
- [ ] 3-level depth toggle (Simple / Study / Scholar) per verse page
- [ ] OKLCH chapter color system — 18 harmonious hues as accents
- [ ] Typography overhaul — Source Serif 4 / Noto Sans Devanagari / Inter system
- [ ] Dark mode default with light mode alternative
- [ ] Per-verse OG images generated at build time (Satori + resvg-js)
- [ ] "Share as image" button — Instagram/Stories-ready verse cards
- [ ] `/today` route — deterministic verse-of-the-day
- [ ] Sefaria-style linked commentary panel (side panel, no page reload)
- [ ] `/about/methodology` page — public 5-layer content pipeline
- [ ] `/about/sources` page — bibliographic citations for all traditions
- [ ] Per-verse source attribution line
- [ ] "Cite this verse" widget (APA / MLA / Chicago)
- [ ] Schema.org structured data (CreativeWork markup)
- [ ] Responsive mobile-first design (iPhone SE minimum)
- [ ] Reading progress / chapter completion tracking (localStorage)
- [ ] Sepia reading mode option

### Out of Scope

- User accounts / login — static site, no backend
- Audio playback — deferred, quality sources needed
- Video content — complexity and hosting costs
- Native mobile app — web-first, responsive covers mobile
- Community comments — keep focus on authoritative content
- Gamification / streaks — risks cheapening the scholarly tone
- Real-time features — static site constraint

## Context

- Content is ~90% complete: all 18 chapters exist, ~285 verses still need enrichment from 3→8 traditions
- Current site is functional but visually basic — needs premium redesign to match content quality
- Competitive landscape: ISKCON (dated, single-tradition), IIT Kanpur (academic, poor UX), holy-bhagavad-gita.org (cleaner, still single-tradition). None offer multi-tradition synthesis + modern UX + life-problem navigation.
- Design inspiration: Sefaria.org (linked commentary), Quran.com (reading UX), Linear (premium CSS), Daily Stoic (contemplative mood), 37signals (opinionated design)
- Wikipedia citation requires: transparent methodology, verifiable sources, neutral POV (multi-tradition = neutral), stable URLs
- Existing stack: Astro 5 + Tailwind v4 + Preact islands + TypeScript strict

## Constraints

- **Tech Stack**: Astro 5 + Tailwind v4 + Preact — no migration, build on existing
- **Hosting**: Fully static — GitHub Pages, no server, no database
- **Content**: AI-synthesized from public domain sources — no copyrighted commentary text (no BBT/ISKCON, no Chinmaya Mission, no Sri Aurobindo Ashram)
- **Transliteration**: IAST only (no Harvard-Kyoto, no ITRANS)
- **Performance**: Build-time generation for OG images, no runtime cost
- **URLs**: Existing URL structure must not break (`/verse/{chapter}/{verse}/`, `/chapter/{n}/`)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark mode as default | Contemplative mood, Gen Z expectation, reduces eye strain for reading | -- Pending |
| Search-first homepage | Life-problem navigation is the unique differentiator; chapter grid serves returning users | -- Pending |
| 3-level depth toggle | Serves casual seekers AND scholars from same URL without overwhelming either | -- Pending |
| OKLCH color system | Perceptually uniform 18-hue system with automatic light/dark variants | -- Pending |
| Satori for OG images | Build-time generation, zero runtime cost, perfect for static sites | -- Pending |
| Sefaria-style commentary panel | Best-in-class pattern for dense commentary content | -- Pending |
| Wikipedia citation infrastructure | Methodology page + source attribution + cite widget = citable resource | -- Pending |
| Source Serif 4 + Noto Sans Devanagari | Contemplative serif for English, proper Devanagari rendering at 110% scale | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-09 after redesign milestone initialization*
