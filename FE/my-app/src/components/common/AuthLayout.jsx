import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl w-full flex">
        {/* Left side - Auth form */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-l-lg shadow-md">
          <div className="flex flex-col items-start max-w-md mx-auto">
            <div className="mb-6">
              <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm-1 1.108L5 7.633V16.5l6 3.75V11.392L5.5 7.764 11 4.108zm2 0l5.5 3.656-5.5 3.628V20.25l6-3.75V7.633l-6-4.525z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600 mb-6">{subtitle}</p>}
            
            {children}
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gray-100 rounded-r-lg">
          <div className="h-full bg-cover bg-center rounded-r-lg" style={{ backgroundImage: "url('/auth-image.jpg')" }}>
            <div className="h-full flex items-center justify-center bg-indigo-900 bg-opacity-30 rounded-r-lg">
              {/* Optional content over the image */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;