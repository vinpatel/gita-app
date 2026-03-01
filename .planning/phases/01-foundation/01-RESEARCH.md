# Phase 1: Foundation - Research

**Researched:** 2026-03-01
**Domain:** Astro 5 project scaffold, Zod content schema, GitHub Actions CI/CD, legal guardrails
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Tech Stack**
- Astro 5 with TypeScript strict mode
- Tailwind CSS v4 via `@tailwindcss/vite` plugin — NOT deprecated `@astrojs/tailwind`
- Preact for interactive islands (3kB runtime)
- Node.js 20 LTS

**Content Schema**
- Per-chapter JSON files in Astro Content Collections with `file()` loader
- Zod schema validates all fields at build time: Sanskrit (Devanagari), IAST transliteration, plain-language explanation, curated synthesis, tradition commentaries (2-3), practical applications (4 domains), life-theme tags
- IAST is the mandatory transliteration standard — schema must reject non-IAST input
- Gita Press (Gorakhpur) is the canonical source for verse numbering (700-verse structure)

**Content Architecture**
- Content-first critical path: schema before generation, generation before UI
- Progressive reveal structure: Sanskrit → transliteration → explanation → commentaries → practical applications
- Practical life applications across domains: Personal Growth, Career/Business, Health, Relationships
- Problem-based discovery: each verse tagged with life themes (stress, decision-making, loss, duty, etc.)

**Design Philosophy**
- Clean, serene, minimal — breathing room for spiritual text
- No ads, no popups, no clutter
- Mobile-responsive, Devanagari at minimum 20px

**Legal Guardrails**
- AI-generated content uses only public domain sources
- No copyrighted commentary text reproduced (BBT, Chinmaya Mission)
- AI prompts must paraphrase philosophical traditions, not reproduce
- MIT license for open source

**CI/CD**
- GitHub Actions with `withastro/action` for zero-config GitHub Pages deploy
- Cache `node_modules/` and `.astro/` directory
- Build target: under 5 minutes

### Claude's Discretion

- Folder structure and naming conventions within Astro project
- Specific Zod schema field types and validation patterns
- Test shloka content for schema validation
- GitHub Actions workflow YAML specifics

### Deferred Ideas (OUT OF SCOPE)

- Audio playback — v2+
- User accounts / login — static site, no backend
- AI chatbot — requires backend API
- Dark mode — Phase 5/6
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INF-01 | Fully static site built with Astro 5, deployed to GitHub Pages | Astro 5.18 stable with `output: 'static'`; withastro/action v5 handles GitHub Pages deployment automatically |
| INF-02 | GitHub Actions CI/CD auto-deploys on push to main | Official starter workflow using withastro/action@v5 + actions/deploy-pages@v4; documented YAML pattern available |
| INF-03 | Open source repository with MIT license | Standard MIT license file; Delhi HC 2024 ruling confirms Sanskrit source text is public domain; translations/interpretations are copyrighted separately |
| INF-05 | Build completes under 5 minutes on GitHub Actions | withastro/action built-in cache (defaults to `node_modules/.astro`); setup-node cache for npm; Astro 5 claims 5x faster Markdown builds than v4 |
| CONT-08 | All content uses Gita Press (Gorakhpur) edition as canonical source for shloka numbering (700-verse structure) | Chapter verse counts confirmed (Ch.1: 47 verses through Ch.18: 78 verses = 700 total); must be declared in project docs not enforced technically |
| CONT-10 | AI-generated content uses only public domain sources — no copyrighted commentary text reproduced | Delhi HC 2024: original Sanskrit is public domain; Prabhupada/BBT and Chinmaya Mission commentaries are copyrighted; AI prompts must paraphrase, never reproduce |
</phase_requirements>

---

## Summary

Phase 1 establishes four deliverables: (1) Astro 5 project scaffold with Tailwind v4, Preact, and TypeScript strict; (2) Zod content schema for per-chapter JSON using the Content Layer API `file()` loader; (3) GitHub Actions CI/CD with GitHub Pages deployment and caching; (4) legal documentation establishing MIT license, public-domain source declaration, and AI prompt constraints.

The tech stack is well-supported and stable as of March 2026. Astro 5.18 is the current stable release (Astro 6 is in beta). The `file()` loader in Astro's Content Layer API is the correct choice for structured JSON data — it replaces the old `type: 'data'` pattern from Astro 4. Zod schema validation happens at build time and fails hard on invalid data, making schema-first development reliable. The `astro/zod` re-export is Zod v3; z.string().regex() is fully available.

The legal landscape is clearer than it might seem. Delhi High Court (2024) confirmed the original Sanskrit text of the Bhagavad Gita is public domain. However, specific translations and commentaries by Prabhupada (BBT/ISKCON), Chinmaya Mission, and other living/recent authors are copyrighted. AI-generated synthesis must paraphrase traditions without reproducing protected text. Gita Press itself does not hold copyright on the source Sanskrit verses.

**Primary recommendation:** Use `npm create astro@latest` with the `--add preact` flag, then layer in Tailwind v4 via the official Tailwind docs for Astro. Define the content schema first with one test shloka in `src/data/chapters/chapter-01.json` before touching any pages or components. Deploy CI/CD using the official GitHub starter workflow with `withastro/action@v5`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.18.x (stable) | Static site framework with islands architecture | Official framework choice; v5 is current stable, v6 in beta |
| @astrojs/preact | latest | Preact island integration | Official Astro integration; enables `client:` directives for Preact components |
| preact | latest | UI library for interactive islands | 3kB runtime vs React's 45kB; perfect for accordion/reveal components |
| tailwindcss | v4.x | Utility-first CSS | Locked decision; v4 uses native CSS cascade layers, no config file needed |
| @tailwindcss/vite | v4.x | Tailwind v4 Vite plugin | Official v4 integration for Astro; replaces deprecated @astrojs/tailwind |
| typescript | 5.x | Type safety | Bundled with Astro; strict mode via `astro/tsconfigs/strict` |
| zod (via astro/zod) | v3 re-export | Schema validation | Built into Astro; `import { z } from 'astro/zod'` — do NOT install zod separately or use zod v4 (Astro 5 uses v3) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource/tiro-devanagari-sanskrit | latest | Self-hosted Devanagari font | Phase 1 install; configured in Phase 3 when font rendering is wired up |
| @fontsource/noto-serif-devanagari | latest | Fallback Devanagari font | Phase 1 install alongside Tiro; provides broader glyph coverage |
| astro-pagefind | 1.8.x | Static full-text search | Install in Phase 1 as dependency; configure and wire up in Phase 4 only |
| withastro/action | v5 (v5.2.0) | GitHub Actions deploy | Official zero-config GitHub Pages deployment action |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/vite | @astrojs/tailwind | @astrojs/tailwind is deprecated for Tailwind v4; do not use |
| astro/zod (Zod v3) | zod@4 directly | Zod v4 is a breaking change; Astro 5 re-exports v3; mixing causes version conflicts |
| file() loader (JSON) | glob() loader (Markdown) | glob() is for Markdown/MDX; JSON data files must use file() |
| withastro/action | Manual deploy workflow | withastro/action handles artifact upload automatically; manual workflow is more error-prone |
| Preact | React | React is 15x larger runtime; no interactivity requirement in Phase 1 justifies the overhead |

**Installation (Phase 1 sequence):**
```bash
# 1. Create project
npm create astro@latest gita-app -- --add preact

# 2. Add Tailwind v4
npm install tailwindcss @tailwindcss/vite

# 3. Add Devanagari fonts (install now, configure in Phase 3)
npm install @fontsource/tiro-devanagari-sanskrit @fontsource/noto-serif-devanagari

# 4. Add pagefind (install now, configure in Phase 4)
npm install astro-pagefind
```

---

## Architecture Patterns

### Recommended Project Structure

```
gita-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── src/
│   ├── content.config.ts       # Content Collections config (Astro 5 location — NOT src/content/config.ts)
│   ├── data/
│   │   └── chapters/
│   │       └── chapter-01.json # Per-chapter shloka data (one file per chapter)
│   ├── pages/
│   │   └── index.astro         # Landing page (placeholder in Phase 1)
│   ├── components/
│   │   ├── astro/              # Zero-JS Astro components (enforces JS budget)
│   │   └── islands/            # Preact components that ship JS (client: directives)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shared HTML shell
│   └── styles/
│       └── global.css          # @import "tailwindcss" entry point
├── public/                     # Static assets (robots.txt, favicon)
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── LICENSE                     # MIT license
└── docs/
    ├── SOURCES.md              # Gita Press canonical source declaration
    └── AI-CONTENT-POLICY.md   # AI prompt constraints & copyright guardrails
```

**Key structural decisions:**
- `src/content.config.ts` — Astro 5 moved the config from `src/content/config.ts` to `src/content.config.ts`. Using the old path will silently fail to register collections.
- `src/data/chapters/` — JSON files live here, not in `src/content/` (Content Layer API supports any path)
- `components/astro/` vs `components/islands/` — Physical directory separation makes the JS-shipping boundary explicit and reviewable

### Pattern 1: Content Layer API with file() Loader

**What:** Defines a typed collection from a single JSON file. Each JSON object requires a unique `id` field. Validation happens at build time via Zod — the build fails if any entry violates the schema.

**When to use:** Structured data in a single file per chapter (per the locked decision). Not for Markdown content.

**Example:**
```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Regex for IAST: permits Latin letters plus IAST diacritics
// IAST chars: ā ī ū ṛ ṝ ḷ ḹ ṃ ḥ ṅ ñ ṭ ḍ ṇ ś ṣ
// Harvard-Kyoto uses uppercase ASCII — rejecting uppercase-only "transliteration" catches HK input
const IAST_PATTERN = /^[a-zA-ZāīūṛṝḷḹṃḥṅñṭḍṇśṣĀĪŪṚṜḶṜṂḤṄÑṬḌṆŚṢ\s\u0900-\u097F'".,()\-]+$/;

const chapters = defineCollection({
  loader: file('src/data/chapters/chapter-01.json'),
  schema: z.object({
    id: z.string(),                          // e.g., "BG-1.1"
    chapter: z.number().int().min(1).max(18),
    verse: z.number().int().min(1),
    sanskrit: z.string().regex(/[\u0900-\u097F]/, {
      message: 'Sanskrit field must contain Devanagari characters (U+0900–U+097F)'
    }),
    iast: z.string().regex(
      /[āīūṛṝḷṃḥṅñṭḍṇśṣ]/,
      { message: 'IAST field must contain IAST diacritics — Harvard-Kyoto uppercase not accepted' }
    ),
    explanation: z.string().min(50),
    synthesis: z.string().min(100),
    commentaries: z.array(z.object({
      tradition: z.enum(['advaita', 'vishishtadvaita', 'bhakti']),
      teacher: z.string(),
      text: z.string().min(50),
    })).min(2).max(3),
    applications: z.object({
      personal_growth: z.string().min(30),
      career_business: z.string().min(30),
      health: z.string().min(30),
      relationships: z.string().min(30),
    }),
    themes: z.array(z.string()).min(1),      // e.g., ["duty", "grief", "decision-making"]
  }),
});

export const collections = { chapters };
```

**Note on IAST validation strategy:** The simplest enforcement is a positive-presence check — the `iast` field must contain at least one IAST diacritic character. Harvard-Kyoto uses only ASCII uppercase (`A` for ā, `T` for ṭ) and would fail this check. This is simpler and more reliable than trying to allowlist/blocklist every possible character.

### Pattern 2: Tailwind v4 Configuration

**What:** Tailwind v4 uses a single CSS import — no `tailwind.config.js` file needed for basic setup. The Vite plugin processes the CSS.

**Example:**
```javascript
// astro.config.mjs
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/<repo-name>',           // Required for non-root GitHub Pages
  output: 'static',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

/* Custom design tokens for Gita app */
@theme {
  --font-devanagari: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
  --font-size-devanagari-min: 1.25rem; /* 20px minimum per DES-03 */
}
```

### Pattern 3: Preact tsconfig Integration

**What:** Preact requires JSX configuration in tsconfig.json when using TypeScript strict mode.

**Example:**
```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "baseUrl": ".",
    "paths": {
      "@components/*": ["./src/components/*"],
      "@layouts/*": ["./src/layouts/*"],
      "@data/*": ["./src/data/*"]
    }
  }
}
```

### Anti-Patterns to Avoid

- **`src/content/config.ts` (old path):** Astro 5 uses `src/content.config.ts` (at project root under `src/`). The old path from Astro 4 is silently ignored — collections will appear to register but not validate.
- **`import { z } from 'zod'`:** Always use `import { z } from 'astro/zod'`. Separately installed `zod` may be v4, which breaks Astro's internal schema types.
- **`@astrojs/tailwind` integration:** This is deprecated. Using it with Tailwind v4 will fail. Use `@tailwindcss/vite` in the `vite.plugins` array instead.
- **`type: 'data'` collection syntax:** This is the Astro 4 Content Collections API. Astro 5 uses the `loader:` property with `file()` or `glob()` from `astro/loaders`.
- **Skipping `id` field in JSON:** The `file()` loader requires each entry to have a unique `id` field. Without it, the loader will error at build time.
- **Using `output: 'server'`:** This requires a server runtime. For GitHub Pages (static hosting), `output: 'static'` is mandatory.
- **Omitting `base` config for non-root repos:** If the GitHub repo is not `<username>.github.io`, the `base` config must match the repo name. Omitting it causes broken asset URLs in production.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Build-time schema validation | Custom JSON validator script | Zod via astro/zod with defineCollection | Integrated into Astro build pipeline; errors surface as build failures automatically |
| GitHub Pages deployment | Custom rsync/FTP scripts | `withastro/action@v5` | Handles artifact upload, Pages configuration, and concurrency group automatically |
| Build caching | Custom cache invalidation | `setup-node` built-in npm cache + withastro/action's `cache: true` | withastro/action defaults `cache-dir` to `node_modules/.astro`; setup-node caches global npm cache |
| Font self-hosting | Manual WOFF2 download + CSS | Fontsource npm packages | Handles subsetting, CSS injection, font-display, and CDN fallback |
| TypeScript path aliases | Relative `../../` imports | tsconfig `paths` + Astro's built-in Vite alias resolution | Astro reads tsconfig paths and configures Vite automatically |
| IAST character validation | Custom transliteration parser | `z.string().regex()` with diacritic presence check | Sufficient for schema enforcement; full transliteration parsing is out of scope |

**Key insight:** Astro's Content Layer API does the heavy lifting of reading JSON files, running Zod, and surfacing errors. The planner should not create tasks to build custom validation runners — let the build pipeline do it.

---

## Common Pitfalls

### Pitfall 1: Content Config File Location Changed in Astro 5

**What goes wrong:** The collection is defined in `src/content/config.ts` (Astro 4 location) and appears to work locally but collections return empty arrays at build time.

**Why it happens:** Astro 5 relocated the config file to `src/content.config.ts`. The old path is not read by the Content Layer API.

**How to avoid:** Always create `src/content.config.ts` (note: directly in `src/`, not `src/content/config.ts`).

**Warning signs:** `getCollection('chapters')` returns `[]` even though JSON files exist; no build error is thrown.

### Pitfall 2: GitHub Pages Base URL Missing

**What goes wrong:** Site deploys successfully but all CSS, JS, and internal links return 404. The site works on `localhost:4321` but not on GitHub Pages.

**Why it happens:** GitHub Pages serves non-root repos at `https://<user>.github.io/<repo-name>/`, but Astro defaults `base` to `/`. All asset URLs lack the repo prefix.

**How to avoid:** Set `base: '/<repo-name>'` in `astro.config.mjs`. Exception: if the repo is named `<username>.github.io`, omit `base`.

**Warning signs:** DevTools shows 404 for `/assets/main.css` but the file exists at `/<repo-name>/assets/main.css`.

### Pitfall 3: Zod Version Conflict

**What goes wrong:** Installing `zod@4` in the project causes type errors inside Astro's content collection types. Error messages reference `_zod` property read failures.

**Why it happens:** Astro 5 re-exports Zod v3 from `astro/zod`. If `zod@4` is installed separately, TypeScript picks up the wrong version for type inference.

**How to avoid:** Do NOT add `zod` to `dependencies` or `devDependencies`. Only use `import { z } from 'astro/zod'`.

**Warning signs:** GitHub issue `withastro/astro#14117` documents this exact error — "Cannot read properties of undefined (reading '_zod')".

### Pitfall 4: Tailwind v4 Requires Different Config Pattern

**What goes wrong:** Developer adds `tailwind.config.js` (v3 pattern) expecting it to be picked up. Styles don't apply or Tailwind isn't detected.

**Why it happens:** Tailwind v4 does not use `tailwind.config.js`. Configuration is done via CSS `@theme {}` blocks or `@plugin` directives inside the CSS file.

**How to avoid:** Create `src/styles/global.css` with `@import "tailwindcss"` as the only required Tailwind setup. Custom theme values go in `@theme {}` blocks in the same file.

**Warning signs:** `tailwind.config.js` exists but content isn't purged; or styles work in dev but not in build (v3/v4 config mismatch).

### Pitfall 5: withastro/action Caches .astro Not node_modules Directly

**What goes wrong:** Developer adds a separate `actions/cache` step for `node_modules/` expecting faster installs, duplicating what the action already does.

**Why it happens:** `withastro/action@v5` has `cache: true` by default and caches `node_modules/.astro` (the Astro build cache). It does NOT cache the full `node_modules/` directory. npm install is still run every time.

**How to avoid:** Use `actions/setup-node@v4` with `cache: 'npm'` for package manager caching (caches global npm cache, makes `npm ci` fast). The withastro/action cache handles Astro-specific build artifacts. Both serve different purposes — use both.

**Warning signs:** Builds still take 3+ minutes because `npm ci` reinstalls packages from scratch every run.

### Pitfall 6: file() Loader Requires id Field

**What goes wrong:** JSON file is structured as a plain array of objects without an `id` field. The loader errors at build time.

**Why it happens:** `file()` loader documentation states: "Each entry in the file must have a unique `id` key property."

**How to avoid:** Structure chapter JSON files with each shloka object having an `id` field (e.g., `"id": "BG-1.1"`).

**Warning signs:** Build error: "file loader: entry does not have an id field" or similar.

---

## Code Examples

### Complete Content Config (Phase 1 Schema)

```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const shlokaSchema = z.object({
  id: z.string(),                    // "BG-1.1" format (chapter.verse)
  chapter: z.number().int().min(1).max(18),
  verse: z.number().int().min(1),
  // Sanskrit Devanagari — must contain at least one Devanagari Unicode character
  sanskrit: z.string().regex(/[\u0900-\u097F]/, {
    message: 'Sanskrit field must contain Devanagari script (U+0900-U+097F)',
  }),
  // IAST transliteration — must contain at least one IAST diacritic
  // Rejects Harvard-Kyoto (ASCII-only uppercase) and plain ASCII romanizations
  iast: z.string().regex(/[āīūṛṝḷṃḥṅñṭḍṇśṣĀĪŪṚṜḶṂḤṄÑṬḌṆŚṢ]/, {
    message: 'IAST field must use IAST diacritics (ā, ī, ū, ṛ, ṃ, ḥ, etc.) — Harvard-Kyoto not accepted',
  }),
  explanation: z.string().min(50),
  synthesis: z.string().min(100),
  commentaries: z.array(
    z.object({
      tradition: z.enum(['advaita', 'vishishtadvaita', 'bhakti']),
      teacher: z.string(),
      text: z.string().min(50),
    })
  ).min(2).max(3),
  applications: z.object({
    personal_growth: z.string().min(30),
    career_business: z.string().min(30),
    health: z.string().min(30),
    relationships: z.string().min(30),
  }),
  themes: z.array(z.string()).min(1),
});

export type Shloka = z.infer<typeof shlokaSchema>;

const chapters = defineCollection({
  loader: file('src/data/chapters/chapter-01.json'),
  schema: shlokaSchema,
});

export const collections = { chapters };
```

### Test Shloka JSON Structure (BG 1.1)

```json
// src/data/chapters/chapter-01.json
[
  {
    "id": "BG-1.1",
    "chapter": 1,
    "verse": 1,
    "sanskrit": "धृतराष्ट्र उवाच । धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
    "iast": "dhṛtarāṣṭra uvāca | dharmakṣetre kurukṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||",
    "explanation": "King Dhritarashtra asks his minister Sanjaya to describe what is happening on the sacred battlefield of Kurukshetra, where his sons and the Pandavas have assembled ready to fight.",
    "synthesis": "The opening question frames the entire Gita: can dharma (righteous duty) be upheld even when it requires fighting one's own family? Dhritarashtra's choice of the word 'dharmakshetra' (field of dharma) alongside 'Kurukshetra' (field of the Kurus) reveals the dual nature of the conflict — it is simultaneously a physical battle and a spiritual inquiry into the nature of right action.",
    "commentaries": [
      {
        "tradition": "advaita",
        "teacher": "Adi Shankaracharya",
        "text": "Shankaracharya notes that the battlefield is called a field of dharma because dharma itself will be the decisive factor. The question is not merely military but metaphysical."
      },
      {
        "tradition": "vishishtadvaita",
        "teacher": "Ramanujacharya",
        "text": "Ramanuja emphasizes that Kurukshetra is a place made sacred by ancient rites. The fact that both armies gathered here suggests a divine orchestration of events."
      },
      {
        "tradition": "bhakti",
        "teacher": "Traditional Bhakti perspective",
        "text": "From the bhakti perspective, the Lord's presence on the battlefield transforms it. The question itself sets in motion Arjuna's eventual surrender to Krishna's guidance."
      }
    ],
    "applications": {
      "personal_growth": "Every significant life decision places us on our own 'Kurukshetra' — a field where competing values and loyalties must be reconciled. Clarity about your core dharma is the starting point.",
      "career_business": "Business decisions often require choosing between loyalty to individuals (team members, partners) and loyalty to principles. Identifying your organization's 'dharmakshetra' helps navigate these conflicts.",
      "health": "Physical and mental health often require facing uncomfortable truths about habits and relationships. The first step, like Dhritarashtra's question, is simply acknowledging that a conflict exists.",
      "relationships": "Conflict in relationships is rarely only about the surface issue. Asking the deeper question — what values are actually in tension here? — opens the path to genuine resolution."
    },
    "themes": ["duty", "conflict", "decision-making", "family", "dharma"]
  }
]
```

### GitHub Actions Workflow (withastro/action v5)

```yaml
# .github/workflows/deploy.yml
# Source: https://docs.astro.build/en/guides/deploy/github/
# + https://github.com/actions/starter-workflows/blob/main/pages/astro.yml
name: Deploy Astro site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"                  # Caches global npm cache; speeds up npm ci

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Build with Astro
        uses: withastro/action@v5
        with:
          # cache: true (default) — caches node_modules/.astro build artifacts
          # Passes --site and --base from configure-pages automatically
        env:
          SITE: ${{ steps.pages.outputs.origin }}
          BASE_PATH: ${{ steps.pages.outputs.base_path }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

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

**Note:** The official Astro docs and starter workflow show two patterns for the build step. The simplest is using `withastro/action@v5` as a combined install+build+upload action (3-line version). The workflow above splits the steps for more control (separate `npm ci` + `withastro/action` + `upload-pages-artifact`). Both work. The split approach gives clearer timing data in the Actions dashboard.

### Minimal astro.config.mjs

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/gita-app',         // Set to repo name; omit if repo is <username>.github.io
  output: 'static',
  integrations: [
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `src/content/config.ts` | `src/content.config.ts` | Astro 5.0 | Config file must be at new path or collections silently fail |
| `type: 'data'` collections | `loader: file()` with Content Layer API | Astro 5.0 | New API is required for JSON files; old syntax still works but is deprecated |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 | @astrojs/tailwind does not support Tailwind v4; must use Vite plugin |
| `tailwind.config.js` | CSS `@theme {}` blocks | Tailwind v4 | No JS config file needed; all theme customization is CSS-native |
| Zod v3 standalone | `astro/zod` re-export | Astro 4+ | Never install `zod` directly in Astro projects; use the re-export to avoid version conflicts |
| `withastro/action@v2` | `withastro/action@v5` | 2025-2026 | v5 is current; v2 uses deprecated GitHub Pages APIs |
| `concurrency: cancel-in-progress: true` | `cancel-in-progress: false` | GitHub Actions best practice | Cancelling in-progress deployments can leave Pages in broken state; false is safer |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Use `@tailwindcss/vite` instead; this package does not support Tailwind v4
- `type: 'data'` content collections: Use Content Layer API (`loader: file()`) in Astro 5
- `withastro/action@v2` and earlier: Use v5 (latest stable as of Feb 2026)
- `actions/checkout@v3` and `actions/deploy-pages@v3`: Use v4+ in new workflows

---

## Legal Domain: Copyright Guardrails

This section covers the domain knowledge needed for Plan 01-04 (legal source list and AI prompt constraints).

### What is Public Domain

**Original Sanskrit text** of the Bhagavad Gita: Public domain. Delhi High Court (2024) confirmed "there can be no copyright claimed in the Scriptures." The original verses are ancient and out of any copyright window globally.

**Gita Press publications**: Gita Press publishes translations and compilations, but the underlying Sanskrit verse numbering structure (700 verses, 18 chapters) is not original to them — it reflects the traditional text. Gita Press is declared as canonical for verse numbering, not as a copyrighted source.

### What is Copyrighted (DO NOT REPRODUCE)

- **Bhaktivedanta Book Trust (BBT/ISKCON)**: Prabhupada's translations and purports are copyrighted by the Trust. Delhi HC 2024 case (Bhaktivedanta Book Trust v. Bhagvatam.In) confirmed these rights.
- **Chinmaya Mission**: Swami Chinmayananda's commentaries are copyrighted original works.
- **Sri Aurobindo Ashram**: Aurobindo's Essays on the Gita are copyrighted.
- Any other commentary by a 20th-21st century author remains under copyright.

### AI Prompt Constraint Document — Required Content

The `docs/AI-CONTENT-POLICY.md` file must establish:

1. **Permitted source traditions** for AI synthesis (Advaita, Vishishtadvaita, Bhakti) — as philosophical traditions, not specific copyrighted texts
2. **Paraphrase requirement** — AI output must synthesize philosophical positions, not reproduce any commentary text verbatim
3. **Prohibited sources** — BBT/ISKCON purports, Chinmaya Mission, Sri Aurobindo (modern copyrighted authors)
4. **IAST requirement** — all transliterations must use IAST standard; Harvard-Kyoto is not accepted
5. **Verse numbering standard** — Gita Press (Gorakhpur) 700-verse structure
6. **Attribution statement** — "AI-generated synthesis of classical Advaita/Bhakti/Vishishtadvaita philosophical traditions based on public domain sources"

### IAST vs Harvard-Kyoto — Schema Enforcement

IAST uses diacritical marks (ā, ī, ū, ṛ, ṃ, ḥ, ṅ, ñ, ṭ, ḍ, ṇ, ś, ṣ). Harvard-Kyoto uses only ASCII uppercase letters (A=ā, T=ṭ, D=ḍ, etc.) — no diacritics.

**Schema enforcement strategy:** Check for presence of at least one IAST diacritic character using regex. A field containing Harvard-Kyoto transliteration will fail because it contains no diacritics. A field containing plain ASCII phonetic spelling (like "dharma" without ṛ) would also fail — which is the desired behavior.

```typescript
// IAST presence check — sufficient for schema enforcement
iast: z.string().regex(/[āīūṛṝḷṃḥṅñṭḍṇśṣĀĪŪṚṜḶṂḤṄÑṬḌṆŚṢ]/, {
  message: 'Must use IAST diacritics. "dharma" → "dharma" fails; "dharma" with ṛ → "dharma" passes.',
})
```

**Note:** The word "dharma" in IAST is actually just "dharma" — no diacritics needed for the d, h, r, m, a sounds as they are standard Latin. However, a shloka transliteration will always contain long vowels (ā, ī, ū) making the diacritic presence check reliable in practice.

---

## Bhagavad Gita Verse Structure Reference

Canonical verse counts per chapter (Gita Press 700-verse edition):

| Chapter | Name | Verses |
|---------|------|--------|
| 1 | Arjuna Vishada Yoga | 47 |
| 2 | Sankhya Yoga | 72 |
| 3 | Karma Yoga | 43 |
| 4 | Jnana Karma Sanyasa Yoga | 42 |
| 5 | Karma Sanyasa Yoga | 29 |
| 6 | Dhyana Yoga | 47 |
| 7 | Jnana Vijnana Yoga | 30 |
| 8 | Akshara Brahma Yoga | 28 |
| 9 | Raja Vidya Raja Guhya Yoga | 34 |
| 10 | Vibhuti Yoga | 42 |
| 11 | Vishwarupa Darshana Yoga | 55 |
| 12 | Bhakti Yoga | 20 |
| 13 | Kshetra Kshetragna Vibhaga Yoga | 35 |
| 14 | Gunatraya Vibhaga Yoga | 27 |
| 15 | Purushottama Yoga | 20 |
| 16 | Daivasura Sampad Vibhaga Yoga | 24 |
| 17 | Shraddhatraya Vibhaga Yoga | 28 |
| 18 | Moksha Sanyasa Yoga | 78 |
| **Total** | | **700** |

**Schema implication:** The `verse` field max should be set per chapter. For the Phase 1 test shloka (chapter 1), max is 47. A generic schema can use `z.number().int().min(1)` without a hard max, relying on Gita Press numbering documentation to provide the canonical upper bound.

---

## Open Questions

1. **withastro/action v5 build step interaction with configure-pages**
   - What we know: The three-step pattern (checkout → withastro/action → deploy-pages) is documented as the minimal workflow. The split pattern (checkout → setup-node → configure-pages → npm ci → withastro/action → upload-artifact → deploy) gives more control.
   - What's unclear: Whether `withastro/action@v5` in build mode (without upload) reads `--site` and `--base` from environment variables set by `configure-pages`, or requires explicit flags.
   - Recommendation: Use the official starter workflow from `actions/starter-workflows` as the YAML template — it is the most tested pattern. If using withastro/action for combined install+build, test with a simple push to confirm `base` is correctly injected.

2. **`z.number().int().min(1)` verse validation without per-chapter max**
   - What we know: The schema enforces verse is a positive integer. The canonical max per chapter is known (47 for Ch. 1) but hardcoding this in Phase 1 creates per-chapter schema variants.
   - What's unclear: Whether a shared schema with no verse max is acceptable for Phase 1, deferring per-chapter max validation to a future refinement.
   - Recommendation: Use a single shared schema without per-chapter max for Phase 1. The Gita Press verse numbering is documented in `docs/SOURCES.md`, providing the canonical reference. Schema enforcement of per-chapter maxima can be added in Phase 2 if desired.

3. **Devanagari regex boundary for the `sanskrit` field**
   - What we know: Devanagari Unicode block is U+0900–U+097F. Extended Devanagari for Vedic extends to U+1CD0–U+1CFF.
   - What's unclear: Whether Phase 1 Sanskrit content will use Vedic accent marks (requires extended Devanagari range).
   - Recommendation: For Phase 1 test shloka (BG 1.1 — classical Bhagavad Gita, not Vedic), U+0900–U+097F is sufficient. Flag for Phase 2 if AI-generated content requires Vedic extensions.

---

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/guides/content-collections/ — Content Layer API, file() loader, defineCollection, Zod schema
- https://docs.astro.build/en/guides/deploy/github/ — GitHub Pages deployment, required astro.config settings
- https://docs.astro.build/en/guides/integrations-guide/preact/ — @astrojs/preact setup, tsconfig jsxImportSource
- https://docs.astro.build/en/guides/typescript/ — tsconfig presets (strict/strictest), path aliases
- https://docs.astro.build/en/reference/modules/astro-zod/ — Confirms astro/zod is Zod v3 re-export
- https://tailwindcss.com/docs/installation/framework-guides/astro — Official @tailwindcss/vite setup for Astro
- https://github.com/withastro/action — withastro/action v5.2.0; cache parameter behavior
- https://github.com/actions/starter-workflows/blob/main/pages/astro.yml — Official Astro GitHub Pages starter workflow YAML

### Secondary (MEDIUM confidence)
- https://zod.dev/v4/changelog — Zod v4 breaking changes; confirms z.string().regex() still available
- https://github.com/withastro/astro/issues/14117 — Confirms Zod v4 + Astro 5 conflict behavior
- https://www.barandbench.com/news/no-copyright-religious-scriptures-dramatic-adaptive-works-copyrighted-delhi-hc — Delhi HC 2024 ruling on religious text copyright
- https://mayapur.store/blog/post/62-how-many-shlokas-in-bhagavad-gita — Chapter-by-chapter verse count confirmation
- https://www.npmjs.com/package/@fontsource/tiro-devanagari-sanskrit — Package exists and installable
- https://www.npmjs.com/package/@fontsource/noto-serif-devanagari — Package exists and installable
- https://astro.build/blog/whats-new-february-2026/ — Confirms Astro 5.18 is current stable (March 2026)

### Tertiary (LOW confidence)
- WebSearch results on IAST character set — character regex compiled from Wikipedia summary and domain knowledge; exact regex should be tested with BG 1.1 sample text before finalizing

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against official Astro 5 docs, Tailwind docs, GitHub Action repo
- Architecture: HIGH — Content Layer API patterns verified against official docs; folder structure is conventional
- CI/CD workflow: HIGH — starter workflow from actions/starter-workflows repo; official documentation
- Legal guardrails: MEDIUM-HIGH — Delhi HC 2024 ruling documented by multiple legal news sources; BBT copyright confirmed by case analysis
- IAST validation regex: MEDIUM — character set from Wikipedia summary; regex logic is sound but should be tested against real BG 1.1 transliteration

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable ecosystem; Astro 6 beta may affect if project upgrades)
