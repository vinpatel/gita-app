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
  vishishtadvaita: 'Vishisht.',
  dvaita: 'Dvaita',
  bhakti: 'Bhakti',
  'kashmir-shaivism': 'Kashmir',
  shuddhadvaita: 'Shuddha.',
  'karma-yoga': 'Karma',
  'practical-vedanta': 'Practical',
};

export default function CommentaryTabs({ commentaries }: { commentaries: Commentary[] }) {
  const [active, setActive] = useState(0);
  const current = commentaries[active];

  return (
    <div>
      {/* Tab grid — 4 columns on mobile, wraps nicely for 8 traditions */}
      <div
        class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2 mb-5"
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
              px-2 py-2.5 sm:py-2.5 rounded-xl text-center transition-all duration-200 cursor-pointer leading-tight
              ${i === active
                ? 'bg-[var(--color-saffron)] text-white shadow-sm'
                : 'bg-[var(--color-warm-50)] text-[var(--color-warm-500)] hover:bg-[var(--color-warm-100)] hover:text-[var(--color-warm-700)]'
              }
            `}
          >
            <span class="text-[11px] sm:text-xs font-medium block">
              <span class="md:hidden">{traditionShort[c.tradition] ?? c.tradition}</span>
              <span class="hidden md:inline">{traditionLabels[c.tradition] ?? c.tradition}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Active panel — constrained height with scroll on small screens */}
      {current && (
        <div
          id={`panel-${current.tradition}`}
          role="tabpanel"
          class="rounded-2xl bg-white/60 border border-[var(--color-warm-100)] p-5 sm:p-8 shadow-sm animate-fade-in max-h-[60vh] sm:max-h-[70vh] overflow-y-auto"
        >
          <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-4">
            <span class="font-[var(--font-display)] text-lg text-[var(--color-warm-900)]">
              {traditionLabels[current.tradition] ?? current.tradition}
            </span>
            <span class="text-sm italic text-[var(--color-warm-500)]">{current.teacher}</span>
          </div>
          <p class="text-base text-[var(--color-warm-700)] leading-[1.85]">
            {current.text}
          </p>
        </div>
      )}
    </div>
  );
}
