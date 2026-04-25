// Generates dist/downloads/gita-en.pdf from the built /book/ route.
// Runs after `astro build` in CI. Spins up a tiny static server, drives
// Chromium via Playwright, and prints to PDF. No persistent browser.

import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize, sep } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
const PORT = Number(process.env.PDF_PORT || 4321);
const ROUTE = '/book/';
const OUT = join(DIST, 'downloads', 'gita-en.pdf');

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
  // Strip query string and decode
  let p = decodeURIComponent(urlPath.split('?')[0]);
  // Default index.html for directories
  if (p.endsWith('/')) p += 'index.html';
  // Prevent path traversal
  const candidate = normalize(join(DIST, p));
  if (!candidate.startsWith(DIST + sep) && candidate !== DIST) return null;
  if (!existsSync(candidate)) {
    // Astro may have produced /foo as /foo/index.html
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
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.warn(`[pdf] pageerror: ${err.message}`));
  page.on('requestfailed', (req) =>
    console.warn(`[pdf] request failed: ${req.url()} ${req.failure()?.errorText}`)
  );

  const url = `http://127.0.0.1:${PORT}${ROUTE}`;
  console.log(`[pdf] navigating to ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });

  // Wait for fonts to settle (Devanagari + Source Serif must load before PDF)
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(1000);

  await page.pdf({
    path: OUT,
    format: 'A4',
    margin: { top: '18mm', bottom: '18mm', left: '15mm', right: '15mm' },
    printBackground: true,
    preferCSSPageSize: true,
  });
  const s = await stat(OUT);
  console.log(`[pdf] generated ${OUT} (${(s.size / 1024 / 1024).toFixed(2)} MB)`);
} catch (e) {
  console.error(`[pdf] FAILED: ${e.message}`);
  exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}
process.exit(exitCode);
