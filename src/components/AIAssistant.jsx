import { useState, useRef, useEffect } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Hi! I\'m your AI real estate assistant. I can help you find properties, calculate mortgages, analyze investments, and answer any questions about home buying. How can I help you today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      let response = '';

      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes('mortgage') || lowerMsg.includes('calculate')) {
        response = 'I can help you calculate your mortgage! For a typical scenario:\n\n• $400,000 home price\n• 20% down payment ($80,000)\n• 6.5% interest rate\n• 30-year term\n\nYour monthly payment would be approximately $2,024/month (principal & interest only).\n\nWould you like me to include property taxes, insurance, and HOA fees for a more accurate estimate?';
      } else if (lowerMsg.includes('property') || lowerMsg.includes('home') || lowerMsg.includes('house')) {
        response = 'Based on your search criteria, I found several excellent properties:\n\n1. **Charming Family Home** - $425K\n   • 4 beds, 3 baths, 2,800 sqft\n   • Austin, TX\n   • Great school district\n\n2. **Modern Smart Home** - $695K\n   • 3 beds, 2.5 baths, 2,200 sqft\n   • San Jose, CA\n   • Solar panels & EV charger\n\nWould you like more details on any of these properties?';
      } else if (lowerMsg.includes('market') || lowerMsg.includes('trend')) {
        response = 'Current market insights:\n\n📈 **Market Trends:**\n• Average home price: $828K\n• Median days on market: 18 days\n• Inventory: Properties moving quickly\n\n💡 **Key Observations:**\n• Homes under $500K are selling 30% faster\n• Properties with modern amenities are in high demand\n• Interest rates remain stable at 6-7%\n\nThis is generally a competitive market. Would you like tips on making a strong offer?';
      } else if (lowerMsg.includes('value') || lowerMsg.includes('deal')) {
        response = 'Great question! Here are the best value properties I found:\n\n🏆 **Top Deals:**\n\n1. **Charming Family Home** - $425K\n   • Price per sqft: $152\n   • 15% below market average\n   • Recently updated kitchen\n\n2. **Contemporary Townhouse** - $550K\n   • Price per sqft: $282\n   • Walk to restaurants & shops\n   • Low HOA fees\n\nThese properties offer excellent value based on location, amenities, and recent comparable sales. Want to schedule tours?';
      } else {
        response = 'I\'d be happy to help with that! I can assist you with:\n\n• 🏠 Finding properties that match your criteria\n• 💰 Calculating mortgages and affordability\n• 📊 Analyzing market trends and property values\n• 📍 Information about neighborhoods and schools\n• 🤝 Connecting you with agents\n• 📅 Scheduling property tours\n\nWhat would you like to know more about?';
      }

      setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        <i className={isOpen ? 'fas fa-times' : 'fas fa-robot'}></i>
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
        <div style={{
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
              <i className="fas fa-robot"></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>AI Assistant</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                {isTyping ? 'Typing...' : 'Online'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
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
                  {msg.content}
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
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
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
                onClick={handleSend}
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
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}