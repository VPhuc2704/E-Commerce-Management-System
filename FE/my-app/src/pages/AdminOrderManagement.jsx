import React, { useState, useEffect } from 'react';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Mock dữ liệu đơn hàng từ localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const mockOrders = [
        { id: 'ORDER-123', total: 2500000, status: 'Chờ xác nhận' },
        { id: 'ORDER-124', total: 1500000, status: 'Đang giao' },
      ];
      setOrders(mockOrders);
      localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
  }, []);

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (orderId) => {
    if (!selectedStatus) return alert('Vui lòng chọn trạng thái!');
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: selectedStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    alert(`Đã cập nhật trạng thái cho đơn ${orderId}`);
    setSelectedStatus('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p>Mã đơn: {order.id}</p>
              <p>Tổng tiền: {order.total.toLocaleString('vi-VN')} VNĐ</p>
              <p>Trạng thái: {order.status}</p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border p-2"
              >
                <option value="">Chọn trạng thái</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
              <button
                onClick={() => handleUpdateStatus(order.id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Cập nhật
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderManagement;