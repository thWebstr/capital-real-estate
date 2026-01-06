import { useFavorites } from '../../contexts/FavoritesContext';
import { properties } from '../../data/properties';
import PropertyCard from '../PropertyCard';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  const favoriteProperties = properties.filter(property =>
    favorites.includes(property.id)
  );

  if (favoriteProperties.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <i className="fas fa-heart-broken" style={{
              fontSize: '4rem',
              color: 'white'
            }}></i>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            No Favorites Yet
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem'
          }}>
            Start exploring properties and click the heart icon to save your favorites here!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-search"></i>
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
        padding: '3rem 0',
        color: 'white'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '800',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <i className="fas fa-heart"></i>
                My Favorites
              </h1>
              <p style={{
                fontSize: '1.1rem',
                opacity: 0.9,
                margin: 0
              }}>
                {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>

            {favoriteProperties.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all favorites?')) {
                    clearFavorites();
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <i className="fas fa-trash-alt"></i>
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="container" style={{ margin: '3rem auto 6rem' }}>
        {/* Sorting Options */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Saved Properties
            </h2>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <label style={{
              color: 'var(--text-secondary)',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Sort by:
            </label>
            <select
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <option>Recently Added</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Bedrooms</option>
              <option>Square Footage</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {favoriteProperties.map((property, index) => (
            <div
              key={property.id}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Additional Actions */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Ready to take the next step?
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Schedule tours, request more information, or compare your favorite properties side by side.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-dark)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-calendar-alt"></i>
              Schedule Tours
            </button>
            <button
              style={{
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-balance-scale"></i>
              Compare Properties
            </button>
            <button
              style={{
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-share-alt"></i>
              Share List
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
