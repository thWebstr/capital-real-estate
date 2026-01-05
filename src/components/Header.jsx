import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useFilters } from '../contexts/FilterContext';

export default function Header() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { favoritesCount } = useFavorites();
  const { searchQuery, setSearchQuery } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      background: isDark 
        ? 'rgba(15, 23, 42, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid var(--border-color)`,
      boxShadow: 'var(--shadow-md)',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem var(--space-lg)',
        gap: '2rem'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'transform var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: `linear-gradient(135deg, var(--accent), var(--secondary))`,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <i className="fas fa-home" style={{ color: 'white', fontSize: '1.25rem' }}></i>
          </div>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700',
              margin: 0,
              background: `linear-gradient(135deg, var(--accent), var(--secondary))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Capital
            </h1>
            <p style={{
              fontSize: '0.75rem',
              margin: 0,
              color: 'var(--text-secondary)',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}>
              REAL ESTATE
            </p>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div style={{
          flex: '1',
          maxWidth: '600px',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by city, address, or property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 3rem 0.75rem 3rem',
                borderRadius: 'var(--radius-full)',
                border: `2px solid var(--border-color)`,
                background: 'var(--bg-secondary)',
                fontSize: '0.95rem',
                transition: 'all var(--transition-fast)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = 'var(--shadow-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              fontSize: '1rem'
            }}></i>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Favorites */}
          <button
            style={{
              position: 'relative',
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-heart" style={{ fontSize: '1.1rem' }}></i>
            <span style={{
              display: window.innerWidth < 768 ? 'none' : 'inline',
              fontWeight: '500'
            }}>
              Favorites
            </span>
            {favoritesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--danger)',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                padding: '0.15rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                boxShadow: 'var(--shadow-md)',
                animation: 'pulse 2s infinite'
              }}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.65rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
              color: 'var(--text-primary)',
              width: '40px',
              height: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'rotate(180deg)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.transform = 'rotate(0deg)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} style={{ fontSize: '1.1rem' }}></i>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: window.innerWidth < 768 ? 'flex' : 'none',
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.65rem',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              width: '40px',
              height: '40px'
            }}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} style={{ fontSize: '1.1rem' }}></i>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {window.innerWidth < 768 && (
        <div style={{
          padding: '0 var(--space-lg) 1rem',
          borderTop: `1px solid var(--border-color)`
        }}>
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 3rem 0.75rem 3rem',
                borderRadius: 'var(--radius-full)',
                border: `2px solid var(--border-color)`,
                background: 'var(--bg-secondary)',
                fontSize: '0.95rem'
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }}></i>
          </div>
        </div>
      )}
    </header>
  );
}