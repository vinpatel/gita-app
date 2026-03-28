import { useState, useRef, useCallback } from 'preact/hooks';
import Fuse from 'fuse.js';

interface IndexEntry {
  id: string;
  c: number;
  v: number;
  q: string[];
  t: string[];
  e: string;
}

interface Props {
  baseUrl: string;
}

const CURATED_THEMES = [
  'grief',
  'anger',
  'decision-making',
  'anxiety',
  'purpose',
  'duty',
  'fear',
  'attachment',
];

const FUSE_OPTIONS: Fuse.IFuseOptions<IndexEntry> = {
  keys: [
    { name: 'q', weight: 3 },
    { name: 't', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 3,
  includeScore: true,
  shouldSort: true,
};

export default function LifeSearch({ baseUrl }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fuse.FuseResult<IndexEntry>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const fuseRef = useRef<Fuse<IndexEntry> | null>(null);

  const loadIndex = useCallback(async () => {
    if (fuseRef.current) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}search-index.json`);
      const data: IndexEntry[] = await res.json();
      fuseRef.current = new Fuse(data, FUSE_OPTIONS);
    } catch (err) {
      console.error('[LifeSearch] Failed to load search index:', err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (value.length < 3 || !fuseRef.current) {
      setResults([]);
      setIsOpen(value.length === 0 ? false : false);
      return;
    }
    const hits = fuseRef.current.search(value, { limit: 8 });
    setResults(hits);
    setIsOpen(hits.length > 0);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && results[activeIndex]) {
          const item = results[activeIndex].item;
          window.location.href = `${baseUrl}verse/${item.c}/${item.v}/`;
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [isOpen, results, activeIndex, baseUrl]
  );

  const handleFocus = () => {
    loadIndex();
    if (query.length === 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow clicks on results
    setTimeout(() => {
      setIsOpen(false);
      setActiveIndex(-1);
    }, 200);
  };

  const handlePillClick = (theme: string) => {
    setQuery(theme);
    loadIndex().then(() => {
      if (fuseRef.current) {
        const hits = fuseRef.current.search(theme, { limit: 8 });
        setResults(hits);
        setIsOpen(hits.length > 0);
      }
    });
  };

  const showPills = isOpen && query.length === 0;
  const showResults = isOpen && results.length > 0;

  return (
    <div class="relative w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-400)] pointer-events-none" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          value={query}
          placeholder="Ask a life question… e.g. 'I feel overwhelmed' or 'grief'"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          aria-label="Search Gita verses by life question"
          autocomplete="off"
          spellcheck={false}
          onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          class="w-full pl-11 pr-12 py-4 text-base rounded-2xl border border-[var(--color-warm-200)] bg-white/90 text-[var(--color-warm-900)] placeholder-[var(--color-warm-400)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-saffron)]/40 focus:border-[var(--color-saffron)]/60 transition-all"
        />
        {isLoading && (
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-400)]" aria-live="polite" aria-label="Loading search index">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="animate-spin" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="22 10"/>
            </svg>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {(showPills || showResults) && (
        <div
          id="search-results"
          role="listbox"
          aria-label="Search suggestions"
          class="absolute z-50 mt-2 w-full rounded-2xl bg-white border border-[var(--color-warm-100)] shadow-lg overflow-hidden"
        >
          {/* Curated theme pills (shown when no query) */}
          {showPills && (
            <div class="p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-[var(--color-warm-400)] mb-3">
                Common life questions
              </p>
              <div class="flex flex-wrap gap-2">
                {CURATED_THEMES.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handlePillClick(theme);
                    }}
                    class="px-3 py-1.5 text-sm rounded-full bg-[var(--color-warm-50)] border border-[var(--color-warm-200)] text-[var(--color-warm-600)] hover:bg-[var(--color-saffron)]/10 hover:border-[var(--color-saffron)]/30 hover:text-[var(--color-saffron)] transition-colors cursor-pointer"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {showResults && (
            <ul class="py-2 divide-y divide-[var(--color-warm-50)]">
              {results.map((result, index) => {
                const item = result.item;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={item.id}
                    role="option"
                    id={`result-${index}`}
                    aria-selected={isActive}
                  >
                    <a
                      href={`${baseUrl}verse/${item.c}/${item.v}/`}
                      class={`block px-4 py-3 transition-colors ${
                        isActive
                          ? 'bg-[var(--color-saffron)]/8 text-[var(--color-warm-900)]'
                          : 'hover:bg-[var(--color-warm-50)] text-[var(--color-warm-800)]'
                      }`}
                      tabIndex={-1}
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-saffron)] mb-1">
                            Chapter {item.c}, Verse {item.v}
                          </p>
                          <p class="text-sm text-[var(--color-warm-700)] leading-relaxed line-clamp-2">
                            {item.e}
                          </p>
                        </div>
                      </div>
                      {item.t.length > 0 && (
                        <div class="flex flex-wrap gap-1.5 mt-2">
                          {item.t.slice(0, 3).map((theme) => (
                            <span
                              key={theme}
                              class="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-[var(--color-warm-100)] text-[var(--color-warm-500)]"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
