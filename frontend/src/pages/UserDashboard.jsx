import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Heart, 
  User, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import DestinationCard from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { useDestination } from '../context/DestinationContext';
import { api } from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectDestination } = useDestination();

  const [favorites, setFavorites] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.favorites.getAll().catch(() => ({ success: false, data: [] })),
      api.places.getAll({ popular: 'true' }).catch(() => ({ success: false, data: [] }))
    ]).then(([favRes, placeRes]) => {
      if (favRes.success && favRes.data) {
        setFavorites(favRes.data);
      }
      if (placeRes.success && placeRes.data) {
        setPopularPlaces(placeRes.data.slice(0, 4));
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSelectPlace = (place) => {
    selectDestination(place);
    navigate('/nearby-places');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white mb-10 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30 inline-block mb-3">
              Member Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Traveler'}!
            </h1>
            <p className="text-base sm:text-lg text-slate-100 mt-3 mb-7 font-normal leading-relaxed">
              Ready for your next journey? Choose a destination to find nearby attractions and verified hotels across India.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base bg-white text-emerald-900 hover:bg-emerald-50 shadow-sm transition-all"
              >
                <span>Start Destination Workflow</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/40 transition-all"
              >
                <Heart className="w-5 h-5 text-rose-300" />
                <span>My Saved Places ({favorites.length})</span>
              </Link>
            </div>
          </div>

          {/* Decorative SVG Mountains */}
          <div className="absolute right-0 bottom-0 opacity-15 hidden md:block">
            <svg width="400" height="240" viewBox="0 0 400 240" fill="none">
              <path d="M0 240 L160 50 L280 240 Z" fill="white" />
              <path d="M180 240 L300 90 L420 240 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          
          <Link
            to="/destinations"
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Step 1
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                Select Destination
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Choose from major travel hubs and popular cities in India.
              </p>
            </div>
          </Link>

          <Link
            to="/nearby-places"
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Step 2
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                Nearby Places
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Explore local attractions, heritage sights, and viewpoints.
              </p>
            </div>
          </Link>

          <Link
            to="/hotels"
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Hotel className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Step 3
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                Nearby Hotels
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Browse verified accommodations linked to your destinations.
              </p>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                {favorites.length} Saved
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                My Favorites
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Quick access to destinations you've saved for future trips.
              </p>
            </div>
          </Link>

        </div>

        {/* Featured Destinations Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Recommended <span className="text-emerald-700">Destinations</span>
              </h2>
              <p className="text-base text-slate-600 font-normal mt-1">
                Top tourist places curated for you
              </p>
            </div>
            <Link
              to="/destinations"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-700 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPlaces.map((place) => (
                <DestinationCard
                  key={place.placeId}
                  place={place}
                  onSelect={handleSelectPlace}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
