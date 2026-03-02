import { useState } from 'preact/hooks';

interface Commentary {
  tradition: string;
  teacher: string;
  text: string;
}

const traditionLabels: Record<string, string> = {
  advaita: 'Advaita Vedanta',
  vishishtadvaita: 'Vishishtadvaita',
  dvaita: 'Dvaita',
  bhakti: 'Bhakti',
  'kashmir-shaivism': 'Kashmir Shaivism',
  shuddhadvaita: 'Shuddhadvaita',
  'karma-yoga': 'Karma Yoga',
  'practical-vedanta': 'Practical Vedanta',
};

const traditionShort: Record<string, string> = {
  advaita: 'Advaita',
  vishishtadvaita: 'Vishishtadvaita',
  dvaita: 'Dvaita',
  bhakti: 'Bhakti',
  'kashmir-shaivism': 'Kashmir Shaivism',
  shuddhadvaita: 'Shuddhadvaita',
  'karma-yoga': 'Karma Yoga',
  'practical-vedanta': 'Practical Vedanta',
};

export default function CommentaryTabs({ commentaries }: { commentaries: Commentary[] }) {
  const [active, setActive] = useState(0);
  const current = commentaries[active];

  return (
    <div>
      {/* Tab bar — scrollable on mobile */}
      <div
        class="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide"
        role="tablist"
        aria-label="Commentary traditions"
      >
        {commentaries.map((c, i) => (
          <button
            key={c.tradition}
            role="tab"
            aria-selected={i === active}
            aria-controls={`panel-${c.tradition}`}
            onClick={() => setActive(i)}
            class={`
              shrink-0 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer
              ${i === active
                ? 'bg-[var(--color-saffron)] text-white shadow-sm'
                : 'bg-[var(--color-warm-50)] text-[var(--color-warm-500)] hover:bg-[var(--color-warm-100)] hover:text-[var(--color-warm-700)]'
              }
            `}
          >
            <span class="hidden sm:inline">{traditionLabels[c.tradition] ?? c.tradition}</span>
            <span class="sm:hidden">{traditionShort[c.tradition] ?? c.tradition}</span>
          </button>
        ))}
      </div>

      {/* Active panel */}
      {current && (
        <div
          id={`panel-${current.tradition}`}
          role="tabpanel"
          class="rounded-2xl bg-white/60 border border-[var(--color-warm-100)] p-6 sm:p-8 shadow-sm animate-fade-in"
        >
          <div class="flex items-baseline gap-3 mb-4">
            <span class="font-[var(--font-display)] text-lg text-[var(--color-warm-900)]">
              {traditionLabels[current.tradition] ?? current.tradition}
            </span>
            <span class="text-[var(--color-warm-300)]">/</span>
            <span class="text-sm italic text-[var(--color-warm-500)]">{current.teacher}</span>
          </div>
          <p class="text-base text-[var(--color-warm-700)] leading-[1.85]">
            {current.text}
          </p>
        </div>
      )}

      {/* Dot indicators for mobile */}
      <div class="flex justify-center gap-1.5 mt-4 sm:hidden">
        {commentaries.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Commentary ${i + 1}`}
            class={`
              w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer
              ${i === active ? 'bg-[var(--color-saffron)] w-4' : 'bg-[var(--color-warm-300)]'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
