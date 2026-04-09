# Requirements: The Bhagavad Gita — Redesign Milestone

**Defined:** 2026-04-09
**Core Value:** Every person — from curious seeker to academic scholar — finds exactly the depth they need, enters through their own question, and trusts the source enough to cite it.

## v1 Requirements

Requirements for the redesign milestone. Each maps to roadmap phases.

### Design System

- [ ] **DES-01**: Site uses a dark-default theme with warm off-white text (not pure white) and a contemplative visual mood
- [ ] **DES-02**: Light mode and sepia mode are available as alternatives, toggled via a persistent control
- [ ] **DES-03**: Typography uses Source Serif 4 for English translations, Noto Sans Devanagari (at 110% scale) for Sanskrit, and Inter for UI elements
- [ ] **DES-04**: Headings are 40px+ with `text-wrap: balance` and a 9-level type scale
- [ ] **DES-05**: Each of 18 chapters has a unique accent color derived from OKLCH color space (20-degree hue increments), used in headers, borders, and badges — never full-page backgrounds
- [ ] **DES-06**: CSS uses semantic color tokens (primary/secondary/tertiary/quaternary text) with dark-mode-first custom properties
- [ ] **DES-07**: Micro-animations exist for page transitions, reveal interactions, and hover states (respects prefers-reduced-motion)
- [ ] **DES-08**: All pages are mobile-first responsive, readable on iPhone SE (375px) with no horizontal scroll

### Homepage & Navigation

- [ ] **NAV-01**: Homepage leads with a search input ("What's troubling you?") as the primary entry point, with topic pills below (anxiety, purpose, duty, loss, etc.)
- [ ] **NAV-02**: Chapter grid appears below the search section, showing all 18 chapters with chapter colors and verse counts
- [ ] **NAV-03**: Site header includes a persistent "The Bhagavad Gita" wordmark, theme toggle, and depth-level selector
- [ ] **NAV-04**: A tagline communicates the multi-tradition, encyclopedic nature (e.g., "18 Chapters. 700 Verses. 8 Traditions. One Encyclopedic View.")

### Verse Experience

- [ ] **VRS-01**: Verse pages use a 3-level depth toggle (Simple / Study / Scholar) that controls which content layers are visible
- [ ] **VRS-02**: Simple mode shows only the English translation and life application section
- [ ] **VRS-03**: Study mode adds IAST transliteration and word-by-word meanings
- [ ] **VRS-04**: Scholar mode shows all content including all 8 tradition commentaries and full Sanskrit apparatus
- [ ] **VRS-05**: Depth preference persists in localStorage and applies across all verse pages
- [ ] **VRS-06**: Commentary traditions are displayed in a Sefaria-style linked panel (side panel on desktop, expandable sections on mobile) — no full page reload
- [ ] **VRS-07**: Each verse page shows a source attribution line listing which traditions contributed to the synthesis
- [ ] **VRS-08**: Previous/next navigation works across chapter boundaries

### Shareability & Social

- [ ] **SHR-01**: Every verse page has a dynamically generated OG image (built at build time via Satori + resvg-js) showing the translation line, verse reference, and chapter color
- [ ] **SHR-02**: A "Share as image" button generates a styled verse card in 1:1 (Instagram) and 4:5 (Stories) formats
- [ ] **SHR-03**: A `/today` route serves a deterministic verse-of-the-day (hash of date mod total verses) with a share-ready card
- [ ] **SHR-04**: A "Cite this verse" widget generates APA, MLA, and Chicago citations for the current verse page

### Authority & Credibility

- [ ] **AUT-01**: An `/about/methodology` page publicly documents the 5-layer content pipeline and 8-tradition synthesis process
- [ ] **AUT-02**: An `/about/sources` page lists all classical and modern sources with full bibliographic citations
- [ ] **AUT-03**: Schema.org structured data (`CreativeWork` or `ScholarlyArticle`) is present on every verse page
- [ ] **AUT-04**: All existing URLs (`/verse/{chapter}/{verse}/`, `/chapter/{n}/`) remain stable — no breaking changes
- [ ] **AUT-05**: Site metadata (title, description, canonical URLs) follows SEO best practices on every page

### Reading Experience

- [ ] **RDX-01**: Reading progress per chapter is tracked in localStorage and shown visually on the chapter grid
- [ ] **RDX-02**: The /explore/ page and search functionality continue to work with the new design
- [ ] **RDX-03**: Sanskrit text renders correctly in Noto Sans Devanagari with proper glyph rendering across browsers

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Content Completion

- **CCM-01**: Remaining ~285 verses enriched from 3 to 8 traditions (Ch 4, 5, 6, 9, 11, 15, 18)
- **CCM-02**: Sanskrit audio playback per verse from quality sources
- **CCM-03**: Guided reading paths (e.g., "30-day Gita journey")

### Advanced Features

- **ADV-01**: Offline support via service worker
- **ADV-02**: PWA installability
- **ADV-03**: Full-text search powered by Pagefind (rebuild index for new design)
- **ADV-04**: Keyboard navigation and screen reader audit
- **ADV-05**: Print-optimized CSS for verse pages

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / login | Static site — no backend infrastructure |
| Community comments | Preserves authoritative, curated tone |
| Native mobile app | Responsive web covers mobile; app adds maintenance burden |
| Gamification / streaks | Risks cheapening scholarly credibility |
| Video content | Hosting costs and complexity |
| Real-time features | Static site constraint |
| Audio playback | Deferred — quality sources needed before implementation |
| Full i18n / translations | English-first; Hindi/Sanskrit inherent in content |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DES-01 | Phase 6 | Pending |
| DES-02 | Phase 6 | Pending |
| DES-03 | Phase 6 | Pending |
| DES-04 | Phase 6 | Pending |
| DES-05 | Phase 6 | Pending |
| DES-06 | Phase 6 | Pending |
| DES-07 | Phase 6 | Pending |
| DES-08 | Phase 6 | Pending |
| NAV-01 | Phase 7 | Pending |
| NAV-02 | Phase 7 | Pending |
| NAV-03 | Phase 7 | Pending |
| NAV-04 | Phase 7 | Pending |
| VRS-01 | Phase 8 | Pending |
| VRS-02 | Phase 8 | Pending |
| VRS-03 | Phase 8 | Pending |
| VRS-04 | Phase 8 | Pending |
| VRS-05 | Phase 8 | Pending |
| VRS-06 | Phase 9 | Pending |
| VRS-07 | Phase 9 | Pending |
| VRS-08 | Phase 9 | Pending |
| SHR-01 | Phase 11 | Pending |
| SHR-02 | Phase 12 | Pending |
| SHR-03 | Phase 11 | Pending |
| SHR-04 | Phase 12 | Pending |
| AUT-01 | Phase 10 | Pending |
| AUT-02 | Phase 10 | Pending |
| AUT-03 | Phase 10 | Pending |
| AUT-04 | Phase 10 | Pending |
| AUT-05 | Phase 10 | Pending |
| RDX-01 | Phase 13 | Pending |
| RDX-02 | Phase 13 | Pending |
| RDX-03 | Phase 13 | Pending |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0

---
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-09 — traceability completed after roadmap creation*
