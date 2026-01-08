import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function BlogPage() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Posts', icon: 'fa-border-all' },
    { id: 'market', label: 'Market Trends', icon: 'fa-chart-line' },
    { id: 'tips', label: 'Buying Tips', icon: 'fa-lightbulb' },
    { id: 'ai', label: 'AI & Technology', icon: 'fa-robot' },
    { id: 'guides', label: 'Guides', icon: 'fa-book' },
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Things to Know Before Buying Your First Home',
      excerpt: 'Essential tips for first-time homebuyers to navigate the real estate market with confidence.',
      category: 'tips',
      author: 'Sarah Johnson',
      date: 'Dec 15, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      tags: ['First-Time Buyers', 'Mortgage', 'Tips']
    },
    {
      id: 2,
      title: 'How AI is Transforming Real Estate in 2025',
      excerpt: 'Discover how artificial intelligence is revolutionizing property search and market analysis.',
      category: 'ai',
      author: 'Michael Chen',
      date: 'Jan 2, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      tags: ['AI', 'Technology', 'Innovation']
    },
    {
      id: 3,
      title: 'Market Report: Q1 2025 Housing Trends',
      excerpt: 'Comprehensive analysis of the latest housing market trends and predictions for the coming quarter.',
      category: 'market',
      author: 'Emily Rodriguez',
      date: 'Jan 5, 2025',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      tags: ['Market Analysis', 'Trends', 'Data']
    },
    {
      id: 4,
      title: 'Complete Guide to Home Inspections',
      excerpt: 'Everything you need to know about home inspections before closing the deal.',
      category: 'guides',
      author: 'David Park',
      date: 'Dec 20, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      tags: ['Inspection', 'Buying Process', 'Tips']
    },
    {
      id: 5,
      title: 'Smart Home Features That Add Value',
      excerpt: 'Discover which smart home upgrades can significantly increase your property value.',
      category: 'tips',
      author: 'Sarah Johnson',
      date: 'Dec 28, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
      tags: ['Smart Home', 'Value', 'Technology']
    },
    {
      id: 6,
      title: 'Understanding Mortgage Rates in 2025',
      excerpt: 'A detailed breakdown of current mortgage rates and what they mean for buyers.',
      category: 'guides',
      author: 'Michael Chen',
      date: 'Jan 3, 2025',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
      tags: ['Mortgage', 'Finance', 'Rates']
    },
  ];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="blog-page" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="blog-hero" style={{
        background: isDark
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #1C3D5A 0%, #2a5a82 50%, #4A90E2 100%)',
        padding: '5rem 0 3rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 className="animate-fade-in-down" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', marginBottom: '1rem' }}>
            Real Estate Insights
          </h1>
          <p className="animate-fade-in-up" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
            Expert tips, market trends, and guides to help you make informed decisions
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ margin: '3rem auto' }}>
        <div className="categories" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-btn ${selectedCategory === category.id ? 'is-active' : ''}`}
            >
              <i className={`fas ${category.icon}`} aria-hidden="true"></i>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container" style={{ margin: '3rem auto 6rem' }}>
        <div className="posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {filteredPosts.map((post, index) => (
            <article key={post.id} className="post-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="post-image">
                <img src={post.image} alt={post.title} />
                <div className="post-badge">{categories.find(c => c.id === post.category)?.label}</div>
              </div>

              <div className="post-body">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>

                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <span className="tag" key={i}>{tag}</span>
                  ))}
                </div>

                <div className="post-meta">
                  <div className="meta-left"><i className="fas fa-user-circle" aria-hidden="true"></i> <span>{post.author}</span></div>
                  <div className="meta-right"><span>{post.date}</span> • <span>{post.readTime}</span></div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="no-results">
            <i className="fas fa-inbox" aria-hidden="true"></i>
            <h3>No posts found</h3>
            <p>Try selecting a different category</p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter-cta" style={{ background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #1C3D5A 0%, #4A90E2 100%)', padding: '5rem 0', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <i className="fas fa-envelope-open-text" aria-hidden="true" style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.9 }}></i>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', marginBottom: '1rem' }}>Never Miss an Update</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>Get the latest real estate insights, market trends, and expert tips delivered to your inbox weekly.</p>
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
            <input type="email" placeholder="Enter your email" />
            <button className="btn-subscribe">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
