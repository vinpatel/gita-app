// Generates dist/downloads/gita-{locale}.pdf for every available locale
// by visiting the corresponding /book/ or /book/{lang}/ route. Runs after
// `astro build` in CI. Spins up a tiny static server, drives Chromium
// via Playwright, prints to PDF, repeats per locale.

import { createServer } from 'node:http';
import { readFile, readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize, sep } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
const PORT = Number(process.env.PDF_PORT || 4321);
const DEFAULT_LOCALE = 'en';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const candidate = normalize(join(DIST, p));
  if (!candidate.startsWith(DIST + sep) && candidate !== DIST) return null;
  if (!existsSync(candidate)) {
    const alt = normalize(join(DIST, p, 'index.html'));
    if (existsSync(alt)) return alt;
    return null;
  }
  const s = await stat(candidate);
  if (s.isDirectory()) {
    const indexed = join(candidate, 'index.html');
    return existsSync(indexed) ? indexed : null;
  }
  return candidate;
}

async function discoverLocales() {
  // Source of truth lives next to the page data so dev and CI agree
  const root = 'src/data';
  const found = new Set([DEFAULT_LOCALE]);
  const entries = await readdir(root, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const m = e.name.match(/^chapters-([a-z]{2,3})$/);
    if (!m) continue;
    const sub = await readdir(join(root, e.name)).catch(() => []);
    if (sub.some((f) => f.startsWith('chapter-') && f.endsWith('.json'))) {
      found.add(m[1]);
    }
  }
  return [...found];
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/');
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server error: ${e.message}`);
  }
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(PORT, '127.0.0.1', resolve);
});
console.log(`[pdf] static server on http://127.0.0.1:${PORT}`);

let exitCode = 0;
let browser;
try {
  await mkdir(join(DIST, 'downloads'), { recursive: true });

  browser = await chromium.launch();

  // OG image: visit /og/default/ and screenshot at 1200x630
  try {
    const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    const ogUrl = `http://127.0.0.1:${PORT}/og/default/`;
    console.log(`[og] rendering ${ogUrl}`);
    await ogPage.goto(ogUrl, { waitUntil: 'networkidle', timeout: 60_000 });
    await ogPage.evaluate(() => document.fonts && document.fonts.ready);
    await ogPage.waitForTimeout(500);
    const ogOut = join(DIST, 'og-default.png');
    await ogPage.screenshot({ path: ogOut, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
    const ogStat = await stat(ogOut);
    console.log(`[og] generated ${ogOut} (${(ogStat.size / 1024).toFixed(0)} KB)`);
    await ogPage.close();
  } catch (e) {
    console.warn(`[og] failed: ${e.message}`);
    // Non-fatal — site still ships, just without a fresh OG image
  }

  const locales = await discoverLocales();
  console.log(`[pdf] locales to generate: ${locales.join(', ')}`);

  for (const locale of locales) {
    const route = locale === DEFAULT_LOCALE ? '/book/' : `/book/${locale}/`;
    const out = join(DIST, 'downloads', `gita-${locale}.pdf`);
    const url = `http://127.0.0.1:${PORT}${route}`;

    const page = await browser.newPage();
    page.on('pageerror', (err) => console.warn(`[pdf:${locale}] pageerror: ${err.message}`));
    page.on('requestfailed', (req) =>
      console.warn(`[pdf:${locale}] request failed: ${req.url()} ${req.failure()?.errorText}`)
    );

    console.log(`[pdf:${locale}] navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(1000);

    await page.pdf({
      path: out,
      format: 'A4',
      margin: { top: '18mm', bottom: '18mm', left: '15mm', right: '15mm' },
      printBackground: true,
      preferCSSPageSize: true,
    });
    const s = await stat(out);
    console.log(`[pdf:${locale}] generated ${out} (${(s.size / 1024 / 1024).toFixed(2)} MB)`);
    await page.close();
  }
} catch (e) {
  console.error(`[pdf] FAILED: ${e.message}`);
  exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}
process.exit(exitCode);
