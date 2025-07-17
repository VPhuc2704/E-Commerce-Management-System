import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/images/logo.png';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, roles, logout } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
    }
  };

  const handleDashboardClick = () => {
    if (isAuthenticated && roles.includes('ROLE_ADMIN')) {
      navigate('/admin/dashboard');
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(`/order-details/${notification.orderId}`);
    setShowNotifications(false);
  };

  return (
    <>
      <div className="h-20"></div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/20'
        : 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                {/* <img
                  src={logo}
                  alt="Logo"
                  className="relative h-12 w-auto cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() => navigate('/')}
                /> */}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Thế giới ẩm thực
                </h1>
              </div>
            </div>

            {/* Navigation Menu - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="button-container flex bg-blue-800 bg-opacity-80 rounded-full h-12 items-center justify-center backdrop-blur-md shadow-md px-3 gap-5">
                {/* Home Button */}
                <button
                  className="group w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:shadow-glow"
                  onClick={() => navigate('/')}
                  title="Home"
                >
                  <svg
                    className="icon text-xl transition-all duration-300 group-hover:text-blue-700"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 1024 1024"
                    height="1em"
                    width="1em"
                  >
                    <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
                  </svg>
                </button>

                {/* Profile Button */}
                <button
                  className="group w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:shadow-glow"
                  onClick={handleProfileClick}
                  title="Profile"
                >
                  <svg
                    className="icon text-xl transition-all duration-300 group-hover:text-blue-700"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                  >
                    <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
                  </svg>
                </button>

                {/* Notification Bell Button */}
                {isAuthenticated && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="group w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:shadow-glow"
                      onClick={() => setShowNotifications(!showNotifications)}
                      title="Notifications"
                    >
                      <Bell className="icon text-xl transition-all duration-300 group-hover:text-blue-700" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute top-14 right-0 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/20 z-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-gray-800 font-semibold">Thông báo</h3>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 p-1 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {notifications.length > 0 ? (
                          <ul className="space-y-2 max-h-64 overflow-y-auto">
                            {notifications.map((notif) => (
                              <li
                                key={notif.id}
                                className={`p-3 rounded-lg transition-all duration-200 ${notif.read ? 'bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                                  } cursor-pointer`}
                                onClick={() => handleNotificationClick(notif)}
                              >
                                <p className="text-sm text-gray-800">{notif.message}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notif.timestamp).toLocaleString('vi-VN')}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm text-center">Không có thông báo mới</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Buttons */}
                {isAuthenticated && roles.includes('ROLE_ADMIN') && (
                  <>
                    <button
                      className="group w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:shadow-glow"
                      onClick={() => navigate('/admin/products')}
                      title="Products"
                    >
                      <svg
                        className="icon text-xl transition-all duration-300 group-hover:text-blue-700"
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                      >
                        <path d="M12 2a5 5 0 0 0-5 5v2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm0 2a3 3 0 1 1 3 3v2H9V7a3 3 0 0 1 3-3zm-7 7h14v9H5z" />
                      </svg>
                    </button>

                    <button
                      className="group w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:shadow-glow"
                      onClick={handleDashboardClick}
                      title="Dashboard"
                    >
                      <svg
                        className="icon text-xl transition-all duration-300 group-hover:text-blue-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        height="1em"
                        width="1em"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Cart Button */}
                <button
                  className="group relative w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:shadow-glow"
                  onClick={handleCartClick}
                  title="Cart"
                >
                  <svg
                    className="icon text-xl transition-all duration-300 group-hover:text-blue-700"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* User Authentication Section */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {isAuthenticated && user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">Welcome back!</p>
                    <p className="text-gray-600">{user.fullname || 'User'}</p>
                  </div>
                </div>
              )}

              <button
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                onClick={handleLoginClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isAuthenticated ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    )}
                  </svg>
                  <span>{isAuthenticated ? 'Log Out' : 'Log In'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Login Alert */}
        {showLoginAlert && (
          <div className="fixed top-24 right-4 z-50">
            <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg border border-red-400/30 backdrop-blur-sm animate-pulse">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">Please log in to continue</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;