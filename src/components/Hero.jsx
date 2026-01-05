import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Hero() {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: 'fa-home', value: '10K+', label: 'Properties' },
    { icon: 'fa-users', value: '50K+', label: 'Happy Clients' },
    { icon: 'fa-building', value: '200+', label: 'Cities' },
    { icon: 'fa-award', value: '15+', label: 'Years Experience' }
  ];

  return (
    <section style={{
      position: 'relative',
      background: isDark
        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
        : 'linear-gradient(135deg, #1C3D5A 0%, #2a5a82 50%, #4A90E2 100%)',
      padding: '5rem 0 4rem',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(74, 144, 226, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 5s ease-in-out infinite 1s',
        pointerEvents: 'none'
      }}></div>

      <div className="container">
        <div style={{
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          color: 'white',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            animation: 'fadeIn 1s ease-out 0.2s both'
          }}>
            <i className="fas fa-sparkles" style={{ color: '#F0C868' }}></i>
            <span>AI-Powered Real Estate Platform</span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            animation: 'fadeIn 1s ease-out 0.4s both'
          }}>
            Find Your Dream Home
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #F0C868, #D4AF37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              With AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '3rem',
            lineHeight: '1.6',
            animation: 'fadeIn 1s ease-out 0.6s both'
          }}>
            Discover luxury properties, calculate mortgages instantly, and get personalized
            <br />
            recommendations from our 24/7 AI assistant.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem',
            animation: 'fadeIn 1s ease-out 0.8s both'
          }}>
            <button style={{
              background: 'white',
              color: 'var(--primary)',
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              transition: 'all var(--transition-normal)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
              }}>
              <i className="fas fa-search"></i>
              Browse Properties
            </button>

            <button style={{
              background: 'transparent',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backdropFilter: 'blur(10px)',
              transition: 'all var(--transition-normal)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
              <i className="fas fa-robot"></i>
              Try AI Assistant
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            animation: 'fadeIn 1s ease-out 1s both'
          }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all var(--transition-normal)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <i className={`fas ${stat.icon}`} style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                  color: '#F0C868'
                }}></i>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '0.25rem',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div style={{
        position: 'absolute',
        bottom: '-2px',
        left: 0,
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0
      }}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '60px'
          }}
        >
          <path
            d="M0,50 C200,80 400,80 600,50 C800,20 1000,20 1200,50 L1200,120 L0,120 Z"
            fill={isDark ? '#0F172A' : '#FFFFFF'}
          />
        </svg>
      </div>
    </section>
  );
}