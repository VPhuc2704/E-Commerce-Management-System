"use client";

import { useState, useEffect, useRef } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const timeoutRef = useRef(null);

  const showNotification = (message, type) => {
    // Ngăn gọi lặp nếu thông báo đang hiển thị với cùng nội dung
    if (notification.show && notification.message === message && notification.type === type) {
      return;
    }

    // Hủy timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ show: true, message, type });
    timeoutRef.current = setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
      timeoutRef.current = null;
    }, 4000);
  };

  const hideNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification({ show: false, message: "", type: "" });
  };

  // Hủy timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};