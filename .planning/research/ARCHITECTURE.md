# Architecture Research

**Domain:** Content-heavy interactive scripture web application (static)
**Researched:** 2026-03-01
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BUILD TIME                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  content/    │  │  src/pages/  │  │  src/components/     │   │
│  │  shlokas/    │  │  (routing)   │  │  (Astro + islands)   │   │
│  │  (JSON/YAML) │  │              │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                     │               │
│         └─────────────────┼─────────────────────┘               │
│                           ↓                                     │
│                ┌──────────────────────┐                         │
│                │   Astro Build Engine  │                         │
│                │   (getStaticPaths +   │                         │
│                │    content collections)│                         │
│                └──────────┬───────────┘                         │
│                           ↓                                     │
│               ┌───────────────────────┐                         │
│               │  Pagefind Indexer      │                         │
│               │  (post-build, indexes  │                         │
│               │   all static output)   │                         │
│               └───────────────────────┘                         │
├─────────────────────────────────────────────────────────────────┤
│                      STATIC OUTPUT (dist/)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────┐   │
│  │  index   │  │  chapters/   │  │  shlokas/  │  │ search/  │   │
│  │  .html   │  │  [n]/index   │  │  [ch]/[n]  │  │  (PF idx)│   │
│  └──────────┘  └──────────────┘  └────────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                       RUNTIME (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│  │  Progressive   │  │  Search Island   │  │  Nanostores     │   │
│  │  Reveal Island │  │  (Pagefind UI)   │  │  (shared state) │   │
│  │  (client:load) │  │  (client:idle)   │  │                 │   │
│  └────────────────┘  └──────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Content Collection (shlokas) | Schema-validated shloka data, single source of truth | JSON files per chapter + `content.config.ts` Zod schema |
| BaseLayout | HTML shell, `<head>`, fonts, global styles, meta tags | `src/layouts/BaseLayout.astro` with `<slot />` |
| ChapterLayout | Chapter-level wrapper: nav context, chapter meta, prev/next links | `src/layouts/ChapterLayout.astro` extending BaseLayout |
| ChapterGrid page | Landing page with 18 chapter cards | `src/pages/index.astro` — pure static |
| Chapter index page | Chapter header + list of shlokas | `src/pages/chapters/[chapter]/index.astro` |
| Shloka detail page | Renders all shloka layers, hosts progressive reveal island | `src/pages/chapters/[chapter]/[shloka].astro` |
| ProgressiveReveal island | Client-side state machine: which layers are visible | `src/components/ProgressiveReveal.tsx` with `client:load` |
| CommentaryAccordion island | Expand/collapse individual commentaries | `src/components/CommentaryAccordion.tsx` with `client:load` |
| SearchModal island | Pagefind-powered full-text search UI | `src/components/SearchModal.tsx` with `client:idle` |
| ChapterCard component | Static card in chapter grid | `src/components/ChapterCard.astro` — no JS |
| ShlokaNav component | Prev/next shloka navigation | `src/components/ShlokaNav.astro` — no JS |

## Recommended Project Structure

```
gita-app/
├── src/
│   ├── content/
│   │   └── shlokas/
│   │       ├── chapter-01.json    # All 47 shlokas for Chapter 1
│   │       ├── chapter-02.json    # All 72 shlokas for Chapter 2
│   │       └── ...                # One JSON file per chapter (18 total)
│   ├── content.config.ts          # Collection definition + Zod schema
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, head, global styles
│   │   └── ChapterLayout.astro    # Chapter context wrapper
│   ├── pages/
│   │   ├── index.astro            # Chapter grid (18 cards)
│   │   ├── chapters/
│   │   │   └── [chapter]/
│   │   │       ├── index.astro    # Chapter overview + shloka list
│   │   │       └── [shloka].astro # Individual shloka detail page
│   │   └── search.astro           # Search page (hosts SearchModal island)
│   ├── components/
│   │   ├── astro/                 # Pure static Astro components
│   │   │   ├── ChapterCard.astro
│   │   │   ├── ShlokaNav.astro
│   │   │   ├── ShlokaSummary.astro
│   │   │   └── ChapterHeader.astro
│   │   └── islands/               # Interactive islands (React or Solid)
│   │       ├── ProgressiveReveal.tsx
│   │       ├── CommentaryAccordion.tsx
│   │       └── SearchModal.tsx
│   ├── stores/
│   │   └── reveal.ts              # Nanostores atoms for reveal state
│   ├── styles/
│   │   ├── global.css             # CSS custom properties, typography baseline
│   │   └── fonts.css              # Sanskrit + Latin font declarations
│   └── utils/
│       ├── chapter.ts             # Chapter metadata helpers
│       └── shloka.ts              # Shloka formatting, number helpers
├── public/
│   ├── fonts/                     # Self-hosted font files
│   └── CNAME                      # If using custom domain
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions → GitHub Pages
├── astro.config.mjs               # site, base, integrations, output: static
├── content.config.ts              # Re-export or define collections here
└── tsconfig.json
```

### Structure Rationale

- **content/shlokas/ (one JSON per chapter):** The `file()` loader reads a single JSON file as an array of entries. One file per chapter keeps authoring granular and git diffs readable. 700 entries across 18 files is trivially fast for the Content Layer API.
- **pages/chapters/[chapter]/[shloka].astro:** Matches the mental model — chapters contain shlokas. `getStaticPaths()` generates all 700 pages at build time. URLs are human-readable: `/chapters/2/47`.
- **components/astro/ vs components/islands/:** Physical separation makes the JavaScript budget explicit. Anything in `islands/` ships JS. Anything in `astro/` does not.
- **stores/:** Nanostores live outside components so any island can import the same atom without circular dependencies.
- **utils/:** Pure TypeScript logic (no Astro, no React) stays reusable and testable without framework dependencies.

## Architectural Patterns

### Pattern 1: Content Collection with Zod Schema for Shloka Data

**What:** Define a single `shlokas` collection using `file()` loaders pointing to per-chapter JSON. Validate each shloka's shape at build time with a Zod schema. This prevents missing fields from reaching production silently.

**When to use:** The moment you have structured content with required fields — not prose markdown, but records with predictable shape (Sanskrit text, transliteration, commentary objects, application arrays).

**Trade-offs:** Build fails loudly on bad data (good). Schema changes require updating all data files (manageable with 18 files). No runtime validation needed.

**Example:**
```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const PracticalApplicationSchema = z.object({
  personal: z.string(),
  professional: z.string(),
  health: z.string(),
  relationships: z.string(),
});

const CommentarySchema = z.object({
  author: z.string(),
  tradition: z.string(),
  text: z.string(),
});

const shlokas = defineCollection({
  loader: file('src/content/shlokas/chapter-01.json'),
  schema: z.object({
    chapter: z.number(),
    shloka: z.number(),
    sanskrit: z.string(),
    transliteration: z.string(),
    word_meanings: z.string(),
    synthesis: z.string(),          // Curated multi-commentary synthesis
    commentaries: z.array(CommentarySchema),
    practical: PracticalApplicationSchema,
    themes: z.array(z.string()),
  }),
});

export const collections = { shlokas };
```

### Pattern 2: getStaticPaths for All 700 Shloka Pages

**What:** At build time, `getStaticPaths()` fetches all shloka entries and returns path params. Astro generates one HTML file per shloka. No server, no runtime, no database query at request time.

**When to use:** Always, for this project. This is the fundamental pattern for static site generation with content collections.

**Trade-offs:** Adding new content requires a rebuild and redeploy (acceptable — GitHub Actions handles this in ~2 minutes). All pages are pre-rendered so load instantly.

**Example:**
```typescript
// src/pages/chapters/[chapter]/[shloka].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  // Load all chapters — when multiple chapter files exist,
  // filter by a chapter number stored in the entry data
  const allShlokas = await getCollection('shlokas');
  return allShlokas.map((entry) => ({
    params: {
      chapter: String(entry.data.chapter),
      shloka: String(entry.data.shloka),
    },
    props: { shloka: entry.data },
  }));
}

const { shloka } = Astro.props;
```

### Pattern 3: Progressive Reveal as a Client Island

**What:** The shloka page (`.astro`) renders all content layers in the HTML — Sanskrit, transliteration, explanation, commentaries, practical applications. A single React (or Solid) island wraps the layers and controls visibility state via CSS classes. The island receives the total layer count as a prop; the server renders all content.

**When to use:** Progressive reveal requires persistent client state across user interactions (clicking "reveal next"). The content itself is static; only the visibility control is dynamic.

**Trade-offs:** All shloka content is in the HTML (good for SEO, accessibility, no flicker). The island is lightweight — it only manages a counter and applies CSS classes. Use `client:load` because the reveal is the primary interaction on the page and must be ready immediately.

**Example:**
```typescript
// src/components/islands/ProgressiveReveal.tsx
import { useState } from 'react';

type Layer = 'sanskrit' | 'transliteration' | 'synthesis' | 'commentaries' | 'practical';

const LAYERS: Layer[] = ['sanskrit', 'transliteration', 'synthesis', 'commentaries', 'practical'];

export default function ProgressiveReveal({ totalLayers }: { totalLayers: number }) {
  const [revealedCount, setRevealedCount] = useState(1); // Sanskrit always visible

  const revealNext = () => {
    if (revealedCount < totalLayers) setRevealedCount((n) => n + 1);
  };

  return (
    <div>
      {LAYERS.slice(0, revealedCount).map((layer) => (
        <div key={layer} data-layer={layer} className="layer visible" />
      ))}
      {revealedCount < totalLayers && (
        <button onClick={revealNext}>Reveal {LAYERS[revealedCount]}</button>
      )}
    </div>
  );
}
```

### Pattern 4: Layout Composition (Base + Chapter)

**What:** Two-level layout nesting. `BaseLayout.astro` owns `<html>`, `<head>`, fonts, global styles, and the top nav. `ChapterLayout.astro` wraps `BaseLayout` and adds chapter-specific context: chapter number, chapter name, breadcrumb. Individual pages wrap content in `ChapterLayout`.

**When to use:** Any time pages share structural chrome but need contextual variations. Avoids copy-paste of `<head>` boilerplate across 700 pages.

**Trade-offs:** Two layout files to maintain (trivial). Clear separation of global vs. contextual concerns.

**Example:**
```astro
---
// src/layouts/ChapterLayout.astro
import BaseLayout from './BaseLayout.astro';

interface Props {
  chapterNumber: number;
  chapterName: string;
  title: string;
}
const { chapterNumber, chapterName, title } = Astro.props;
---
<BaseLayout title={`${title} | Bhagavad Gita`}>
  <nav class="chapter-nav">
    <a href="/">All Chapters</a> / Chapter {chapterNumber}: {chapterName}
  </nav>
  <slot />
</BaseLayout>
```

### Pattern 5: Pagefind for Build-Time Search Indexing

**What:** Pagefind runs as an Astro integration after the build step. It crawls the static HTML output and creates a search index that lives alongside the site files. The search UI is an island loaded with `client:idle` — it does not block page render.

**When to use:** Any static site needing full-text search without a server or external API. For 700 shlokas with Sanskrit, transliteration, and explanation text, Pagefind's index will be under 1MB compressed.

**Trade-offs:** Search only covers published content (no draft content). Index rebuilds on every deploy (fast — seconds for 700 pages). No search analytics without external tooling.

**Example:**
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://username.github.io',
  base: '/gita-app',
  output: 'static',
  integrations: [pagefind()],
});
```

## Data Flow

### Build Time: Content → Static HTML

```
chapter-01.json (raw shloka data)
    ↓  (file() loader + Zod validation)
Content Collection entries (typed, validated)
    ↓  (getCollection() in getStaticPaths)
Route params [{chapter: '1', shloka: '1'}, ...]
    ↓  (Astro renders each page template)
700 static HTML files in dist/chapters/[ch]/[sh]/index.html
    ↓  (Pagefind post-build indexer)
dist/_pagefind/ (search index shards)
    ↓  (GitHub Actions: withastro/action + deploy-pages)
GitHub Pages CDN
```

### Runtime: User Interaction Flow (Progressive Reveal)

```
User lands on /chapters/2/11
    ↓  (Browser renders static HTML — Sanskrit visible immediately)
ProgressiveReveal island hydrates (client:load)
    ↓  (island reads its initial state: layer 1 visible)
User clicks "Reveal next"
    ↓  (useState update — no network call)
CSS class applied to transliteration layer
    ↓  (user clicks again...)
Synthesis, commentaries, practical applications revealed
    ↓  (all data was in HTML from build time — zero latency)
```

### Runtime: Search Flow

```
User types in search box (SearchModal island, client:idle)
    ↓  (Pagefind JS loaded on first keystroke — lazy)
Query sent to local _pagefind/ index (no server)
    ↓  (index shards loaded from CDN cache)
Results returned: shloka titles, chapter refs, excerpt
    ↓  (user clicks result)
Navigation to static shloka page
```

### State Management: Nanostores (if needed for cross-island state)

For v1, progressive reveal state is local to a single island and does not need nanostores. If later features require shared state (e.g., "bookmarked shlokas" persisted to localStorage, or a "reading progress" indicator visible in the nav), nanostores becomes relevant.

```
// Example future use: reading progress
// src/stores/progress.ts
import { atom, map } from 'nanostores';

export const readingProgress = map<Record<string, number>>({});
// Key: 'chapter-2', Value: last shloka number visited

// Any island imports and reads:
import { useStore } from '@nanostores/react';
import { readingProgress } from '../stores/progress';
```

## Scaling Considerations

This is a static site with no server. "Scaling" means CDN delivery, not application scaling.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0 - 10K monthly visitors | GitHub Pages CDN is sufficient — no changes needed |
| 10K - 1M monthly visitors | GitHub Pages handles this; if custom domain, add Cloudflare in front for better cache control and analytics |
| Content: Chapters 1-2 (v1) | Single collection file per chapter; build in seconds |
| Content: All 18 chapters (full) | 700 entries across 18 JSON files; Content Layer API handles this without performance concerns — 5x faster than legacy |
| Pagefind index at 700 shlokas | Index size ~500KB - 1MB compressed; loads lazily per shard only when searched |

### Scaling Priorities

1. **First bottleneck: Build time** — if content grows beyond 700 shlokas (unlikely), or if the AI content generation pipeline needs re-running often. Mitigation: Astro's Content Layer API caches between builds.
2. **Second bottleneck: GitHub Pages bandwidth** — at very high traffic. Mitigation: add Cloudflare proxy (free tier) for caching and bandwidth.

## Anti-Patterns

### Anti-Pattern 1: Putting All 700 Shlokas in a Single JSON File

**What people do:** Create one monolithic `shlokas.json` with all 700 entries.

**Why it's wrong:** Git blame, diffs, and contributions become unreadable. A single 700-entry file causes merge conflicts during content authoring. The `file()` loader handles it fine technically, but the authoring and contribution experience degrades.

**Do this instead:** One JSON file per chapter (`chapter-01.json` through `chapter-18.json`). Each chapter file is a JSON array of shloka objects. Contribution PRs touch only one chapter file.

### Anti-Pattern 2: Using Markdown Files Instead of JSON for Structured Shloka Data

**What people do:** Create one `.md` file per shloka (700 markdown files) with frontmatter for structured fields.

**Why it's wrong:** Shloka data is structured records, not prose documents. 700 individual files creates filesystem clutter, slow IDE indexing, and painful content generation tooling. Frontmatter parsing is slower than JSON for non-prose content. The `glob()` loader with 700 files works but is semantically wrong for this shape.

**Do this instead:** JSON arrays via the `file()` loader. Reserve markdown/MDX for content that is genuinely long-form prose (blog posts, documentation pages). Shlokas are records.

### Anti-Pattern 3: Adding Client-Side Hydration to Static Display Components

**What people do:** Wrap `ChapterCard`, `ShlokaNav`, or Sanskrit text display in a React component with `client:load` "just to be safe" or for convenience.

**Why it's wrong:** Every `client:*` directive ships JavaScript. ChapterCard, navigation arrows, and Sanskrit text rendering have zero interactivity needs. Unnecessary hydration inflates bundle size and delays Time to Interactive.

**Do this instead:** Default to `.astro` components for everything. Only reach for `client:*` when the component genuinely needs DOM event listeners or persistent client state (the reveal toggle, search input, accordion open/close).

### Anti-Pattern 4: Storing Reveal State in the URL or Server

**What people do:** Track which layers are revealed via URL query params (`?revealed=3`) or try to persist reveal state server-side.

**Why it's wrong:** This is a static site with no server. URL params for transient UI state create ugly URLs and break back-button behavior unexpectedly. Users expect reveal state to reset when they navigate to a new shloka.

**Do this instead:** `useState` local to the ProgressiveReveal island. State resets on page navigation (correct behavior — each shloka starts fresh). If "resume where I left off" becomes a v2 requirement, use `localStorage` via nanostores.

### Anti-Pattern 5: Fetching Shloka Data at Runtime

**What people do:** Load shloka content via a fetch call from a client island after page load — treating it like an API.

**Why it's wrong:** Defeats the entire purpose of static generation. Introduces latency, network failure modes, and requires CORS configuration or an API server — none of which this architecture has.

**Do this instead:** All shloka data is embedded in the static HTML at build time via `getStaticPaths` + `props`. The island receives only control props (layer count, IDs for CSS targeting). Content never crosses the network at runtime.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub Pages | `withastro/action@v5` in GitHub Actions; `output: 'static'` in config | Requires `site` and `base` set in `astro.config.mjs` if repo name differs from username.github.io |
| Google Fonts / Self-hosted | CSS `@font-face` in `src/styles/fonts.css`, files in `public/fonts/` | Self-host preferred for performance and offline capability; avoids external DNS dependency |
| Pagefind | `astro-pagefind` npm integration; runs post-build automatically | Index lives in `dist/_pagefind/` and is deployed alongside static files |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Content data → Page components | `getCollection()` / `getEntry()` in `.astro` frontmatter scripts; typed props passed down | One-way: data flows from collection to template, never the reverse |
| Astro pages → Island components | Props via component attributes; rendered HTML structure that islands can reference | Islands receive minimal props — primarily IDs and counts, not large data objects |
| Islands → Islands | Nanostores atoms imported by both islands; no direct parent-child communication | Only needed for cross-island shared state; v1 may not require this at all |
| Build pipeline → Search | Pagefind reads `dist/` HTML after Astro build; no source-level coupling | Pagefind respects `data-pagefind-ignore` attributes for excluding nav/footer from index |

## Build Order Implications

The following build order of components is implied by these dependencies:

1. **Content schema + JSON data files** — everything else depends on this. Schema defines the shape that all page templates receive.
2. **BaseLayout + ChapterLayout** — layouts must exist before pages can use them. Pure static; no dependencies on islands.
3. **Static Astro components** (ChapterCard, ShlokaNav, ChapterHeader) — depend on layouts; no JS dependencies.
4. **Dynamic route pages** (chapter index, shloka detail) — depend on layouts, static components, and content collection shape.
5. **Island components** (ProgressiveReveal, CommentaryAccordion, SearchModal) — depend on understanding the HTML structure they will mount into; developed against stable page templates.
6. **Search integration (Pagefind)** — configured after pages exist; runs post-build.
7. **GitHub Actions deployment** — configured last after local build is verified.

## Sources

- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) — HIGH confidence (official docs, verified 2026-03-01)
- [Astro Islands Architecture Docs](https://docs.astro.build/en/concepts/islands/) — HIGH confidence (official docs)
- [Astro Routing Guide](https://docs.astro.build/en/guides/routing/) — HIGH confidence (official docs)
- [Astro Share State Between Islands](https://docs.astro.build/en/recipes/sharing-state-islands/) — HIGH confidence (official docs)
- [Deploy Astro to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) — HIGH confidence (official docs)
- [astro-pagefind integration](https://github.com/shishkin/astro-pagefind) — MEDIUM confidence (community package, widely used per multiple sources)
- [Pagefind static search for Astro](https://evilmartians.com/chronicles/how-to-add-fast-client-side-search-to-astro-static-sites) — MEDIUM confidence (Evil Martians engineering blog, reputable source)
- [Astro Layouts Docs](https://docs.astro.build/en/basics/layouts/) — HIGH confidence (official docs)

---
*Architecture research for: Bhagavad Gita interactive web application (Astro + GitHub Pages)*
*Researched: 2026-03-01*
