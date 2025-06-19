import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderHistory } from '../hooks/useOrderHistory';

const OrderList = () => {
  const { orders } = useOrderHistory();
  const Host = "http://localhost:8081";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h3>
          <p className="text-gray-600">Tổng số: {orders.length} đơn hàng</p>
        </div>
      </div>

      <AnimatePresence>
        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Đơn hàng #{order.id}</h4>
                    <p className="text-sm text-gray-500">
                      Ngày đặt: {new Date(order.createdDate).toLocaleString('vi-VN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {order.status === 'PENDING' ? 'Chờ xác nhận' : order.status === 'COMPLETED' ? 'Đã hoàn thành' : order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Thông tin khách hàng</h5>
                    <p className="text-gray-600">Họ tên: {order.user.fullname}</p>
                    <p className="text-gray-600">Email: {order.user.email}</p>
                    <p className="text-gray-600">Số điện thoại: {order.user.numberphone}</p>
                    <p className="text-gray-600">Địa chỉ: {order.user.address}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Sản phẩm</h5>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 mb-3">
                        <img
                          src={`${Host}${item.imageUrl}` || '/assets/images/default.jpg'}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          onError={(e) => { e.target.src = '/assets/images/default.jpg'; }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                          <p className="text-sm text-gray-600">
                            Tổng: {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-right">
                  <p className="text-lg font-semibold text-indigo-600">
                    Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đơn hàng nào</h4>
            <p className="text-gray-500">Hãy khám phá các món ăn ngon và đặt hàng ngay!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderList;