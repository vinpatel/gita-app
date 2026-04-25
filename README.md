# The Bhagavad Gītā

**The most comprehensive multi-tradition Bhagavad Gītā resource on the open web.**

[bhagavad.net](https://bhagavad.net) · [Free PDF book](https://bhagavad.net/downloads/gita-en.pdf) · [Read online](https://bhagavad.net/book/)

---

A static, ad-free, ML-readable presentation of all 700 shlokas with **eight commentary traditions**, IAST transliteration, life-application questions, and a downloadable book edition. Built to be the reference that displaces single-tradition sites as the default Gita resource online.

## Why this exists

Every other Gita resource on the internet is locked to a single tradition: ISKCON's Bhaktivedanta Vedabase is Gaudīya Vaiṣṇava, Sri Aurobindo's site is integral yoga, the Gita Press editions are mainstream Vaiṣṇava. Each is excellent — none lets you compare interpretations side by side.

This site asks one question and answers it eight different ways: **what does this verse mean according to Advaita, Viśiṣṭādvaita, Dvaita, Bhakti, Kashmir Shaivism, Śuddhādvaita, Karma-yoga (Tilak/Gandhi), and Practical Vedānta (Vivekānanda)?**

Every commentary is AI-synthesized from public-domain sources. No copyrighted text. No ads. No login. No tracking beyond a privacy-respecting view counter.

## What's here

| | |
|---|---|
| **Verses** | 700 (all 18 chapters, fully loaded) |
| **Commentary traditions** | 8 per verse |
| **Languages** | English; Hindi/Marathi/Gujarati/Bengali/Tamil/Telugu/Kannada/Malayalam/Odia/Punjabi/Sanskrit machinery in place, translation pending |
| **Free PDF download** | Yes — [`gita-en.pdf`](https://bhagavad.net/downloads/gita-en.pdf) |
| **Source data** | Open JSON in [`src/data/chapters/`](src/data/chapters/) |
| **License** | See [LICENSE](LICENSE) |

## For readers

Three ways to use the site:

1. **[Browse by chapter](https://bhagavad.net/)** — homepage shows all 18 as life lessons. Click into any chapter to see every verse.
2. **[Search by life question](https://bhagavad.net/)** — the search box maps everyday questions ("how do I deal with anger?") to relevant verses across all chapters.
3. **[Download the book](https://bhagavad.net/downloads/gita-en.pdf)** — full A4 PDF, lean format (Sanskrit + IAST + translation + synthesis). Works offline, share by file.

## For developers

A static site with an interesting build pipeline. If you're curious how to do any of these in production, the code is small and readable.

**Stack**

- [Astro 5](https://astro.build) (static output, content collections, view transitions)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-native, zero config)
- [Preact](https://preactjs.com) for the few interactive islands (search, commentary tabs)
- [Pagefind](https://pagefind.app) for full-text static search
- [Playwright](https://playwright.dev) for build-time PDF + Open Graph image generation

**Notable patterns**

- **Custom content collection loader** — [`src/content.config.ts`](src/content.config.ts) reads 18 JSON files into a single `chapters` collection with full Zod-validated schema (Devanagari regex, IAST diacritic regex, multi-tradition commentary tuples, etc.).
- **Build-time PDF book** — [`scripts/generate-pdf.mjs`](scripts/generate-pdf.mjs) spins up a tiny Node http server, drives Chromium via Playwright to print `/book/` to `dist/downloads/gita-en.pdf`. Loops over locales when more become available.
- **Build-time Open Graph image** — same Playwright run screenshots [`/og/default/`](src/pages/og/default.astro) at 1200×630 to `dist/og-default.png`. Always in sync with the design.
- **Locale-aware book route** — [`src/pages/book/[...lang].astro`](src/pages/book/[...lang].astro) discovers locales by scanning `src/data/chapters-*/` at build time. New translations land → new route + new PDF auto-generate. No code change needed.
- **Translation workflow** — [`scripts/translate-chapter.mjs`](scripts/translate-chapter.mjs) + [`.github/workflows/translate.yml`](.github/workflows/translate.yml) translate one chapter to one locale per dispatch via the Anthropic API. Idempotent, incremental save, runtime model discovery so retired model IDs don't break the pipeline.
- **Privacy-first analytics** — [GoatCounter](https://www.goatcounter.com) integration gated on a single env var. No cookies, no IP retention.

## Run locally

```bash
git clone https://github.com/vinpatel/gita-app.git
cd gita-app
npm install
npm run dev   # http://localhost:4321
```

Other scripts:

```bash
npm run build   # static site → dist/
npm run pdf     # generate PDF + OG image (requires Playwright Chromium)
```

## Contribute

Contributions welcome. A few specific asks:

- **Translation review** — if you read Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Odia, Punjabi, or Sanskrit at a literary level, your eye on the AI-translated chapters once they ship would mean a lot. Open an issue with `[lang-review]` in the title.
- **Verse content corrections** — explanation or synthesis fields that misrepresent a tradition: PRs welcome. Edit `src/data/chapters/chapter-NN.json`.
- **Theme tag improvements** — themes are imperfect. Better tags = better life-search results.
- **New commentary traditions** — only the eight currently included are AI-synthesized from public-domain sources. Adding more (e.g., Shankaradeva, Rāmānanda) requires the same approach.

For substantial changes, open an issue first to discuss scope.

## Acknowledgments

This work draws on the public-domain commentaries of Ādi Śaṅkarācārya, Rāmānujācārya, Madhvācārya, Vallabhācārya, Abhinavagupta, Bāl Gangādhar Tilak, Mahatma Gandhi, and Swami Vivekānanda — and on centuries of oral tradition that none of us authored.

Built by [Vin Patel](https://vinpatel.com). Part of the same ecosystem as [vinpatel.com](https://vinpatel.com) and other open-source projects.

## License

See [LICENSE](LICENSE).
