import React from 'react';
import PropertyCard from './PropertyCard';
import { useFilters } from '../contexts/FilterContext';

export default function PropertyList() {
  const { filteredProperties } = useFilters();

  if (!filteredProperties || filteredProperties.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          No properties match your filters.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 360px))',
      gap: '1.5rem',
      justifyContent: 'center',
      width: '100%'
    }}>
      {filteredProperties.map((property) => (
        <div style={{ width: '100%', maxWidth: '360px' }} key={property.id}>
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}
