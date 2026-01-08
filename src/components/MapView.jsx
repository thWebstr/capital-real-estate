import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function MapView({ properties = [], center = null, onMarkerClick }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) return; // no key -- don't initialize

    const loader = new Loader({ apiKey: key, version: 'weekly' });
    let map;
    let markers = [];

    loader.load().then(() => {
      map = new window.google.maps.Map(containerRef.current, {
        center: center || (properties[0] ? { lat: properties[0].lat, lng: properties[0].lng } : { lat: 39.5, lng: -98.35 }),
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false
      });

      markers = properties.map((p) => {
        const marker = new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: p.title
        });
        const infowindow = new window.google.maps.InfoWindow({ content: `<strong>${p.title}</strong><br/>${p.city} — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.price)}` });
        marker.addListener('click', () => {
          infowindow.open({ anchor: marker, map });
          if (onMarkerClick) onMarkerClick(p);
        });
        return marker;
      });

      mapRef.current = { map, markers };
    }).catch(() => {
      // loader failed - silently ignore (fallback)
    });

    return () => {
      if (mapRef.current?.markers) {
        mapRef.current.markers.forEach(m => m.setMap(null));
      }
    };
  }, [properties, center, onMarkerClick]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '500px',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <p>No Google Maps API key configured — map disabled.</p>
        </div>
      )}
    </div>
  );
}
