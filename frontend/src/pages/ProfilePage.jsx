import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  LogOut, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ProfilePage = () => {
  const { user, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.auth.updateProfile({ name: name.trim() });
      if (res.success && res.user) {
        updateCurrentUser(res.user);
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-8 sm:p-12">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-200 text-center sm:text-left">
            <div className="w-22 h-22 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-3xl shadow-md shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5">
                <h1 className="text-3xl font-extrabold text-slate-900">{user?.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {user?.role}
                </span>
              </div>
              <p className="text-base text-slate-600 font-medium">{user?.email}</p>
              <p className="text-sm text-slate-500 mt-1">
                Member ID: <span className="font-mono text-slate-700 font-semibold">{user?.userId}</span>
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Profile Edit Form */}
          <form onSubmit={handleUpdate} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base font-medium focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Email Address (Registered)
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-medium text-base cursor-not-allowed shadow-2xs"
                />
              </div>
              <p className="text-sm text-slate-600 mt-1.5 font-normal">
                Email is tied to your account identity and cannot be edited directly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-bold text-base text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-base text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
