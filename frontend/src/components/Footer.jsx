import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, Heart } from 'lucide-react';
import { Logo } from './Navbar';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-300 pt-16 pb-10 text-slate-700">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-300">
          
          {/* Col 1: Logo & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="normal" showTagline={true} />
            <p className="text-base text-slate-600 max-w-sm leading-relaxed mt-3 font-normal">
              Discover amazing places, find nearby hotels, explore attractions and plan your perfect trip with TravelGuide. Your trusted companion for exploring India's incredible heritage and beauty.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-500 transition-colors shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-500 transition-colors shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-500 transition-colors shadow-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-500 transition-colors shadow-xs"
                aria-label="X Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link to="/" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <a href="/#why-choose-us" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Destinations */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
              Destinations
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link to="/destinations?search=Taj+Mahal" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Taj Mahal
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Nainital" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Nainital
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Goa" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Goa
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Manali" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Manali
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-emerald-700 font-semibold hover:underline">
                  More Places &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <a href="/#contact" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-slate-700 hover:text-emerald-700 font-medium transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 font-medium gap-4">
          <p>© 2026 TravelGuide. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
