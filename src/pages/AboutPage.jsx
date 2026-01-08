import { useTheme } from '../contexts/ThemeContext';

export default function AboutPage() {
  const { isDark } = useTheme();

  const stats = [
    { icon: 'fa-home', value: '10,000+', label: 'Properties Sold' },
    { icon: 'fa-users', value: '50,000+', label: 'Happy Clients' },
    { icon: 'fa-award', value: '15+', label: 'Years Experience' },
    { icon: 'fa-globe', value: '200+', label: 'Cities Covered' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://i.pravatar.cc/300?img=1',
      bio: '15+ years in real estate with a vision to revolutionize property search with AI.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://i.pravatar.cc/300?img=12',
      bio: 'Former Google engineer, leading our AI and technology initiatives.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://i.pravatar.cc/300?img=5',
      bio: 'Expert in scaling operations and ensuring customer satisfaction.',
    },
    {
      name: 'David Park',
      role: 'Lead Agent',
      image: 'https://i.pravatar.cc/300?img=8',
      bio: 'Top-rated agent with 1000+ successful property transactions.',
    },
  ];

  const values = [
    {
      icon: 'fa-heart',
      title: 'Customer First',
      description: 'Your dream home is our priority. We go above and beyond to ensure satisfaction.',
    },
    {
      icon: 'fa-shield-alt',
      title: 'Trust & Transparency',
      description: 'Honest pricing, clear communication, and no hidden fees. Ever.',
    },
    {
      icon: 'fa-lightbulb',
      title: 'Innovation',
      description: 'Leveraging AI and cutting-edge technology to make home buying effortless.',
    },
    {
      icon: 'fa-handshake',
      title: 'Partnership',
      description: 'We build lasting relationships, not just transactions.',
    },
  ];

  return (
    <div className="about-page" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        className="about-hero"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
            : 'linear-gradient(135deg, #1C3D5A 0%, #2a5a82 50%, #4A90E2 100%)',
          padding: '5rem 0 3rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-labelledby="about-heading"
      >
        <div className="accent-circle" aria-hidden="true"></div>

        <div className="container" style={{ textAlign: 'center' }}>
          <h1
            id="about-heading"
            className="animate-fade-in-down"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', marginBottom: '1.5rem' }}
          >
            About Capital Real Estate
          </h1>
          <p
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6',
              opacity: 0.95,
            }}
          >
            Revolutionizing real estate with AI-powered search, market insights, and 24/7 assistance.
            We're not just finding homes—we're building futures.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container" style={{ margin: '4rem auto' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card animate-fade-in-up"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
                cursor: 'default',
                animationDelay: `${index * 0.08}s`,
              }}
            >
              <i className={`fas ${stat.icon}`} aria-hidden="true" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{stat.value}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="container" style={{ margin: '6rem auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Our Story</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Founded in 2010, Capital Real Estate was born from a simple idea: finding your dream home shouldn't be complicated.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Over the past 15 years, we've helped over 50,000 families find their perfect homes across 200+ cities. What started as a small local agency has grown into a technology-driven real estate powerhouse.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              In 2023, we launched our AI-powered platform—the first of its kind in the industry—making property search smarter, faster, and more personalized than ever before.
            </p>
          </div>
          <div className="story-image">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="Modern real estate office" />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section" style={{ background: 'var(--bg-secondary)', padding: '6rem 0', margin: '6rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3rem', textAlign: 'center' }}>Our Core Values</h2>
          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {values.map((value, index) => (
              <div key={index} className="value-card animate-fade-in-up" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-md)', transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)', animationDelay: `${index * 0.06}s` }}>
                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--accent), var(--secondary))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <i className={`fas ${value.icon}`} aria-hidden="true" style={{ fontSize: '1.75rem', color: 'white' }}></i>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>{value.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container" style={{ margin: '6rem auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3rem', textAlign: 'center' }}>Meet Our Team</h2>
        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {team.map((member, index) => (
            <div key={index} className="team-member animate-fade-in-up" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)', animationDelay: `${index * 0.06}s` }}>
              <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{member.name}</h3>
                <p style={{ color: 'var(--accent)', fontWeight: '500', marginBottom: '1rem' }}>{member.role}</p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
