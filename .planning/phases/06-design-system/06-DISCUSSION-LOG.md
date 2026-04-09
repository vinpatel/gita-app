# Phase 6: Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 06-design-system
**Areas discussed:** Theme modes & switching, Chapter color system, Typography & type scale, Animation & motion

---

## Theme Modes & Switching

### How should the theme toggle work?

| Option | Description | Selected |
|--------|-------------|----------|
| 3-way toggle | Dark / Light / Sepia cycling control, class on `<html>`, localStorage persistence | ✓ |
| Dark + Light only | Skip sepia, simpler implementation | |
| System-aware + manual | Respect prefers-color-scheme first, then manual override | |

**User's choice:** 3-way toggle (Dark / Light / Sepia)

### Where should the theme toggle live?

| Option | Description | Selected |
|--------|-------------|----------|
| Header bar | Small icon button in persistent site header | ✓ |
| Floating corner button | Fixed position, always visible | |
| You decide | Claude picks | |

**User's choice:** Header bar

### Dark mode palette vibe

| Option | Description | Selected |
|--------|-------------|----------|
| Warm charcoal | #1a1714 background, #f5f0e8 text, "ancient library at night" | ✓ |
| Cool dark | Blue-gray dark, modern/tech feel | |
| True black | #000000, OLED-friendly, maximum contrast | |

**User's choice:** Warm charcoal

### Sepia mode palette

| Option | Description | Selected |
|--------|-------------|----------|
| Parchment warm | #f4e8c1 background, #3b2f1e text, "reading a physical manuscript" | ✓ |
| Subtle sepia | Barely tinted, close to current cream | |
| You decide | Claude picks | |

**User's choice:** Parchment warm

---

## Chapter Color System

### How should chapter colors be used?

| Option | Description | Selected |
|--------|-------------|----------|
| Accent touches | Header bar/border, card badge, verse page stripe. Never full-page backgrounds. | ✓ |
| Bold color sections | Prominent use in hero backgrounds, sidebar tinting | |
| Minimal -- badges only | Small dot/pill badge only | |

**User's choice:** Accent touches

### How should colors adapt across theme modes?

| Option | Description | Selected |
|--------|-------------|----------|
| Auto lightness shift | Same hue, lightness/chroma adjust per mode | ✓ |
| Fixed colors | Same values across all modes | |
| You decide | Claude picks | |

**User's choice:** Auto lightness shift

---

## Typography & Type Scale

### What happens to Cormorant Garamond?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep all three | Cormorant (display) + Source Serif 4 (body) + Inter (UI) | ✓ |
| Drop Cormorant | Source Serif 4 for both display and body | |
| You decide | Claude picks | |

**User's choice:** Keep all three

### Devanagari font stack

| Option | Description | Selected |
|--------|-------------|----------|
| Switch to Noto Sans Devanagari | Match requirements, drop Tiro + Noto Serif | ✓ |
| Keep Tiro as primary | Tiro Devanagari Sanskrit primary, Noto Sans fallback | |
| You decide | Claude picks | |

**User's choice:** Switch to Noto Sans Devanagari

### Type scale approach

| Option | Description | Selected |
|--------|-------------|----------|
| Fluid clamp scale | CSS clamp() for responsive sizes, no breakpoint jumps | ✓ |
| Fixed with breakpoints | Traditional fixed sizes per breakpoint | |
| You decide | Claude picks | |

**User's choice:** Fluid clamp scale

---

## Animation & Motion

### Animation personality

| Option | Description | Selected |
|--------|-------------|----------|
| Contemplative & subtle | 300-500ms, fade + vertical shift, no springs/bounces | ✓ |
| Crisp & modern | 150-250ms, sharp easing, Linear/Vercel feel | |
| Minimal -- near zero | Only essential transitions | |

**User's choice:** Contemplative & subtle

### prefers-reduced-motion handling

| Option | Description | Selected |
|--------|-------------|----------|
| Instant swap | All durations to ~0ms, content still toggles | ✓ |
| Gentle fade only | Remove transforms, keep opacity fades at 150ms | |
| You decide | Claude picks based on WCAG | |

**User's choice:** Instant swap

### View Transitions API

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, use View Transitions | Astro ViewTransitions component, crossfade + morph | ✓ |
| No, standard navigation | Full page loads, zero JS overhead | |
| You decide | Claude evaluates | |

**User's choice:** Yes, use View Transitions

---

## Claude's Discretion

- Exact OKLCH hue values for 18 chapters
- Exact clamp() values for 9-level type scale
- CSS custom property naming conventions
- Semantic color token naming
- Responsive breakpoints and spacing scale
- Theme toggle implementation (Preact vs vanilla JS)
- Design system file structure

## Deferred Ideas

None -- discussion stayed within phase scope
