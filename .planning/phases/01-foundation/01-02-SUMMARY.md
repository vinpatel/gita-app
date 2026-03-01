---
phase: 01-foundation
plan: 02
subsystem: content
tags: [astro, zod, content-collection, iast, devanagari, json]

# Dependency graph
requires:
  - phase: 01-01
    provides: Astro 5 project scaffold with TypeScript strict mode and astro/zod available

provides:
  - Zod schema for shloka content collection enforcing IAST transliteration and Devanagari script
  - Test shloka BG 1.1 (Gita Press verse numbering) with all required content fields
  - Build-time validation that rejects Harvard-Kyoto ASCII and non-Devanagari Sanskrit

affects:
  - phase-02-content-generation (schema is the contract for all AI-generated shloka data)
  - phase-03-ui (Shloka TypeScript type exported from content.config.ts)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro 5 content collections using file() loader with JSON data files"
    - "Import z from astro/zod (not standalone zod) to avoid version conflicts"
    - "src/content.config.ts at Astro 5 root location (NOT src/content/config.ts)"
    - "IAST diacritic regex enforcement at schema level — builds fail on invalid transliteration"

key-files:
  created:
    - src/content.config.ts
    - src/data/chapters/chapter-01.json
  modified: []

key-decisions:
  - "src/content.config.ts at Astro 5 location — src/content/config.ts is Astro 4 and silently fails"
  - "IAST diacritic regex rejects Harvard-Kyoto (ASCII-only uppercase) at build time"
  - "file() loader requires id field on every JSON entry — BG-1.1 format established"
  - "Commentary texts are paraphrased philosophical synthesis — not reproductions of copyrighted source texts"

patterns-established:
  - "Content schema pattern: Zod enforces transliteration standard, traditions enum, and all required fields"
  - "JSON data pattern: Array of objects with id field for file() loader compatibility"

requirements-completed: [CONT-08]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 1 Plan 2: Content Schema Summary

**Zod content schema for shloka data with build-time IAST diacritic enforcement and Devanagari validation, tested with BG 1.1 using Gita Press verse numbering**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T17:42:26Z
- **Completed:** 2026-03-01T17:43:39Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created `src/content.config.ts` at the correct Astro 5 location with full shlokaSchema
- IAST regex enforces diacritics (ā, ī, ū, ṛ, ṃ, ḥ, etc.) — Harvard-Kyoto ASCII rejected at build time
- Devanagari regex (U+0900-U+097F) rejects plain ASCII in the Sanskrit field
- Commentary traditions restricted to enum: advaita, vishishtadvaita, bhakti
- All four application domains (personal_growth, career_business, health, relationships) required
- `npm run build` passes with zero errors, schema validated end-to-end against BG 1.1

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Zod content schema with IAST enforcement** - `6714d03` (feat)
2. **Task 2: Create test shloka JSON (BG 1.1) and validate build** - `24756db` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/content.config.ts` - Astro 5 content collection config with shlokaSchema; imports from astro/zod; uses file() loader pointing to chapter-01.json; exports Shloka TypeScript type
- `src/data/chapters/chapter-01.json` - BG 1.1 test shloka with Devanagari Sanskrit, IAST transliteration, three tradition commentaries, four application domains, five theme tags

## Decisions Made
- `src/content.config.ts` placed at Astro 5 root location — the Astro 4 path `src/content/config.ts` silently fails with no error
- Import `z` from `astro/zod` not standalone `zod` to avoid Zod version conflicts (Astro bundles Zod v3)
- IAST regex is enforced at schema level so invalid transliteration fails `npm run build` — not runtime
- Commentary texts are original paraphrased synthesis of philosophical traditions per AI-CONTENT-POLICY.md

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Content schema is the binding contract for Phase 2 AI content generation
- The `Shloka` TypeScript type (exported from content.config.ts) is ready for UI components in Phase 3
- Schema enforces all CONT-08 requirements: IAST transliteration standard, Gita Press verse numbering, required content fields
- Risk remains: Phase 2 AI prompt engineering for theological accuracy has no established playbook

---
*Phase: 01-foundation*
*Completed: 2026-03-01*
