import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ContactPage() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
    }, 3000);
  };

  const contactMethods = [
    { icon: 'fa-phone', title: 'Phone', value: '+1 (555) 123-4567', description: 'Mon-Fri 9AM-6PM EST', color: 'var(--success)' },
    { icon: 'fa-envelope', title: 'Email', value: 'hello@capitalre.com', description: 'We reply within 24 hours', color: 'var(--accent)' },
    { icon: 'fa-map-marker-alt', title: 'Office', value: '123 Business Ave, NYC', description: 'Visit us Mon-Fri', color: 'var(--secondary)' },
    { icon: 'fa-comments', title: 'Live Chat', value: 'Chat with us', description: 'Available 24/7', color: 'var(--warning)' }
  ];

  const offices = [
    { city: 'New York', address: '123 Business Avenue, Suite 500', phone: '+1 (555) 123-4567', email: 'ny@capitalre.com' },
    { city: 'Los Angeles', address: '456 Pacific Boulevard, Floor 10', phone: '+1 (555) 234-5678', email: 'la@capitalre.com' },
    { city: 'Chicago', address: '789 Michigan Street, Suite 300', phone: '+1 (555) 345-6789', email: 'chicago@capitalre.com' }
  ];

  return (
    <div className="contact-page" style={{ minHeight: '100vh' }}>
      <section className="contact-hero" style={{
        background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)' : 'linear-gradient(135deg, #1C3D5A 0%, #2a5a82 50%, #4A90E2 100%)',
        padding: '5rem 0 3rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 className="animate-fade-in-down" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '800', marginBottom: '1rem' }}>
            Get in Touch
          </h1>
          <p className="animate-fade-in-up" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
            Have questions? We're here to help you find your dream home
          </p>
        </div>
      </section>

      <section className="container contact-methods" style={{ margin: '3rem auto' }}>
        <div className="methods-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {contactMethods.map((method, index) => (
            <div key={index} className="method-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="method-icon" style={{ background: `${method.color}20` }}>
                <i className={`fas ${method.icon}`} style={{ color: method.color }} aria-hidden="true"></i>
              </div>
              <h3>{method.title}</h3>
              <p className="method-value">{method.value}</p>
              <p className="method-desc">{method.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container contact-form-section" style={{ margin: '6rem auto' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Send us a Message</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Fill out the form below and we'll get back to you within 24 hours.</p>

            {submitted ? (
              <div className="success-message">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <h3>Message Sent!</h3>
                <p>We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>Full Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="form-row">
                  <label>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <div className="form-row">
                  <label>Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="form-row">
                  <label>Subject *</label>
                  <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                    <option value="general">General Inquiry</option>
                    <option value="buying">Buying a Property</option>
                    <option value="selling">Selling a Property</option>
                    <option value="agent">Speak to an Agent</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Message *</label>
                  <textarea rows="5" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us how we can help..."></textarea>
                </div>
                <button type="submit" className="btn-send"> <i className="fas fa-paper-plane" aria-hidden="true"></i> Send Message</button>
              </form>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2rem' }}>Our Offices</h2>
            {offices.map((office, index) => (
              <div key={index} className="office-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                <h3><i className="fas fa-building" style={{ color: 'var(--accent)' }} aria-hidden="true"></i> {office.city}</h3>
                <div className="office-info">
                  <div><i className="fas fa-map-marker-alt" style={{ color: 'var(--accent)' }} aria-hidden="true"></i> {office.address}</div>
                  <div><i className="fas fa-phone" style={{ color: 'var(--accent)' }} aria-hidden="true"></i> {office.phone}</div>
                  <div><i className="fas fa-envelope" style={{ color: 'var(--accent)' }} aria-hidden="true"></i> {office.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
