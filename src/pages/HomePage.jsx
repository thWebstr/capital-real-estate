import { useState } from 'react';
import Hero from '../components/Hero';
import PropertyList from '../components/PropertyList';
import FilterPanel from '../components/FilterPanel';
import MarketDashboard from '../components/MarketDashboard';

export default function HomePage() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
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
            <div style={{
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button onClick={() => setShowDashboard(false)}>
                Properties
              </button>

              <button onClick={() => setShowDashboard(true)}>
                Market Insights
              </button>
            </div>

            {showDashboard ? <MarketDashboard /> : <PropertyList />}
          </div>
        </div>
      </section>
    </main>
  );
}
