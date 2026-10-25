import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DestinationProvider } from './context/DestinationContext';
import { UserRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import SelectDestination from './pages/SelectDestination';
import NearbyPlaces from './pages/NearbyPlaces';
import PlaceDetails from './pages/PlaceDetails';
import NearbyHotels from './pages/NearbyHotels';
import HotelDetails from './pages/HotelDetails';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlaces from './pages/AdminPlaces';
import AdminHotels from './pages/AdminHotels';
import AdminReports from './pages/AdminReports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DestinationProvider>
          <Routes>
            {/* Public Routes (Accessible by all visitors) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated User Routes (Protected: unauthenticated visitors redirected to /login) */}
            <Route
              path="/dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />
            <Route
              path="/destinations"
              element={
                <UserRoute>
                  <SelectDestination />
                </UserRoute>
              }
            />
            <Route
              path="/nearby-places"
              element={
                <UserRoute>
                  <NearbyPlaces />
                </UserRoute>
              }
            />
            <Route
              path="/places/:id"
              element={
                <UserRoute>
                  <PlaceDetails />
                </UserRoute>
              }
            />
            <Route
              path="/hotels"
              element={
                <UserRoute>
                  <NearbyHotels />
                </UserRoute>
              }
            />
            <Route
              path="/hotels/:id"
              element={
                <UserRoute>
                  <HotelDetails />
                </UserRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <UserRoute>
                  <FavoritesPage />
                </UserRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <UserRoute>
                  <ProfilePage />
                </UserRoute>
              }
            />

            {/* Protected Admin Routes (Protected: requires admin role) */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/places"
              element={
                <AdminRoute>
                  <AdminPlaces />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/hotels"
              element={
                <AdminRoute>
                  <AdminHotels />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              }
            />

            {/* Fallback Catch-All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DestinationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
