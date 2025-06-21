import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { useProfileData } from "../hooks/useProfileData";
import { useProfileForm } from "../hooks/useProfileForm";
import { useNotification } from "../hooks/useNotification";
import { useOrderHistory } from "../hooks/useOrderHistory";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import SecuritySettings from "./SecuritySettings";
import Notification from "./Notification";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect');
  const initialTab = queryParams.get('tab') || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { notification, showNotification } = useNotification();
  const { userInfo, setUserInfo, isLoading } = useProfileData(user);
  const {
    isEditing,
    setIsEditing,
    passwordForm,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleUpdatePassword,
  } = useProfileForm(userInfo, showNotification);
  const { orders, loading: orderLoading, error: orderError } = useOrderHistory();

  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar || "../src/assets/images/default-avatar.jpg");

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

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleToggleChange = (setting) => (e) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: e.target.checked,
    }));
    showNotification(
      `Đã ${e.target.checked ? 'bật' : 'tắt'} ${
        setting === 'twoFactor' ? 'Xác thực 2 bước' : setting === 'emailNotifications' ? 'Thông báo email' : 'Đăng nhập tự động'
      }!`,
      'success'
    );
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
      <ProfileSidebar
        userInfo={userInfo}
        avatarPreview={avatarPreview}
        setAvatarPreview={setAvatarPreview}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabItems={tabItems}
      />

      <div className="flex-1 flex flex-col ml-80">
        <div className="h-16 bg-white/80 backdrop-blur-xl border-b flex items-center px-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {activeTab === "profile" && "Hồ sơ"}
              {activeTab === "orders" && "Lịch sử đơn hàng"}
              {activeTab === "security" && "Bảo mật"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <ProfileInfo
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSaveProfile={handleSaveProfile}
                handleInputChange={handleInputChange}
                orders={orders}
                redirectPath={redirectPath}
                navigate={navigate}
              />
            )}
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
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdDate).toLocaleString('vi-VN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.status === 'PENDING'
                              ? 'Chờ xác nhận'
                              : order.status === 'COMPLETED'
                              ? 'Đã hoàn thành'
                              : order.status}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/order-details/${order.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-md transition-all duration-300 text-sm"
                          >
                            Xem chi tiết
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Tổng: {order.totalAmount.toLocaleString('vi-VN')}₫
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} món • Giao đến {order.user.address}
                      </p>
                    </motion.div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-600">Không có đơn hàng nào.</p>}
                </div>
              </motion.div>
            )}
            {activeTab === "security" && (
              <SecuritySettings
                passwordForm={passwordForm}
                handlePasswordChange={handlePasswordChange}
                handleUpdatePassword={handleUpdatePassword}
                securitySettings={securitySettings}
                handleToggleChange={handleToggleChange}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <Notification show={notification.show} message={notification.message} type={notification.type} />
    </div>
  );
};

export default ProfilePage;