import { useState } from 'react';
import { useFilters } from '../contexts/FilterContext';

export default function FilterPanel() {
  const { filters, updateFilter, clearFilters } = useFilters();
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    bedsBaths: true,
    type: true,
    features: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Multi-Family'];
  const featuresList = ['Pool', 'Garage', 'Fireplace', 'Garden', 'Smart Home', 'Ocean View'];
  const cities = ['Miami Beach', 'Chicago', 'Austin', 'Seattle', 'Malibu', 'Denver', 'Brooklyn', 'San Jose'];

  const formatPrice = (price) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  };

  const FilterSection = ({ title, section, children }) => (
    <div style={{
      marginBottom: '1.5rem',
      borderBottom: '1px solid var(--border-color)',
      paddingBottom: '1.5rem',
    }}>
      <button
        onClick={() => toggleSection(section)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: '0 0 1rem 0',
          cursor: 'pointer',
          color: 'var(--text-primary)',
        }}
      >
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          margin: 0,
        }}>
          {title}
        </h3>
        <i className={`fas fa-chevron-${expandedSections[section] ? 'up' : 'down'}`}
          style={{
            transition: 'transform var(--transition-fast)',
            color: 'var(--text-secondary)',
          }}
        ></i>
      </button>
      {expandedSections[section] && (
        <div style={{
          animation: 'fadeInUp 0.3s ease-out',
        }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="filter-panel" style={{
      width: '100%',
      maxWidth: '360px',
      boxSizing: 'border-box',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      position: 'sticky',
      top: '100px',
      boxShadow: 'var(--shadow-md)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: 0,
          color: 'var(--text-primary)',
        }}>
          <i className="fas fa-sliders-h" style={{ marginRight: '0.5rem', color: 'var(--accent)' }}></i>
          Filters
        </h2>
        <button
          onClick={clearFilters}
          style={{
            background: 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--text-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--danger)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <i className="fas fa-times"></i> Clear All
        </button>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="range"
            min="0"
            max="10000000"
            step="50000"
            value={filters.priceMax}
            onChange={(e) => updateFilter('priceMax', parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent)',
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}>
            <span>{formatPrice(filters.priceMin)}</span>
            <span style={{ color: 'var(--accent)', fontWeight: '600' }}>
              {formatPrice(filters.priceMax)}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Bedrooms & Bathrooms */}
      <FilterSection title="Beds & Baths" section="bedsBaths">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
          }}>
            Bedrooms
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
          }}>
            {[null, 1, 2, 3, 4, 5].map((num) => (
              <button
                key={num ?? 'any'}
                onClick={() => updateFilter('bedrooms', num)}
                style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: filters.bedrooms === num ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  background: filters.bedrooms === num ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: filters.bedrooms === num ? 'white' : 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (filters.bedrooms !== num) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.bedrooms !== num) {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                {num ? `${num}+` : 'Any'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
          }}>
            Bathrooms
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
          }}>
            {[null, 1, 2, 3, 4].map((num) => (
              <button
                key={num ?? 'any'}
                onClick={() => updateFilter('bathrooms', num)}
                style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: filters.bathrooms === num ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                  background: filters.bathrooms === num ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: filters.bathrooms === num ? 'white' : 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {num ? `${num}+` : 'Any'}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type" section="type">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          {propertyTypes.map((type) => (
            <label
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.propertyTypes, type]
                    : filters.propertyTypes.filter(t => t !== type);
                  updateFilter('propertyTypes', newTypes);
                }}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--accent)',
                  cursor: 'pointer',
                }}
              />
              <span style={{
                fontWeight: '500',
                color: 'var(--text-primary)',
              }}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features" section="features">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          {featuresList.map((feature) => (
            <label
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={(e) => {
                  const newFeatures = e.target.checked
                    ? [...filters.features, feature]
                    : filters.features.filter(f => f !== feature);
                  updateFilter('features', newFeatures);
                }}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--accent)',
                  cursor: 'pointer',
                }}
              />
              <span style={{
                fontWeight: '500',
                color: 'var(--text-primary)',
              }}>
                {feature}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sort By */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
        }}>
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="bedrooms">Most Bedrooms</option>
          <option value="sqft">Largest First</option>
        </select>
      </div>
    </div>
  );
}