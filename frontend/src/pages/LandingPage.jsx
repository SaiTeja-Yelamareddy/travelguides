import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Map, 
  Hotel, 
  Camera, 
  Heart, 
  ChevronRight,
  Mail,
  Phone,
  Send,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DestinationCard from '../components/DestinationCard';
import UserSidebar from '../components/UserSidebar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDestination } from '../context/DestinationContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectDestination } = useDestination();
  
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    api.places.getAll({ popular: 'true' })
      .then((res) => {
        if (res.success && res.data) {
          setPopularPlaces(res.data.slice(0, 4));
        }
      })
      .catch((err) => console.error('Failed to load popular places:', err))
      .finally(() => setLoading(false));
  }, []);

  // Explore Destinations CTA Handler (Requirement 2)
  const handleExploreClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/destinations');
    } else {
      navigate('/login', { state: { from: { pathname: '/destinations' } } });
    }
  };

  const handleSelectPlace = (place) => {
    selectDestination(place);
    if (isAuthenticated) {
      navigate('/nearby-places');
    } else {
      navigate('/login', { state: { from: { pathname: '/nearby-places' } } });
    }
  };

  const handleCategoryClick = (cat) => {
    const targetPath = `/destinations?category=${encodeURIComponent(cat.category)}`;
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate('/login', { state: { from: { pathname: targetPath } } });
    }
  };

  const whyChooseItems = [
    {
      icon: Map,
      title: 'Curated Destinations',
      desc: 'Explore the best tourist places across India.',
      color: 'bg-emerald-500 text-white',
    },
    {
      icon: Hotel,
      title: 'Verified Hotels',
      desc: 'Find nearby and reliable accommodation options.',
      color: 'bg-blue-500 text-white',
    },
    {
      icon: Camera,
      title: 'Attractions & Information',
      desc: 'Get detailed information about each destination.',
      color: 'bg-amber-500 text-white',
    },
    {
      icon: Heart,
      title: 'Save Your Favorites',
      desc: 'Keep track of places you love to visit.',
      color: 'bg-rose-500 text-white',
    },
  ];

  const experienceCategories = [
    {
      title: 'Historical Places',
      category: 'Historical',
      img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Hill Stations',
      category: 'Hill Station',
      img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Beaches',
      category: 'Beach',
      img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Adventure',
      category: 'Adventure',
      img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* User Sidebar Drawer (Only accessible when authenticated) */}
      {isAuthenticated && (
        <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section id="home" className="relative w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[680px] flex items-center justify-center overflow-hidden bg-slate-950 scroll-mt-20">
          {/* Background Majestic Indian Tourism Landscape (Taj Mahal Sunrise) */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&auto=format&fit=crop&q=85"
              alt="Incredible Indian Tourist Destination at Sunrise"
              className="w-full h-full object-cover object-center"
            />
            {/* Elegant Gradient Overlays for optimal readability and rich contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/25" />
          </div>

          <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 flex items-center justify-between">
            <div className="max-w-2xl text-white">
              <span className="inline-block text-xs sm:text-sm uppercase tracking-widest font-semibold text-emerald-300 mb-4 bg-emerald-950/70 px-4 py-1.5 rounded-full border border-emerald-500/40 backdrop-blur-md">
                Discover Amazing Places
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-5 drop-shadow-md">
                Explore Incredible Tourist{' '}
                <span className="text-emerald-400">Destinations</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-100 mb-8 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
                Discover beautiful places, find nearby hotels, explore attractions and plan your perfect trip across India.
              </p>

              <div>
                <button
                  type="button"
                  onClick={handleExploreClick}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base sm:text-lg bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white shadow-xl shadow-emerald-950/50 hover:translate-x-1 transition-all cursor-pointer"
                >
                  <span>Explore Destinations</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Popular Destinations Section */}
        <section id="popular" className="py-16 sm:py-24 bg-slate-50/70 scroll-mt-20 border-b border-slate-300">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Popular <span className="text-emerald-700">Destinations</span>
              </h2>
              <p className="text-base text-slate-600 font-normal mt-3">
                Explore some of the most visited and beautiful tourist places across India
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
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
        </section>

        {/* 3. Why Choose TravelGuide Section */}
        <section id="why-choose-us" className="py-16 sm:py-24 bg-white scroll-mt-20 relative border-b border-slate-300">
          <div id="about" className="absolute -top-20" />
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Why Choose <span className="text-emerald-700">TravelGuide?</span>
              </h2>
              <p className="text-base text-slate-600 font-normal mt-3">
                Your trusted companion for exploring India's most amazing destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl border border-slate-300 bg-white shadow-sm text-center hover:border-emerald-600 card-hover flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${item.color} shadow-sm`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base text-slate-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Featured Experiences Section */}
        <section id="experiences" className="py-16 sm:py-24 bg-slate-50/70 scroll-mt-20 border-b border-slate-300">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Featured <span className="text-emerald-700">Experiences</span>
              </h2>
              <p className="text-base text-slate-600 font-normal mt-3">
                Discover different types of destinations for every kind of traveler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experienceCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-300 card-hover"
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                    <span className="font-bold text-lg drop-shadow-sm">
                      {cat.title}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Scenic Banner (Moved before Contact for natural page flow) */}
        <section className="relative py-20 sm:py-24 overflow-hidden border-b border-slate-300">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&auto=format&fit=crop&q=85"
              alt="Himalayan Mountain Golden Sunset"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-slate-950/85 backdrop-blur-[0.5px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
              Travel Far, Discover More
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-4">
              Create Unforgettable Memories
            </h3>
            <p className="text-base sm:text-lg text-slate-100 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
              Let TravelGuide help you explore the most beautiful places in India.
            </p>
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-base bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-950/50 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 6. Contact Section (#contact) - Placed naturally right above Footer */}
        <section id="contact" className="py-16 sm:py-24 bg-slate-50 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-300 inline-block mb-3">
                Get in Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Contact <span className="text-emerald-700">TravelGuide</span>
              </h2>
              <p className="text-base text-slate-600 mt-2 max-w-xl mx-auto">
                Have questions or need assistance with your travel plans? We're here to help.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-300 shadow-md">
              {contactSubmitted ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-base text-slate-600 font-normal mt-1 max-w-md mx-auto">
                    Thank you for reaching out. Our tourism support team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-12 sm:h-13 px-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full h-12 sm:h-13 px-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all font-normal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Destination inquiry or travel assistance"
                      className="w-full h-12 sm:h-13 px-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can we assist you with exploring India's destinations?"
                      className="w-full min-h-[140px] p-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all font-normal"
                    />
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
