import { useState, useRef, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { api } from '../services/api';
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
      const filters = {
        q,
        city,
        priceMax,
        bedrooms,
        page: opts.page || 1,
        perPage: opts.perPage || 12
      };

      const response = await api.fetchProperties(filters);

      setResults(response.data);
      setTotal(response.total);
      setPage(response.page);

      // Cache results
      cacheRef.current.set(cacheKey, { results: response.data, total: response.total });
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to load properties. Please try again.');
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Results Column */}
        <div>
          {loading && <p>Loading…</p>}
          {!loading && results.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No results yet — try a search.</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {results.map(p => (
              <div key={p.id}>
                <PropertyCard property={p} onViewDetails={(prop) => setSelectedProperty(prop)} />
              </div>
            ))}
          </div>

          {total !== null && total > results.length && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => fetchResults({ page: page + 1 })}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)'
                }}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal (Centered Overlay instead of side panel) */}
      {selectedProperty && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setSelectedProperty(null)}>
          <div style={{
            background: 'var(--bg-primary)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '1rem' }}>
              <img
                src={selectedProperty.images?.[0] || 'https://via.placeholder.com/600x400'}
                alt={selectedProperty.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <h3>
              {selectedProperty.verified && <i className="fas fa-check-circle" style={{ color: 'var(--info)', marginRight: '0.5rem' }} title="Verified Listing"></i>}
              {selectedProperty.title} — {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(selectedProperty.price)}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedProperty.area}, {selectedProperty.city}</p>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{selectedProperty.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div><strong>{selectedProperty.bedrooms}</strong> Beds</div>
              <div><strong>{selectedProperty.bathrooms}</strong> Baths</div>
              <div><strong>{selectedProperty.sqft}</strong> Sq Ft</div>
              <div><strong>{selectedProperty.propertyType}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                onClick={() => { addFavorite(selectedProperty.id); }}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontWeight: '600'
                }}
              >
                {/* Check if favorite logic would be nice here, but simple add is fine */}
                <i className="far fa-heart" style={{ marginRight: '0.5rem' }}></i> Save
              </button>
              <button
                onClick={() => { window.open(`https://wa.me/?text=I am interested in ${selectedProperty.title}`, '_blank'); }}
                style={{
                  flex: 2,
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--success)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: '600'
                }}
              >
                <i className="fab fa-whatsapp"></i> Contact Verified Agent
              </button>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
