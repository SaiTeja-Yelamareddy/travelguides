import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Shield, LogOut } from 'lucide-react';
import { Logo } from './Navbar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      {/* Admin Sidebar with EXACTLY 5 options */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              aria-label="Open admin navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Logo size="normal" showTagline={false} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 text-right">
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-slate-600 font-medium">{user?.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                A
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Admin View Container */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </main>

      {/* Minimal clean admin footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-600 font-medium">
        TravelGuide Administration Portal &bull; System Version 1.0 &bull; Real MongoDB Engine
      </footer>
    </div>
  );
};

export default AdminLayout;
