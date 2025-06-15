import { useState, useEffect } from 'react';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn hàng từ localStorage
  useEffect(() => {
    const fetchOrders = () => {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock dữ liệu đơn hàng
        const mockOrders = [
          {
            id: 7,
            createdDate: '2025-06-09T13:14:10.468',
            totalAmount: 64000.0,
            status: 'PENDING',
            user: {
              email: '2251120103@ut.edu.vn',
              fullname: 'VanPhuc',
              numberphone: '0355308724',
              address: '39/11a Duong 102, Tang Nhon Phu A, TP.HCM',
            },
            items: [
              {
                id: 8,
                productId: 6,
                productName: 'Chả giò hải sản',
                imageUrl: '/img/cha_gio_6.jpg',
                quantity: 2,
                price: 32000.0,
              },
            ],
          },
        ];
        setOrders(mockOrders);
        localStorage.setItem('orders', JSON.stringify(mockOrders));
      }
    };
    fetchOrders();
  }, []);

  // Lắng nghe sự kiện storage để cập nhật
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'orders') {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { orders };
};