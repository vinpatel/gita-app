# Requirements: Gita App

**Defined:** 2026-03-01
**Core Value:** Every shloka becomes actionable wisdom — simple enough for beginners, deep enough for scholars, applied to real life.

## v1 Requirements

V1 delivers chapters 1 and 2 fully polished with all features. Chapter grid shows all 18 chapters with 16 marked "coming soon."

### Content

- [ ] **CONT-01**: Each shloka displays original Sanskrit text in Devanagari script
- [ ] **CONT-02**: Each shloka displays IAST Roman transliteration
- [ ] **CONT-03**: Each shloka has a plain-language English explanation that beginners can understand but scholars find valuable
- [ ] **CONT-04**: Each shloka has a curated synthesis drawing from multiple commentary traditions (Advaita, Vishishtadvaita, Bhakti)
- [ ] **CONT-05**: Each shloka has expandable individual commentaries from 2-3 traditions (Shankaracharya, Prabhupada tradition, Chinmayananda)
- [ ] **CONT-06**: Each shloka has practical life applications across 4 domains: Personal Growth, Career/Business, Health, Relationships
- [ ] **CONT-07**: Each chapter has a summary with theme overview and key teachings
- [x] **CONT-08**: All content uses Gita Press (Gorakhpur) edition as canonical source for shloka numbering (700-verse structure)
- [ ] **CONT-09**: Each shloka is tagged with life themes (stress, decision-making, loss, anger, purpose, duty, etc.) for problem-based search
- [x] **CONT-10**: AI-generated content uses only public domain sources — no copyrighted commentary text reproduced

### Navigation

- [ ] **NAV-01**: Chapter grid landing page displays 18 chapter cards with Sanskrit name, English title, and verse count
- [ ] **NAV-02**: Each chapter has an index page listing all shlokas with brief previews
- [ ] **NAV-03**: User can navigate sequentially between shlokas (prev/next) including cross-chapter boundaries
- [ ] **NAV-04**: User can jump to any chapter from any page

### Interactive Experience

- [ ] **UX-01**: Shloka pages use progressive reveal — Sanskrit shown first, then transliteration, explanation, commentaries, and practical applications revealed layer by layer
- [ ] **UX-02**: Individual commentaries expand/collapse independently (accordion UI)
- [ ] **UX-03**: User can search by keyword, theme, or life problem and get relevant shlokas with contextual guidance
- [ ] **UX-04**: Problem-based search shows why each shloka is relevant to the user's query

### Design

- [ ] **DES-01**: Serene, minimal design with generous whitespace — no ads, no popups, no clutter
- [ ] **DES-02**: Sanskrit text renders correctly using Tiro Devanagari Sanskrit font (self-hosted, full glyph set)
- [ ] **DES-03**: Fully mobile-responsive with Devanagari at minimum 20px
- [ ] **DES-04**: Simple but deep — language accessible to complete beginners without losing philosophical depth

### Infrastructure

- [x] **INF-01**: Fully static site built with Astro 5, deployed to GitHub Pages
- [x] **INF-02**: GitHub Actions CI/CD auto-deploys on push to main
- [x] **INF-03**: Open source repository with MIT license
- [ ] **INF-04**: Clear CONTRIBUTING.md with content contribution guidelines
- [x] **INF-05**: Build completes under 5 minutes on GitHub Actions

## v2 Requirements

### Content Expansion

- **EXP-01**: All 18 chapters with complete content (700 shlokas)
- **EXP-02**: Dark mode with localStorage preference persistence
- **EXP-03**: Reading position persistence via localStorage

### Audio

- **AUD-01**: Audio playback of Sanskrit chanting per shloka
- **AUD-02**: Audio sourced from verified recordings

### Localization

- **LOC-01**: Hindi translation support
- **LOC-02**: Additional Indian language support

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / login | Static site — no backend; localStorage handles reading state |
| AI chatbot / Q&A bot | Requires backend API, per-query cost; problem-based search covers this need statically |
| Community comments / discussions | Requires moderation infrastructure; disrupts contemplative experience |
| Gamification (streaks, badges) | Contradicts the Gita's teaching on non-attachment to outcomes |
| Video content | Hosting cost, production complexity; written practical applications serve the need |
| Word-by-word Sanskrit breakdown (anvaya) | Very high complexity; v3+ consideration for Sanskrit-learning mode |
| Multi-language beyond English for v1 | Content multiplication unsustainable; English first for global reach |
| Donations / fundraiser CTA | Disrupts reading; open source contributions = code/content PRs |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| CONT-05 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| CONT-07 | Phase 2 | Pending |
| CONT-08 | Phase 1 | Complete |
| CONT-09 | Phase 2 | Pending |
| CONT-10 | Phase 1 | Complete |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| NAV-04 | Phase 3 | Pending |
| UX-01 | Phase 3 | Pending |
| UX-02 | Phase 3 | Pending |
| UX-03 | Phase 4 | Pending |
| UX-04 | Phase 4 | Pending |
| DES-01 | Phase 3 | Pending |
| DES-02 | Phase 3 | Pending |
| DES-03 | Phase 3 | Pending |
| DES-04 | Phase 2 | Pending |
| INF-01 | Phase 1 | Complete |
| INF-02 | Phase 1 | Complete |
| INF-03 | Phase 1 | Complete |
| INF-04 | Phase 5 | Pending |
| INF-05 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-01*
*Last updated: 2026-03-01 after roadmap creation*
