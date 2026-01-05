import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('propertyNotes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('propertyNotes', JSON.stringify(notes));
  }, [notes]);

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const addFavorite = (propertyId) => {
    if (!favorites.includes(propertyId)) {
      setFavorites(prev => [...prev, propertyId]);
    }
  };

  const removeFavorite = (propertyId) => {
    setFavorites(prev => prev.filter(id => id !== propertyId));
  };

  const clearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
      setNotes({});
    }
  };

  const addNote = (propertyId, note) => {
    setNotes(prev => ({
      ...prev,
      [propertyId]: note
    }));
  };

  const getNote = (propertyId) => {
    return notes[propertyId] || '';
  };

  const deleteNote = (propertyId) => {
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[propertyId];
      return newNotes;
    });
  };

  const value = {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    notes,
    addNote,
    getNote,
    deleteNote
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}

export default FavoritesContext;