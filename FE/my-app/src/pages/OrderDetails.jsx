import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { motion } from 'framer-motion';
import "../components/orders/OrderDetails.css";
import { ArrowLeft, Package, User, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, XCircle, CreditCard, Truck } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;


const OrderItem = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
  >
    <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
      <img
        src={`${BASE_URL}${item.imageUrl}`}
        alt={item.productName}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="w-full h-full bg-gray-100 flex items-center justify-center" style={{ display: 'none' }}>
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    </div>

    <div className="flex-1">
      <h4 className="font-medium text-gray-900 mb-1">{item.productName}</h4>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>SL: {item.quantity}</span>
        <span>×</span>
        <span className="font-medium">{item.price.toLocaleString('vi-VN')} VNĐ</span>
      </div>
    </div>

    <div className="text-right">
      <p className="font-semibold text-gray-900">
        {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ
      </p>
    </div>
  </motion.div>
);

const UserInfo = ({ user }) => (
  <div className="info-section">
    <h3 className="section-title">Thông tin khách hàng</h3>
    <p className="user-info-item"><strong>Họ tên:</strong> {user.fullname}</p>
    <p className="user-info-item"><strong>Email:</strong> {user.email}</p>
    <p className="user-info-item"><strong>Số điện thoại:</strong> {user.numberphone}</p>
    <p className="user-info-item"><strong>Địa chỉ:</strong> {user.address}</p>
  </div>
);


const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          text: 'Chờ xác nhận',
          className: 'bg-amber-100 text-amber-700 border-amber-200'
        };
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          text: 'Đã hoàn thành',
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'CANCELLED':
        return {
          icon: XCircle,
          text: 'Đã hủy',
          className: 'bg-red-100 text-red-700 border-red-200'
        };
      default:
        return {
          icon: Clock,
          text: status,
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.className}`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium">{config.text}</span>
    </div>
  );
};

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Đang tải...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại'}</p>
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile?tab=orders')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.id}</h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid-8 grid-cols-1">

          {/* Left Column - Customer & Shipping Info */}
          <div className="lg:col-span-1 space-y-6">

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                  <p className="font-medium text-gray-900">{order.user.fullname}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {order.user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.user.numberphone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</p>
                  <p className="font-medium text-gray-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{order.user.address}</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tổng quan đơn hàng</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng sản phẩm:</span>
                  <span className="font-medium">{order.items.length} sản phẩm</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{order.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phí giao hàng:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Tổng thanh toán:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết sản phẩm ({order.items.length})
                </h3>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <OrderItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
          >
            Quay lại danh sách đơn hàng
          </button>
        </motion.div>
      </div>
    </div>
  );
};
export default OrderDetails;