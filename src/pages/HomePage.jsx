import { useState } from 'react';
import Hero from '../components/Hero';
import PropertyList from '../components/PropertyList';
import FilterPanel from '../components/FilterPanel';
import SearchPanel from '../components/SearchPanel';

export default function HomePage() {


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
            {/* Header / Title for the listing section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Latest Verified Listings
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Browse verified properties in your area.
              </p>
            </div>

            {/* Search + Map integration */}
            <SearchPanel />

            {/* Property List is handled inside SearchPanel mostly, or we can just render PropertyList if SearchPanel is just the search bar. 
                Looking at SearchPanel code, it contains the grid. So we just leave SearchPanel. 
                Wait, HomePage currently renders <SearchPanel /> AND {showDashboard ? ... : <PropertyList />}.
                SearchPanel has its own results grid. PropertyList is likely duplicative or used for the initial state?
                Let's check PropertyList usage. SearchPanel seems to do its own fetching and rendering.
                Actually SearchPanel in Step 85 renders PropertyCard loop.
                Let's stick to SearchPanel as the main view for now.
             */}
            <PropertyList />
          </div>
        </div>
      </section>
    </main>
  );
}
