import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';

const Host = "http://localhost:8081";

const OrderItem = ({ item }) => (
  <div className="flex items-center space-x-4 mb-3">
    <img
      src={`${Host}${item.imageUrl}`}
      alt={item.productName}
      className="w-16 h-16 object-cover rounded-lg shadow-sm"
    />
    <div>
      <p className="text-sm font-medium text-gray-900">{item.productName}</p>
      <p className="text-sm text-gray-600">
        Số lượng: {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
      </p>
      <p className="text-sm text-gray-600">
        Tổng: {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ
      </p>
    </div>
  </div>
);

const UserInfo = ({ user }) => (
  <div>
    <h3 className="text-md font-bold text-gray-900 mb-2">Thông tin khách hàng</h3>
    <p className="text-sm text-gray-700">Họ tên: {user.fullname}</p>
    <p className="text-sm text-gray-700">Email: {user.email}</p>
    <p className="text-sm text-gray-700">Số điện thoại: {user.numberphone}</p>
    <p className="text-sm text-gray-700">Địa chỉ: {user.address}</p>
  </div>
);

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getOrderDetails(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải chi tiết đơn hàng');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return <div className="text-center p-8 text-red-600">{error || 'Đơn hàng không tồn tại'}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{order.id}</h1>
            <p className="text-sm text-gray-600">
              Ngày đặt: {new Date(order.createdDate).toLocaleString('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              order.status === 'PENDING'
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
          <UserInfo user={order.user} />
          <div>
            <h3 className="text-md font-bold text-gray-900 mb-2">Sản phẩm</h3>
            {order.items.map(item => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-right">
          <p className="text-lg font-semibold text-indigo-600">
            Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')} VNĐ
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/orders')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-md transition-all duration-300"
          >
            Quay lại lịch sử đơn hàng
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetails;