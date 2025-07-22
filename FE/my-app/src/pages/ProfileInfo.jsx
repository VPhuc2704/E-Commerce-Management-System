import React from 'react';
import { motion } from 'framer-motion';

const ProfileInfo = ({
  userInfo,
  setUserInfo,
  isEditing,
  setIsEditing,
  handleSaveProfile,
  handleInputChange,
  orders,
  redirectPath,
  navigate,
}) => {
  const handleUserInfoChange = (e) => {
    const { name, value } = handleInputChange(e);
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfileClick = async () => {
    await handleSaveProfile(userInfo, setUserInfo);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
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
          className={`px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${isEditing
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            }`}
        >
          {isEditing ? "💾 Lưu thông tin" : "✏️ Chỉnh sửa"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { label: "Họ và tên", name: "fullname", type: "text", editable: true },
          { label: "Email", name: "email", type: "email", editable: true },
          { label: "Số điện thoại", name: "numberphone", type: "tel", editable: true },
          { label: "Địa chỉ", name: "address", type: "text", editable: true },
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
              <p className="text-gray-900 font-bold text-lg">5/05/2025</p>
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
  );
};

export default ProfileInfo;