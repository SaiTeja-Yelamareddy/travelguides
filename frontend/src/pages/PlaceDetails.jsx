import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Heart, 
  Hotel, 
  ArrowLeft, 
  Share2, 
  Check, 
  Compass, 
  ChevronRight 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import { api } from '../services/api';
import { useDestination } from '../context/DestinationContext';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectPlace, toggleFavorite, isFavorited } = useDestination();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.places.getById(id)
      .then((res) => {
        if (res.success && res.data) {
          setPlace(res.data);
          selectPlace(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load tourist place details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    if (place) {
      await toggleFavorite(place.placeId);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-sm text-slate-600 mb-4">{error || 'Tourist place not found.'}</p>
          <Link
            to="/destinations"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
          >
            Back to Destinations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const favorited = isFavorited(place.placeId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm text-slate-700 font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors shadow-2xs cursor-pointer ${
                favorited
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
              <span>{favorited ? 'Saved to Favorites' : 'Save Favorite'}</span>
            </button>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-soft overflow-hidden">
          
          {/* Header Image banner if present */}
          {place.imageUrl && (
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-100">
              <img
                src={place.imageUrl}
                alt={place.placeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white inline-block mb-2.5 shadow-xs">
                  {place.category}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  {place.placeName}
                </h1>
                <p className="flex items-center gap-2 text-base text-slate-200 mt-1 font-medium">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>{place.city}, {place.state}</span>
                </p>
              </div>
            </div>
          )}

          {/* Details Content */}
          <div className="p-6 sm:p-10">
            {!place.imageUrl && (
              <div className="mb-6">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block mb-2.5">
                  {place.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {place.placeName}
                </h1>
                <p className="flex items-center gap-2 text-base text-slate-600 mt-1 font-medium">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <span>{place.city}, {place.state}</span>
                </p>
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Destination Category
                </span>
                <p className="text-base font-bold text-slate-900">{place.category}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Visiting Hours
                </span>
                <p className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>{place.visitingHours}</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                About {place.placeName}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {place.description}
              </p>
            </div>

            {/* Action Bar */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Planning a visit to {place.placeName}?
                </h3>
                <p className="text-sm text-emerald-800 mt-1 font-medium">
                  Explore verified hotels near {place.city} for comfortable stays.
                </p>
              </div>

              <button
                onClick={() => {
                  selectPlace(place);
                  navigate(`/hotels?placeId=${place.placeId}`);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <Hotel className="w-5 h-5" />
                <span>View Associated Hotels</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlaceDetails;
