# Pitfalls Research

**Domain:** Bhagavad Gita interactive web application (Astro static site, 700+ shlokas, AI-generated content, GitHub Pages)
**Researched:** 2026-03-01
**Confidence:** MEDIUM — Core technical pitfalls (Astro, GitHub Pages) verified against official docs and real-world post-mortems. Content/copyright pitfalls verified against court records and official policy. AI accuracy risks verified against published research and documented incidents.

---

## Critical Pitfalls

### Pitfall 1: Using Prabhupada's Commentary Text Directly

**What goes wrong:**
The project uses AI-generated content "from public domain sources," but developers conflate the Bhagavad Gita's public domain Sanskrit text with the copyrighted commentary that surrounds it in popular editions. Swami Prabhupada's "Bhagavad Gita As It Is" — the most widely distributed English Gita — has its translations, purports, summaries, and introductions actively protected by the Bhaktivedanta Book Trust (BBT). The Delhi High Court ruled in BBT's favor in April 2024 against a site reproducing these works. BBT explicitly states it "doesn't like infringements and when the need arises, its legal department may deal with them sternly."

**Why it happens:**
The original Sanskrit shlokas are unambiguously public domain (ancient text, no copyright). Developers assume commentaries are similarly free because they're about a spiritual text, or because old translations appear on archive.org. The legal distinction between the text itself and its interpretation/commentary is non-obvious.

**How to avoid:**
- The bare Sanskrit text and its transliteration: fully public domain. Use freely.
- Adi Shankaracharya's original commentary in Sanskrit: public domain (8th century CE). Use freely.
- 19th century English translations of Shankaracharya's commentary (Alladi Mahadeva Sastri, 1897): public domain. Use freely, with attribution.
- Swami Prabhupada's English translation and purports: actively copyrighted by BBT. Do NOT reproduce directly. AI synthesis that paraphrases philosophical ideas in original language is the correct path.
- Swami Chinmayananda's commentary: copyrighted by Chinmaya Mission. Same rule applies.
- Eknath Easwaran's translation: copyrighted. Same rule applies.
- Safe approach: AI synthesizes the philosophical tradition (citing schools of thought: Advaita Vedanta per Shankaracharya, Vishishtadvaita per Ramanuja, Bhakti per Vaishnava tradition) without reproducing specific sentence patterns from copyrighted works.

**Warning signs:**
- Any shloka explanation that reads like it could be excerpted from a BBT publication
- AI prompts that include chunks of commentary text as reference material
- Content that cites "Prabhupada says..." followed by direct quotation exceeding a few words

**Phase to address:**
Content pipeline design phase (before any AI generation starts). Establish legal source list and AI prompt constraints as foundational decisions, not afterthoughts.

---

### Pitfall 2: Sanskrit Transliteration Inconsistency Across 700 Shlokas

**What goes wrong:**
The project ends up with mixed transliteration schemes — some shlokas use IAST (with diacritics: ā, ī, ū, ṭ, ḍ, ṇ, ś, ṣ), others use Harvard-Kyoto (no diacritics: aa, ii, uu, T, D, N, sh, S), and some use casual romanization (karma, yoga, dharma, moksha without any system). This makes the site look amateur to scholars, creates broken search (searching "dharma" misses "dhárma"), and makes copy-paste from other digital Gita resources unreliable.

**Why it happens:**
AI models default to whatever transliteration appears most in their training data, which is inconsistent. Developers don't specify a scheme in generation prompts. Different source texts use different systems. Without a schema-level constraint enforcing a single scheme, inconsistency accumulates across 700 shlokas.

**How to avoid:**
- Decide on IAST as the project standard (it's the academic standard, used by SARIT, Muktabodha, GRETIL, sanskritdocuments.org). Enforce in AI prompts explicitly.
- Store transliteration as a separate field with schema validation in Astro content collections (Zod schema can validate that required diacritics are present).
- Run a post-generation validation pass checking for scheme consistency before committing content.
- Include a few verified reference shlokas as canonical examples in AI prompts.

**Warning signs:**
- Chapter 1 uses IAST, Chapter 2 uses casual romanization
- Sanskrit search returns inconsistent results for the same root word
- Contributors submit PRs with different transliteration conventions

**Phase to address:**
Content schema design phase (before any content is generated). Lock the transliteration standard in the Zod schema and AI prompt templates. Verify across both chapters before expanding.

---

### Pitfall 3: AI-Generated Commentary Misattributing Views to Traditions

**What goes wrong:**
The AI synthesis presents a philosophical position as "the Advaita perspective" or "what Shankaracharya says" when it's actually a fabrication or conflation. For example, stating that Shankaracharya emphasized devotion (bhakti) over knowledge (jnana) — the opposite of his actual position. Or attributing a Bhakti Yoga interpretation to the Advaita school. These errors are plausible-sounding and non-obvious to non-scholars, so they survive human review and spread as the site gains users.

**Why it happens:**
LLMs trained on general corpora have surface-level knowledge of commentary traditions but cannot reliably distinguish nuanced theological positions between schools. The hallucination is not random noise but confident-sounding misinformation. Documented incidents with Bhagavad Gita AI chatbots (2023-2025) show bots "going off script" while claiming scriptural authority.

**How to avoid:**
- Limit AI to paraphrasing the *synthesis* (shared meaning) rather than attributing specific claims to specific commentators.
- When mentioning traditions by name ("Advaita Vedanta holds that..."), verify the attributed position against a trusted reference before publishing.
- Include a disclaimer that the synthesis is a practical interpretation, not a scholarly treatise.
- For v1 (chapters 1-2), have someone with Gita knowledge do a read-through of all AI-generated commentary, specifically checking tradition attributions.
- Use AI for structure and practical application sections, not for precision-attribution of philosophical positions.

**Warning signs:**
- AI synthesis contradicts itself between shlokas on the same philosophical point
- A "Shankaracharya perspective" section emphasizes devotion/bhakti prominently
- Practical application sections make specific prescriptive claims ("The Gita says you should...")

**Phase to address:**
Content review process (after generation, before publishing). Build a review checklist that specifically flags tradition attribution claims.

---

### Pitfall 4: GitHub Actions Build Exceeding the 10-Minute GitHub Pages Timeout

**What goes wrong:**
GitHub Pages deployments time out after 10 minutes. Astro builds for 700 static pages with image optimization, schema validation, and search index generation can exceed this at scale. Real-world cases show Astro sites with 200+ pages reaching 30-minute build times when component-level API calls are made per page.

**Why it happens:**
- Data fetching in child components inside `[slug].astro` triggers once per page — 700 pages * 300ms API call = 3.5 minutes of unnecessary delay
- Image processing runs on every build even for unchanged assets
- No build cache configured in GitHub Actions
- Node.js running at default memory ceiling causes garbage collection pauses

**How to avoid:**
- Pass data via props from the top-level page component, not inside child/layout components
- Enable Astro's content collection caching: `contentCollectionCache: true` in `astro.config.mjs`
- Configure GitHub Actions to cache the `.astro` and `node_modules` directories between builds
- Use `NODE_OPTIONS='--max-old-space-size=4096'` in the GitHub Actions environment
- Store shloka content as Markdown files in content collections (not external API calls) — this avoids runtime fetching entirely
- Use `npm run build` with `--concurrency` set to avoid resource contention

**Warning signs:**
- Local builds take 2+ minutes for chapters 1-2 only (will multiply catastrophically at 700 shlokas)
- GitHub Actions logs show image optimization consuming disproportionate build time
- Build time grows linearly with shloka count

**Phase to address:**
CI/CD setup phase (before v1 launch). Establish build time budget (target: under 5 minutes for 700 shlokas) and measure from the start.

---

### Pitfall 5: Shloka Numbering Schema Without Agreed-Upon Source Edition

**What goes wrong:**
The project builds 700 pages with URLs like `/shloka/6/47` (chapter 6, verse 47). Later, a contributor or comparison with another Gita site reveals that some editions number verses differently — particularly in chapters with speaker-attribution verses or summary verses. Southern Indian manuscript traditions include additional verses not in the "standard" 700. The project's URLs become canonical and changing them later breaks incoming links, search index, and cross-references.

**Why it happens:**
The Bhagavad Gita exists in multiple manuscript traditions. The "700 shlokas" standard traces to Adi Shankara's commentary (8th century CE) and is used by Gita Press (the definitive modern edition). However, southern recensions count 745 verses. ISKCON/Prabhupada editions follow the 700-verse Gita Press numbering but with some chapter-internal differences. Without explicitly choosing an edition as the authority, the numbering is ambiguous.

**How to avoid:**
- Declare the source edition explicitly in the project README and content schema: use Gita Press (Gorakhpur) as the canonical numbering authority for the 700-verse structure.
- Cross-reference the first 5 shlokas of each chapter against bhagavadgita.org (uses Gita Press numbering) before generating the full content batch.
- Persist `chapter` and `verse` as integers in the content schema; use `chapter/verse` as the canonical URL segment — do not change this after launch.
- Add an optional `alternate_numbering` field in the schema for edge cases.

**Warning signs:**
- Content source uses chapter/verse numbers that don't match Gita Press
- Chapter 1 has a different verse count than the 47 expected by Gita Press numbering
- Contributors report "the shloka for 2.47 says karmayoga, but another site says that's 2.48"

**Phase to address:**
Data schema phase (before any content is generated). Lock edition choice and verify numbering for chapters 1-2 against at least two reference sources before generating.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding chapter metadata in page components | Faster initial build | Breaks when chapters expand; duplication across components | Never — put in content collection from day one |
| Storing all 700 shlokas in a single JSON file | Simple to manage | Single-file schema changes require touching every entry; no per-file git history | Never — use individual Markdown files per shloka |
| Using Google Fonts CDN for Devanagari font loading | Zero setup | External dependency; potential CORS issues; performance varies; single point of failure for font rendering | Acceptable for prototype; self-host before launch |
| Generating all 700 shlokas at once in one AI batch | Faster initial population | No per-shloka review; errors propagate uniformly | Never — generate chapter by chapter with review gates |
| Skipping Zod schema validation on content fields | Faster content iteration | Silent data corruption; build errors discovered at deploy time not authoring time | Never — schema is the contract between content and UI |
| Using `client:load` on all interactive components | Simpler development | JavaScript loaded on every page even for rarely-used features; defeats Astro's performance model | Never — use `client:visible` or `client:idle` for non-critical UI |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Actions + GitHub Pages | Using the default `pages` deployment action which inherits the 10-minute timeout | Use `actions/deploy-pages@v4` with `withastro/action` and add explicit caching steps for `.astro/` directory |
| Pagefind search | Running Pagefind before Astro build completes, missing new content | Add Pagefind as an Astro integration (last in integration list) so it indexes after build; never call it in a pre-build hook |
| Pagefind search | Pagefind indexes Sanskrit Devanagari text as unindexable binary | Add `data-pagefind-ignore` to raw Devanagari spans and only index transliteration + English explanation fields |
| Fontsource / Noto Serif Devanagari | Importing the full variable font (3-5MB) | Use `@fontsource/noto-serif-devanagari` with subset imports; or load via `<link rel="preload">` with `font-display: swap` |
| AI generation (OpenAI/Anthropic API) | Calling API per-shloka at build time in Astro page components | Generate all content offline, commit as Markdown files, never call AI APIs during the build |
| Astro content collections | Changing the Zod schema after content is generated | Schema changes require validating all existing files; plan the schema fully before bulk generation |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Devanagari font not preloaded | Flash of unstyled text (FOUT) on every shloka page; Latin font renders, then Devanagari font loads seconds later | Preload the Devanagari font with `<link rel="preload">` in `<head>`; set `font-display: swap` | On any 3G connection; consistently on first visit |
| Sanskrit font subsetting breaks ligatures | Compound consonants render as boxes or wrong characters; conjunct consonants missing | Do NOT subset Noto Serif Devanagari — Sanskrit requires full glyph set including complex ligatures not present in vernacular Devanagari | As soon as complex Sanskrit conjuncts appear (most shlokas) |
| Progressive reveal implemented with CSS only (no JS state) | Revealed layers can't be bookmarked; user loses progress on page refresh; browser back button breaks the reveal | Track reveal state in URL hash or localStorage; use Astro island for reveal logic | On any page refresh or back-navigation |
| Search index built at client startup | 500ms+ delay before search works; janky experience on slow devices | Use Pagefind (pre-built index served as static chunks); never build index in the browser | With 700 shlokas, client-side index build will be noticeable on mid-range mobile |
| All 700 shloka pages share one large CSS bundle | Unused styles for features not on that page; slower parse time | Use Astro's scoped styles per component; avoid global stylesheets for component-specific styles | Not a problem at 700 pages, but establishes bad pattern before scaling |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Committing AI API keys to the repository | Key theft; unauthorized API usage charges | Use GitHub Actions secrets exclusively; never hardcode API keys in scripts or `.env` files committed to the repo |
| Including unchecked AI-generated content that contains harmful advice | Spiritual authority framing makes harmful advice more dangerous; documented incidents of Gita bots endorsing violence | Human review gate for all AI-generated content before merge; no automated publishing to production |
| Using third-party commentary text directly in AI prompts as training examples | Copyright violation from the prompt side (training data that reproduces protected text) | Use only public domain source texts in prompts; reference philosophical positions by description, not quotation |
| Exposing build-time environment variables in client-side bundle | Configuration leakage | Astro separates server-only and client-exposed env vars; audit `import.meta.env` usage in client components |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Progressive reveal with no "reveal all" shortcut | Power users frustrated by clicking through 4 reveal steps; scholars want full text immediately | Add "Expand all" button that bypasses the reveal sequence; store preference in localStorage |
| Reveal state resets on page load | User reads shloka, bookmarks it, returns and has to re-reveal — anti-contemplative | Persist reveal state per shloka in sessionStorage or URL hash; restore on load |
| No visual separator between synthesis and individual commentaries | Users confuse AI synthesis with specific commentator's words; undermines scholarly trust | Clear labeling: "Synthesized Reading" vs "Traditional Commentaries" vs "Practical Applications" — different visual treatments |
| Mobile: Devanagari text too small to read | Devanagari script requires larger font size than Latin at the same `em` — 16px Devanagari is closer to 12px Latin in perceived size | Set Devanagari text at minimum 20px; test on actual Android and iOS devices, not just browser emulation |
| No keyboard navigation between shlokas | Sequential reading requires mouse; breaks screen reader flow | Implement `prev` / `next` keyboard shortcuts; ensure arrow key navigation works within chapter |
| Search returns shlokas with no context | User searches "duty" and gets verse numbers with no preview — can't evaluate relevance | Pagefind search snippets should include explanation excerpt, not just Sanskrit/transliteration |
| Animation violates `prefers-reduced-motion` | Users with vestibular disorders experience nausea from reveal animations | Wrap all CSS transitions in `@media (prefers-reduced-motion: no-preference)` from the start |

---

## "Looks Done But Isn't" Checklist

- [ ] **Sanskrit rendering:** Verify Devanagari text displays correctly on iOS Safari and Android Chrome — not just desktop Chrome. iOS doesn't always render Vedic accents correctly with Noto fonts.
- [ ] **Progressive reveal:** Verify state persists across page reload and browser back-button. A reveal that resets on refresh is broken for contemplative use.
- [ ] **Search:** Verify Pagefind index is rebuilt on every deployment, not cached from a previous build. New shlokas added after initial deployment must appear in search.
- [ ] **Open Graph / social sharing:** Each shloka page needs unique `og:title`, `og:description`, and ideally `og:image` — not the homepage defaults. Sharing shloka links on social must work.
- [ ] **Chapter page:** The 18-chapter grid must handle chapters with varying verse counts gracefully. Chapters range from 20 to 78 shlokas — cards must not assume uniform count.
- [ ] **Sequential navigation:** Verify that `Next shloka` at chapter boundary (e.g., end of Chapter 1) correctly navigates to Chapter 2, Verse 1 — not to a 404 or to verse 1 of the same chapter.
- [ ] **Copyright notices:** AI-generated content must include a notice that it's synthesized from public domain sources. Commentary attributions must be accurate (tradition names, not specific author names for copyrighted works).
- [ ] **Mobile keyboard:** Search bar on mobile should not trigger keyboard that obscures the first search results. Test on actual mobile device.
- [ ] **Build time:** Measure full build time for chapters 1-2 on GitHub Actions. If it exceeds 3 minutes for 2 chapters, 700 shlokas will exceed the 10-minute limit.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Copyright infringement discovered post-launch | HIGH | Immediate takedown of infringing content; regenerate affected shlokas with corrected prompts; add copyright review to contribution guidelines |
| Shloka numbering mismatch discovered at scale | HIGH | Choose canonical edition, update all content slugs, implement 301 redirects from old to new URLs, update search index |
| AI attribution errors spread across 700 shlokas | HIGH | Audit all tradition-attributed claims; create correction batch; requires subject matter expert review pass |
| Build timeout hitting GitHub Pages limit | MEDIUM | Implement build caching immediately; or temporarily build locally and push artifact; long-term: optimize per strategies above |
| Transliteration inconsistency across chapters | MEDIUM | Write a transliteration normalization script; run as a one-time migration; add to CI linting going forward |
| Progressive reveal state not persisting | LOW | Add localStorage persistence to the reveal island; no content changes required; ships in a patch |
| Devanagari font rendering broken on mobile | LOW | Switch font source (self-host via fontsource instead of CDN); no content changes required |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Prabhupada/commentary copyright | Content pipeline design (before AI generation) | Legal source list approved; AI prompts audited for prohibited source material |
| Sanskrit transliteration inconsistency | Data schema design | Zod schema enforces transliteration field; test with 5 shlokas from different chapters |
| AI misattribution of traditions | Content review process | Pre-launch checklist applied to all ch1-2 shlokas; tradition claims verified against reference |
| GitHub Actions build timeout | CI/CD setup | Build time measured and under 5 minutes for full 700-shloka run; caching confirmed active |
| Shloka numbering ambiguity | Data schema design | Edition declared in README; numbering verified against two sources for chapters 1-2 |
| Devanagari font subsetting | Foundation/design system phase | All Devanagari renders correctly on iOS Safari, Android Chrome, and desktop with 5 test shlokas |
| Progressive reveal state loss | UI component phase | Reveal state persists through page reload and browser back navigation |
| Search indexing gaps | Search implementation phase | Pagefind indexes all shlokas including newly added content; rebuild confirmed in CI |
| AI content at scale without review | Content generation workflow | Human review gate defined in CONTRIBUTING.md; no automated publish path |

---

## Sources

- [GitHub Pages Limits — Official GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [How We Cut Astro Build Time 83% Faster — AntStack](https://www.antstack.com/blog/how-we-cut-astro-build-time-from-30-minutes-to-5-minutes-83-faster/)
- [Optimize Astro Build Performance — Markaicode](https://markaicode.com/optimize-astro-build-performance/)
- [Astro Content Collections: Schema Validation Errors — Astro Docs](https://docs.astro.build/en/reference/errors/invalid-content-entry-frontmatter-error/)
- [Pagefind Static Site Search — Official Docs](https://pagefind.app/)
- [ISKCON Copyright Case: HC Grants Injunction — Latest Laws](https://www.latestlaws.com/high-courts/iskcon-copyright-case-hc-grants-injunction-against-unauthorized-reproduction-of-spiritual-texts-from-piracy-206471)
- [Delhi HC Bhaktivedanta Book Trust Copyright Case Analysis — Khurana & Khurana, 2024](https://www.khuranaandkhurana.com/2024/08/26/case-analysis-bhaktivedanta-book-trust-v-bhagvatam-in/)
- [No copyright in religious scriptures but adaptive works can be — Bar and Bench](https://www.barandbench.com/news/no-copyright-religious-scriptures-dramatic-adaptive-works-copyrighted-delhi-high-court)
- [India's religious AI chatbots: dangers of fabricated spiritual authority — Rest of World, 2023](https://restofworld.org/2023/chatgpt-religious-chatbots-india-gitagpt-krishna/)
- [Vibe Siddhanta and The Dangers of AI — ISKCON News](https://iskconnews.org/vibe-siddhanta-and-the-dangers-of-ai/)
- [Devanagari Sanskrit Font Issues — AshtangaYoga.info](https://www.ashtangayoga.info/philosophie/sanskrit-und-devanagari/fonts-schriften-fuer-devanagari-und-lautschrift-iso-15919/sanskrit-/-devanagari-problem-solving/)
- [Noto Devanagari Incorrect Rendering Issue — GitHub notofonts/devanagari](https://github.com/notofonts/devanagari/issues/32)
- [IAST — International Alphabet of Sanskrit Transliteration — Wikipedia](https://en.wikipedia.org/wiki/International_Alphabet_of_Sanskrit_Transliteration)
- [How Many Verses in the Bhagavad Gita — 700 or 745? — Way2Wise](https://way2wise.com/number-of-verses-in-bhagavad-gita/)
- [Font Best Practices — web.dev](https://web.dev/articles/font-best-practices)
- [Astro Islands Architecture — Astro Docs](https://docs.astro.build/en/concepts/islands/)
- [Progressive Disclosure Accessibility — Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/)
- [Bhagavad Gita App Open Issues — GitHub gita/Bhagavad-Gita-App](https://github.com/gita/Bhagavad-Gita-App/issues)

---
*Pitfalls research for: Bhagavad Gita interactive web application (Astro, GitHub Pages, AI-generated content)*
*Researched: 2026-03-01*
