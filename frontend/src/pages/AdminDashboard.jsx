import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Hotel, 
  BarChart3, 
  ArrowRight, 
  Plus, 
  Compass, 
  Clock, 
  Layers 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.admin.getStats()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load admin stats:', err);
        setError('Failed to fetch dashboard metrics from MongoDB');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Overview of published tourism data and administrative controls."
    >
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl font-semibold">
          {error}
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Top Metric Cards calculated directly from MongoDB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Total Tourist Places Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-soft flex items-center justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  Total Tourist Places
                </span>
                <p className="text-4xl font-extrabold text-slate-900 mt-1.5">
                  {stats?.totalPlaces || 0}
                </p>
                <Link
                  to="/admin/places"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 mt-3"
                >
                  <span>Manage Places</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-8 h-8" />
              </div>
            </div>

            {/* Total Hotels Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-soft flex items-center justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  Total Verified Hotels
                </span>
                <p className="text-4xl font-extrabold text-slate-900 mt-1.5">
                  {stats?.totalHotels || 0}
                </p>
                <Link
                  to="/admin/hotels"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 mt-3"
                >
                  <span>Manage Hotels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Hotel className="w-8 h-8" />
              </div>
            </div>

            {/* Tourism Analytics Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-soft flex items-center justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  Tourism Reports
                </span>
                <p className="text-4xl font-extrabold text-slate-900 mt-1.5">
                  {stats?.categoryCounts?.length || 0} Categories
                </p>
                <Link
                  to="/admin/reports"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 mt-3"
                >
                  <span>View Reports</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-8 h-8" />
              </div>
            </div>

          </div>

          {/* Quick Action Navigation Cards (Requirement 7) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link
              to="/admin/places"
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                  Manage Tourist Places
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Add new places, update descriptions, categories, cities, and visiting hours with full CRUD support.
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm font-bold text-emerald-700">
                <span>Open Places Table</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/admin/hotels"
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                  <Hotel className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                  Manage Hotels
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Add accommodation records, associate them with tourist places, update room prices, and set ratings.
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm font-bold text-emerald-700">
                <span>Open Hotels Table</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300 hover:border-emerald-500 shadow-soft card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                  Tourism Reports
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  View aggregated data breakdowns by category, state, city, and hotel associations calculated via MongoDB.
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm font-bold text-emerald-700">
                <span>View Reports</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

          </div>

          {/* Simple Overview of Tourism Data & Recent Places Table */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-soft p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Tourist Places
                </h3>
                <p className="text-sm text-slate-600 font-medium mt-0.5">
                  Latest entries in the MongoDB database
                </p>
              </div>
              <Link
                to="/admin/places"
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-800 uppercase tracking-wider text-xs">
                    <th className="pb-3.5 font-bold">Place ID</th>
                    <th className="pb-3.5 font-bold">Name</th>
                    <th className="pb-3.5 font-bold">Category</th>
                    <th className="pb-3.5 font-bold">Location</th>
                    <th className="pb-3.5 font-bold">Visiting Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentPlaces?.map((p) => (
                    <tr key={p.placeId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 font-mono text-slate-700 font-medium">{p.placeId}</td>
                      <td className="py-3.5 font-bold text-slate-900">{p.placeName}</td>
                      <td className="py-3.5">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-700">{p.city}, {p.state}</td>
                      <td className="py-3.5 text-slate-600">{p.visitingHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
