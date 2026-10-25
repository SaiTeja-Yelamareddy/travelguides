import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart, 
  Home, 
  Info, 
  Phone,
  Compass,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Logo = ({ size = 'normal', showTagline = true }) => (
  <Link to="/" className="flex items-center gap-2.5 group shrink-0">
    <div className="relative flex items-center justify-center">
      {/* Mountain Logo SVG matching reference */}
      <svg className={`${size === 'large' ? 'w-10 h-10' : 'w-8 h-8'} transition-transform group-hover:scale-105`} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="14" fill="#F59E0B" />
        <path d="M5 75 L38 25 L65 75 Z" fill="#047857" />
        <path d="M32 75 L58 35 L88 75 Z" fill="#059669" />
        <path d="M55 75 L75 45 L98 75 Z" fill="#10B981" />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-slate-900 font-extrabold text-lg sm:text-xl tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
        Travel<span className="text-emerald-700">Guide</span>
      </span>
      {showTagline && (
        <span className="text-[9px] sm:text-[10px] text-slate-600 font-medium tracking-wider mt-0.5 whitespace-nowrap">
          Explore . Discover . Experience
        </span>
      )}
    </div>
  </Link>
);

const Navbar = ({ onToggleSidebar, isAdminView = false }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Landing page sections to show in public navigation
  const publicNavLinks = [
    { name: 'Home', id: 'home', path: '/#home', icon: Home },
    { name: 'Popular Destinations', id: 'popular', path: '/#popular', icon: MapPin },
    { name: 'Why Choose Us', id: 'why-choose-us', path: '/#why-choose-us', icon: Info },
    { name: 'Experiences', id: 'experiences', path: '/#experiences', icon: Compass },
    { name: 'Contact', id: 'contact', path: '/#contact', icon: Phone },
  ];

  // Track active section on scroll when on landing page
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const currentHash = location.hash.replace('#', '');
    if (currentHash) {
      setActiveSection(currentHash);
    } else {
      setActiveSection('home');
    }

    const sectionIds = ['home', 'popular', 'why-choose-us', 'experiences', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // offset for fixed header
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, link) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const target = document.getElementById(link.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${link.id}`);
        setActiveSection(link.id);
      }
    } else {
      navigate(`/#${link.id}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-150/80 shadow-2xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Left section: Hamburger (SHOWS ONLY FOR AUTHENTICATED USERS) + Logo at left corner */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                aria-label="Open user navigation drawer"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            <Logo />
          </div>

          {/* Center section: Navigation for Landing Page Sections */}
          {!isAdminView && (!isAuthenticated || location.pathname === '/') && (
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
              {publicNavLinks.map((link) => {
                const active = location.pathname === '/' && activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`text-xs lg:text-sm transition-colors relative py-1 cursor-pointer ${
                      active
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-900 hover:text-emerald-700 font-medium'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-700 rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>
          )}

        {/* Right section: Authentication controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            /* Authenticated User Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 pr-3 sm:pr-3.5 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all focus:outline-none cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:inline-block max-w-[120px] truncate">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>

                  {/* 1. My Favorites */}
                  <Link
                    to="/favorites"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Favorites</span>
                  </Link>

                  {/* 2. My Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>My Profile</span>
                  </Link>

                  {/* 3. Logout */}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Public Desktop & Mobile Buttons */
            <>
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-emerald-700 border border-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Register
                </Link>
              </div>

              {/* Mobile Menu Button for unauthenticated view */}
              <div className="flex md:hidden items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-700 rounded-md hover:bg-emerald-50"
                >
                  Login
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Mobile Navigation Drawer for Unauthenticated visitors */}
      {!isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 shadow-md animate-in slide-from-top-2">
          {publicNavLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === '/' && activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.path}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link);
                }}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-sm transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-900 hover:bg-slate-50 hover:text-emerald-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-700' : 'text-slate-600'}`} />
                  <span>{link.name}</span>
                </div>
                {active && (
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                )}
              </a>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-semibold text-emerald-700 border border-emerald-700 rounded-lg hover:bg-emerald-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg shadow-sm hover:bg-emerald-800"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
    {/* Spacer so page content begins exactly underneath the fixed header */}
    <div className="h-18 sm:h-20 w-full shrink-0" aria-hidden="true" />
  </>
  );
};

export default Navbar;
