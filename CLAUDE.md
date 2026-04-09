<!-- GSD:project-start source:PROJECT.md -->
## Project

**The Bhagavad Gita — Definitive Modern Resource**

The most comprehensive, beautiful, and authoritative Bhagavad Gita resource on the internet. A static web application presenting all 700 shlokas with multi-tradition synthesis (8 schools of thought), life-problem navigation, progressive disclosure for all audiences (seekers to scholars), and Wikipedia-citable methodology. Built to be the reference that displaces single-tradition sites as the default Gita resource online.

**Core Value:** Every person — from a curious Gen Z seeker to an academic scholar — finds exactly the depth they need, enters through their own question, and trusts the source enough to cite it.

### Constraints

- **Tech Stack**: Astro 5 + Tailwind v4 + Preact — no migration, build on existing
- **Hosting**: Fully static — GitHub Pages, no server, no database
- **Content**: AI-synthesized from public domain sources — no copyrighted commentary text (no BBT/ISKCON, no Chinmaya Mission, no Sri Aurobindo Ashram)
- **Transliteration**: IAST only (no Harvard-Kyoto, no ITRANS)
- **Performance**: Build-time generation for OG images, no runtime cost
- **URLs**: Existing URL structure must not break (`/verse/{chapter}/{verse}/`, `/chapter/{n}/`)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
## Installation
# Bootstrap a new Astro project (interactive — choose "empty" template, TypeScript strict)
# Add official integrations
# Search
# Fonts (Devanagari)
# Dev tools
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
## Stack Patterns by Variant
- Implement as a Preact island: `<client:load>` directive
- State: simple `useState` with a step index
- No need for a state management library (Zustand, Jotai, etc.) — this is local component state
- Preact island with `useState` for which commentary is expanded
- Or pure CSS + `<details>`/`<summary>` HTML elements with no JS at all — valid for simple show/hide
- Use `astro-pagefind`'s prebuilt `<Search />` component with `client:load`
- Style it with Tailwind's `@layer components` to match your design
- `/src/pages/chapters/[chapter]/index.astro` — chapter overview page
- `/src/pages/chapters/[chapter]/[verse].astro` — individual shloka page
- Use `getStaticPaths()` driven by content collection queries
- id: "1.1"
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| astro@5.18.x | @astrojs/preact@4.1.x | Official integration, maintained in sync |
| astro@5.18.x | @astrojs/mdx@4.3.x | Official integration |
| astro@5.18.x | @astrojs/sitemap@3.7.x | Official integration |
| astro@5.18.x | tailwindcss@4.2.x + @tailwindcss/vite | Requires Astro 5.2+ for Vite plugin |
| astro@5.18.x | astro-pagefind@1.8.x | Community integration; add last in integrations array |
| Node.js | >=20.x | Required by Astro 5 |
## GitHub Actions Deployment Workflow
# .github/workflows/deploy.yml
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
