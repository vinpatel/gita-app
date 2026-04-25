// Translate a single chapter from English to a target locale via the
// Anthropic API. Reads src/data/chapters/chapter-NN.json, sends each
// verse to Claude for translation, writes src/data/chapters-{locale}/
// chapter-NN.json. Also updates the chapter meta (name + summary) in
// src/data/i18n/chapter-meta.json.
//
// Designed to be idempotent and resumable: existing already-translated
// verses in the output file are reused unless RETRANSLATE=1.
//
// Required env: ANTHROPIC_API_KEY, CHAPTER, LOCALE.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const FALLBACK_MODEL = 'claude-sonnet-4-6';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('FATAL: ANTHROPIC_API_KEY is not set');
  process.exit(1);
}

const CHAPTER = Number(process.env.CHAPTER);
const LOCALE = (process.env.LOCALE || '').toLowerCase();
const RETRANSLATE = process.env.RETRANSLATE === '1';

if (!Number.isInteger(CHAPTER) || CHAPTER < 1 || CHAPTER > 18) {
  console.error(`FATAL: invalid CHAPTER: ${process.env.CHAPTER}`);
  process.exit(1);
}
if (!/^[a-z]{2,3}$/.test(LOCALE)) {
  console.error(`FATAL: invalid LOCALE: ${process.env.LOCALE}`);
  process.exit(1);
}

const LANG_NAMES = {
  hi: { english: 'Hindi', native: 'हिन्दी' },
  mr: { english: 'Marathi', native: 'मराठी' },
  gu: { english: 'Gujarati', native: 'ગુજરાતી' },
  bn: { english: 'Bengali', native: 'বাংলা' },
  ta: { english: 'Tamil', native: 'தமிழ்' },
  te: { english: 'Telugu', native: 'తెలుగు' },
  kn: { english: 'Kannada', native: 'ಕನ್ನಡ' },
  ml: { english: 'Malayalam', native: 'മലയാളം' },
  or: { english: 'Odia', native: 'ଓଡ଼ିଆ' },
  pa: { english: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  sa: { english: 'Sanskrit', native: 'संस्कृतम्' },
};
const LANG = LANG_NAMES[LOCALE];
if (!LANG) {
  console.error(`FATAL: locale ${LOCALE} not in supported list`);
  process.exit(1);
}

const PADDED = String(CHAPTER).padStart(2, '0');
const SOURCE_PATH = `src/data/chapters/chapter-${PADDED}.json`;
const OUT_DIR = `src/data/chapters-${LOCALE}`;
const OUT_PATH = `${OUT_DIR}/chapter-${PADDED}.json`;
const META_PATH = 'src/data/i18n/chapter-meta.json';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

let cachedModel = null;
async function discoverModel() {
  if (cachedModel) return cachedModel;
  try {
    const res = await fetch('https://api.anthropic.com/v1/models?limit=50', {
      headers: { 'x-api-key': API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
    });
    if (res.ok) {
      const data = await res.json();
      for (const m of data.data ?? []) {
        if ((m.id || '').toLowerCase().includes('sonnet')) {
          cachedModel = m.id;
          console.log(`[translate] using model ${cachedModel}`);
          return cachedModel;
        }
      }
    }
    console.warn(`[translate] model discovery returned no sonnet, falling back`);
  } catch (e) {
    console.warn(`[translate] model discovery failed: ${e.message}`);
  }
  cachedModel = FALLBACK_MODEL;
  return cachedModel;
}

async function callClaude(prompt, { maxTokens = 8000 } = {}) {
  const model = await discoverModel();
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'anthropic-version': ANTHROPIC_VERSION,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 400)}`);
      }
      const data = await res.json();
      return data.content[0].text;
    } catch (e) {
      const final = attempt === 3;
      console.warn(`[claude] attempt ${attempt}/3 failed: ${e.message}`);
      if (final) throw e;
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
  throw new Error('unreachable');
}

function extractJSON(text) {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
  }
  // Find the first balanced JSON object/array
  const start = t.search(/[{[]/);
  if (start === -1) throw new Error(`no JSON in response: ${t.slice(0, 200)}`);
  return JSON.parse(t.slice(start));
}

async function translateVerse(verse) {
  const prompt = [
    `You are translating a Bhagavad Gītā commentary entry from English to ${LANG.english} (${LANG.native}).`,
    '',
    'TRANSLATE these fields, preserve everything else:',
    '- explanation (English → ' + LANG.english + ')',
    '- synthesis (English → ' + LANG.english + ')',
    '- commentaries[].text (English → ' + LANG.english + ')',
    '- commentaries[].teacher (transliterate Sanskrit names into ' + LANG.english + ' script — e.g. "Adi Shankaracharya" → its native rendering)',
    '- applications.* (English → ' + LANG.english + ')',
    '- questions.*[] (English → ' + LANG.english + ')',
    '- themes[] (translate each tag to ' + LANG.english + ')',
    '',
    'KEEP UNCHANGED:',
    '- id, chapter, verse (numerical/identifier values)',
    '- sanskrit (already in Devanagari, do not modify)',
    '- iast (Sanskrit transliteration, do not modify)',
    '- commentaries[].tradition (technical IDs like "advaita", "bhakti")',
    '',
    'STYLE RULES:',
    '- Use natural, literary ' + LANG.english + ' — not literal word-for-word.',
    '- Preserve technical Sanskrit terms (dharma, karma, atman, moksha, yoga, sattva, rajas, tamas, brahman, etc.) using the appropriate native script form.',
    '- Match the gravitas and clarity of the original.',
    '',
    'Return ONLY valid JSON matching the exact source schema. No markdown fences, no explanation.',
    '',
    'SOURCE VERSE:',
    JSON.stringify(verse),
  ].join('\n');

  const text = await callClaude(prompt, { maxTokens: 8000 });
  const parsed = extractJSON(text);
  // Sanity: preserve identifying fields exactly
  parsed.id = verse.id;
  parsed.chapter = verse.chapter;
  parsed.verse = verse.verse;
  parsed.sanskrit = verse.sanskrit;
  parsed.iast = verse.iast;
  return parsed;
}

async function translateMeta(sourceMeta) {
  const prompt = [
    `Translate this Bhagavad Gītā chapter metadata from English to ${LANG.english} (${LANG.native}).`,
    '',
    'Chapter ' + CHAPTER + ' source:',
    JSON.stringify(sourceMeta),
    '',
    'Translate "name" and "summary" to ' + LANG.english + '. Keep "sanskrit" unchanged (already in Devanagari).',
    'Return ONLY valid JSON with the same shape: { "sanskrit": "...", "name": "...", "summary": "..." }.',
    'No markdown fences. No explanation.',
  ].join('\n');

  const text = await callClaude(prompt, { maxTokens: 1500 });
  const parsed = extractJSON(text);
  parsed.sanskrit = sourceMeta.sanskrit; // never modify
  return parsed;
}

async function main() {
  console.log(`[translate] chapter=${CHAPTER} locale=${LOCALE} (${LANG.english})`);

  const sourceRaw = await readFile(SOURCE_PATH, 'utf-8');
  const source = JSON.parse(sourceRaw);
  console.log(`[translate] source: ${source.length} verses`);

  await mkdir(OUT_DIR, { recursive: true });
  let existing = [];
  if ((await exists(OUT_PATH)) && !RETRANSLATE) {
    try {
      existing = JSON.parse(await readFile(OUT_PATH, 'utf-8'));
      console.log(`[translate] existing output has ${existing.length} verses, will reuse where present`);
    } catch (e) {
      console.warn(`[translate] could not parse existing output, ignoring: ${e.message}`);
    }
  }
  const existingById = new Map(existing.map((v) => [v.id, v]));

  // Translate meta first (cheap call, exits early if API broken)
  const metaRaw = JSON.parse(await readFile(META_PATH, 'utf-8'));
  const enMeta = metaRaw.en?.[String(CHAPTER)];
  if (!enMeta) throw new Error(`English meta missing for chapter ${CHAPTER}`);
  const localeMetaForChapter = metaRaw[LOCALE]?.[String(CHAPTER)];

  if (!localeMetaForChapter || RETRANSLATE) {
    console.log(`[translate] translating chapter meta`);
    const translatedMeta = await translateMeta(enMeta);
    metaRaw[LOCALE] = metaRaw[LOCALE] || {};
    metaRaw[LOCALE][String(CHAPTER)] = translatedMeta;
    await writeFile(META_PATH, JSON.stringify(metaRaw, null, 2) + '\n');
    console.log(`[translate] meta written for ${LOCALE}/${CHAPTER}`);
  } else {
    console.log(`[translate] meta already translated for ${LOCALE}/${CHAPTER}, skipping`);
  }

  // Translate each verse
  const out = [];
  let translated = 0;
  let reused = 0;
  for (let i = 0; i < source.length; i++) {
    const v = source[i];
    const have = existingById.get(v.id);
    if (have && !RETRANSLATE) {
      out.push(have);
      reused++;
      continue;
    }
    const tag = `${v.chapter}.${v.verse}`;
    process.stdout.write(`[translate] ${tag} (${i + 1}/${source.length}) ... `);
    const t0 = Date.now();
    try {
      const t = await translateVerse(v);
      out.push(t);
      translated++;
      // Persist incrementally so a mid-chapter failure doesn't lose work
      await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + '\n');
      console.log(`ok (${Date.now() - t0}ms)`);
    } catch (e) {
      console.log(`FAIL (${e.message})`);
      throw e;
    }
  }

  console.log(`[translate] done. translated=${translated} reused=${reused} total=${out.length}`);
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + '\n');
}

main().catch((e) => {
  console.error(`[translate] FATAL: ${e.message}`);
  process.exit(1);
});
