import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useFilters } from '../contexts/FilterContext';

export default function Header() {
  const { toggleTheme, isDark } = useTheme();
  const { favoritesCount } = useFavorites();
  const { searchQuery, setSearchQuery, isFilterOpen, toggleFilter, closeFilter } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // small debounce helper
  function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // Header show/hide on scroll
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      // Don't hide when mobile menu is open
      if (isMenuOpen) {
        setIsHidden(false);
        lastScrollY.current = window.scrollY;
        return;
      }

      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(() => {
          const current = window.scrollY;

          // Always show near top
          if (current <= 50) {
            setIsHidden(false);
          } else if (current > lastScrollY.current && current > 100) {
            // Scrolling down
            setIsHidden(true);
          } else if (current < lastScrollY.current) {
            // Scrolling up
            setIsHidden(false);
          }

          lastScrollY.current = current;
          ticking.current = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  // Resize handler (debounced) to switch mobile/desktop layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };
    const debounced = debounce(handleResize, 120);
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, []);

  useEffect(() => {
    const onClose = () => {
      if (isFilterOpen) closeFilter();
    };

    window.addEventListener('closeFilters', onClose);
    return () => window.removeEventListener('closeFilters', onClose);
  }, [isFilterOpen, closeFilter]);

  // Manage menu open: scroll-lock, outside-click, Escape key, and focus management
  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      if (toggleRef.current) toggleRef.current.focus();
      return;
    }

    document.body.style.overflow = 'hidden';

    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !toggleRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);

    // Move focus into the menu
    setTimeout(() => {
      if (menuRef.current) {
        const first = menuRef.current.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])');
        if (first) first.focus();
      }
    }, 0);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header
      aria-hidden={isHidden}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        background: isDark
          ? 'rgba(15, 23, 42, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid var(--border-color)`,
        boxShadow: isHidden ? 'none' : 'var(--shadow-md)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), background var(--transition-normal)',
        transform: isHidden ? 'translateY(-110%)' : 'translateY(0)',
        willChange: 'transform'
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
        {!isMobile && (
          <div style={{
            flex: '1',
            maxWidth: '600px'
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
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Favorites */}
          <Link
            to="/favorites"
            aria-label={`Favorites (${favoritesCount})`}
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
              color: 'var(--text-primary)',
              textDecoration: 'none'
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
            <i className="fas fa-heart" style={{ fontSize: '1.1rem' }} aria-hidden="true"></i>
            {!isMobile && (
              <span style={{ fontWeight: '500' }}>
                Favorites
              </span>
            )}
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
          </Link>

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

          {/* Mobile Filter Toggle */}
          {isMobile && (
            <button
              onClick={() => { toggleFilter(); setIsHidden(false); }}
              style={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.6rem',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                width: '40px',
                height: '40px',
                marginRight: '0.5rem'
              }}
              title="Filters"
            >
              <i className="fas fa-filter" style={{ fontSize: '1.05rem' }}></i>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              ref={toggleRef}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => { setIsMenuOpen(prev => !prev); setIsHidden(false); }}
              style={{
                background: isMenuOpen ? 'var(--accent)' : 'var(--bg-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.65rem',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: isMenuOpen ? 'white' : 'var(--text-primary)',
                width: '40px',
                height: '40px'
              }}
            >
              <span className={`hamburger ${isMenuOpen ? 'is-open' : ''}`} aria-hidden="true">
                <span className="bar bar1"></span>
                <span className="bar bar2"></span>
                <span className="bar bar3"></span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" style={{
          background: 'var(--bg-primary)',
          borderTop: `1px solid var(--border-color)`,
          padding: '1rem',
          animation: 'slideInDown 0.3s ease-out'
        }}>
          <nav role="navigation" aria-label="Mobile menu" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {[
              { label: 'Home', to: '/' },
              { label: 'Blog', to: '/blog' },
              { label: 'Favorites', to: '/favorites' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  textAlign: 'left',
                  textDecoration: 'none'
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Search inside menu */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ position: 'relative' }}>
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
        </div>
      )}

      {/* Mobile Search (visible when menu is closed) */}
      {isMobile && !isMenuOpen && (
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