import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyList from './components/PropertyList';
import FilterPanel from './components/FilterPanel';
import MarketDashboard from './components/MarketDashboard';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import { ThemeProvider } from './contexts/ThemeContext';
import { FilterProvider } from './contexts/FilterContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import './styles/global.css';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <FilterProvider>
          <div className="app">
            <Header />
            
            <main>
              <Hero />
              
              <section className="container" style={{ marginTop: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '2rem',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap'
                }}>
                  {/* Filter Sidebar */}
                  <aside style={{ flex: '0 0 300px', minWidth: '280px' }}>
                    <FilterPanel />
                  </aside>
                  
                  {/* Main Content */}
                  <div style={{ flex: '1', minWidth: '300px' }}>
                    {/* Toggle Dashboard/List View */}
                    <div style={{ 
                      marginBottom: '1.5rem',
                      display: 'flex',
                      gap: '1rem',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={() => setShowDashboard(false)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          borderRadius: 'var(--radius-md)',
                          background: !showDashboard ? 'var(--accent)' : 'var(--bg-secondary)',
                          color: !showDashboard ? 'white' : 'var(--text-primary)',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <i className="fas fa-list"></i>
                        Properties
                      </button>
                      <button
                        onClick={() => setShowDashboard(true)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          borderRadius: 'var(--radius-md)',
                          background: showDashboard ? 'var(--accent)' : 'var(--bg-secondary)',
                          color: showDashboard ? 'white' : 'var(--text-primary)',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <i className="fas fa-chart-line"></i>
                        Market Insights
                      </button>
                    </div>
                    
                    {/* Content Area */}
                    {showDashboard ? (
                      <MarketDashboard />
                    ) : (
                      <PropertyList />
                    )}
                  </div>
                </div>
              </section>
            </main>
            
            <Footer />
            
            {/* AI Assistant Chat Widget */}
            <AIAssistant />
          </div>
        </FilterProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;