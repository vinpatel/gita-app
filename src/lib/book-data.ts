// Build-time helpers for the multilingual book route.
// Direct filesystem reads so each locale can supply its own JSON
// data without needing a separate Astro content collection.

import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const DEFAULT_LOCALE = 'en';

export type ChapterMeta = { sanskrit: string; name: string; summary: string };

type Verse = {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  iast: string;
  explanation: string;
  synthesis: string;
  themes: string[];
  // Other fields exist on the source schema but the book layout
  // only needs these. Extra keys are tolerated, never required.
  [key: string]: unknown;
};

const DATA_ROOT = 'src/data';

function chapterDir(locale: string): string {
  return locale === DEFAULT_LOCALE
    ? join(DATA_ROOT, 'chapters')
    : join(DATA_ROOT, `chapters-${locale}`);
}

async function readChapterFile(dir: string, num: number): Promise<Verse[] | null> {
  const filename = `chapter-${String(num).padStart(2, '0')}.json`;
  const path = join(dir, filename);
  if (!existsSync(path)) return null;
  const raw = await readFile(path, 'utf-8');
  return JSON.parse(raw) as Verse[];
}

export async function loadVerses(num: number, locale: string): Promise<{ verses: Verse[]; translated: boolean }> {
  if (locale !== DEFAULT_LOCALE) {
    const localized = await readChapterFile(chapterDir(locale), num);
    if (localized && localized.length > 0) {
      return { verses: localized, translated: true };
    }
  }
  const fallback = await readChapterFile(chapterDir(DEFAULT_LOCALE), num);
  return { verses: fallback ?? [], translated: false };
}

type ChapterMetaFile = Record<string, Record<string, ChapterMeta>>;

let metaCache: ChapterMetaFile | null = null;
async function loadMetaFile(): Promise<ChapterMetaFile> {
  if (metaCache) return metaCache;
  const raw = await readFile(join(DATA_ROOT, 'i18n', 'chapter-meta.json'), 'utf-8');
  metaCache = JSON.parse(raw) as ChapterMetaFile;
  return metaCache;
}

export async function loadChapterMeta(locale: string): Promise<Record<number, ChapterMeta>> {
  const file = await loadMetaFile();
  const out: Record<number, ChapterMeta> = {};
  const fallback = file[DEFAULT_LOCALE] ?? {};
  const localized = file[locale] ?? {};
  for (let i = 1; i <= 18; i++) {
    out[i] = localized[String(i)] ?? fallback[String(i)];
  }
  return out;
}

// Discovers locales by scanning src/data for chapters-{locale} directories
// that contain at least one chapter file. The default locale is always
// included even if the dir name differs.
export async function discoverLocales(): Promise<string[]> {
  const found = new Set<string>([DEFAULT_LOCALE]);
  const entries = await readdir(DATA_ROOT, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const m = e.name.match(/^chapters-([a-z]{2,3})$/);
    if (!m) continue;
    const sub = await readdir(join(DATA_ROOT, e.name)).catch(() => []);
    if (sub.some((f) => f.startsWith('chapter-') && f.endsWith('.json'))) {
      found.add(m[1]);
    }
  }
  return [...found];
}

export const LOCALE_LABELS: Record<string, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  mr: { native: 'मराठी', english: 'Marathi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
  ml: { native: 'മലയാളം', english: 'Malayalam' },
  or: { native: 'ଓଡ଼ିଆ', english: 'Odia' },
  pa: { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  sa: { native: 'संस्कृतम्', english: 'Sanskrit' },
};

// HTML lang attribute values
export const HTML_LANG: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  mr: 'mr',
  gu: 'gu',
  bn: 'bn',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  ml: 'ml',
  or: 'or',
  pa: 'pa',
  sa: 'sa',
};
