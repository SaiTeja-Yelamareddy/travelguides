import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const DestinationContext = createContext(null);

export const DestinationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Persist selected destination across workflow in sessionStorage
  const [selectedDestination, setSelectedDestination] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tg_selected_destination');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist selected place in Step 2
  const [selectedPlace, setSelectedPlace] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tg_selected_place');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [favoritePlaceIds, setFavoritePlaceIds] = useState(new Set());

  // Fetch user favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.favorites.getAll()
        .then((res) => {
          if (res.success && res.favoriteIds) {
            setFavoritePlaceIds(new Set(res.favoriteIds));
          }
        })
        .catch((err) => console.error('Failed to load favorites:', err));
    } else {
      setFavoritePlaceIds(new Set());
    }
  }, [isAuthenticated]);

  const selectDestination = (destination) => {
    setSelectedDestination(destination);
    // Clear sub-place selection when switching destination
    setSelectedPlace(null);
    sessionStorage.removeItem('tg_selected_place');
    if (destination) {
      sessionStorage.setItem('tg_selected_destination', JSON.stringify(destination));
    } else {
      sessionStorage.removeItem('tg_selected_destination');
    }
  };

  const selectPlace = (place) => {
    setSelectedPlace(place);
    if (place) {
      sessionStorage.setItem('tg_selected_place', JSON.stringify(place));
    } else {
      sessionStorage.removeItem('tg_selected_place');
    }
  };

  const resetWorkflow = () => {
    setSelectedDestination(null);
    setSelectedPlace(null);
    sessionStorage.removeItem('tg_selected_destination');
    sessionStorage.removeItem('tg_selected_place');
  };

  const toggleFavorite = async (placeId) => {
    if (!isAuthenticated) return { needLogin: true };
    try {
      const res = await api.favorites.toggle(placeId);
      if (res.success) {
        setFavoritePlaceIds((prev) => {
          const next = new Set(prev);
          if (res.favorited) {
            next.add(placeId);
          } else {
            next.delete(placeId);
          }
          return next;
        });
      }
      return res;
    } catch (err) {
      console.error('Toggle favorite failed:', err);
      throw err;
    }
  };

  const isFavorited = (placeId) => favoritePlaceIds.has(placeId);

  const value = {
    selectedDestination,
    selectedPlace,
    selectDestination,
    selectPlace,
    resetWorkflow,
    favoritePlaceIds,
    toggleFavorite,
    isFavorited
  };

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestination = () => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
};
