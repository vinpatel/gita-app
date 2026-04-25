---
phase: quick-260425-crl
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/llms.txt
  - public/llms-full.txt
  - public/ai.txt
  - public/sitemap-ai.xml
autonomous: true
requirements:
  - QUICK-AEO-01

must_haves:
  truths:
    - "AI crawlers can fetch /llms.txt from the deployed site"
    - "AI crawlers can fetch /llms-full.txt from the deployed site"
    - "AI training/inference licensing declaration is published at /ai.txt"
    - "Supplementary AI sitemap is available at /sitemap-ai.xml"
    - "Existing public/robots.txt is unchanged"
    - "Astro build still succeeds after the files are added"
  artifacts:
    - path: public/llms.txt
      provides: "Standard llms.txt index for AI crawlers (Anthropic-style)"
      min_size_bytes: 60000
    - path: public/llms-full.txt
      provides: "Full-content variant for AI crawlers"
      min_size_bytes: 800000
    - path: public/ai.txt
      provides: "AI training/inference licensing declaration (CC-BY-4.0)"
      min_size_bytes: 300
    - path: public/sitemap-ai.xml
      provides: "Supplementary sitemap with <ai:summary> per URL"
      min_size_bytes: 55000
  key_links:
    - from: "Astro public/ directory"
      to: "build output (dist/)"
      via: "Astro static asset passthrough — files in public/ are copied verbatim to site root"
      pattern: "public/{filename} -> https://bhagavad.net/{filename}"
---

<objective>
Add four AEOrank-generated AI-discovery files to the Astro `public/` directory so they are served at the site root after build/deploy.

Purpose: Improve discoverability of the Bhagavad Gita resource by AI crawlers (LLMs, AI search engines) via the emerging llms.txt + ai.txt + AI sitemap conventions. These files are static and AEOrank produced them already — this is purely a copy/commit task.

Output:
- `public/llms.txt` (~65KB) — llms.txt index
- `public/llms-full.txt` (~810KB) — full-content variant
- `public/ai.txt` (~406B) — licensing declaration
- `public/sitemap-ai.xml` (~60KB) — AI sitemap with summaries
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/STATE.md

<!-- Source files (already on disk, do not need to be created): -->
<!-- /tmp/aeorank/llms.txt -->
<!-- /tmp/aeorank/llms-full.txt -->
<!-- /tmp/aeorank/ai.txt -->
<!-- /tmp/aeorank/sitemap-ai.xml -->

<interfaces>
<!-- Astro static-asset behavior: -->
<!-- Anything in `public/` is copied verbatim into the build output (`dist/`) and -->
<!-- served at the site root. No frontmatter, no processing, no imports. -->
<!-- Existing `public/robots.txt` is left untouched; @astrojs/sitemap continues to -->
<!-- generate `sitemap-index.xml` at build time. The new `sitemap-ai.xml` is a -->
<!-- supplementary file (different filename), not a replacement. -->
</interfaces>

<files_to_skip>
<!-- These exist in /tmp/aeorank/ but MUST NOT be copied: -->
<!-- - CLAUDE.md      → AEOrank's audit report; would clobber project CLAUDE.md -->
<!-- - schema.json    → trivial JSON-LD; site already ships richer JSON-LD -->
<!-- - robots-patch.txt → no-op; existing robots.txt already permissive -->
<!-- - faq-blocks.html  → empty template -->
<!-- - citation-anchors.html → requires manual heading-id edits; out of scope -->
</files_to_skip>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Copy AEO files into public/ and verify build</name>
  <files>
    public/llms.txt,
    public/llms-full.txt,
    public/ai.txt,
    public/sitemap-ai.xml
  </files>
  <action>
Copy exactly four files from `/tmp/aeorank/` into the project's `public/` directory:

```bash
cp /tmp/aeorank/llms.txt        /Users/vin/Development/gita-app/public/llms.txt
cp /tmp/aeorank/llms-full.txt   /Users/vin/Development/gita-app/public/llms-full.txt
cp /tmp/aeorank/ai.txt          /Users/vin/Development/gita-app/public/ai.txt
cp /tmp/aeorank/sitemap-ai.xml  /Users/vin/Development/gita-app/public/sitemap-ai.xml
```

DO NOT copy these files (they are intentionally skipped — see `<files_to_skip>`):
- `/tmp/aeorank/CLAUDE.md` (would conflict with project CLAUDE.md)
- `/tmp/aeorank/schema.json` (site already ships richer JSON-LD)
- `/tmp/aeorank/robots-patch.txt` (no-op)
- `/tmp/aeorank/faq-blocks.html` (empty template)
- `/tmp/aeorank/citation-anchors.html` (requires separate manual heading-id work)

DO NOT modify `public/robots.txt` (already exists, already permissive).

DO NOT touch `astro.config.*` or anything related to `@astrojs/sitemap` — the new `sitemap-ai.xml` is a supplementary static file with a distinct name, NOT a replacement for the integration-generated `sitemap-index.xml`.

After copying, run `pnpm build` (preferred — `pnpm-lock.yaml` is the project lockfile; fall back to `npm run build` only if pnpm is not available) to confirm the static build still succeeds. The four new files should appear in `dist/` at the same paths.
  </action>
  <verify>
    <automated>
test -f /Users/vin/Development/gita-app/public/llms.txt && \
test -f /Users/vin/Development/gita-app/public/llms-full.txt && \
test -f /Users/vin/Development/gita-app/public/ai.txt && \
test -f /Users/vin/Development/gita-app/public/sitemap-ai.xml && \
test "$(wc -c < /Users/vin/Development/gita-app/public/llms.txt)" -gt 60000 && \
test "$(wc -c < /Users/vin/Development/gita-app/public/llms-full.txt)" -gt 800000 && \
test "$(wc -c < /Users/vin/Development/gita-app/public/ai.txt)" -gt 300 && \
test "$(wc -c < /Users/vin/Development/gita-app/public/sitemap-ai.xml)" -gt 55000 && \
test -f /Users/vin/Development/gita-app/public/robots.txt && \
cd /Users/vin/Development/gita-app && (pnpm build || npm run build) && \
test -f dist/llms.txt && test -f dist/llms-full.txt && \
test -f dist/ai.txt && test -f dist/sitemap-ai.xml
    </automated>
  </verify>
  <done>
All four files exist in `public/` with sizes consistent with the source files. `public/robots.txt` is unchanged. `pnpm build` (or `npm run build`) completes without error. The four files are also present in `dist/` at the site root, confirming Astro will serve them at `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/sitemap-ai.xml` after deploy.
  </done>
</task>

</tasks>

<verification>
Manual spot-checks (post-build):
1. `head -5 dist/llms.txt` — should look like a markdown index of the site
2. `cat dist/ai.txt` — should be a short licensing declaration referencing CC-BY-4.0
3. `head -10 dist/sitemap-ai.xml` — should contain `<urlset>` with `xmlns:ai="..."` declarations and `<ai:summary>` children
4. `dist/sitemap-index.xml` still exists (proves `@astrojs/sitemap` was not disturbed)
5. `dist/robots.txt` matches `public/robots.txt` (proves we did not overwrite it)
</verification>

<success_criteria>
- [ ] `public/llms.txt`, `public/llms-full.txt`, `public/ai.txt`, `public/sitemap-ai.xml` all exist with correct content (byte-size sanity checks pass)
- [ ] `public/robots.txt` unchanged
- [ ] `astro.config.*` unchanged
- [ ] `pnpm build` (or `npm run build`) succeeds
- [ ] `dist/` contains all four new files at the root
- [ ] `dist/sitemap-index.xml` still exists (sitemap integration intact)
- [ ] None of the skipped files (CLAUDE.md, schema.json, robots-patch.txt, faq-blocks.html, citation-anchors.html) were copied into `public/`
</success_criteria>

<output>
After completion, create `.planning/quick/260425-crl-add-aeo-files-llms-txt-llms-full-txt-ai-/260425-crl-SUMMARY.md` documenting:
- Which files were copied and final sizes
- Build status (pnpm vs npm fallback used)
- Confirmation that robots.txt and astro.config were not modified
- Live URLs that will become available after next deploy
</output>
