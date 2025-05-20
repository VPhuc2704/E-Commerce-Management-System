import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRequireLogin = () => {
    setShowLoginAlert(true);
    setTimeout(() => {
      setShowLoginAlert(false);
    }, 3000);
  };

  return (
    <nav className="bg-gray-100 py-3 px-6 shadow-md">
      <div className="container mx-auto flex items-center">
        {/* Logo - now with flex-1 to take equal space */}
        <div className="flex-1">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Navigation - centered with flex-2, making it more prominent */}
        <div className="flex-2 flex justify-center">
          <div className="button-container flex bg-black rounded-lg h-12 items-center justify-around w-80">
            <button className="button w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1">
              <svg
                className="icon text-2xl"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1.2em"
                width="1.2em"
              >
                <path
                  d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"
                ></path>
              </svg>
            </button>
            <button className="button w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1">
              <svg
                className="icon text-2xl"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                height="1.2em"
                width="1.2em"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
            <button 
              className="button w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
              onClick={handleRequireLogin}
            >
              <svg
                className="icon text-2xl"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1.2em"
                width="1.2em"
              >
                <path
                  d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
                ></path>
              </svg>
            </button>
            <button 
              className="button w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1"
              onClick={handleRequireLogin}
            >
              <svg
                className="icon text-2xl"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.2em"
                width="1.2em"
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

        {/* Login Button - now with flex-1 to take equal space */}
        <div className="flex-1 flex justify-end">
          <div
            aria-label="User Login Button"
            tabIndex="0"
            role="button"
            className="user-profile w-36 h-14 rounded-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-500 to-transparent bg-opacity-20 flex items-center justify-center hover:bg-opacity-70 hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 focus:outline-none"
            onClick={handleLoginClick}
          >
            <div className="user-profile-inner w-[141px] h-[55px] rounded-md bg-gray-900 flex items-center justify-center gap-4 text-white font-semibold">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-white"
              >
                <g data-name="Layer 2" id="Layer_2">
                  <path
                    d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"
                  ></path>
                </g>
              </svg>
              <p className="text-lg">Log In</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Alert */}
      {showLoginAlert && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50">
          <p>Please login to continue</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;