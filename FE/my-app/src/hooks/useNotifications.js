import { useState, useEffect, useRef } from 'react';
import { useNotification } from './useNotification';
import orderService from '../services/orderService';

export const useNotifications = () => {
  const { showNotification } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);
  const shownNotiIdsRef = useRef(new Set());

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const updates = await orderService.getOrderUpdates();

      const newNotifications = updates.map((update) => ({
        id: update.id,
        orderId: update.id,
        message: `Đơn hàng ${update.orderId} đã được cập nhật trạng thái: ${update.status}`,
        timestamp: update.timestamp,
        read: false,
      }));

      // Cập nhật danh sách
      setNotifications((prev) => {
        const uniqueNotifications = [...newNotifications, ...prev].reduce((acc, curr) => {
          if (!acc.some((n) => n.id === curr.id)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        return uniqueNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });

      // Chỉ hiển thị nếu chưa hiển thị trước đó
      newNotifications.forEach((notif) => {
        if (!shownNotiIdsRef.current.has(notif.id)) {
          showNotification(notif.message, 'info');
          shownNotiIdsRef.current.add(notif.id);
          setUnreadCount((prev) => prev + 1);
        }
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
      showNotification('Lỗi khi lấy thông báo đơn hàng', 'error');
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchNotifications();
    };

    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, []);

  useEffect(() => {
    fetchNotifications();

    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchNotifications, 100000);
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
  };
};
