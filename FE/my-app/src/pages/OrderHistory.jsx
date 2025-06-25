import React from 'react';
import { useOrderHistory } from '../hooks/useOrderHistory';

// Component hiển thị một sản phẩm trong đơn hàng
const OrderItem = ({ item }) => (
  <div className="flex items-center space-x-4 mb-3">
    <img
      src={item.imageUrl}
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

// Component hiển thị thông tin khách hàng
const UserInfo = ({ user }) => (
  <div>
    <h3 className="text-md font-bold text-gray-900 mb-2">Thông tin khách hàng</h3>
    <p className="text-sm text-gray-700">Họ tên: {user.fullname}</p>
    <p className="text-sm text-gray-700">Email: {user.email}</p>
    <p className="text-sm text-gray-700">Số điện thoại: {user.numberphone}</p>
    <p className="text-sm text-gray-700">Địa chỉ: {user.address}</p>
  </div>
);

// Component hiển thị một đơn hàng
const OrderCard = ({ order }) => (
  <li
    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
  >
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="text-lg font-semibold text-gray-900">Mã đơn hàng: #{order.id}</p>
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
    </div>
  </li>
);

const OrderHistory = () => {
  const { orders } = useOrderHistory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Lịch sử đơn hàng</h1>
      {orders.length > 0 ? (
        <ul className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-600">Không có đơn hàng nào.</div>
      )}
    </div>
  );
};

export default OrderHistory;