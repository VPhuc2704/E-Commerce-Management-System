
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
// Import pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Dashboard from '../pages/Dashboard';

// Protect routes for authenticated users only
const ProtectedRoute = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const authStatus = checkAuthStatus();
  
  // Redirect to homepage first, then to login
  if (!isAuthenticated && !authStatus) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  
  return <Outlet />;
};

// Route for guests only (already logged in users will be redirected to dashboard)
const GuestOnlyRoute = ({ children }) => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const authStatus = checkAuthStatus();
  
  if (isAuthenticated || authStatus) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Public routes - accessible by anyone */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* 👥 Guest-only routes - redirect to dashboard if logged in */}
        <Route path="/login" element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        } />
        <Route path="/register" element={
          <GuestOnlyRoute>
            <Register />
          </GuestOnlyRoute>
        } />
        
        {/* 🔐 Protected routes - redirect to login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Thêm các route cần bảo vệ khác ở đây */}
        </Route>
        
        {/* 🚫 Catch all: chuyển hướng về Home nếu route không hợp lệ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;