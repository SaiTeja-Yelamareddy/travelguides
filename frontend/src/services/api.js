// Base API Service for TravelGuide
// In production on Vercel, set VITE_API_URL (e.g. https://your-backend.onrender.com)
// In local development, defaults to '/api' which is proxied via vite.config.js
const rawBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateProfile: async (data) => {
      const res = await fetch(`${BASE_URL}/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Tourist Places
  places: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/places${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/places/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${BASE_URL}/places`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${BASE_URL}/places/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/places/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Hotels
  hotels: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/hotels${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/hotels/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${BASE_URL}/hotels`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${BASE_URL}/hotels/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/hotels/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Favorites
  favorites: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/favorites`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    toggle: async (placeId) => {
      const res = await fetch(`${BASE_URL}/favorites/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ placeId })
      });
      return handleResponse(res);
    },
    remove: async (placeId) => {
      const res = await fetch(`${BASE_URL}/favorites/${placeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Admin reports & stats
  admin: {
    getStats: async () => {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getReports: async () => {
      const res = await fetch(`${BASE_URL}/admin/reports`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  }
};
