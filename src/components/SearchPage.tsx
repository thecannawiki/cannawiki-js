import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface SearchPageEntry {
  slug: string;
  title: string;
  terms: Record<string, number>;
  text: string;
}

interface SearchIndex {
  version: number;
  pages: SearchPageEntry[];
}

interface SearchResult {
  slug: string;
  title: string;
  snippet: React.ReactNode;
  score: number;
}

const SNIPPET_RADIUS = 120;

function normalizeQuery(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

function buildSnippet(text: string, matchedTerm: string): React.ReactNode {
  const idx = text.indexOf(matchedTerm);
  if (idx === -1) {
    const preview = text.slice(0, SNIPPET_RADIUS * 2);
    return preview + (text.length > preview.length ? '…' : '');
  }

  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(text.length, idx + matchedTerm.length + SNIPPET_RADIUS);
  const before = text.slice(start, idx);
  const match = text.slice(idx, idx + matchedTerm.length);
  const after = text.slice(idx + matchedTerm.length, end);

  return (
    <>
      {start > 0 && '…'}
      {before}
      <mark>{match}</mark>
      {after}
      {end < text.length && '…'}
    </>
  );
}

function searchPages(pages: SearchPageEntry[], queryTokens: string[]): SearchResult[] {
  if (queryTokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const page of pages) {
    const matchedTerms = queryTokens.filter((t) => t in page.terms);
    if (matchedTerms.length === 0) continue;

    const score = matchedTerms.reduce((sum, t) => sum + (page.terms[t] || 0), 0);
    const highlightTerm = matchedTerms.reduce((best, t) =>
      (page.terms[t] || 0) > (page.terms[best] || 0) ? t : best
    , matchedTerms[0]);

    results.push({
      slug: page.slug,
      title: page.title,
      snippet: buildSnippet(page.text, highlightTerm),
      score,
    });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });

  return results;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '');

  const query = searchParams.get('q') ?? '';

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load search index');
        return res.json();
      })
      .then((json: SearchIndex) => setIndex(json))
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const queryTokens = useMemo(() => normalizeQuery(query), [query]);

  const results = useMemo(() => {
    if (!index) return [];
    return searchPages(index.pages, queryTokens);
  }, [index, queryTokens]);

  const submitSearch = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(inputValue);
  };

  useEffect(() => {
    const trimmed = inputValue.trim();
    const timer = setTimeout(() => {
      const current = (searchParams.get('q') ?? '').trim();
      if (trimmed === current) return;
      if (trimmed) {
        setSearchParams({ q: trimmed });
      } else {
        setSearchParams({});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, searchParams, setSearchParams]);

  return (
    <div className="searchPage" style={containerStyle}>
      <h1>Search</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search the wiki…"
          aria-label="Search query"
          style={inputStyle}
          autoFocus
        />
      </form>

      {loadError && <p>Could not load search index.</p>}
      {!loadError && !index && <p>Loading search index…</p>}

  

      {index && query.trim() !== '' && queryTokens.length === 0 && (
        <p>No results — try longer keywords (at least 2 characters).</p>
      )}

      {index && queryTokens.length > 0 && results.length === 0 && (
        <p>No results for &ldquo;{query}&rdquo;.</p>
      )}

      {results.length > 0 && (
        <ul style={resultsListStyle}>
          {results.map((result) => (
            <li key={result.slug} style={resultItemStyle}>
              <h2 style={resultHeadingStyle}>
                <Link to={`/${result.slug}`}>{result.title}</Link>
              </h2>
              <p style={snippetStyle}>{result.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '660px',
  margin: '0 auto',
  padding: '0 28px 2rem 28px',
  width: '100%',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const resultsListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const resultItemStyle: React.CSSProperties = {
  marginBottom: '1.75rem',
};

const resultHeadingStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  margin: '0 0 0.35rem 0',
};

const snippetStyle: React.CSSProperties = {
  margin: 0,
  opacity: 0.85,
  lineHeight: 1.5,
};

export default SearchPage;
