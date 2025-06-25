"use client";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import Notification from "../pages/Notification"; // Thêm Notification
import ProtectedRoutes from "../routes/ProtectedRoutes";
import AdminLayout from "../components/common/AdminLayout";
import ErrorBoundary from "../components/common/ErrorBoundary";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import LoggedInHomePage from "../pages/LoggedInHomePage";
import ProductListing from "../pages/ProductListing";
import ProductDetails from "../pages/ProductDetails";
import AdminProductManagement from "../pages/AdminProductManagement";
import AdminUserManagement from "../pages/AdminUserManagement";
import CartPage from "../pages/CartPage";
import OrderHistory from "../pages/OrderHistory";
import AdminOrderManagement from "../pages/AdminOrderManagement";
import AdminDashboard from "../pages/AdminDashboard";
import VerifyPage from "../pages/VerifyPage";
import ProfilePage from "../pages/ProfilePage";
import OrderDetails from "../pages/OrderDetails";
import PaymentResult from "../pages/PaymentResult";

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
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const hideNavbarRoutes = ["/login", "/register", "/verify", "/forgot-password"];
  const adminRoutes = ["/admin/dashboard", "/admin/products", "/admin/orders"];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    (isAdmin && adminRoutes.some((route) => location.pathname.startsWith(route)));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

// Component to handle routes
const RoutesContent = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  if (isAdmin && window.location.pathname === "/home") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <ErrorBoundary>
      <Notification /> {/* Thêm Notification */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/product-details/:id" element={<Layout><ProductDetails /></Layout>} />

        {/* Guest-only routes */}
        <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
        <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />
        <Route path="/verify" element={<GuestOnlyRoute><VerifyPage /></GuestOnlyRoute>} />
        <Route path="/forgot-password" element={<GuestOnlyRoute><ForgotPassword /></GuestOnlyRoute>} />

        {/* Protected routes for authenticated users */}
        <Route element={<ErrorBoundary><ProtectedRoutes /></ErrorBoundary>}>
          {!isAdmin && (
            <>
              <Route path="/home" element={<Layout><LoggedInHomePage user={user} /></Layout>} />
              <Route path="/products" element={<Layout><ProductListing /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage user={user} /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />
              <Route path="/orders" element={<Layout><OrderHistory /></Layout>} />
              <Route path="/order-details/:orderId" element={<Layout><OrderDetails /></Layout>} />
              <Route path="/payment-result" element={<PaymentResult />} />
            </>
          )}
        </Route>

        {/* Admin-only routes */}
        <Route element={<ErrorBoundary><ProtectedRoutes adminOnly={true} /></ErrorBoundary>}>
          <Route element={<AdminLayout user={user} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductManagement user={user} />} />
            <Route path="/admin/orders" element={<AdminOrderManagement />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <RoutesContent />
    </Router>
  );
};

export default AppRoutes;