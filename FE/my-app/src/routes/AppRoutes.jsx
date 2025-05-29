import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import ProtectedRoutes from '../routes/ProtectedRoutes';
import ErrorBoundary from '../components/common/ErrorBoundary';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ForgotPassword from '../features/auth/ForgotPassword';
import LoggedInHomePage from '../pages/LoggedInHomePage';
import ProductListing from '../pages/ProductListing';
import ProductDetails from '../pages/ProductDetails';
import AdminProductManagement from '../pages/AdminProductManagement';
import CartPage from '../pages/CartPage';
import OrderHistory from '../pages/OrderHistory';
import AdminOrderManagement from '../pages/AdminOrderManagement';
import AdminDashboard from '../pages/AdminDashboard';
import VerifyPage from '../pages/VerifyPage';

// Placeholder component for ProfilePage
const PlaceholderPage = () => <div className="min-h-screen p-4">Placeholder Page</div>;
const ProfilePage = () => <div className="min-h-screen p-4">Profile Page (Placeholder)</div>;

// GuestOnlyRoute Component
const GuestOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Layout Component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation(); // Ensure useLocation is available
  const hideNavbarRoutes = ['/login', '/register', '/verify', '/forgot-password'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public routes for guests */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />

          {/* Guest-only routes (without Navbar) */}
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <Login />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyRoute>
                <Register />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <GuestOnlyRoute>
                <VerifyPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestOnlyRoute>
                <ForgotPassword />
              </GuestOnlyRoute>
            }
          />

          {/* Protected routes for authenticated users */}
          <Route element={<ErrorBoundary><ProtectedRoutes /></ErrorBoundary>}>
            <Route path="/home" element={<Layout><LoggedInHomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductListing /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} /> {/* Sử dụng CartPage thực tế */}
            <Route path="/orders" element={<Layout><OrderHistory /></Layout>} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ErrorBoundary><ProtectedRoutes adminOnly={true} /></ErrorBoundary>}>
            <Route path="/admin/products" element={<Layout><AdminProductManagement /></Layout>} />
            <Route path="/admin/orders" element={<Layout><AdminOrderManagement /></Layout>} />
            <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;