# Phase 6: Design System - Discussion Log (Redesign)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 06-design-system
**Areas discussed:** Color palette & mood, Homepage layout, Typography & fonts, Theme modes, Search, Lesson interaction
**Note:** This is the SECOND discussion — first attempt (2026-04-09) was rejected after seeing the warm/scholarly design locally. User pivoted to 37signals-style bold design.

---

## Color Palette & Mood

| Option | Description | Selected |
|--------|-------------|----------|
| Bold primaries | Like 37signals/HEY — saturated blue, yellow, green, orange. Bold solid color blocks. | ✓ |
| Muted earth tones | Solid but softer — terracotta, olive, clay, slate. Warmer/spiritual. | |
| One bold + neutrals | One signature color with clean white/dark neutral backgrounds. | |

**User's choice:** Bold primaries
**Notes:** User explicitly referenced 37signals multiple times. Rejected the warm cream/parchment palette from the previous Phase 6 attempt.

---

## Homepage Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Bold numbered list | Full-width rows, huge numbers (1-18), lesson text large. Like a manifesto. | ✓ |
| Color-block cards | Each lesson gets its own bold-colored card/tile in a grid. | |
| Alternating full-width | Each lesson is a full-width color band with alternating bold colors. | |

**User's choice:** Bold numbered list
**Notes:** Search box at top, above the lessons.

---

## Typography & Fonts

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current fonts | Cormorant Garamond + Source Serif 4 + Inter + Noto Sans Devanagari | |
| Go sans-serif bold | Inter for everything. Bold weights. Clean, modern. | |
| Mix: sans headings + serif body | Inter Bold for headings/UI. Source Serif 4 for reading text. | ✓ |

**User's choice:** Mix — Inter Bold headings, Source Serif 4 body
**Notes:** Drops Cormorant Garamond. Keeps Noto Sans Devanagari for Sanskrit.

---

## Theme Modes

| Option | Description | Selected |
|--------|-------------|----------|
| Just light | One mode only. Bold colors on white/light. Simplest. | |
| Light + Dark | Two modes. Bold colors adapt for dark. No sepia. | ✓ |
| Keep all three | Light, Dark, Sepia with bold color adaptation. | |

**User's choice:** Light + Dark (drop sepia)

---

## Search Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Dropdown suggestions | Dropdown shows matching questions. Click to navigate. | |
| Full-page takeover | Full-screen overlay like Spotlight/Alfred. Grouped by life area. | ✓ |
| Inline expand | Results below search box, pushing content down. | |

**User's choice:** Full-page takeover
**Notes:** Accepts freeform queries. Existing LifeSearch.tsx to be adapted.

---

## Lesson Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Direct link to chapter | Click lesson → chapter page. Simplest. | ✓ |
| Expand inline | Click → accordion with details and 'Read chapter' button. | |
| Hover preview | Hover shows tooltip/card. Click goes to chapter. | |

**User's choice:** Direct link to chapter

---

## Claude's Discretion

- Exact primary color hex values
- CSS custom property naming
- 18-chapter color assignment
- Search overlay implementation details
- Responsive breakpoints

## Deferred Ideas

None
