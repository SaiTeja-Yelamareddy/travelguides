import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Hotel, 
  Search, 
  MapPin, 
  RotateCcw, 
  Filter, 
  Info,
  SlidersHorizontal 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import ProgressTracker from '../components/ProgressTracker';
import HotelCard from '../components/HotelCard';
import { api } from '../services/api';
import { useDestination } from '../context/DestinationContext';

const NearbyHotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedDestination, selectedPlace } = useDestination();

  // Selected placeId from URL query or Context
  const targetPlaceId = searchParams.get('placeId') || selectedPlace?.placeId || selectedDestination?.placeId || '';

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState('');
  const [allPlaces, setAllPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load tourist places to allow filter dropdown
  useEffect(() => {
    api.places.getAll()
      .then((res) => {
        if (res.success && res.data) {
          setAllPlaces(res.data);
          if (targetPlaceId) {
            const found = res.data.find((p) => p.placeId === targetPlaceId);
            if (found) setActivePlace(found);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [targetPlaceId]);

  // Fetch hotels matching placeId and search term
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (targetPlaceId) params.placeId = targetPlaceId;
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (minRating) params.minRating = minRating;

    api.hotels.getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          setHotels(res.data);
        }
      })
      .catch((err) => console.error('Failed to load hotels:', err))
      .finally(() => setLoading(false));
  }, [targetPlaceId, searchTerm, minRating]);

  const handlePlaceFilterChange = (newPlaceId) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPlaceId) {
      newParams.set('placeId', newPlaceId);
    } else {
      newParams.delete('placeId');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Step 3 on Progress Tracker */}
      <ProgressTracker currentStep={3} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 pb-20">
        
        {/* Selected Tourist Place Header Summary */}
        {activePlace ? (
          <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-7 mb-8 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                Linked Tourist Place
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Hotels Near {activePlace.placeName}
              </h2>
              <p className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>{activePlace.city}, {activePlace.state}</span>
              </p>
            </div>

            <button
              onClick={() => handlePlaceFilterChange('')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Show All Hotels</span>
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-300 rounded-2xl flex items-center justify-between text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Viewing all accommodation options. You can filter by a tourist place using the dropdown below.</span>
            </div>
            <Link to="/destinations" className="text-emerald-800 font-bold underline ml-4 shrink-0">
              Select Destination &rarr;
            </Link>
          </div>
        )}

        {/* Section Heading & Search bar matching Page D */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nearby <span className="text-emerald-700">Hotels</span>
            </h1>
            <p className="text-base text-slate-600 font-normal mt-1">
              Find verified accommodation and contact details for your trip.
            </p>
          </div>

          {/* Search Box by Hotel Name */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg w-full">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hotel name..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs"
              />
            </div>

            {/* Filter by Tourist Place Dropdown */}
            <select
              value={targetPlaceId}
              onChange={(e) => handlePlaceFilterChange(e.target.value)}
              className="h-12 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-emerald-700 shrink-0 cursor-pointer shadow-2xs"
            >
              <option value="">All Places</option>
              {allPlaces.map((p) => (
                <option key={p.placeId} value={p.placeId}>
                  {p.placeName} ({p.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
            <Hotel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No hotels found</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-sm mx-auto">
              {activePlace
                ? `Currently no hotels are recorded under ${activePlace.placeName}. Check back soon or browse other nearby destinations.`
                : 'No hotels match your search criteria. Try modifying your search term.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                handlePlaceFilterChange('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Show All Hotels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.hotelId} hotel={hotel} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default NearbyHotels;
