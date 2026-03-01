# Feature Research

**Domain:** Bhagavad Gita / scripture web application
**Researched:** 2026-03-01
**Confidence:** MEDIUM (ecosystem surveyed via WebSearch + live site analysis; no Context7 applicable for domain features)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in any scripture reading app. Missing these causes immediate abandonment.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full text: all shlokas with Sanskrit (Devanagari) | Core content — users open a Gita app for the Gita | LOW | 700 shlokas across 18 chapters; store as structured data (JSON/Markdown) |
| Roman transliteration per shloka | Universal expectation — non-Sanskrit readers need this to follow pronunciation | LOW | Standard IAST or simplified Roman; every major app has this |
| English translation per shloka | Non-negotiable — without it the product is unusable for most visitors | LOW | Public domain translations available (Gita Press, Swami Gambhirananda, etc.) |
| Chapter-by-chapter navigation | How users read — linear, chapter by chapter | LOW | 18 chapters; needs landing page + per-chapter index |
| Verse-level navigation (prev/next) | Users expect to move through shlokas sequentially | LOW | Next/prev links per shloka within a chapter |
| Chapter index / landing page | Entry point to explore the content; every competitor has this | LOW | 18 chapter cards with Sanskrit name, title, verse count |
| Mobile-responsive design | >60% of spiritual content is consumed on mobile | MEDIUM | Mandatory — Sanskrit text must render correctly at all sizes |
| Fast page loads | Spiritual reading demands a calm experience; slow sites feel wrong | LOW | Static site solves this; avoid heavy JS bundles |
| Legible Sanskrit typography | Devanagari requires appropriate font choices; poor rendering breaks trust | LOW | Use Noto Sans Devanagari or similar; test across devices |
| Search / verse lookup | Users want to find specific shlokas by number or keyword | MEDIUM | Search by chapter:verse reference at minimum; full-text is differentiating |
| Commentary or explanation per shloka | Translation alone is insufficient — users need interpretation | MEDIUM | Even minimal commentary is expected; the question is depth and whose |
| Chapter summaries | Users orient themselves before diving into verses | LOW | Brief thematic overview per chapter |

### Differentiators (Competitive Advantage)

Features no existing Gita app does well, or that this app uniquely combines. These are where the project competes.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Progressive reveal (Sanskrit → transliteration → explanation → practical) | Mirrors contemplative study — sit with the Sanskrit before peeling meaning; no competitor does this as a deliberate UX pattern | MEDIUM | Core UX innovation; implemented with expand/reveal interactions; no progressive disclosure is used in any current Gita app surveyed |
| Practical life applications per shloka (Personal / Career / Health / Relationships) | Every other site stops at philosophy. Mapping each shloka to career, relationships, health, and personal growth is unique in the ecosystem | HIGH | Most content-intensive feature; 700 shlokas × 4 domains = 2,800 application sections; AI-generated is the only viable approach at scale |
| Curated synthesis of multiple commentaries (Shankaracharya, Prabhupada, Chinmayananda, Ramanuja, etc.) | Each app picks ONE tradition. Synthesizing across Advaita, Vishishtadvaita, and devotional schools gives beginners a balanced view scholars lack | HIGH | Requires editorial judgment in AI prompting; must be transparent about synthesis approach |
| Expandable individual commentaries per tradition | Lets scholars and devotees go deeper into their tradition; no web app currently shows multiple traditions side-by-side | MEDIUM | Accordion/expandable UI; Gita Supersite has multi-window view but it's clunky |
| Thematic/keyword search across all shlokas | Finding all shlokas related to "karma" or "detachment" across the full text — most apps offer verse search only | MEDIUM | Requires indexed content; feasible statically with a pre-built search index (Pagefind, Fuse.js) |
| Serene, minimal, distraction-free design | Existing Gita apps are visually cluttered (ads, subscription CTAs, excessive links). A breathing, contemplative UI is a genuine differentiator | MEDIUM | Design-first philosophy; no ads, no popups, generous whitespace |
| Open source with structured data for community contribution | Enables 700-shloka content to be crowdsourced and corrected; builds community trust | LOW | MIT license + clear PR templates; very few Gita apps are genuinely open source |
| Static, zero-server architecture (GitHub Pages) | Accessibility from any network, zero downtime, no login friction | LOW | Already decided; worth surfacing as UX feature (no account needed, no cookies) |

### Anti-Features (Commonly Requested, Often Problematic)

Features that are frequently added to Gita apps but actively harm the experience or are out of scope for this project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Audio playback of shlokas | Users want Sanskrit pronunciation guidance | Quality varies wildly — poor audio is worse than none; hosting adds cost and complexity; mobile autoplay is unreliable | Defer post-v1; when added, source from verified recordings (ISKCON, Gita Press); do not rush |
| User accounts / login / progress tracking | Users want bookmarks and reading progress saved | Requires backend/auth infrastructure; kills the static-site constraint; privacy friction for spiritual content | Use localStorage for reading position; no server needed for basic persistence |
| Community comments / discussion | Users want to share insights | Requires moderation, backend, and creates noise that disrupts the contemplative context | Link to existing community forums (Reddit r/hinduism, etc.) rather than building in-app |
| AI chatbot / Q&A bot | Users want to "ask Krishna" — trending in 2024-25 | Requires backend API calls, costs money per query, creates dependency on external LLM services, inconsistent theological quality | Content is already AI-synthesized; the practical applications sections serve this need without a conversational interface |
| Multi-language support (Hindi, Telugu, etc.) | Gita Supersite offers 11 scripts; users from India want vernacular | Massive content multiplication — 700 shlokas × N languages = unsustainable for v1 with AI-generated content; translation quality is hard to validate | English first for global accessibility; add Hindi post-validation if engagement warrants |
| Gamification (streaks, badges, leaderboards) | Bhagavad Gita For All uses this; increases daily engagement | Contradicts the contemplative, non-achievement-oriented spirit of the Gita itself; feels dissonant | Verse-of-the-day or reading continuation as gentle engagement without competitive framing |
| Video content per shloka | Sloka-a-Day app uses video; high engagement | Hosting cost, production complexity, copyright risk, makes static site hosting impractical | Written practical applications cover this need; video is a separate product |
| Donation / fundraiser CTA | Common on spiritual sites (holy-bhagavad-gita.org, etc.) | Disrupts reading flow; creates commercial tone incongruent with open-source mission | Keep it purely open source; contribution = code/content PRs, not money |
| Word-by-word Sanskrit breakdown (anvaya) | Sanskrit learners value grammatical analysis | Very high complexity; requires Sanskrit NLP or manual tagging; Gita Supersite/Sri Aurobindo app do this; not the core use case | Transliteration with clear pronunciation serves beginners; anvaya is a v3+ consideration for Sanskrit-learning mode |

---

## Feature Dependencies

```
[Chapter index / landing page]
    └──required by──> [Chapter-by-chapter navigation]
                          └──required by──> [Verse-level navigation (prev/next)]
                                                └──required by──> [Progressive reveal UX]

[Structured shloka data (Sanskrit + transliteration + translation)]
    └──required by──> [Commentary / explanation per shloka]
                          └──required by──> [Curated multi-commentary synthesis]
                                                └──required by──> [Expandable individual commentaries]

[Structured shloka data]
    └──required by──> [Practical life applications per shloka]

[Structured shloka data]
    └──required by──> [Keyword/theme search]

[Practical life applications per shloka] ──enhances──> [Progressive reveal UX]
    (practical applications are the final reveal layer)

[Open source repo / MIT license] ──enables──> [Community contributions]
    (not a dependency, but an enabler that must be set up before first commit)
```

### Dependency Notes

- **Structured shloka data requires content first:** The entire feature set depends on having well-structured content (JSON/Markdown with Sanskrit, transliteration, translation, commentary, practical applications) before any UI can be built. Content generation is the critical path.
- **Progressive reveal requires verse page layout:** The reveal UX is a presentation layer on top of complete shloka data. Cannot design the interaction until all content layers are defined.
- **Chapter index requires all chapter metadata:** Chapter cards need chapter summaries, verse counts, and Sanskrit names — these are metadata, not per-verse content, and are simpler to produce.
- **Search requires content to be indexed:** Full-text search (Pagefind or Fuse.js) is built post-content-generation; it cannot be built before content exists.
- **Expandable commentaries conflict with minimal design:** Adding too many commentary traditions risks visual clutter. Maximum 4-5 traditions shown; collapsed by default. Design must enforce restraint.

---

## MVP Definition

### Launch With (v1 — Chapters 1 and 2)

Minimum viable product to prove the concept and template with two fully polished chapters.

- [ ] Chapter grid landing page (18 chapter cards, chapters 1 & 2 active, rest indicated as "coming soon") — proves the navigation concept
- [ ] Chapter 1 and 2 fully implemented with all shlokas — validates the content template
- [ ] Progressive reveal per shloka (Sanskrit → transliteration → curated explanation → practical applications) — core differentiating UX
- [ ] Curated synthesis commentary as default explanation — the main value proposition
- [ ] Expandable individual commentaries (2-3 traditions for v1) — depth for scholars
- [ ] Practical life applications per shloka (all 4 domains: Personal, Career, Health, Relationships) — the primary differentiator
- [ ] Chapter-level navigation (all shlokas listed) — table stakes
- [ ] Sequential prev/next verse navigation — table stakes
- [ ] Mobile-responsive design — table stakes
- [ ] Search within chapters 1 and 2 — basic verse lookup by number

### Add After Validation (v1.x)

Features to add once the template is proven and there's community interest.

- [ ] Remaining 16 chapters (chapter by chapter, consistent template) — triggered by positive reception of chapters 1 & 2
- [ ] Full-text thematic/keyword search across all available chapters — triggered when enough content exists to make it valuable
- [ ] Chapter summaries as standalone pages — triggered if users want overview before diving into verses
- [ ] Dark mode / reading preferences — triggered by user feedback; add if readers request it

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Audio playback — requires quality source, hosting decisions, and proven user demand
- [ ] Hindi / vernacular translations — triggered by non-English traffic data
- [ ] Word-by-word Sanskrit breakdown (anvaya) — triggered by Sanskrit-learner community engagement
- [ ] RSS or API for shloka data — triggered by developer community interest in the structured data

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Structured shloka data (all layers) | HIGH | HIGH (AI generation) | P1 — blocks everything |
| Chapter landing page (18 cards) | HIGH | LOW | P1 |
| Progressive reveal UX | HIGH | MEDIUM | P1 |
| Practical life applications per shloka | HIGH | HIGH (content) | P1 — core differentiator |
| Curated multi-commentary synthesis | HIGH | HIGH (content) | P1 |
| Expandable individual commentaries | MEDIUM | MEDIUM | P1 |
| Prev/next verse navigation | HIGH | LOW | P1 |
| Mobile-responsive design | HIGH | MEDIUM | P1 |
| Sanskrit typography (Devanagari) | HIGH | LOW | P1 |
| Basic verse search (by reference) | MEDIUM | LOW | P1 |
| Chapter summaries | MEDIUM | LOW | P2 |
| Full-text thematic search | MEDIUM | MEDIUM | P2 |
| Dark mode | LOW | LOW | P2 |
| Audio playback | MEDIUM | HIGH | P3 |
| Word-by-word Sanskrit breakdown | LOW | HIGH | P3 |
| Multi-language support | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch (v1)
- P2: Should have, add when possible (v1.x)
- P3: Nice to have, future consideration (v2+)

---

## Competitor Feature Analysis

| Feature | Gita Supersite (IITK) | Holy Bhagavad Gita | BhagavadGita.com | Bhagavad Gita For All | This App |
|---------|----------------------|-------------------|------------------|-----------------------|----------|
| Sanskrit + transliteration | YES (11 scripts) | YES | YES | YES | YES (Roman only, v1) |
| English translation | YES (multiple) | YES (single — Mukundananda) | YES (multiple) | YES | YES (synthesized) |
| Commentary | YES (Shankara, others) | YES (single tradition) | YES (20+ scholars) | YES (video) | YES (synthesized + expandable multi-tradition) |
| Progressive reveal UX | NO | NO | NO | PARTIAL (6 layers, not reveal) | YES — primary UX innovation |
| Practical life applications | NO | NO | NO | YES (career/relationships/stress — video format) | YES — per shloka, written, 4 domains |
| Multi-commentary comparison | YES (clunky multi-window) | NO | NO | NO | YES (clean expandable accordions) |
| Search | YES (Solr, Devanagari) | NO | YES | NO | YES (v1 basic; v1.x full-text) |
| Open source | NO | NO | NO | NO | YES |
| Static / no login | YES | YES | NO | NO | YES |
| Mobile-first design | PARTIAL | YES | YES | YES (app) | YES |
| Serene, minimal UI | NO | PARTIAL | NO | NO | YES — core design principle |
| Audio | YES | YES (audio) | YES | YES (100+ hours video) | NO (v1); post-v1 |
| Dark mode | NO | NO | YES | NO | v1.x |

**Key insight:** No competitor combines (a) progressive reveal UX, (b) synthesized multi-commentary, AND (c) practical life applications per shloka in a static, no-login web app. The gap is real and fillable.

---

## Sources

- Gita Supersite (IITK): https://www.gitasupersite.iitk.ac.in/ — 11-script support, multi-window commentary comparison, Solr search (MEDIUM confidence, live site verified)
- Holy Bhagavad Gita (Swami Mukundananda): https://www.holy-bhagavad-gita.org/ — Single-tradition commentary, verse structure analysis (MEDIUM confidence, live site verified)
- BhagavadGita.com (Ved Vyas Foundation): https://bhagavadgita.com/ — 20+ commentaries, AI chatbot, Next.js (MEDIUM confidence, live site verified)
- Bhagavad Gita For All: https://www.bhagavadgitaforall.com/ — 6-layer practical applications via video, 50+ life topics (MEDIUM confidence, live site verified)
- Srimad Gita App Comparison 2025: https://www.srimadgita.com/bhagavad-gita-app-comparison — Ecosystem feature matrix (LOW confidence, single source, marketing site)
- Scripture app UX analysis: https://ithy.com/article/best-bible-app-features-3vp7zjwh — Bible app table stakes vs differentiators (MEDIUM confidence, cross-domain analogy)
- GitHub Bhagavad Gita topic: https://github.com/topics/bhagavad-gita — Open source project landscape (MEDIUM confidence, live data)
- Bhagavad Gita For All practical application structure: https://www.bhagavadgitaforall.com/ — "World's first video Gita" with life-theme shloka mapping (MEDIUM confidence, live site verified)
- The Gita App (holy-bhagavad-gita.org mobile): https://thegita.app/ — Navigation patterns, reading progress (MEDIUM confidence, live site verified)

---

*Feature research for: Bhagavad Gita interactive web application*
*Researched: 2026-03-01*
