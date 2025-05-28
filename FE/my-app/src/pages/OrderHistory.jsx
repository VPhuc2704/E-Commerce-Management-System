import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // Mock dữ liệu đơn hàng từ localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const mockOrders = [
        { id: 'ORDER-123', date: '2025-05-25', total: 2500000, status: 'Chờ xác nhận' },
        { id: 'ORDER-124', date: '2025-05-24', total: 1500000, status: 'Đã hoàn thành' },
      ];
      setOrders(mockOrders);
      localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
  }, []);

  // Lưu đơn hàng mới khi checkout (mock)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded-lg">
              <p>Mã đơn: {order.id}</p>
              <p>Ngày đặt: {order.date}</p>
              <p>Tổng tiền: {order.total.toLocaleString('vi-VN')} VNĐ</p>
              <p>Trạng thái: {order.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderHistory;