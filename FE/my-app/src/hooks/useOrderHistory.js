"use client";

import { useState, useEffect, useCallback } from "react";
import orderService from "../services/orderService";
import { useOrderApi } from '../hooks/useOrderApi';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the function but don't put it in dependencies
  const { getAllOrders } = useOrderApi();

  // ✅ Fix: Remove getAllOrders from dependencies to prevent infinite loop
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // ✅ Empty dependency array - only run once on mount

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Use useCallback to prevent recreation and use getAllOrders directly
  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Use getAllOrders instead of orderService.getOrders for consistency
      const data = await getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error refreshing orders:", err);
    } finally {
      setLoading(false);
    }
  }, [getAllOrders]); // ✅ Now it's safe to include getAllOrders here since refreshOrders is called manually

  return {
    orders,
    loading,
    error,
    refreshOrders,
  };
};