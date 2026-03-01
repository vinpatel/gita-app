---
phase: 01-foundation
plan: "04"
subsystem: infra
tags: [license, mit, legal, copyright, iast, transliteration, bhagavad-gita]

# Dependency graph
requires: []
provides:
  - MIT license at project root for open source compliance
  - Gita Press (Gorakhpur) declared as canonical source for 700-verse 18-chapter structure
  - Complete chapter-by-chapter verse count table (Ch. 1 through Ch. 18, total 700)
  - AI content policy with copyright guardrails for Phase 2 generation
  - IAST mandated as the only accepted transliteration standard
  - Prohibited sources named: BBT/ISKCON, Chinmaya Mission, Sri Aurobindo
  - Paraphrase-and-tradition-attribution requirement established
affects:
  - 02-content-generation (AI prompts must reference AI-CONTENT-POLICY.md)
  - src/data/chapters (verse numbering structure from SOURCES.md)
  - All AI content generation prompts in Phase 2

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tradition-attribution pattern: attribute to philosophical tradition, not to specific modern author/book"
    - "IAST-only transliteration: enforced in docs, to be enforced in Zod schema in Phase 2"
    - "Public-domain legal basis: Delhi HC 2024 ruling as foundation for all Sanskrit content"

key-files:
  created:
    - LICENSE
    - docs/SOURCES.md
    - docs/AI-CONTENT-POLICY.md
  modified: []

key-decisions:
  - "MIT license with 'Gita App Contributors' copyright holder — user can update name. MIT covers code and AI-generated synthesis content."
  - "Gita Press (Gorakhpur) is the canonical verse numbering source — not a licensing dependency, just a reference standard."
  - "BBT/ISKCON, Chinmaya Mission, and Sri Aurobindo Ashram named explicitly as prohibited sources in policy."
  - "IAST is the only accepted transliteration standard — Harvard-Kyoto, ITRANS, and other romanization schemes rejected."
  - "Delhi High Court (2024) ruling cited as legal basis: original Sanskrit text is public domain."

patterns-established:
  - "AI prompt constraint pattern: AI-CONTENT-POLICY.md must be referenced in every Phase 2 AI prompt"
  - "Attribution format: 'AI-generated synthesis of [tradition] philosophical tradition based on public domain sources'"
  - "Verse reference format: Chapter:Verse (e.g., 2:47)"

requirements-completed: [INF-03, CONT-10]

# Metrics
duration: 1min
completed: 2026-03-01
---

# Phase 1 Plan 04: Legal and AI Content Policy Summary

**MIT license, Gita Press canonical source declaration, and AI content policy with IAST mandate and BBT/Chinmaya/Sri Aurobindo copyright guardrails**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-01T17:36:31Z
- **Completed:** 2026-03-01T17:37:47Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- MIT License at project root with 2026 copyright year for open source compliance
- `docs/SOURCES.md` declares Gita Press (Gorakhpur) as the canonical verse numbering source with the complete 18-chapter, 700-verse count table
- `docs/AI-CONTENT-POLICY.md` establishes all copyright guardrails and standards needed before Phase 2 AI content generation begins: paraphrase requirement, prohibited sources (BBT, Chinmaya Mission, Sri Aurobindo), IAST transliteration mandate, verse numbering reference, and Delhi HC 2024 legal basis

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MIT license file** - `92f9360` (chore)
2. **Task 2: Create canonical sources document and AI content policy** - `70380a4` (docs)

**Plan metadata:** `864f1f7` (docs: complete plan)

## Files Created/Modified

- `LICENSE` - Standard MIT License, 2026, Gita App Contributors
- `docs/SOURCES.md` - Canonical source declaration for Gita Press (Gorakhpur); complete 700-verse chapter table; public domain legal note
- `docs/AI-CONTENT-POLICY.md` - Copyright guardrails for Phase 2 AI generation: paraphrase requirement, prohibited sources, IAST standard, verse numbering reference, Delhi HC 2024 legal basis

## Decisions Made

- MIT license uses "Gita App Contributors" as copyright holder — generic so user can update later. MIT applies to code and AI-generated synthesis content; original Sanskrit text is separately public domain.
- Gita Press (Gorakhpur) chosen as canonical source for verse numbering because it is the widely-used 700-verse, 18-chapter reference. This is a reference choice, not a licensing dependency.
- BBT/ISKCON, Chinmaya Mission, and Sri Aurobindo Ashram named explicitly by name in the prohibited sources list — vague "modern commentaries" language would not be actionable enough for AI prompt engineering.
- IAST mandated with explicit diacritical marks table — will be enforceable in Zod schema validation in Phase 2.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Legal and ethical foundation is complete. Phase 2 AI content generation can proceed with `docs/AI-CONTENT-POLICY.md` as the binding constraint document.
- All AI prompts in Phase 2 must include a reference to `docs/AI-CONTENT-POLICY.md`.
- Verse numbering structure from `docs/SOURCES.md` should be the reference for Zod schema design in Phase 2.
- The copyright holder name in `LICENSE` is "Gita App Contributors" — user may wish to update before public release.

---
*Phase: 01-foundation*
*Completed: 2026-03-01*
