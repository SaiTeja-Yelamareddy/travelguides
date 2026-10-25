import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Compass, 
  RotateCcw, 
  Filter, 
  Hotel, 
  ArrowRight,
  Info 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import ProgressTracker from '../components/ProgressTracker';
import TouristPlaceCard from '../components/TouristPlaceCard';
import { api } from '../services/api';
import { useDestination } from '../context/DestinationContext';

const NearbyPlaces = () => {
  const navigate = useNavigate();
  const { selectedDestination, selectPlace } = useDestination();

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If no destination is selected, fetch places or allow selecting
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;

    // If destination is selected, filter by that city/state to find true nearby places
    if (selectedDestination?.city) {
      params.city = selectedDestination.city;
    }

    api.places.getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          // If we filtered by city and got few or none, fallback to all places in the state
          if (res.data.length === 0 && selectedDestination?.state) {
            return api.places.getAll({ state: selectedDestination.state });
          }
          return res;
        }
      })
      .then((res) => {
        if (res && res.data) {
          setNearbyPlaces(res.data);
        }
      })
      .catch((err) => console.error('Failed to fetch nearby places:', err))
      .finally(() => setLoading(false));
  }, [selectedDestination, selectedCategory, searchTerm]);

  const handleSelectPlaceForHotels = (place) => {
    selectPlace(place);
    navigate(`/hotels?placeId=${place.placeId}`);
  };

  const categories = ['All', 'Historical', 'Hill Station', 'Beach', 'Adventure', 'Nature', 'Temple'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Step 2 on Progress Tracker */}
      <ProgressTracker currentStep={2} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 pb-20">
        
        {/* Selected Destination Summary Card */}
        {selectedDestination ? (
          <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 mb-10 shadow-soft">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 sm:gap-6">
                {selectedDestination.imageUrl && (
                  <img
                    src={selectedDestination.imageUrl}
                    alt={selectedDestination.placeName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-xs border border-slate-200"
                  />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                    Selected Destination
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {selectedDestination.placeName}
                  </h2>
                  <p className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>{selectedDestination.city}, {selectedDestination.state}</span>
                  </p>
                  <p className="text-sm text-slate-700 max-w-2xl line-clamp-2 leading-relaxed">
                    {selectedDestination.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
                <Link
                  to="/destinations"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-600" />
                  <span>Change Destination</span>
                </Link>

                <button
                  onClick={() => navigate(`/hotels?placeId=${selectedDestination.placeId}`)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
                >
                  <Hotel className="w-4 h-4" />
                  <span>View Destination Hotels</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-sm text-amber-900 font-medium">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 shrink-0 text-amber-700" />
              <span>No main destination selected yet. You can select one or browse all nearby places.</span>
            </div>
            <Link to="/destinations" className="font-bold underline text-emerald-800 ml-4">
              Choose Destination &rarr;
            </Link>
          </div>
        )}

        {/* Section Heading & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nearby Tourist <span className="text-emerald-700">Places</span>
            </h1>
            <p className="text-base text-slate-600 font-normal mt-1">
              {selectedDestination
                ? `Showing tourist places in and around ${selectedDestination.city}, ${selectedDestination.state}`
                : 'Showing all tourist attractions across regions.'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search places by name or keywords..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-5 h-5 text-slate-600 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
          </div>
        ) : nearbyPlaces.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No nearby places found</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-sm mx-auto">
              No matching tourist places found for this filter. Try clearing filters or selecting another destination.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {nearbyPlaces.map((place) => (
              <TouristPlaceCard
                key={place.placeId}
                place={place}
                onSelectPlace={handleSelectPlaceForHotels}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default NearbyPlaces;
