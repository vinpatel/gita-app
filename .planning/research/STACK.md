# Stack Research

**Domain:** Interactive scripture / content-heavy static web application
**Researched:** 2026-03-01
**Confidence:** HIGH (verified against official docs, npm registry, and multiple current sources)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 5.18.x (stable) | Static site framework | Chosen constraint; also the right choice — native content collections, islands architecture, zero JS by default, 5x faster builds for content-heavy sites. Avoid v6 beta — breaking changes, not stable. |
| TypeScript | bundled with Astro | Type safety | Astro ships strict TypeScript presets; content collection schemas auto-generate types from Zod definitions. Non-negotiable for 700-entry structured data. |
| Tailwind CSS | 4.2.x | Utility-first CSS | v4 is a full rewrite — CSS-native, zero config, `@import "tailwindcss"` is all you need. Faster builds, smaller output. The @astrojs/tailwind integration is deprecated for v4; use the Vite plugin instead. |
| Preact | via @astrojs/preact 4.1.x | Interactive islands UI | 3kB runtime vs React's ~45kB. Identical API to React. Recommended specifically for islands-first frameworks like Astro. The Gita app's interactive needs (progressive reveal, search modal, commentary toggles) are lightweight — Preact is sufficient and appropriate. |

### Content Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro Content Collections (Content Layer API) | built-in Astro 5 | Structured shloka data | The standard Astro 5 approach for structured content. `file()` loader reads one YAML file with 700 entries; `glob()` loader reads per-file Markdown. Both give full Zod schema validation and TypeScript types. The Content Layer caches between builds — handles 10,000+ entries efficiently. |
| YAML (per-chapter files) | — | Shloka data format | One YAML file per chapter (18 files, ~40 entries each) is the right granularity. Easier to edit/review than a single 700-entry monolith, easier to query than 700 individual files. Each entry has `id`, `chapter`, `verse`, `sanskrit`, `transliteration`, `explanation`, `applications` fields validated by Zod. |
| Zod | bundled via `astro/zod` | Schema validation | Built into Astro — no separate install. Validates every shloka entry at build time. Type inference means TypeScript autocompletion throughout your `.astro` files. |

### Search

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Pagefind | via astro-pagefind 1.8.x | Full-text static search | The standard for Astro static sites. Runs post-build, indexes HTML, ships a <300kB JS bundle for a 10,000-page site. Zero backend. Supports multilingual content. Drop-in `<Search />` component from `astro-pagefind/components/Search`. No alternatives are close for this use case. |

### Typography / Fonts

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @fontsource/tiro-devanagari-sanskrit | latest | Sanskrit / Devanagari body text | Designed specifically for Sanskrit texts; origins in Murty Classical Library of India; supports Vedic accents; available via Fontsource (self-hosted, no Google CDN dependency). SIL OFL 1.1 license. |
| @fontsource/noto-serif-devanagari | latest | Devanagari fallback | Google's Noto project covers all scripts — use as fallback if Tiro Devanagari fails to load. Variable font available. |
| A Latin serif for body/UI text | — | Latin script headings and UI | Pair with a refined Latin serif (e.g., `@fontsource-variable/crimson-pro` or `@fontsource/eb-garamond`) to match the scholarly spiritual tone. Pick one at design time. |

### SEO and Deployment

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @astrojs/sitemap | 3.7.x | XML sitemap generation | Official integration. Automatically crawls all static routes including dynamic `[slug]` pages. Critical for a scripture site targeting organic search. |
| withastro/action | v5.2.0 | GitHub Actions CI/CD | The official Astro GitHub Pages deploy action. Detects package manager from lockfile, builds, uploads artifact to Pages. Zero configuration. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Node.js 20 LTS | Runtime for build tooling | Required by Astro 5. Use the GitHub Actions `node-version: 20` setting. |
| pnpm | Package manager | Faster installs than npm; lockfile committed as `pnpm-lock.yaml` for action detection. Use pnpm if you have a preference; npm works fine too. |
| Prettier + `prettier-plugin-astro` | Code formatting | Prettier does not format `.astro` files natively — the plugin is required. Add to pre-commit hooks. |
| ESLint + `eslint-plugin-astro` | Lint | Official Astro ESLint plugin catches common mistakes in `.astro` files. |

---

## Installation

```bash
# Bootstrap a new Astro project (interactive — choose "empty" template, TypeScript strict)
npm create astro@latest gita-app

# Add official integrations
npx astro add tailwind    # installs @tailwindcss/vite, configures astro.config.mjs
npx astro add preact      # installs @astrojs/preact
npx astro add mdx         # if you need MDX for rich component-in-content authoring
npx astro add sitemap     # installs @astrojs/sitemap

# Search
npm install astro-pagefind

# Fonts (Devanagari)
npm install @fontsource/tiro-devanagari-sanskrit
npm install @fontsource/noto-serif-devanagari

# Dev tools
npm install -D prettier prettier-plugin-astro
npm install -D eslint eslint-plugin-astro
```

**tsconfig.json** — use Astro's strictest preset:
```json
{
  "extends": "astro/tsconfigs/strictest"
}
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro 5.18 (stable) | Astro 6 beta | When v6 reaches stable; v6 adds live collections and CSP APIs but isn't production-ready yet |
| Preact | React | If your team is already committed to React tooling, or you plan to integrate React-specific libraries (e.g., Framer Motion). The 42kB extra payload is acceptable if needed. |
| Preact | Svelte | If you want even smaller bundle size and compiler-based reactivity. Svelte 5 is mature. Tradeoff: fewer Astro community examples with Svelte. |
| Preact | Vanilla JS | For truly minimal interactions (a single toggle). Use `<script>` tags in Astro for zero-framework interactivity. For the Gita app's progressive reveal, Preact is the right call — stateful UI logic is cleaner in a component. |
| Tailwind v4 | CSS Modules | CSS Modules are great for component-scoped styles. Astro supports them natively. Use Tailwind v4 for utility-first layout/spacing/color; supplement with Astro's scoped `<style>` for bespoke Devanagari typography rules. |
| YAML per-chapter files | Single 700-entry YAML | Monolith is harder to review in PRs and diffs. Per-chapter files map naturally to the 18-chapter structure. |
| YAML per-chapter files | Markdown with frontmatter (per shloka) | 700 individual `.md` files is manageable with `glob()` loader but creates a very large directory. YAML gives better structure for multi-section data (applications split by life domain). |
| Pagefind | Lunr.js | Lunr ships its entire index to the browser upfront. Pagefind streams index chunks on demand — Pagefind wins decisively for large content sets. |
| Pagefind | Algolia / Typesense | These require a backend or external service. Non-starter for a fully static GitHub Pages deployment. |
| @astrojs/sitemap | Manual sitemap | Manual sitemaps go stale when pages are added. Use the integration. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@astrojs/tailwind` integration | Deprecated for Tailwind v4. Only works with Tailwind v3. Installs the wrong version. | `@tailwindcss/vite` Vite plugin (added via `npx astro add tailwind`) |
| Tailwind v3 | v4 is the current stable release with faster builds and CSS-native config. v3 is end-of-maintenance. | Tailwind v4.2.x |
| Astro v6 beta | Not stable. Has breaking changes from v5. Wait for stable release. | Astro 5.18.x |
| React (`@astrojs/react`) for islands | 45kB runtime overhead for what are essentially toggle/reveal interactions. Kills the performance story. | Preact — same API, 3kB |
| `astro-lunr` | Abandoned, last published years ago. Sends full index to client, bad for large sites. | Pagefind via `astro-pagefind` |
| Google Fonts CDN at runtime | External DNS lookup, privacy implications, fails offline. | Fontsource npm packages (self-hosted, bundled) |
| A JavaScript CMS / headless CMS | Zero need for a backend; adds cost, complexity, and a dependency for a pure static open-source project. | Astro content collections with YAML files committed to the repo — contributions via PRs. |
| `output: 'server'` or `output: 'hybrid'` | Requires a server adapter. GitHub Pages cannot serve server-rendered responses. | `output: 'static'` (the default in Astro 5) |

---

## Stack Patterns by Variant

**For the progressive reveal interaction (Sanskrit → transliteration → explanation → applications):**
- Implement as a Preact island: `<client:load>` directive
- State: simple `useState` with a step index
- No need for a state management library (Zustand, Jotai, etc.) — this is local component state

**For commentary toggles (Shankaracharya, Prabhupada, etc.):**
- Preact island with `useState` for which commentary is expanded
- Or pure CSS + `<details>`/`<summary>` HTML elements with no JS at all — valid for simple show/hide

**For the search page/modal:**
- Use `astro-pagefind`'s prebuilt `<Search />` component with `client:load`
- Style it with Tailwind's `@layer components` to match your design

**For chapter and shloka routing:**
- `/src/pages/chapters/[chapter]/index.astro` — chapter overview page
- `/src/pages/chapters/[chapter]/[verse].astro` — individual shloka page
- Use `getStaticPaths()` driven by content collection queries

**For content data structure (one YAML file per chapter):**
```
/src/data/
  chapter-01.yaml   # 47 shlokas
  chapter-02.yaml   # 72 shlokas
  ...
  chapter-18.yaml   # 78 shlokas
```
Each entry structure:
```yaml
- id: "1.1"
  chapter: 1
  verse: 1
  sanskrit: "धृतराष्ट्र उवाच..."
  transliteration: "dhritarashtra uvaacha..."
  word_meanings: "..."
  explanation: "..."
  applications:
    personal: "..."
    professional: "..."
    health: "..."
    relationships: "..."
  commentaries:
    shankaracharya: "..."
    prabhupada: "..."
    chinmayananda: "..."
```

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| astro@5.18.x | @astrojs/preact@4.1.x | Official integration, maintained in sync |
| astro@5.18.x | @astrojs/mdx@4.3.x | Official integration |
| astro@5.18.x | @astrojs/sitemap@3.7.x | Official integration |
| astro@5.18.x | tailwindcss@4.2.x + @tailwindcss/vite | Requires Astro 5.2+ for Vite plugin |
| astro@5.18.x | astro-pagefind@1.8.x | Community integration; add last in integrations array |
| Node.js | >=20.x | Required by Astro 5 |

**Critical compatibility note:** The old `@astrojs/tailwind` integration targets Tailwind v3. It is incompatible with Tailwind v4. Do not install both.

---

## GitHub Actions Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v5
        # Detects pnpm/npm/yarn from lockfile automatically
        # No additional configuration needed for standard Astro projects

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**astro.config.mjs** configuration for GitHub Pages:
```javascript
// For a user/org page (username.github.io):
export default defineConfig({
  site: 'https://username.github.io',
  // No base needed for username.github.io repos
});

// For a project page (username.github.io/gita-app):
export default defineConfig({
  site: 'https://username.github.io',
  base: '/gita-app',
});
```

---

## Sources

- [Astro 5.0 release announcement](https://astro.build/blog/astro-5/) — Content Layer API, Server Islands, performance numbers (HIGH confidence)
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — file() loader, glob() loader, Zod schemas (HIGH confidence)
- [Astro GitHub Pages deploy guide](https://docs.astro.build/en/guides/deploy/github/) — site/base config, workflow structure (HIGH confidence)
- [withastro/action releases](https://github.com/withastro/action/releases) — confirmed v5.2.0 as latest (HIGH confidence)
- [Tailwind CSS v4 with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — Vite plugin approach confirmed (HIGH confidence)
- [Astro 5.2 announcement](https://astro.build/blog/astro-520/) — `npx astro add tailwind` now configures Tailwind v4 Vite plugin (HIGH confidence)
- [Pagefind official site](https://pagefind.app/) — v1.4.0, multilingual support, <300kB payload at scale (HIGH confidence)
- [astro-pagefind npm](https://github.com/shishkin/astro-pagefind) — v1.8.5, add-last requirement (MEDIUM confidence — npm data from WebSearch)
- [Tiro Devanagari Sanskrit on Fontsource](https://fontsource.org/fonts/tiro-devanagari-sanskrit) — SIL OFL 1.1, Sanskrit-specific design (HIGH confidence)
- [Astro "What's New" January 2026](https://astro.build/blog/whats-new-january-2026/) — Astro joined Cloudflare, v5.17 released, v6 beta ongoing (HIGH confidence)
- npm search data — astro@5.18.0, tailwindcss@4.2.1, @astrojs/preact@4.1.3, @astrojs/mdx@4.3.13, @astrojs/sitemap@3.7.0 (MEDIUM confidence — from WebSearch, verified against multiple sources)

---

*Stack research for: Bhagavad Gita interactive static web application*
*Researched: 2026-03-01*
