import { useState, useRef, useEffect } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

export default function AIAssistant() {
  const { addFavorite } = useFavorites();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Hello — I\'m your Capital Real Estate assistant. I can help you discover properties, calculate mortgages, analyze markets, and book tours. Tell me what you\'re looking for (e.g., "properties under $500k in Austin", or "calculate mortgage for $400k, 10% down").'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const inputRef = useRef(null);

  // For property search pagination
  const [lastResults, setLastResults] = useState([]);
  const [resultsPage, setResultsPage] = useState(0);
  const pageSize = 3; // items per page for assistant responses
  const [selectedProperty, setSelectedProperty] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Utility helpers
  const formatCurrency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const parsePriceFromText = (text) => {
    const match = text.match(/\$?([\d,]+(?:\.\d+)?)\s*(k|m|thousand|million)?/i);
    if (!match) return null;
    let num = parseFloat(match[1].replace(/,/g, ''));
    if (match[2] && match[2].toLowerCase().startsWith('m')) num *= 1000000;
    else if (match[2] && match[2].toLowerCase().startsWith('k')) num *= 1000;
    return num;
  };

  const calculateMortgage = (principal, downPct, annualRate, years) => {
    const downPayment = principal * (downPct / 100);
    const loanAmount = principal - downPayment;
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return {
      principal,
      downPayment,
      annualRate,
      years,
      monthly: isFinite(monthlyPayment) ? monthlyPayment : 0,
    };
  };

  const searchProperties = ({ priceMax: _priceMax, city: _city, bedrooms: _bedrooms } = {}) => {
    // Mock search using sample data (in real app, would query backend)
    return [];
  };




  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when opening
      setTimeout(() => inputRef.current?.focus(), 0);
      const onKey = (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    } else {
      // Return focus to toggle button when closed
      setTimeout(() => toggleButtonRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProperty) {
      const onKey = (e) => { if (e.key === 'Escape') setSelectedProperty(null); };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [selectedProperty]);

  const quickActions = [
    { icon: 'fa-search', text: 'Find properties', action: 'Show me properties under $500K' },
    { icon: 'fa-calculator', text: 'Calculate mortgage', action: 'Calculate mortgage for a $400K home' },
    { icon: 'fa-chart-line', text: 'Market analysis', action: 'What are the current market trends?' },
    { icon: 'fa-home', text: 'Best value homes', action: 'Show me best value properties' },
  ];

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI response (In production, this would call the Anthropic API)
    setTimeout(() => {
      const lowerMsg = userMessage.toLowerCase();

      // SHOW MORE handling: paginate last results
      if (lowerMsg.includes('show more') || lowerMsg.includes('more properties')) {
        if (!lastResults || lastResults.length === 0) {
          setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: 'No previous results to show more of — try asking for properties (e.g., "properties under $500k")' }]);
          setIsTyping(false);
          return;
        }

        const nextPage = resultsPage + 1;
        const start = nextPage * pageSize;
        const slice = lastResults.slice(start, start + pageSize);

        if (slice.length === 0) {
          setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: 'That\'s all the results I have for that query. Try broadening your criteria.' }]);
          setIsTyping(false);
          return;
        }

        setResultsPage(nextPage);
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', type: 'list', content: slice }]);
        setIsTyping(false);
        return;
      }

      // Mortgage parsing
      if (lowerMsg.includes('mortgage') || lowerMsg.includes('calculate')) {
        const price = parsePriceFromText(userMessage) || 400000;
        const downMatch = userMessage.match(/(\d+)%\s*(down)?/i);
        const downPct = downMatch ? parseFloat(downMatch[1]) : 20;
        const rateMatch = userMessage.match(/(\d+(?:\.\d+)?)%/i);
        const rate = rateMatch ? parseFloat(rateMatch[1]) : 6.5;
        const termMatch = userMessage.match(/(\d+)\s*-?\s*year/i);
        const years = termMatch ? parseInt(termMatch[1], 10) : 30;

        const result = calculateMortgage(price, downPct, rate, years);
        const text = `Mortgage estimate for ${formatCurrency(price)} (Down: ${downPct}% — ${formatCurrency(result.downPayment)}):\n• Loan amount: ${formatCurrency(result.principal)}\n• Rate: ${result.annualRate}% | Term: ${result.years} years\n• Estimated monthly payment (P&I): ${formatCurrency(result.monthly)}/month\n\nWould you like a breakdown including taxes and insurance?`;
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: text }]);
        setIsTyping(false);
        return;
      }

      // Property search parsing (price, city, bedrooms)
      if (lowerMsg.includes('property') || lowerMsg.includes('properties') || lowerMsg.includes('show') || lowerMsg.includes('find') || lowerMsg.includes('homes') || lowerMsg.includes('homes in')) {
        const price = parsePriceFromText(userMessage);
        let city = '';
        const cityMatch = userMessage.match(/in\s+([a-zA-Z\s]+)/i);
        if (cityMatch) city = cityMatch[1].trim().replace(/\.$/, '');
        const bedsMatch = userMessage.match(/(\d+)\s*(?:bed|beds|br)/i);
        const bedrooms = bedsMatch ? parseInt(bedsMatch[1], 10) : null;

        const results = searchProperties({ priceMax: price, city, bedrooms });
        setLastResults(results);
        setResultsPage(0);

        if (results.length === 0) {
          setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: 'I couldn\'t find any properties matching that criteria. Try widening the price range or removing the city.' }]);
          setIsTyping(false);
          return;
        }

        const slice = results.slice(0, pageSize);
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', type: 'list', content: slice }]);
        setIsTyping(false);
        return;
      }

      // Market or other
      if (lowerMsg.includes('market') || lowerMsg.includes('trend')) {
        const response = 'Market snapshot:\n• Average home price: $828,000\n• Median days on market: 18\n• Inventory: Competitive — homes under $500k are moving faster.\n\nI can pull comparable sales or show properties in a specific city if you\'d like.';
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: response }]);
        setIsTyping(false);
        return;
      }

      // Fallback professional reply
      const fallback = 'I\'m here to help — you can ask me to find properties (e.g., "Properties under $500k in Austin"), calculate a mortgage ("Calculate mortgage for $400k"), or request market insights. What would you like to do?';
      setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: fallback }]);
      setIsTyping(false);
    }, 900);
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        ref={toggleButtonRef}
        type="button"
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'all var(--transition-fast)',
          zIndex: 'var(--z-fixed)',
          animation: 'glow 2s ease-in-out infinite',
        }}
        onKeyDown={(e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        <i className={isOpen ? 'fas fa-times' : 'fas fa-robot'} aria-hidden="true"></i>
        {!isOpen && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            background: 'var(--danger)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '700',
            animation: 'pulse 2s infinite',
          }}>
            AI
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div id="ai-assistant-panel" role="dialog" aria-modal="true" aria-labelledby="ai-assistant-title" style={{
          position: 'fixed',
          bottom: '100px',
          right: '2rem',
          width: '400px',
          maxWidth: 'calc(100vw - 4rem)',
          height: '600px',
          maxHeight: 'calc(100vh - 150px)',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 'var(--z-fixed)',
          animation: 'scaleIn 0.3s ease-out',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
            color: 'white',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}>
              <i className="fas fa-robot" aria-hidden="true"></i>
            </div>
            <div style={{ flex: 1 }}>
              <div id="ai-assistant-title" style={{ fontWeight: '700', fontSize: '1.1rem' }}>AI Assistant</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                {isTyping ? 'Typing...' : 'Online'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div id="ai-assistant-messages" role="log" aria-live="polite" aria-atomic="false" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeInUp 0.3s ease-out',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: msg.role === 'user'
                    ? 'var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)'
                    : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 0',
                  background: msg.role === 'user'
                    ? 'var(--accent)'
                    : 'var(--bg-secondary)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {msg.type === 'list' ? (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {msg.content.map((p) => (
                        <div key={p.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <img src={p.images?.[0] || p.thumbnail || 'https://via.placeholder.com/120'} alt={p.title} style={{ width: '86px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ fontWeight: '700' }}>{p.title}</div>
                              <div style={{ fontWeight: '800' }}>{formatCurrency(p.price)}</div>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.bedrooms} bd • {p.bathrooms} ba • {p.sqft} sqft • {p.city}</div>
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                              <button type="button" onClick={() => setSelectedProperty(p)} style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer' }} aria-label={`Details for ${p.title}`}>Details</button>
                              <button type="button" onClick={() => {
                                addFavorite(p.id);
                                setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: `${p.title} has been added to your favorites.` }]);
                              }} style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>Add to Favorites</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(msg.content.length < lastResults.length || (resultsPage + 1) * pageSize < lastResults.length) && (
                        <button type="button" onClick={() => { setInputValue('show more'); setTimeout(() => handleSend(), 50); }} style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', marginTop: '0.5rem' }}>Show more</button>
                      )}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}>
                <div style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--text-tertiary)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--text-tertiary)',
                    animation: 'pulse 1.5s ease-in-out 0.2s infinite',
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--text-tertiary)',
                    animation: 'pulse 1.5s ease-in-out 0.4s infinite',
                  }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 1.5rem 1rem',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  type="button"
                  aria-label={`Quick action: ${action.text}`}
                  onClick={() => handleQuickAction(action.action)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <i className={`fas ${action.icon}`}></i>
                  {action.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  } else if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
                placeholder="Type your message..."
                aria-label="Message"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                aria-label="Send message"
                disabled={!inputValue.trim() || isTyping}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: inputValue.trim() && !isTyping ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: inputValue.trim() && !isTyping ? 'white' : 'var(--text-tertiary)',
                  border: 'none',
                  cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim() && !isTyping) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div role="dialog" aria-modal="true" aria-labelledby="property-title" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'calc(var(--z-fixed) + 1)' }} onClick={() => setSelectedProperty(null)}>
          <div role="document" style={{ width: 'min(900px, 95vw)', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 320px' }}>
                <img src={selectedProperty.images?.[0] || 'https://via.placeholder.com/320x200'} alt={selectedProperty.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {selectedProperty.images?.slice(0, 3).map((src, idx) => (<img key={idx} src={src} alt={selectedProperty.title + ' photo ' + (idx + 1)} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 id="property-title" style={{ margin: 0 }}>{selectedProperty.title}</h2>
                  <div style={{ fontWeight: '800' }}>{formatCurrency(selectedProperty.price)}</div>
                </div>
                <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>{selectedProperty.address || ''} {selectedProperty.city ? '• ' + selectedProperty.city : ''}</p>
                <p style={{ margin: '0.25rem 0' }}>{selectedProperty.bedrooms} bd • {selectedProperty.bathrooms} ba • {selectedProperty.sqft} sqft</p>
                <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>{selectedProperty.description}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => { addFavorite(selectedProperty.id); }} style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none' }}>Add to Favorites</button>
                  <button type="button" onClick={() => { setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'user', content: `I want to schedule a tour for ${selectedProperty.title} (id: ${selectedProperty.id})` }]); setSelectedProperty(null); setIsOpen(true); }} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>Request Tour</button>
                  <button type="button" onClick={() => setSelectedProperty(null)} aria-label="Close details" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>Close</button>
                </div>
                <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
                  Agent: {selectedProperty.agent?.name} • <a href={`mailto:${selectedProperty.agent?.email}`}>{selectedProperty.agent?.email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}