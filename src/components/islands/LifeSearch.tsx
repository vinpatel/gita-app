import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import Fuse from 'fuse.js';

interface IndexEntry {
  q: string;
  c: number;
  v: number;
  t: string[];
  e: string;
  p: string;
}

interface VerseGroup {
  c: number;
  v: number;
  e: string;
  t: string[];
  matchedQuestions: string[];
  bestScore: number;
}

interface Props {
  baseUrl: string;
  compact?: boolean;
}

const CURATED_THEMES = [
  'grief', 'anger', 'decision-making', 'anxiety',
  'purpose', 'duty', 'fear', 'attachment',
  'letting go', 'self-doubt', 'confusion', 'motivation',
];

const FUSE_OPTIONS: Fuse.IFuseOptions<IndexEntry> = {
  keys: [{ name: 'q', weight: 1 }],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
};

const PILLAR_LABELS: Record<string, string> = {
  personal_growth: 'Personal Growth',
  career_business: 'Career & Business',
  health: 'Health & Wellbeing',
  relationships: 'Relationships',
  theme: 'Theme',
};

function groupByVerse(hits: Fuse.FuseResult<IndexEntry>[]): VerseGroup[] {
  const map = new Map<string, VerseGroup>();
  for (const hit of hits) {
    const item = hit.item;
    const key = `${item.c}-${item.v}`;
    const existing = map.get(key);
    if (existing) {
      if (!existing.matchedQuestions.includes(item.q)) {
        existing.matchedQuestions.push(item.q);
      }
      if ((hit.score ?? 1) < existing.bestScore) {
        existing.bestScore = hit.score ?? 1;
      }
    } else {
      map.set(key, {
        c: item.c,
        v: item.v,
        e: item.e,
        t: item.t,
        matchedQuestions: [item.q],
        bestScore: hit.score ?? 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.bestScore - b.bestScore);
}

export default function LifeSearch({ baseUrl, compact = false }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VerseGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const fuseRef = useRef<Fuse<IndexEntry> | null>(null);
  const allQuestionsRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadIndex = useCallback(async () => {
    if (fuseRef.current) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}search-index.json`);
      const data: IndexEntry[] = await res.json();
      fuseRef.current = new Fuse(data, FUSE_OPTIONS);
      // Collect unique questions for typeahead
      const qSet = new Set<string>();
      for (const entry of data) {
        qSet.add(entry.q);
      }
      allQuestionsRef.current = Array.from(qSet);
      setIndexLoaded(true);
    } catch (err) {
      console.error('[LifeSearch] Failed to load search index:', err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  const performSearch = useCallback((searchQuery: string, closeSuggestions = false) => {
    if (searchQuery.length < 2 || !fuseRef.current) {
      setResults([]);
      setSearchPerformed(false);
      return;
    }
    const hits = fuseRef.current.search(searchQuery, { limit: 200 });
    const grouped = groupByVerse(hits);
    setResults(grouped);
    setSearchPerformed(true);
    if (closeSuggestions) {
      setShowSuggestions(false);
    }
  }, []);

  const updateSuggestions = useCallback((value: string) => {
    if (value.length < 2 || allQuestionsRef.current.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lower = value.toLowerCase();
    const matched = allQuestionsRef.current
      .filter((q) => q.toLowerCase().includes(lower))
      .slice(0, 8);
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
    setActiveSuggestion(-1);
  }, []);

  const handleInput = useCallback((value: string) => {
    setQuery(value);
    updateSuggestions(value);

    // Debounce search results
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [updateSuggestions, performSearch]);

  const selectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    performSearch(suggestion, true);
  }, [performSearch]);

  const handlePillClick = useCallback((theme: string) => {
    setQuery(theme);
    loadIndex().then(() => {
      performSearch(theme, true);
    });
  }, [loadIndex, performSearch]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (showSuggestions && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveSuggestion((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeSuggestion >= 0) {
            selectSuggestion(suggestions[activeSuggestion]);
          } else {
            performSearch(query, true);
          }
        } else if (e.key === 'Escape') {
          setShowSuggestions(false);
          setActiveSuggestion(-1);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(query, true);
      }
    },
    [showSuggestions, suggestions, activeSuggestion, selectSuggestion, performSearch, query]
  );

  const handleFocus = () => {
    loadIndex();
  };

  // If compact mode (homepage), redirect to /explore/ with query
  if (compact) {
    return (
      <div class="w-full max-w-xl mx-auto">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-400)] pointer-events-none" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" stroke-width="1.5"/>
              <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Ask a life question… e.g. 'How do I deal with anger?'"
            aria-label="Search Gita verses by life question"
            onFocus={() => { window.location.href = `${baseUrl}explore/`; }}
            class="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-[var(--color-warm-200)] bg-white/90 text-[var(--color-warm-900)] placeholder-[var(--color-warm-400)] shadow-sm cursor-pointer hover:border-[var(--color-saffron)]/40 transition-all"
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} class="w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-400)] pointer-events-none" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Ask a life question… e.g. 'I feel overwhelmed' or 'how to let go'"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
          aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined}
          aria-label="Search Gita verses by life question"
          autocomplete="off"
          spellcheck={false}
          onInput={(e) => handleInput((e.target as HTMLInputElement).value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          class="w-full pl-11 pr-12 py-4 text-base rounded-2xl border border-[var(--color-warm-200)] bg-white/90 text-[var(--color-warm-900)] placeholder-[var(--color-warm-400)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-saffron)]/40 focus:border-[var(--color-saffron)]/60 transition-all"
        />
        {isLoading && (
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-400)]" aria-live="polite">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="animate-spin">
              <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="22 10"/>
            </svg>
          </span>
        )}
        {query.length > 0 && !isLoading && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setSearchPerformed(false); setSuggestions([]); setShowSuggestions(false); inputRef.current?.focus(); }}
            class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-400)] hover:text-[var(--color-warm-600)] transition-colors"
            aria-label="Clear search"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 5L13 13M13 5L5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Typeahead suggestions dropdown */}
      {showSuggestions && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label="Question suggestions"
          class="absolute z-50 mt-2 w-full max-w-2xl rounded-xl bg-white border border-[var(--color-warm-100)] shadow-lg overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              id={`suggestion-${i}`}
              aria-selected={i === activeSuggestion}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
              class={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                i === activeSuggestion
                  ? 'bg-[var(--color-saffron)]/8 text-[var(--color-warm-900)]'
                  : 'text-[var(--color-warm-700)] hover:bg-[var(--color-warm-50)]'
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* Theme pills — shown when no search yet */}
      {!searchPerformed && !showSuggestions && indexLoaded && (
        <div class="mt-6 flex flex-wrap justify-center gap-2">
          {CURATED_THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => handlePillClick(theme)}
              class="px-3.5 py-1.5 text-sm rounded-full bg-[var(--color-warm-50)] border border-[var(--color-warm-200)] text-[var(--color-warm-600)] hover:bg-[var(--color-saffron)]/10 hover:border-[var(--color-saffron)]/30 hover:text-[var(--color-saffron)] transition-colors cursor-pointer"
            >
              {theme}
            </button>
          ))}
        </div>
      )}

      {/* Results — all matching verses shown inline */}
      {searchPerformed && (
        <div class="mt-8">
          {results.length === 0 ? (
            <p class="text-center text-[var(--color-warm-400)] py-8">
              No matching verses found. Try a different question or browse the{' '}
              <a href={baseUrl} class="text-[var(--color-saffron)] hover:underline">chapters</a>.
            </p>
          ) : (
            <>
              <p class="text-sm text-[var(--color-warm-400)] mb-4">
                {results.length} verse{results.length !== 1 ? 's' : ''} found
              </p>
              <div class="space-y-4">
                {results.map((verse) => (
                  <a
                    key={`${verse.c}-${verse.v}`}
                    href={`${baseUrl}verse/${verse.c}/${verse.v}/`}
                    class="block rounded-xl border border-[var(--color-warm-100)] bg-white p-5 hover:border-[var(--color-saffron)]/40 hover:shadow-md transition-all group"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-saffron)] mb-1.5">
                          Chapter {verse.c}, Verse {verse.v}
                        </p>
                        <p class="text-[var(--color-warm-800)] leading-relaxed mb-3">
                          {verse.e}
                        </p>

                        {/* Matched questions — why this verse is relevant */}
                        <div class="space-y-1 mb-3">
                          {verse.matchedQuestions.slice(0, 3).map((mq) => (
                            <p key={mq} class="text-sm text-[var(--color-warm-500)] flex items-start gap-2">
                              <span class="text-[var(--color-saffron)] mt-0.5 shrink-0">&#8250;</span>
                              <span>{mq}</span>
                            </p>
                          ))}
                          {verse.matchedQuestions.length > 3 && (
                            <p class="text-xs text-[var(--color-warm-400)] pl-5">
                              +{verse.matchedQuestions.length - 3} more related questions
                            </p>
                          )}
                        </div>

                        {/* Theme tags */}
                        {verse.t.length > 0 && (
                          <div class="flex flex-wrap gap-1.5">
                            {verse.t.slice(0, 5).map((theme) => (
                              <span
                                key={theme}
                                class="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-[var(--color-warm-50)] text-[var(--color-warm-500)] border border-[var(--color-warm-100)]"
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <span class="text-[var(--color-warm-300)] group-hover:text-[var(--color-saffron)] transition-colors mt-1 shrink-0">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
