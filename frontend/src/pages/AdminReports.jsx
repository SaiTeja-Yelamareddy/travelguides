import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MapPin, 
  Hotel, 
  Layers, 
  Map, 
  Star, 
  IndianRupee,
  RefreshCw 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = () => {
    setLoading(true);
    api.admin.getReports()
      .then((res) => {
        if (res.success && res.data) {
          setReports(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load tourism reports:', err);
        setError('Failed to compute reports from MongoDB.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Compute maximum category count for visual percentage bars
  const maxCategoryCount = reports?.byCategory?.length
    ? Math.max(...reports.byCategory.map((c) => c.count))
    : 1;

  // Compute maximum state count
  const maxStateCount = reports?.byState?.length
    ? Math.max(...reports.byState.map((s) => s.count))
    : 1;

  return (
    <AdminLayout
      title="Tourism Reports & Analytics"
      subtitle="Data aggregations computed directly from MongoDB database records."
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">
            Source: Live MongoDB Collections (TouristPlaces &amp; Hotels)
          </span>
        </div>
        <button
          onClick={loadReports}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-700 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl font-semibold">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-soft flex items-center justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  Total Tourist Places
                </span>
                <p className="text-4xl font-extrabold text-slate-900 mt-1.5">
                  {reports?.totalPlaces || 0}
                </p>
                <p className="text-sm text-emerald-700 font-semibold mt-2">
                  Across {reports?.byState?.length || 0} Indian States
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-soft flex items-center justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
                  Total Verified Hotels
                </span>
                <p className="text-4xl font-extrabold text-slate-900 mt-1.5">
                  {reports?.totalHotels || 0}
                </p>
                <p className="text-sm text-sky-600 font-semibold mt-2">
                  Linked across destination hubs
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Hotel className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Report 1: Places Grouped by Category */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-soft p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Tourist Places Grouped by Category
                </h3>
                <p className="text-sm text-slate-600 font-medium mt-0.5">
                  Distribution of destinations across tourism niches
                </p>
              </div>
            </div>

            {reports?.byCategory?.length === 0 ? (
              <p className="text-sm text-slate-600 py-4">No categories recorded.</p>
            ) : (
              <div className="space-y-4">
                {reports?.byCategory?.map((cat) => {
                  const percentage = Math.round((cat.count / maxCategoryCount) * 100);
                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-900">{cat.category}</span>
                        <span className="text-emerald-700">{cat.count} places</span>
                      </div>
                      <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Report 2: Places Grouped by State & City */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* By State */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Places Grouped by State
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Regional concentration of tourist places
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {reports?.byState?.map((st) => (
                  <div
                    key={st.state}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-bold text-slate-900">{st.state}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      {st.count} {st.count === 1 ? 'place' : 'places'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* By City */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Places Grouped by City
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    City-level destination clusters
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {reports?.byCity?.map((ct) => (
                  <div
                    key={ct.city}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="font-bold text-slate-900">{ct.city}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
                      {ct.count} {ct.count === 1 ? 'place' : 'places'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Report 3: Hotels Grouped by Associated Tourist Place */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Hotels Grouped by Associated Tourist Place
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Accommodation inventory, average ratings, and average tariffs per destination
                </p>
              </div>
            </div>

            {reports?.hotelsByPlace?.length === 0 ? (
              <p className="text-xs text-slate-600 py-4">No associated hotels found in the database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Associated Tourist Place</th>
                      <th className="py-3 px-4 font-bold">City</th>
                      <th className="py-3 px-4 font-bold text-center">Hotel Count</th>
                      <th className="py-3 px-4 font-bold text-center">Avg Rating</th>
                      <th className="py-3 px-4 font-bold text-right">Avg Room Tariff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports?.hotelsByPlace?.map((row) => (
                      <tr key={row.placeId} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {row.placeName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {row.city}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {row.hotelCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 font-bold text-amber-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{row.avgRating || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-right">
                          ₹{Number(row.avgPrice || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReports;
