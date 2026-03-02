import { useState } from 'preact/hooks';

interface ApplicationsData {
  applications: Record<string, string>;
  questions: Record<string, string[]>;
}

const pillarMeta: Record<string, { label: string; icon: string }> = {
  personal_growth: { label: 'Personal Growth', icon: '\u2728' },
  career_business: { label: 'Career & Business', icon: '\u25B2' },
  health: { label: 'Health & Wellness', icon: '\u25CB' },
  relationships: { label: 'Relationships', icon: '\u2661' },
};

const pillarKeys = ['personal_growth', 'career_business', 'health', 'relationships'];

export default function ApplicationCards({ applications, questions }: ApplicationsData) {
  const [active, setActive] = useState(0);
  const key = pillarKeys[active];
  const meta = pillarMeta[key];
  const appText = applications[key];
  const qList = questions[key] ?? [];

  return (
    <div>
      {/* Pillar selector */}
      <div class="grid grid-cols-4 gap-2 mb-6" role="tablist" aria-label="Life application pillars">
        {pillarKeys.map((k, i) => {
          const m = pillarMeta[k];
          return (
            <button
              key={k}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              class={`
                flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all duration-200 cursor-pointer
                ${i === active
                  ? 'bg-[var(--color-saffron)]/10 border border-[var(--color-saffron)]/30 text-[var(--color-saffron)]'
                  : 'bg-[var(--color-warm-50)] border border-transparent text-[var(--color-warm-400)] hover:bg-[var(--color-warm-100)] hover:text-[var(--color-warm-600)]'
                }
              `}
            >
              <span class="text-lg leading-none">{m.icon}</span>
              <span class="text-[11px] sm:text-xs font-medium tracking-wide leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Application content */}
      <div class="animate-fade-in" key={key}>
        <div class="rounded-2xl bg-white/60 border border-[var(--color-warm-100)] p-6 sm:p-8 shadow-sm mb-4">
          <h3 class="font-[var(--font-display)] text-lg text-[var(--color-warm-900)] mb-3">
            {meta.label}
          </h3>
          <p class="text-base text-[var(--color-warm-700)] leading-[1.85]">
            {appText}
          </p>
        </div>

        {/* Questions */}
        {qList.length > 0 && (
          <div class="rounded-2xl bg-[var(--color-warm-50)]/60 border border-[var(--color-warm-100)] p-6 sm:p-8">
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-warm-400)] mb-4">
              Questions this verse answers
            </p>
            <ul class="space-y-3">
              {qList.map((q, i) => (
                <li key={i} class="flex items-start gap-3">
                  <span class="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[var(--color-saffron)]/10 flex items-center justify-center">
                    <span class="text-[10px] text-[var(--color-saffron)] font-medium">?</span>
                  </span>
                  <span class="text-sm text-[var(--color-warm-600)] leading-relaxed italic">
                    "{q}"
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
