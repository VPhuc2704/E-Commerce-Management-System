import React from 'react';
import { motion } from 'framer-motion';

const ProfileSidebar = ({ userInfo, avatarPreview, setAvatarPreview, activeTab, setActiveTab, tabItems }) => {
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white fixed h-screen z-50 border-r border-white/10">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 translate-y-16"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 p-1 shadow-2xl">
              <img
                src={avatarPreview || "../src/assets/images/default-avatar.jpg"}
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
  );
};

export default ProfileSidebar;