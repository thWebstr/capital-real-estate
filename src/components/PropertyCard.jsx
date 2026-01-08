import { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

export default function PropertyCard({ property, onViewDetails }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const favorite = isFavorite(property.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleImageChange = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-md)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Gallery */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '66.67%' }}>
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Image Navigation */}
        {property.images.length > 1 && isHovered && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange('prev');
              }}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange('next');
              }}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        {/* Image Dots */}
        {property.images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
            }}
          >
            {property.images.map((src, index) => (
              <div
                key={src}
                style={{
                  width: currentImageIndex === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentImageIndex === index
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Status Badge */}
        <div
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: property.verified ? 'var(--info)' : (property.status === 'For Sale' ? 'var(--success)' : 'var(--warning)'),
            color: 'white',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <i className={property.verified ? "fas fa-check-circle" : "fas fa-tag"} style={{ marginRight: '0.3rem' }}></i>
          {property.verified ? 'Verified' : property.status}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: favorite ? 'var(--danger)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            color: favorite ? 'white' : 'var(--text-secondary)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-md)',
            animation: favorite ? 'scaleIn 0.3s ease-out' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <i className={favorite ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>

        {/* Days on Market */}
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: '500',
          }}
        >
          <i className="fas fa-map-marker-alt" style={{ marginRight: '0.4rem' }}></i>
          {property.city}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Price */}
        <div
          style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--accent)',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            lineHeight: '1.3',
          }}
        >
          {property.title}
        </h3>

        {/* Address */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <i className="fas fa-map-marker-alt" style={{ marginTop: '0.2rem', color: 'var(--accent)' }}></i>
          <span>{property.area}, {property.city}</span>
        </p>

        {/* Property Details */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-bed" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {property.bedrooms}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>beds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-bath" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {property.bathrooms}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>baths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-ruler-combined" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {formatNumber(property.sqft)}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>sqft</span>
          </div>
        </div>

        {/* Property Type */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            alignSelf: 'flex-start',
            background: 'var(--bg-secondary)',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
          }}
        >
          <i className="fas fa-home"></i>
          {property.propertyType}
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          {property.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '500',
              }}
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span
              style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '0.3rem 0.7rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              +{property.features.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginTop: 'auto',
          }}
        >
          <button
            type="button"
            style={{
              background: 'var(--accent)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onClick={(e) => { e.stopPropagation(); if (typeof onViewDetails === 'function') onViewDetails(property); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-eye"></i>
            View Details
          </button>
          <button
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="fab fa-whatsapp"></i>
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}