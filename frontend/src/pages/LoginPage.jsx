import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Please enter both email/username and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email.trim(), password, loginType);
      if (res.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (res.user.role === 'admin' && loginType === 'admin') {
            navigate('/admin/dashboard');
          } else {
            const redirectUrl = location.state?.from?.pathname || '/destinations';
            navigate(redirectUrl);
          }
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your login details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick fill helper for review
  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setLoginType('admin');
      setEmail('admin@travelguide.com');
      setPassword('AdminPassword123!');
    } else {
      setLoginType('user');
      setEmail('saiteja@example.com');
      setPassword('Password123!');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-md border border-slate-300 p-8 sm:p-10">
          
          {/* Top Pill Switch: User Login / Admin Login (Images 3 & 4) */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-8 border border-slate-300">
            <button
              type="button"
              onClick={() => {
                setLoginType('user');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                loginType === 'user'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>User Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                loginType === 'admin'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loginType === 'admin' ? 'Admin' : 'User'}{' '}
              <span className="text-emerald-700">Login</span>
            </h2>
            <p className="text-sm text-slate-600 font-normal mt-1.5 max-w-xs mx-auto">
              {loginType === 'admin'
                ? 'Login with administrator credentials to manage tourism data and reports.'
                : 'Login to your TravelGuide account and continue exploring amazing destinations.'}
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-2xs font-normal"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-2xs font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 px-6 rounded-xl font-semibold text-base text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all shadow-md shadow-emerald-950/20 disabled:opacity-70 mt-2 cursor-pointer flex items-center justify-center"
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Quick Credential Helpers */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center mb-2.5">
              Demo Credentials
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('user')}
                className="flex-1 text-xs sm:text-sm py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-800 font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                Sai Teja (User)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex-1 text-xs sm:text-sm py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-800 font-semibold transition-colors cursor-pointer border border-slate-200"
              >
                Admin Account
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            {loginType === 'user' ? (
              <p className="text-sm text-slate-600 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-700 font-bold hover:underline">
                  Register here &rarr;
                </Link>
              </p>
            ) : (
              <p className="text-sm text-slate-600 font-medium">
                Protected system area for authorized administrators.
              </p>
            )}
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              For demo safety, use your seeded credentials:
              <br />
              <strong className="text-slate-800">User:</strong> saiteja@example.com / Password123!
              <br />
              <strong className="text-slate-800">Admin:</strong> admin@travelguide.com / AdminPassword123!
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
