import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { motion } from 'framer-motion';
import "../components/orders/OrderDetails.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const OrderItem = ({ item }) => (
  <div className="product-item">
    <img
      src={`${BASE_URL}${item.imageUrl}`}
      alt={item.productName}
      className="product-image"
    />
    <div className="product-info">
      <p className="product-name">{item.productName}</p>
      <p className="product-details">
        Số lượng: {item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ
      </p>
      <p className="product-details">
        Tổng: {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ
      </p>
    </div>
  </div>
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-badge status-pending';
      case 'COMPLETED':
        return 'status-badge status-completed';
      default:
        return 'status-badge status-cancelled';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2 className="error-title">Có lỗi xảy ra</h2>
          <p className="error-message">{error || 'Đơn hàng không tồn tại'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="order-card"
      >
        <div className="order-header">
          <div>
            <h1 className="order-title">Chi tiết đơn hàng #{order.id}</h1>
            <p className="order-date">
              Ngày đặt: {new Date(order.createdDate).toLocaleString('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <span className={getStatusClass(order.status)}>
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="content-section">
          <div className="content-grid">
            <UserInfo user={order.user} />
            <div className="info-section">
              <h3 className="section-title">Sản phẩm đã đặt</h3>
              {order.items.map(item => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="total-section">
          <p className="total-amount">
            Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')} VNĐ
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profile?tab=orders')}
            className="simple-button"
          >
            ← Quay lại danh sách đơn hàng
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetails;