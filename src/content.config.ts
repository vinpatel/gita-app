// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const shlokaSchema = z.object({
  id: z.string(),                    // "BG-1.1" format — required by loader
  chapter: z.number().int().min(1).max(18),
  verse: z.number().int().min(1),
  sanskrit: z.string().regex(/[\u0900-\u097F]/, {
    message: 'Sanskrit field must contain Devanagari script (U+0900-U+097F)',
  }),
  iast: z.string().regex(/[āīūṛṝḷṃḥṅñṭḍṇśṣĀĪŪṚṜḶṂḤṄÑṬḌṆŚṢ]/, {
    message: 'IAST field must use IAST diacritics (ā, ī, ū, ṛ, ṃ, ḥ, etc.) — Harvard-Kyoto not accepted',
  }),
  explanation: z.string().min(50),
  synthesis: z.string().min(100),
  commentaries: z.array(
    z.object({
      tradition: z.enum([
        'advaita',              // Adi Shankaracharya — non-dualism
        'vishishtadvaita',      // Ramanujacharya — qualified non-dualism
        'dvaita',               // Madhvacharya — dualism
        'bhakti',               // Broad devotional traditions
        'kashmir-shaivism',     // Abhinavagupta
        'shuddhadvaita',       // Vallabhacharya — pure non-dualism
        'karma-yoga',           // Tilak, Gandhi — action-oriented
        'practical-vedanta',    // Vivekananda — universal application
      ]),
      teacher: z.string(),
      text: z.string().min(50),
    })
  ).min(3).max(8),
  applications: z.object({
    personal_growth: z.string().min(30),
    career_business: z.string().min(30),
    health: z.string().min(30),
    relationships: z.string().min(30),
  }),
  questions: z.object({
    personal_growth: z.array(z.string()).min(1),
    career_business: z.array(z.string()).min(1),
    health: z.array(z.string()).min(1),
    relationships: z.array(z.string()).min(1),
  }),
  themes: z.array(z.string()).min(1),
});

export type Shloka = z.infer<typeof shlokaSchema>;

// Custom loader: reads all chapter-*.json files from src/data/chapters/
const chapters = defineCollection({
  loader: {
    name: 'chapters-loader',
    load: async ({ store, logger }) => {
      const dir = 'src/data/chapters';
      const files = (await readdir(dir))
        .filter((f) => f.startsWith('chapter-') && f.endsWith('.json'))
        .sort();

      for (const f of files) {
        const raw = await readFile(join(dir, f), 'utf-8');
        const entries = JSON.parse(raw);
        for (const entry of entries) {
          store.set({ id: entry.id, data: entry });
        }
        logger.info(`Loaded ${entries.length} verses from ${f}`);
      }
    },
  },
  schema: shlokaSchema,
});

export const collections = { chapters };
