import React from 'react';
import { motion } from 'framer-motion';

const AddressList = ({ addresses, handleAddAddress, handleSetDefaultAddress, handleDeleteAddress, userInfo }) => {
  return (
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
  );
};

export default AddressList;