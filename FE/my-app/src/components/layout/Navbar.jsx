import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const { isAuthenticated, user, roles, logout } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartItemCount(totalQuantity);
    };

    updateCartCount();

    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', updateCartCount);

    // Listen for custom cart update event (same-tab updates)
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
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

  return (
    <>
      {/* Spacer để tránh navbar chèn lên content */}
      <div className="h-20"></div>
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/20' 
          : 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="relative h-12 w-auto cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() => navigate('/')}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Thế giơi ẩm thực
                </h1>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-2 flex justify-center items-center gap-4">
              <div className="button-container flex bg-blue-800 bg-opacity-80 rounded-full h-12 items-center justify-around w-72 backdrop-blur-md shadow-md">
                
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


                {/* Admin Buttons */}
                {isAuthenticated && roles.includes('ROLE_ADMIN') && (
                  <>
                    <button
                    className="button w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-glow"
                    onClick={() => navigate('/admin/products')}
                  >
                    <svg
                      className="icon text-xl"
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
                      className="group relative p-3.5 rounded-xl transition-all duration-300 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25 hover:border hover:border-green-300"
                      onClick={handleDashboardClick}
                      title="Dashboard"
                    >
                      <svg
                        className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        Dashboard
                      </div>
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

                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* User Authentication Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">Welcome back!</p>
                    <p className="text-gray-600">{user.name || 'User'}</p>
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