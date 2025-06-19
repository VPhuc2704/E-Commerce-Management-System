import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import OrderList from "./orderList";
import { useProfileData } from "../hooks/useProfileData";
import { useProfileForm } from "../hooks/useProfileForm";
import { useNotification } from "../hooks/useNotification";
import { useAddressManager } from "../hooks/useAddressManager";
import { useOrderHistory } from "../hooks/useOrderHistory";

const useAuth = () => ({
  user: useMemo(() => ({ email: "nguyenvana@example.com" }), []),
  logout: () => console.log("Logged out"),
});

const Notification = ({ show, message, type }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl z-50 ${
          type === "success"
            ? "bg-emerald-500/90 text-white border border-emerald-400/50"
            : "bg-red-500/90 text-white border border-red-400/50"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            type === "success" ? "bg-white/20" : "bg-white/20"
          }`}
        >
          {type === "success" ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span className="font-medium">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect');

  const { notification, showNotification } = useNotification();
  const { userInfo, setUserInfo, addresses, setAddresses, isLoading } = useProfileData(user);
  const {
    isEditing,
    setIsEditing,
    passwordForm,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleUpdatePassword,
  } = useProfileForm(userInfo, showNotification);
  const { handleSetDefaultAddress, handleDeleteAddress, handleAddAddress } = useAddressManager(
    addresses,
    setAddresses,
    showNotification,
  );
  const { orders, loading: orderLoading, error: orderError } = useOrderHistory();

  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar || "../src/assets/images/default-avatar.jpg");

  // State cho các tùy chọn bảo mật
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    emailNotifications: true,
    autoLogin: false,
  });

  useEffect(() => {
    if (redirectPath && !isLoading && (!userInfo.name || !userInfo.phone)) {
      showNotification('Vui lòng cập nhật thông tin cá nhân trước khi tiếp tục!', 'error');
      setActiveTab('profile');
      setIsEditing(true);
    }
  }, [redirectPath, isLoading, userInfo, showNotification]);

  const handleUserInfoChange = (e) => {
    const { name, value } = handleInputChange(e);
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setUserInfo((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
      showNotification('Ảnh đại diện đã được tải lên thành công!', 'success');
    }
  };

  const handleSaveProfileClick = async () => {
    await handleSaveProfile(userInfo, setUserInfo);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleToggleChange = (setting) => (e) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: e.target.checked,
    }));
    showNotification(`Đã ${e.target.checked ? 'bật' : 'tắt'} ${setting === 'twoFactor' ? 'Xác thực 2 bước' : setting === 'emailNotifications' ? 'Thông báo email' : 'Đăng nhập tự động'}!`, 'success');
  };

  const tabItems = [
    {
      tab: "profile",
      icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
      label: "Hồ sơ",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      tab: "orders",
      icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
      label: "Lịch sử đơn hàng",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      tab: "addresses",
      icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
      label: "Địa chỉ",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      tab: "security",
      icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
      label: "Bảo mật",
      gradient: "from-red-500 to-orange-500",
    },
  ];

  if (isLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (orderError) {
    return <div className="text-center p-8 text-red-600">{orderError}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Fixed Sidebar */}
      <div className="w-80 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white fixed h-screen z-50 border-r border-white/10">
        {/* Sidebar Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 translate-y-16"></div>
        </div>

        <div className="relative z-10 p-8">
          {/* User Profile Card */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 p-1 shadow-2xl">
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{userInfo.name || "Chưa cập nhật"}</h2>
            <p className="text-indigo-200 text-sm">{userInfo.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Đang hoạt động
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabItems.map(({ tab, icon, label, gradient }) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
                className={`w-full group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 text-indigo-200 hover:text-white ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-white/15 to-white/5 text-white shadow-lg"
                    : "bg-transparent"
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeTab === tab
                        ? `bg-gradient-to-r ${gradient} shadow-lg`
                        : "bg-transparent group-hover:bg-white/20"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content with Padding for Fixed Sidebar */}
      <div className="flex-1 flex flex-col ml-80">
        {/* Header */}
        <div className="h-16 bg-white/80 backdrop-blur-xl border-b flex items-center px-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {activeTab === "profile" && "Hồ sơ"}
              {activeTab === "orders" && "Lịch sử đơn hàng"}
              {activeTab === "addresses" && "Địa chỉ"}
              {activeTab === "security" && "Bảo mật"}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h3>
                    <p className="text-gray-600">Cập nhật thông tin để có trải nghiệm tốt nhất</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (isEditing ? handleSaveProfileClick() : setIsEditing(true))}
                    className={`px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
                      isEditing
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                    }`}
                  >
                    {isEditing ? "💾 Lưu thông tin" : "✏️ Chỉnh sửa"}
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[
                    { label: "Họ và tên", name: "name", type: "text", editable: true },
                    { label: "Email", name: "email", type: "email", editable: true },
                    { label: "Số điện thoại", name: "phone", type: "tel", editable: true },
                  ].map(({ label, name, type, editable }) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700">{label}</label>
                      {isEditing && editable ? (
                        <input
                          type={type}
                          name={name}
                          value={userInfo[name] || ""}
                          onChange={handleUserInfoChange}
                          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white shadow-sm"
                        />
                      ) : (
                        <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 text-gray-800 font-medium">
                          {userInfo[name] || "Chưa cập nhật"}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700">Giới thiệu bản thân</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={userInfo.bio || ""}
                      onChange={handleUserInfoChange}
                      rows={4}
                      className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white shadow-sm resize-none"
                      placeholder="Chia sẻ về bản thân bạn..."
                    />
                  ) : (
                    <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 text-gray-800 min-h-[120px] flex items-center">
                      {userInfo.bio || "Chưa cập nhật"}
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-blue-600 font-semibold text-sm">Ngày tham gia</p>
                        <p className="text-gray-900 font-bold text-lg">25/05/2023</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-emerald-600 font-semibold text-sm">Đơn hàng</p>
                        <p className="text-gray-900 font-bold text-lg">{orders.length} đơn</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-purple-600 font-semibold text-sm">Điểm thưởng</p>
                        <p className="text-gray-900 font-bold text-lg">2,450</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h3>
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Đơn hàng #{order.id}</h4>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {order.statusText || "Đang xử lý"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">Tổng: {order.total}₫</p>
                      <p className="text-sm text-gray-500">{order.items} món • Giao đến {order.location}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/order-details/${order.id}`)}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-md transition-all duration-300"
                      >
                        Xem chi tiết
                      </motion.button>
                    </motion.div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-600">Không có đơn hàng nào.</p>}
                </div>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Địa chỉ giao hàng</h3>
                    <p className="text-gray-600">Quản lý các địa chỉ giao hàng của bạn</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleAddAddress({
                        name: "Địa chỉ mới",
                        recipient: userInfo.name || "",
                        address: "",
                        city: "",
                        phone: userInfo.phone || "",
                      })
                    }
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-300"
                  >
                    ➕ Thêm địa chỉ
                  </motion.button>
                </div>

                <div className="grid gap-6">
                  {addresses.map((address, index) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                      {address.isDefault && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-bl-2xl text-sm font-semibold">
                          📍 Mặc định
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{address.name}</h4>
                            <p className="text-gray-600">{address.recipient}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-gray-800 font-medium">{address.address}</p>
                        <p className="text-gray-600">{address.city}</p>
                        <p className="text-gray-600">📞 {address.phone}</p>
                      </div>

                      <div className="flex gap-3">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md"
                          >
                            Đặt mặc định
                          </button>
                        )}
                        <button className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md">
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md"
                        >
                          Xóa
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
  
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Bảo mật tài khoản</h3>
                <p className="text-gray-600">Quản lý cài đặt bảo mật và quyền riêng tư</p>
              </div>

              {/* Change Password and Security Settings Side by Side */}
              <div className="grid grid-cols-2 gap-8">
                {/* Change Password Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50"
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Đổi mật khẩu</h4>
                  <p className="text-gray-500 mb-6">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-300"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdatePassword}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300"
                    >
                      Cập nhật mật khẩu
                    </motion.button>
                  </div>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50"
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Cài đặt bảo mật</h4>
                  <p className="text-gray-500 mb-6">Tùy chỉnh các tính năng bảo mật cho tài khoản</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Xác thực 2 bước</p>
                          <p className="text-sm text-gray-500">Bảo vệ tài khoản bằng SMS</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${securitySettings.twoFactor ? 'text-green-600' : 'text-gray-600'}`}>
                          {securitySettings.twoFactor ? 'Đã bật' : 'Tắt'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactor}
                            onChange={handleToggleChange('twoFactor')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:bg-green-600 after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:transition-all after:duration-300 after:top-1/2 after:-translate-y-1/2 after:left-1 peer-checked:after:translate-x-5"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14l1 12H4L5 19z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Thông báo email</p>
                          <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${securitySettings.emailNotifications ? 'text-blue-600' : 'text-gray-600'}`}>
                          {securitySettings.emailNotifications ? 'Đã bật' : 'Tắt'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.emailNotifications}
                            onChange={handleToggleChange('emailNotifications')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:transition-all after:duration-300 after:top-1/2 after:-translate-y-1/2 after:left-1 peer-checked:after:translate-x-5"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.828 4.828A1.414 1.414 0 014 6.414v11.172A1.414 1.414 0 015.414 19h8.068M12 4h8a2 2 0 012 2v4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Đăng nhập tự động</p>
                          <p className="text-sm text-gray-500">Ghi nhớ phiên đăng nhập</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${securitySettings.autoLogin ? 'text-gray-600' : 'text-gray-600'}`}>
                          {securitySettings.autoLogin ? 'Đã bật' : 'Tắt'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.autoLogin}
                            onChange={handleToggleChange('autoLogin')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:bg-gray-600 after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:transition-all after:duration-300 after:top-1/2 after:-translate-y-1/2 after:left-1 peer-checked:after:translate-x-5"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification */}
      <Notification show={notification.show} message={notification.message} type={notification.type} />
    </div>
  );
};

export default ProfilePage;