import { useState, useRef, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import MapView from './MapView';
import supabase from '../supabaseClient';
import { useFavorites } from '../contexts/FavoritesContext';

export default function SearchPanel() {
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const { addFavorite } = useFavorites();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [error, setError] = useState(null);

  // Suggestions and caching for instant results
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const cacheRef = useRef(new Map());

  const fetchResults = async (opts = {}) => {
    const cacheKey = `results:${q}|${city}|${priceMax}|${bedrooms}|${opts.page || 1}`;
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      setResults(cached.results);
      setTotal(cached.total);
      setPage(opts.page || 1);
      return;
    }

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    if (priceMax) params.set('priceMax', priceMax);
    if (bedrooms) params.set('bedrooms', bedrooms);
    params.set('perPage', opts.perPage || 12);
    params.set('page', opts.page || 1);

    setLoading(true);
    setError(null);
    try {
      let data, count;

      // Try Supabase first
      try {
        let query = supabase.from('properties').select('*', { count: 'exact' });

        if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%`);
        if (city) query = query.ilike('city', `%${city}%`);
        if (priceMax) query = query.lte('price', priceMax);
        if (bedrooms) query = query.gte('bedrooms', bedrooms);

        query = query.range((opts.page || 1) * (opts.perPage || 12) - (opts.perPage || 12), (opts.page || 1) * (opts.perPage || 12) - 1);

        const { data: sbData, error: sbError, count: sbCount } = await query;

        if (sbError) throw sbError;

        data = { hits: sbData.map(d => ({ document: d })), found: sbCount };
      } catch (sbErr) {
        console.warn('Supabase fetch failed, falling back to legacy API/Local:', sbErr);
        // Legacy API fallback (optional, or just go to local)
        const r = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4200'}/search?${params.toString()}`);
        if (!r.ok) throw new Error('Search API error');
        data = await r.json();
      }
      const hits = data.hits ? data.hits.map(h => h.document) : data.documents || [];
      setResults(hits);
      setTotal(data.found || hits.length);
      setPage(opts.page || 1);
      cacheRef.current.set(cacheKey, { results: hits, total: data.found || hits.length });
    } catch (err) {
      // Fallback to client side search using local dataset
      console.warn('Search API failed — falling back to local results', err.message);
      setError('Search service temporarily unavailable — showing local sample results.');
      const local = (await import('../data/properties')).properties || (await import('../data/properties')).default;
      let filtered = local;
      if (city) filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
      if (priceMax) filtered = filtered.filter(p => p.price <= parseInt(priceMax, 10));
      if (bedrooms) filtered = filtered.filter(p => p.bedrooms >= parseInt(bedrooms, 10));
      const slice = filtered.slice(0, opts.perPage || 12);
      setResults(slice);
      setTotal(filtered.length);
      setPage(opts.page || 1);
      cacheRef.current.set(cacheKey, { results: slice, total: filtered.length });
    } finally {
      setLoading(false);
    }
  };

  // Suggestions: lightweight client-side suggestions (fast UX)
  const fetchSuggestions = async (term) => {
    if (!term) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }
    const cacheKey = `sugg:${term}|${city}`;
    if (cacheRef.current.has(cacheKey)) {
      setSuggestions(cacheRef.current.get(cacheKey));
      setShowSuggestions(true);
      return;
    }
    const local = (await import('../data/properties')).properties || (await import('../data/properties')).default;
    const s = local.filter(p => `${p.title} ${p.description}`.toLowerCase().includes(term.toLowerCase()) || (p.city && p.city.toLowerCase().includes(term.toLowerCase()))).slice(0, 5);
    cacheRef.current.set(cacheKey, s);
    setSuggestions(s);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  // Debounced instant search & suggestions
  const debounceRef = useRef(null);
  const triggerSearchDebounced = (delay = 500) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(q);
      fetchResults({ page: 1 });
    }, delay);
  };

  // auto-search on input changes
  useEffect(() => {
    triggerSearchDebounced(600);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, city, priceMax, bedrooms]);

  // support Enter key to run immediate search + navigate suggestions
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        const sel = suggestions[highlightedIndex];
        setQ(sel.title);
        setShowSuggestions(false);
        fetchResults({ page: 1 });
        return;
      }
      if (debounceRef.current) clearTimeout(debounceRef.current);
      fetchResults({ page: 1 });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showSuggestions) {
        fetchSuggestions(q);
      }
      setHighlightedIndex(i => (i < suggestions.length - 1 ? i + 1 : 0));
      setShowSuggestions(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => fetchSuggestions(q)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search text (title, description)"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          style={{ flex: '1', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => fetchSuggestions(q)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="City"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          style={{ width: '180px', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <input
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => fetchSuggestions(q)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Max price"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          style={{ width: '140px', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <input
          value={bedrooms}
          onChange={e => setBedrooms(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => fetchSuggestions(q)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Bedrooms"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
          style={{ width: '120px', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <button onClick={() => fetchResults({ page: 1 })} style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none' }}>Search</button>
      </div>

      {/* Live region for announcements (accessible) */}
      <div aria-live="polite" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        {loading ? 'Searching…' : error ? error : (total !== null ? `${total} results` : (results.length ? `${results.length} results` : ''))}
      </div>

      {/* Suggestions dropdown for instant results */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }} >
          <ul id="search-suggestions" role="listbox" aria-label="Suggestions" style={{ listStyle: 'none', margin: 0, padding: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-primary)', maxWidth: '72rem' }}>
            {suggestions.map((s, idx) => (
              <li
                key={s.id}
                role="option"
                aria-selected={highlightedIndex === idx}
                onMouseDown={(e) => { e.preventDefault(); setQ(s.title); setShowSuggestions(false); fetchResults({ page: 1 }); }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{ padding: '0.5rem', background: highlightedIndex === idx ? 'var(--accent)' : 'transparent', color: highlightedIndex === idx ? '#fff' : 'inherit', cursor: 'pointer' }}
              >
                <strong>{s.title}</strong> <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>{s.city}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        <div>
          {loading && <p>Loading…</p>}
          {!loading && results.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No results yet — try a search.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {results.map(p => (
              <div key={p.id}>
                <PropertyCard property={p} onViewDetails={(prop) => setSelectedProperty(prop)} />
              </div>
            ))}
          </div>
          {total !== null && total > results.length && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button onClick={() => fetchResults({ page: page + 1 })} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>Show more</button>
            </div>
          )}
        </div>

        <div style={{
          position: 'sticky',
          top: '120px',
          height: 'fit-content'
        }}>
          <MapView properties={results} onMarkerClick={(p) => setSelectedProperty(p)} />

          {/* Modal */}
          {selectedProperty && (
            <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)' }}>
              <h3>
                {selectedProperty.verified && <i className="fas fa-check-circle" style={{ color: 'var(--info)', marginRight: '0.5rem' }} title="Verified Listing"></i>}
                {selectedProperty.title} — {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(selectedProperty.price)}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>{selectedProperty.address} {selectedProperty.city ? '• ' + selectedProperty.city : ''}</p>
              <p>{selectedProperty.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={() => { addFavorite(selectedProperty.id); }} style={{ padding: '0.6rem 0.9rem', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none' }}>Add to Favorites</button>
                <button onClick={() => { window.open(`https://wa.me/?text=I am interested in ${selectedProperty.title}`, '_blank'); }} style={{ padding: '0.6rem 0.9rem', borderRadius: '8px', border: 'none', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fab fa-whatsapp"></i> Contact Verified Agent
                </button>
                <button onClick={() => setSelectedProperty(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
