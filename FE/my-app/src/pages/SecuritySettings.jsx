import React from 'react';
import { motion } from 'framer-motion';

const SecuritySettings = ({ passwordForm, handlePasswordChange, handleUpdatePassword, securitySettings, handleToggleChange }) => {
  return (
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

      <div className="grid grid-cols-2 gap-8">
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
  );
};

export default SecuritySettings;