import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  Hotel, 
  Heart, 
  Camera, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      if (res.success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/destinations');
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-md border border-slate-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
          
          {/* Left Hero Graphic Section matching Image 2 */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white overflow-hidden">
            {/* Background Iconic Indian Architecture (Hawa Mahal, Jaipur) */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=85"
                alt="Iconic Hawa Mahal Jaipur"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-slate-900/40" />
            </div>

            <div className="relative z-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-emerald-300 block mb-2">
                JOIN OUR COMMUNITY
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">
                Start Your Travel Journey with <span className="text-emerald-400">TravelGuide</span>
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed max-w-xs">
                Create your account and explore beautiful tourist destinations across India.
              </p>
            </div>

            {/* Checklist matching Image 2 */}
            <div className="relative z-10 space-y-4 my-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold">Discover Places</h4>
                  <p className="text-xs sm:text-sm text-slate-200">Explore amazing tourist destinations</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Hotel className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold">Find Hotels</h4>
                  <p className="text-xs sm:text-sm text-slate-200">Get reliable hotel information</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold">Save Favorites</h4>
                  <p className="text-xs sm:text-sm text-slate-200">Keep track of places you love</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold">Plan Your Trips</h4>
                  <p className="text-xs sm:text-sm text-slate-200">Explore attractions and travel tips</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs text-slate-200 font-medium">
              © 2026 TravelGuide. All rights reserved.
            </div>
          </div>

          {/* Right Form Section */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Create an <span className="text-emerald-700">Account</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal mt-1 mb-6">
                Join TravelGuide and start exploring India's beautiful destinations.
              </p>

              {/* Error & Success Messages */}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-2xs font-normal"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-2xs font-normal"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3.5 h-12 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-700 font-semibold shrink-0">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-2xs font-normal"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
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
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-300 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 shadow-2xs font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-slate-700 font-medium select-none">
                    I agree to the{' '}
                    <span className="text-emerald-800 font-semibold cursor-pointer hover:underline">
                      Terms & Conditions
                    </span>{' '}
                    and{' '}
                    <span className="text-emerald-800 font-semibold cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 px-6 rounded-xl font-semibold text-base text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] transition-all shadow-md shadow-emerald-950/20 disabled:opacity-70 mt-2 cursor-pointer flex items-center justify-center"
                >
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Login link */}
              <div className="text-center mt-6">
                <p className="text-sm text-slate-600 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-emerald-800 font-bold hover:underline">
                    Login here &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
