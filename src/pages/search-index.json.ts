import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('chapters');

  // Flatten: one entry per question string for precise free-text matching
  const index: Array<{
    q: string;
    c: number;
    v: number;
    t: string[];
    e: string;
    p: string; // pillar: personal_growth, career_business, health, relationships
  }> = [];

  const pillars = ['personal_growth', 'career_business', 'health', 'relationships'] as const;

  for (const entry of entries) {
    const d = entry.data;
    const verseBase = {
      c: d.chapter,
      v: d.verse,
      t: d.themes,
      e: d.explanation.slice(0, 200),
    };

    for (const pillar of pillars) {
      const questions = d.questions[pillar] ?? [];
      for (const q of questions) {
        index.push({ ...verseBase, q, p: pillar });
      }
    }

    // Also index themes as searchable questions
    for (const theme of d.themes) {
      index.push({ ...verseBase, q: theme, p: 'theme' });
    }
  }

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
