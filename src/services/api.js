import { properties, agents } from '../data/properties';

const DELAY = 500; // Simulated network delay in ms

export const api = {
  // Fetch properties with robust filtering
  fetchProperties: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...properties];

        // 1. Text Search (Title, Description, City, Area)
        if (filters.q) {
          const q = filters.q.toLowerCase();
          data = data.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.area.toLowerCase().includes(q)
          );
        }

        // 2. Exact City Match
        if (filters.city) {
          data = data.filter(p => p.city.toLowerCase() === filters.city.toLowerCase());
        }

        // 3. Price Filter (Max)
        if (filters.priceMax) {
          data = data.filter(p => p.price <= parseInt(filters.priceMax));
        }

        // 4. Bedroom Filter (Min)
        if (filters.bedrooms) {
          data = data.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
        }

        // 5. Verified Only
        if (filters.verifiedOnly) {
          data = data.filter(p => p.verified === true);
        }

        // Pagination Logic
        const page = filters.page || 1;
        const perPage = filters.perPage || 12;
        const total = data.length;
        const start = (page - 1) * perPage;
        const paginatedData = data.slice(start, start + perPage);

        resolve({
          data: paginatedData,
          total: total,
          page: page,
          perPage: perPage
        });
      }, DELAY);
    });
  },

  // Fetch single property by ID
  fetchPropertyById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const property = properties.find(p => p.id === id);
        if (property) {
          // Hydrate Agent Data
          const agent = agents.find(a => a.id === property.agentId);
          resolve({ ...property, agent });
        } else {
          reject(new Error('Property not found'));
        }
      }, DELAY);
    });
  },

  // Mock Contact Agent
  contactAgent: async (inquiryData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Inquiry sent:', inquiryData);
        resolve({ success: true, message: 'Agent contacted successfully' });
      }, DELAY);
    });
  }
};
