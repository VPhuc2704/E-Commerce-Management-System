"use client"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const AdminLayout = ({ user }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false

  // Redirect non-admin users
  if (!isAdmin) {
    navigate("/home")
    return null
  }

  // Sidebar navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h6v6H3V3zm0 8h6v10H3V11zm8 0h10v10H11V11zm0-8h10v6H11V3z"
          />
        </svg>
      ),
    },
    {
      name: "Quản lý sản phẩm",
      path: "/admin/products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4m0 0v10"
          />
        </svg>
      ),
    },
    {
      name: "Quản lý đơn hàng",
      path: "/admin/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      name: "Quản lý người dùng",
      path: "/admin/users",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userData")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white flex flex-col shadow-2xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-700/50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-indigo-300">Management System</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${location.pathname === item.path
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "hover:bg-white/10 hover:transform hover:scale-105"
                    }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ${location.pathname === item.path ? "bg-white/20" : "bg-white/10 group-hover:bg-white/20"
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {location.pathname === item.path && (
                    <motion.div layoutId="activeIndicator" className="ml-auto w-2 h-2 bg-yellow-400 rounded-full" />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-indigo-700/50"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.email || "Admin"}</p>
                <p className="text-xs text-indigo-300">Administrator</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Đăng xuất</span>
          </button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-72 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
