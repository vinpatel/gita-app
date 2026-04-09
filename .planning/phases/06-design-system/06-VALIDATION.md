---
phase: 6
slug: design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 6 is CSS/visual only |
| **Config file** | Not applicable |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm preview` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm preview`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | DES-01 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |
| 6-01-02 | 01 | 1 | DES-06 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |
| 6-02-01 | 02 | 1 | DES-03 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |
| 6-02-02 | 02 | 1 | DES-04 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |
| 6-03-01 | 03 | 1 | DES-05 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |
| 6-04-01 | 04 | 2 | DES-02 | — | localStorage enum constraint | manual | `pnpm build` | N/A | ⬜ pending |
| 6-05-01 | 05 | 2 | DES-07 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |
| 6-06-01 | 06 | 2 | DES-08 | — | N/A | manual | `pnpm build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework install needed — this phase is purely CSS/visual with build verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark theme renders warm charcoal bg, off-white text | DES-01 | Visual appearance | `pnpm dev` → open browser → confirm dark renders by default |
| Theme toggle cycles dark→light→sepia, persists on reload | DES-02 | User interaction + localStorage | Click toggle 3 times, reload between each; confirm localStorage key `theme` |
| Source Serif 4, Noto Sans Devanagari, Inter load | DES-03 | Font rendering | DevTools Network → Font filter → confirm 3 families load |
| Headings reach 40px+ on desktop, fluid on resize | DES-04 | Visual measurement | Chrome DevTools Computed tab on h1 at 1280px viewport |
| 18 chapters show distinct OKLCH accent colors | DES-05 | Color appearance | Visit ch1 and ch10 pages; confirm left border colors differ |
| Semantic tokens resolve per theme | DES-06 | CSS variable inspection | DevTools → Inspect → confirm `--color-bg` changes with theme class |
| Page transitions fade; reduced-motion disables | DES-07 | Animation behavior | DevTools → Rendering → Emulate prefers-reduced-motion |
| 375px viewport no horizontal scroll | DES-08 | Responsive layout | DevTools device emulation → iPhone SE → no horizontal scroll |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
