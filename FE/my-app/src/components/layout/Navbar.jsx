import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    if (isAuthenticated && user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-100 to-coral-100 py-2 px-6 shadow-lg">
      <div className="container mx-auto flex items-center">
        {/* Logo */}
        <div className="flex-1">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Navigation */}
        <div className="flex-2 flex justify-center items-center gap-4">
          <div className="button-container flex bg-black rounded-lg h-10 items-center justify-around w-72 bg-opacity-80 backdrop-blur-md shadow-md">
            <button
              className="button w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
              onClick={() => navigate('/')}
            >
              <svg
                className="icon text-xl"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
              >
                <path
                  d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"
                ></path>
              </svg>
            </button>
            <button
              className="button w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
              onClick={handleProfileClick}
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
                <path
                  d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
                ></path>
              </svg>
            </button>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <button
                className="button w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
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
                  <path
                    d="M12 2a5 5 0 0 0-5 5v2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v2H9V7a3 3 0 0 1 3-3zm-7 7h14v9H5z"
                  ></path>
                </svg>
              </button>
            )}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <button
                className="button w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
                onClick={handleDashboardClick}
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
                  <path
                    d="M3 3h6v6H3V3zm0 8h6v10H3V11zm8 0h10v10H11V11zm0-8h10v6H11V3z"
                  ></path>
                </svg>
              </button>
            )}
            <button
              className="button w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
              onClick={handleCartClick}
            >
              <svg
                className="icon text-xl"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1em"
                width="1em"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path
                  d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Login/Logout Button */}
        <div className="flex-1 flex justify-end">
          <div
            aria-label={isAuthenticated ? 'User Logout Button' : 'User Login Button'}
            tabIndex="0"
            role="button"
            className="user-profile w-40 h-12 rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-indigo-500 to-coral-500 bg-opacity-20 flex items-center justify-center hover:bg-opacity-70 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 focus:outline-none"
            onClick={handleLoginClick}
          >
            <div className="user-profile-inner w-[156px] h-10 rounded-md bg-gray-900 flex items-center justify-center gap-3 text-white font-semibold">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
              >
                <g data-name="Layer 2" id="Layer_2">
                  <path
                    d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"
                  ></path>
                </g>
              </svg>
              <p className="text-base">{isAuthenticated ? 'Log Out' : 'Log In'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Alert */}
      {showLoginAlert && (
        <div className="fixed top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-md z-50 animate-fade-in">
          <p>Please login to continue</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;