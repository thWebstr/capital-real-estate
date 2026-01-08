export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Contact', href: '#' },
    ],
    resources: [
      { name: 'Buying Guide', href: '#' },
      { name: 'Selling Guide', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: 'fa-facebook', href: '#', color: '#1877F2' },
    { icon: 'fa-twitter', href: '#', color: '#1DA1F2' },
    { icon: 'fa-instagram', href: '#', color: '#E4405F' },
    { icon: 'fa-linkedin', href: '#', color: '#0A66C2' },
    { icon: 'fa-youtube', href: '#', color: '#FF0000' },
  ];

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '5rem',
    }}>
      <div className="container" style={{
        padding: '4rem var(--space-lg) 2rem',
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <i className="fas fa-check-circle" style={{ color: 'white', fontSize: '1.25rem' }}></i>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  margin: 0,
                  background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Verified
                </h3>
                <p style={{
                  fontSize: '0.7rem',
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  letterSpacing: '1px',
                }}>
                  HOMES
                </p>
              </div>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
            }}>
              Verified properties only. No fake listings, no stress.
              Find your next home with confidence.
            </p>
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '1rem',
            }}>
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-primary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className={`fab ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}>
              Company
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {footerLinks.company.map((link) => (
                <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href={link.href}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color var(--transition-fast)',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}>
              Resources
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {footerLinks.resources.map((link) => (
                <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href={link.href}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color var(--transition-fast)',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}>
              Support
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {footerLinks.support.map((link) => (
                <li key={link.name} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href={link.href}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color var(--transition-fast)',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: 'var(--accent)' }}></i>
              Stay Updated
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              margin: 0,
            }}>
              Get the latest property listings and market insights delivered to your inbox.
            </p>
          </div>
          <div style={{
            flex: '1',
            minWidth: '300px',
            display: 'flex',
            gap: '0.75rem',
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
              }}
            />
            <button
              style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
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
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            margin: 0,
          }}>
            © {currentYear} Verified Homes. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <a
              href="#"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Terms of Service
            </a>
            <a
              href="#"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}