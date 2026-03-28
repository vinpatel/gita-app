import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('chapters');

  const index = entries.map((entry) => {
    const d = entry.data;
    return {
      id: d.id,
      c: d.chapter,
      v: d.verse,
      q: [
        ...(d.questions.personal_growth ?? []),
        ...(d.questions.career_business ?? []),
        ...(d.questions.health ?? []),
        ...(d.questions.relationships ?? []),
      ],
      t: d.themes,
      e: d.explanation.slice(0, 200),
    };
  });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
