// src/content.config.ts
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const shlokaSchema = z.object({
  id: z.string(),                    // "BG-1.1" format — required by file() loader
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
      tradition: z.enum(['advaita', 'vishishtadvaita', 'bhakti']),
      teacher: z.string(),
      text: z.string().min(50),
    })
  ).min(2).max(3),
  applications: z.object({
    personal_growth: z.string().min(30),
    career_business: z.string().min(30),
    health: z.string().min(30),
    relationships: z.string().min(30),
  }),
  themes: z.array(z.string()).min(1),
});

export type Shloka = z.infer<typeof shlokaSchema>;

const chapters = defineCollection({
  loader: file('src/data/chapters/chapter-01.json'),
  schema: shlokaSchema,
});

export const collections = { chapters };
