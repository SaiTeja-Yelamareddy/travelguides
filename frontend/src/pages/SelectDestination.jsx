import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Sparkles, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import ProgressTracker from '../components/ProgressTracker';
import DestinationCard from '../components/DestinationCard';
import { api } from '../services/api';
import { useDestination } from '../context/DestinationContext';

const SelectDestination = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectDestination, selectedDestination } = useDestination();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = ['All', 'Historical', 'Hill Station', 'Beach', 'Adventure', 'Nature', 'Temple'];

  const fetchDestinations = (search = '', category = 'All') => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category && category !== 'All') params.category = category;

    api.places.getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          setPlaces(res.data);
        }
      })
      .catch((err) => console.error('Failed to fetch destinations:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
    fetchDestinations(urlSearch, urlCategory);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
    fetchDestinations(searchTerm, selectedCategory);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== 'All') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    fetchDestinations(searchTerm, cat);
  };

  const handleSelect = (place) => {
    selectDestination(place);
    navigate('/nearby-places');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* 3-Step Progress Indicator (Image 5) */}
      <ProgressTracker currentStep={1} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 pb-20">
        
        {/* Header & Search Bar matching Image 5 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Select a Tourist <span className="text-emerald-700">Destination</span>
            </h1>
            <p className="text-base text-slate-600 font-normal mt-1">
              Choose a destination to explore amazing places.
            </p>
          </div>

          {/* Search Box on right side matching Image 5 */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tourist destinations..."
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-7 rounded-xl font-bold text-base text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-5 h-5 text-slate-600 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
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

        {/* Destination Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any destination matching "{searchTerm}". Try clearing your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                fetchDestinations('', 'All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {places.map((place) => (
              <DestinationCard
                key={place.placeId}
                place={place}
                onSelect={handleSelect}
                isSelected={selectedDestination?.placeId === place.placeId}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default SelectDestination;
