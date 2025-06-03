import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLayout = ({ user }) => {
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/home');
    return null;
  }

  // Sidebar navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h6v6H3V3zm0 8h6v10H3V11zm8 0h10v10H11V11zm0-8h10v6H11V3z" />
        </svg>
      ),
    },
    {
      name: 'Manage Products',
      path: '/admin/products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4m0 0v10" />
        </svg>
      ),
    },
    {
      name: 'Manage Orders',
      path: '/admin/orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-2 12H5L3 3zm5 12h8m-5 4h2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-64 h-full bg-indigo-900 text-white flex flex-col shadow-lg"
      >
        <div className="p-6 flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.2 0-4-1.8-4-4H4v2h4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h4v-2h-4c0 2.2-1.8 4-4 4zM4 6h16v2H4z" />
          </svg>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all duration-200"
          >
            Back to Store
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;