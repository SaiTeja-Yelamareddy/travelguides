import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MapPin, 
  Clock, 
  X, 
  Check, 
  AlertCircle,
  Filter 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmationModal from '../components/ConfirmationModal';
import { api } from '../services/api';

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form inputs matching project fields exactly
  const initialForm = {
    placeName: '',
    category: 'Historical',
    city: '',
    state: '',
    description: '',
    visitingHours: '',
    imageUrl: '',
    isPopular: false
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = ['All', 'Historical', 'Hill Station', 'Beach', 'Adventure', 'Nature', 'Temple'];

  const fetchPlaces = () => {
    setLoading(true);
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;

    api.places.getAll(params)
      .then((res) => {
        if (res.success && res.data) {
          setPlaces(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlaces();
  }, [searchTerm, selectedCategory]);

  const handleOpenAddModal = () => {
    setEditingPlace(null);
    setFormData(initialForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (place) => {
    setEditingPlace(place);
    setFormData({
      placeName: place.placeName || '',
      category: place.category || 'Historical',
      city: place.city || '',
      state: place.state || '',
      description: place.description || '',
      visitingHours: place.visitingHours || '',
      imageUrl: place.imageUrl || '',
      isPopular: place.isPopular || false
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.placeName || !formData.city || !formData.state || !formData.description || !formData.visitingHours) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setModalLoading(true);
    try {
      if (editingPlace) {
        await api.places.update(editingPlace.placeId, formData);
      } else {
        await api.places.create(formData);
      }
      setIsModalOpen(false);
      fetchPlaces();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (place) => {
    setPlaceToDelete(place);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!placeToDelete) return;
    setDeleteLoading(true);
    try {
      await api.places.delete(placeToDelete.placeId);
      setDeleteModalOpen(false);
      setPlaceToDelete(null);
      fetchPlaces();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Manage Tourist Places"
      subtitle="Create, view, update, and delete tourist destination records in MongoDB."
    >
      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          {/* Search by Place Name */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by place name, city, state..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 text-slate-900 text-base bg-white focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 font-medium shadow-2xs"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-12 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-emerald-700 shrink-0 shadow-2xs cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Add Tourist Place Button */}
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-base text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Tourist Place</span>
        </button>
      </div>

      {/* Places Table */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-700 border-t-transparent" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 p-6">
            <p className="text-base text-slate-600 font-medium">No tourist places found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-300 text-slate-800 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-4 px-4 font-bold">Place ID</th>
                  <th className="py-4 px-4 font-bold">Place Name</th>
                  <th className="py-4 px-4 font-bold">Category</th>
                  <th className="py-4 px-4 font-bold">Location</th>
                  <th className="py-4 px-4 font-bold">Visiting Hours</th>
                  <th className="py-4 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {places.map((place) => (
                  <tr key={place.placeId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-700 text-sm font-semibold">
                      {place.placeId}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 text-base">
                      {place.placeName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {place.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium text-sm">
                      {place.city}, {place.state}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-sm">
                      {place.visitingHours}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(place)}
                          className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit place"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(place)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete place"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-150 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPlace ? 'Edit Tourist Place' : 'Add New Tourist Place'}
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
                  Place Name *
                </label>
                <input
                  type="text"
                  value={formData.placeName}
                  onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                  placeholder="e.g. Taj Mahal"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:border-emerald-700 font-medium"
                >
                  <option value="Historical">Historical</option>
                  <option value="Hill Station">Hill Station</option>
                  <option value="Beach">Beach</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Nature">Nature</option>
                  <option value="Temple">Temple</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Agra"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Uttar Pradesh"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Visiting Hours *
                </label>
                <input
                  type="text"
                  value={formData.visitingHours}
                  onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                  placeholder="e.g. 6:00 AM - 6:30 PM (Closed Fridays)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed information about the tourist place..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-700 border-slate-300 focus:ring-emerald-600"
                />
                <label htmlFor="isPopular" className="text-xs text-slate-800 font-semibold select-none">
                  Feature in Popular Destinations section on Landing Page
                </label>
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
                  {modalLoading ? 'Saving...' : editingPlace ? 'Update Place' : 'Create Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Tourist Place"
        message={`Are you sure you want to delete "${placeToDelete?.placeName}"? Associated hotel references will also be updated.`}
        confirmText="Delete Place"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPlaceToDelete(null);
        }}
        loading={deleteLoading}
      />
    </AdminLayout>
  );
};

export default AdminPlaces;
