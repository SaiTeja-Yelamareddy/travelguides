import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Hotel, 
  MapPin, 
  Phone, 
  Star, 
  IndianRupee, 
  ArrowLeft, 
  Share2, 
  Check, 
  Compass, 
  Wifi, 
  ShieldCheck, 
  Coffee, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import { api } from '../services/api';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.hotels.getById(id)
      .then((res) => {
        if (res.success && res.data) {
          setHotel(res.data);
        } else {
          setError('Hotel details could not be retrieved.');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch hotel details:', err);
        setError('Failed to load hotel details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-base text-slate-700 font-medium mb-4">{error || 'Hotel not found.'}</p>
          <Link
            to="/hotels"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800"
          >
            Back to Hotels
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const amenities = [
    { name: 'High-Speed Wi-Fi', icon: Wifi },
    { name: 'Complimentary Breakfast', icon: Coffee },
    { name: '24/7 Front Desk & Security', icon: ShieldCheck },
    { name: 'Flexible Check-in / Out', icon: Clock }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        
        {/* Navigation & Actions Top Bar */}
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

            <a
              href={`tel:${hotel.contactNumber}`}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call Hotel</span>
            </a>
          </div>
        </div>

        {/* Main Hotel Details Card */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-soft overflow-hidden">
          
          {/* Header Image Banner */}
          {hotel.imageUrl ? (
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-100">
              <img
                src={hotel.imageUrl}
                alt={hotel.hotelName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  {hotel.placeDetails && (
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white inline-block mb-2.5 shadow-xs">
                      Near {hotel.placeDetails.placeName} ({hotel.placeDetails.city})
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                    {hotel.hotelName}
                  </h1>
                  <p className="flex items-center gap-2 text-base text-slate-200 mt-2 font-medium">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{hotel.address}</span>
                  </p>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 border border-amber-200 shadow-md shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span className="text-lg font-extrabold">{Number(hotel.rating).toFixed(1)}</span>
                  <span className="text-xs text-slate-600 font-semibold">/ 5.0 Rating</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 border-b border-slate-200 bg-slate-50">
              {hotel.placeDetails && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block mb-2">
                  Near {hotel.placeDetails.placeName} ({hotel.placeDetails.city})
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {hotel.hotelName}
              </h1>
              <p className="flex items-center gap-2 text-base text-slate-600 mt-1 font-medium">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{hotel.address}</span>
              </p>
            </div>
          )}

          {/* Details Content */}
          <div className="p-6 sm:p-10">
            
            {/* Quick Tariff & Booking Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              {/* Tariff Card */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                    Room Tariff per Night
                  </span>
                  <div className="flex items-baseline text-slate-900 font-extrabold text-3xl sm:text-4xl">
                    <IndianRupee className="w-6 h-6 text-emerald-700 self-center" />
                    <span>{hotel.roomPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-normal text-slate-600 ml-1.5">/ night</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-800 font-medium mt-3">
                  Verified tariff for double occupancy rooms.
                </p>
              </div>

              {/* Contact Information */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Front Desk Direct Contact
                  </span>
                  <a
                    href={`tel:${hotel.contactNumber}`}
                    className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-emerald-700 transition-colors block mt-1"
                  >
                    {hotel.contactNumber}
                  </a>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-3">
                  Available for booking inquiries and check-in confirmation.
                </p>
              </div>

              {/* Linked Destination Place */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Nearby Tourist Attraction
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">
                    {hotel.placeDetails?.placeName || hotel.placeId}
                  </h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {hotel.placeDetails?.city}, {hotel.placeDetails?.state}
                  </p>
                </div>
                <Link
                  to={`/places/${hotel.placeId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-3"
                >
                  <span>Explore Destination Place &rarr;</span>
                </Link>
              </div>

            </div>

            {/* Hotel Amenities */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>Featured Amenities &amp; Services</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {amenities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3 shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location & Directions */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Location &amp; Address
              </h2>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold text-slate-900">{hotel.address}</p>
                    <p className="text-sm text-slate-600 mt-0.5">Conveniently situated near major transportation and sight-seeing hubs.</p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.hotelName} ${hotel.address}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shrink-0 shadow-2xs"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-700" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Action Callout */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to reserve your stay at {hotel.hotelName}?
                </h3>
                <p className="text-sm text-emerald-800 mt-1 font-medium">
                  Call the hotel directly to check current room availability and confirm special rates.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`tel:${hotel.contactNumber}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call {hotel.contactNumber}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;
