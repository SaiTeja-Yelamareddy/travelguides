import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Compass, ArrowRight, Trash2, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import DestinationCard from '../components/DestinationCard';
import { api } from '../services/api';
import { useDestination } from '../context/DestinationContext';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { selectDestination, toggleFavorite } = useDestination();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchFavorites = () => {
    setLoading(true);
    api.favorites.getAll()
      .then((res) => {
        if (res.success && res.data) {
          setFavorites(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (placeId) => {
    try {
      await toggleFavorite(placeId);
      setFavorites((prev) => prev.filter((p) => p.placeId !== placeId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handleSelect = (place) => {
    selectDestination(place);
    navigate('/nearby-places');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                My <span className="text-emerald-700">Favorites</span>
              </h1>
            </div>
            <p className="text-base text-slate-600 font-normal mt-1">
              Your saved tourist destinations and must-visit travel places.
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Places</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-300 p-8 sm:p-12 shadow-soft max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No Favorites Saved Yet
            </h3>
            <p className="text-base text-slate-600 font-normal leading-relaxed mb-6">
              When exploring destinations, click the heart icon on any card to save places to your personal list for quick access.
            </p>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {favorites.map((place) => (
              <div key={place.placeId} className="relative group">
                <DestinationCard
                  place={place}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
