import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  MapPin, 
  Phone, 
  IndianRupee, 
  X, 
  AlertCircle 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmationModal from '../components/ConfirmationModal';
import { api } from '../services/api';

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlaceId, setFilterPlaceId] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Exact fields from project specification + imageUrl
  const initialForm = {
    hotelName: '',
    placeId: '',
    address: '',
    contactNumber: '',
    roomPrice: '',
    rating: '4.5',
    imageUrl: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Load existing places for dropdown
  useEffect(() => {
    api.places.getAll()
      .then((res) => {
        if (res.success && res.data) {
          setPlaces(res.data);
          if (res.data.length > 0 && !formData.placeId) {
            setFormData((prev) => ({ ...prev, placeId: res.data[0].placeId }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchHotels = () => {
    setLoading(true);
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (filterPlaceId) params.placeId = filterPlaceId;

    api.hotels.getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          setHotels(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
  }, [searchTerm, filterPlaceId]);

  const handleOpenAddModal = () => {
    setEditingHotel(null);
    setFormData({
      ...initialForm,
      placeId: places.length > 0 ? places[0].placeId : '',
      imageUrl: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      hotelName: hotel.hotelName || '',
      placeId: hotel.placeId || '',
      address: hotel.address || '',
      contactNumber: hotel.contactNumber || '',
      roomPrice: hotel.roomPrice || '',
      rating: hotel.rating || '4.5',
      imageUrl: hotel.imageUrl || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.hotelName || !formData.placeId || !formData.address || !formData.contactNumber || !formData.roomPrice || !formData.rating) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setModalLoading(true);
    try {
      if (editingHotel) {
        await api.hotels.update(editingHotel.hotelId, formData);
      } else {
        await api.hotels.create(formData);
      }
      setIsModalOpen(false);
      fetchHotels();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (hotel) => {
    setHotelToDelete(hotel);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;
    setDeleteLoading(true);
    try {
      await api.hotels.delete(hotelToDelete.hotelId);
      setDeleteModalOpen(false);
      setHotelToDelete(null);
      fetchHotels();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Manage Hotels"
      subtitle="Associate accommodation records with tourist destinations with complete CRUD support."
    >
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by hotel name..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base bg-white focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 font-medium shadow-2xs"
            />
          </div>

          <select
            value={filterPlaceId}
            onChange={(e) => setFilterPlaceId(e.target.value)}
            className="h-12 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-emerald-700 shrink-0 shadow-2xs cursor-pointer"
          >
            <option value="">All Linked Destinations</option>
            {places.map((p) => (
              <option key={p.placeId} value={p.placeId}>
                {p.placeName} ({p.city})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-base text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Hotel</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-700 border-t-transparent" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-16 p-6">
            <p className="text-base text-slate-600 font-medium">No hotels found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-300 text-slate-800 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-4 px-4 font-bold">Hotel ID</th>
                  <th className="py-4 px-4 font-bold">Hotel Name</th>
                  <th className="py-4 px-4 font-bold">Linked Destination</th>
                  <th className="py-4 px-4 font-bold">Address</th>
                  <th className="py-4 px-4 font-bold">Contact</th>
                  <th className="py-4 px-4 font-bold">Room Tariff</th>
                  <th className="py-4 px-4 font-bold">Rating</th>
                  <th className="py-4 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotels.map((hotel) => (
                  <tr key={hotel.hotelId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-700 text-sm font-semibold">
                      {hotel.hotelId}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 text-base">
                      <div className="flex items-center gap-3">
                        {hotel.imageUrl ? (
                          <img
                            src={hotel.imageUrl}
                            alt={hotel.hotelName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                            <Hotel className="w-5 h-5" />
                          </div>
                        )}
                        <span>{hotel.hotelName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {hotel.placeDetails ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {hotel.placeDetails.placeName}
                        </span>
                      ) : (
                        <span className="font-mono text-slate-600 text-sm">{hotel.placeId}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium max-w-xs truncate text-sm" title={hotel.address}>
                      {hotel.address}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium text-sm">
                      {hotel.contactNumber}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 text-base">
                      ₹{hotel.roomPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-700 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{Number(hotel.rating).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(hotel)}
                          className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit hotel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(hotel)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete hotel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-150 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingHotel ? 'Edit Hotel Details' : 'Add New Hotel'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                  placeholder="e.g. The Oberoi Amarvilas"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Associated Tourist Place (placeId) *
                </label>
                <select
                  value={formData.placeId}
                  onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-emerald-700 font-medium"
                >
                  {places.map((p) => (
                    <option key={p.placeId} value={p.placeId}>
                      {p.placeName} ({p.city}, {p.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, City, State, PIN"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="+91 562 223 1504"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Room Price (₹/Night) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={formData.roomPrice}
                    onChange={(e) => setFormData({ ...formData, roomPrice: e.target.value })}
                    placeholder="e.g. 5200"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Rating (1.0 to 5.0) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="e.g. 4.7"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Hotel Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs"
                >
                  {modalLoading ? 'Saving...' : editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Hotel Record"
        message={`Are you sure you want to delete "${hotelToDelete?.hotelName}"? This action will remove the hotel permanently from MongoDB.`}
        confirmText="Delete Hotel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setHotelToDelete(null);
        }}
        loading={deleteLoading}
      />
    </AdminLayout>
  );
};

export default AdminHotels;
