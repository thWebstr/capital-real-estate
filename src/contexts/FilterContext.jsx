import { createContext, useContext, useState, useEffect } from 'react';
import { properties } from '../data/properties';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('propertyFilters');
    return saved ? JSON.parse(saved) : {
      priceMin: 0,
      priceMax: 10000000,
      bedrooms: null,
      bathrooms: null,
      propertyTypes: [],
      features: [],
      cities: [],
      sortBy: 'newest'
    };
  });

  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen(prev => !prev);
  const closeFilter = () => setIsFilterOpen(false);

  useEffect(() => {
    localStorage.setItem('propertyFilters', JSON.stringify(filters));

    // Inline filter logic to satisfy exhaustive-deps and avoid recreating functions
    let filtered = [...properties];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prop =>
        prop.title.toLowerCase().includes(query) ||
        prop.address.toLowerCase().includes(query) ||
        prop.city.toLowerCase().includes(query)
      );
    }

    // Price range
    filtered = filtered.filter(prop =>
      prop.price >= filters.priceMin && prop.price <= filters.priceMax
    );

    // Bedrooms
    if (filters.bedrooms !== null) {
      filtered = filtered.filter(prop => prop.bedrooms >= filters.bedrooms);
    }

    // Bathrooms
    if (filters.bathrooms !== null) {
      filtered = filtered.filter(prop => prop.bathrooms >= filters.bathrooms);
    }

    // Property types
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(prop =>
        filters.propertyTypes.includes(prop.propertyType)
      );
    }

    // Square footage removed from MVP logic


    // Features
    if (filters.features.length > 0) {
      filtered = filtered.filter(prop =>
        filters.features.every(feature => prop.features.includes(feature))
      );
    }

    // Cities
    if (filters.cities.length > 0) {
      filtered = filtered.filter(prop =>
        filters.cities.includes(prop.city)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'bedrooms':
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case 'sqft':
        filtered.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
    }

    setFilteredProperties(filtered);
  }, [filters, searchQuery]);



  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 10000000,
      bedrooms: null,
      bathrooms: null,
      propertyTypes: [],
      features: [],
      cities: [],
      sortBy: 'newest'
    });
    setSearchQuery('');
  };

  const value = {
    filters,
    filteredProperties,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearFilters,
    totalCount: properties.length,
    filteredCount: filteredProperties.length,
    // Drawer controls
    isFilterOpen,
    toggleFilter,
    closeFilter
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}

export default FilterContext;