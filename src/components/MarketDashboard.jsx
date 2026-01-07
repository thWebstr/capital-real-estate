import { useEffect, useRef } from 'react';
import { useFilters } from '../contexts/FilterContext';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function MarketDashboard() {
  const { filteredProperties } = useFilters();
  const priceChartRef = useRef(null);
  const typeChartRef = useRef(null);
  const bedsChartRef = useRef(null);
  const priceChartInstance = useRef(null);
  const typeChartInstance = useRef(null);
  const bedsChartInstance = useRef(null);

  // Calculate statistics
  const avgPrice = filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length || 0;
  const medianDays = filteredProperties.sort((a, b) => a.daysOnMarket - b.daysOnMarket)[Math.floor(filteredProperties.length / 2)]?.daysOnMarket || 0;
  const totalProperties = filteredProperties.length;

  // Price distribution
  const priceRanges = {
    'Under $500K': filteredProperties.filter(p => p.price < 500000).length,
    '$500K-$1M': filteredProperties.filter(p => p.price >= 500000 && p.price < 1000000).length,
    '$1M-$2M': filteredProperties.filter(p => p.price >= 1000000 && p.price < 2000000).length,
    'Over $2M': filteredProperties.filter(p => p.price >= 2000000).length,
  };

  // Property type distribution
  const typeDistribution = filteredProperties.reduce((acc, p) => {
    acc[p.propertyType] = (acc[p.propertyType] || 0) + 1;
    return acc;
  }, {});

  // Bedroom distribution
  const bedroomDistribution = filteredProperties.reduce((acc, p) => {
    const key = p.bedrooms >= 5 ? '5+' : p.bedrooms.toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#F1F5F9' : '#2F3E46';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Price Distribution Chart
    if (priceChartRef.current) {
      if (priceChartInstance.current) {
        priceChartInstance.current.destroy();
      }

      priceChartInstance.current = new Chart(priceChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(priceRanges),
          datasets: [{
            label: 'Number of Properties',
            data: Object.values(priceRanges),
            backgroundColor: 'rgba(201, 162, 77, 0.7)',
            borderColor: 'rgba(201, 162, 77, 1)',
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
              padding: 12,
              displayColors: false,
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { size: 11 } }
            }
          }
        }
      });
    }

    // Property Type Chart
    if (typeChartRef.current) {
      if (typeChartInstance.current) {
        typeChartInstance.current.destroy();
      }

      typeChartInstance.current = new Chart(typeChartRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(typeDistribution),
          datasets: [{
            data: Object.values(typeDistribution),
            backgroundColor: [
              'rgba(201, 162, 77, 0.8)',
              'rgba(212, 175, 55, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: isDark ? '#1E293B' : '#FFFFFF',
            borderWidth: 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
              padding: 12,
            }
          }
        }
      });
    }

    // Bedroom Distribution Chart
    if (bedsChartRef.current) {
      if (bedsChartInstance.current) {
        bedsChartInstance.current.destroy();
      }

      bedsChartInstance.current = new Chart(bedsChartRef.current, {
        type: 'line',
        data: {
          labels: Object.keys(bedroomDistribution).sort(),
          datasets: [{
            label: 'Properties',
            data: Object.keys(bedroomDistribution).sort().map(key => bedroomDistribution[key]),
            borderColor: 'rgba(212, 175, 55, 1)',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(212, 175, 55, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
              padding: 12,
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { size: 11 } }
            }
          }
        }
      });
    }

    return () => {
      if (priceChartInstance.current) priceChartInstance.current.destroy();
      if (typeChartInstance.current) typeChartInstance.current.destroy();
      if (bedsChartInstance.current) bedsChartInstance.current.destroy();
    };
  }, [filteredProperties]);

  const StatCard = ({ icon, value, label, color }) => (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      boxShadow: 'var(--shadow-md)',
      transition: 'all var(--transition-normal)',
      cursor: 'default',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: 'var(--radius-lg)',
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        color: color,
      }}>
        <i className={icon}></i>
      </div>
      <div>
        <div style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1,
          marginBottom: '0.25rem',
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          fontWeight: '500',
        }}>
          {label}
        </div>
      </div>
    </div>
  );

  return (
    <section className="market-dashboard full-bleed">
      <div style={{
        marginBottom: '2rem',
        animation: 'fadeInDown 0.5s ease-out',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          <i className="fas fa-chart-line" style={{ marginRight: '0.75rem', color: 'var(--accent)' }}></i>
          Market Insights
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
        }}>
          Real-time analytics and trends from {totalProperties} properties
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <StatCard
          icon="fas fa-dollar-sign"
          value={`$ ${(avgPrice / 1000).toFixed(0)}K`}
          label="Average Price"
          color="var(--accent)"
        />
        <StatCard
          icon="fas fa-calendar-alt"
          value={medianDays}
          label="Median Days on Market"
          color="var(--secondary)"
        />
        <StatCard
          icon="fas fa-home"
          value={totalProperties}
          label="Available Properties"
          color="var(--success)"
        />
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
      }}>
        {/* Price Distribution */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem', color: 'var(--accent)' }}></i>
            Price Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <canvas ref={priceChartRef}></canvas>
          </div>
        </div>

        {/* Property Types */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            <i className="fas fa-chart-pie" style={{ marginRight: '0.5rem', color: 'var(--secondary)' }}></i>
            Property Types
          </h3>
          <div style={{ height: '300px' }}>
            <canvas ref={typeChartRef}></canvas>
          </div>
        </div>

        {/* Bedroom Distribution */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            <i className="fas fa-bed" style={{ marginRight: '0.5rem', color: 'var(--accent)' }}></i>
            Bedrooms Distribution
          </h3>
          <div style={{ height: '300px' }}>
            <canvas ref={bedsChartRef}></canvas>
          </div>
        </div>
      </div>
    </section>
  );
}