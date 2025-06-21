"use client";

import { useState, useEffect, useCallback } from "react";
import orderService from "../services/orderService";
import { useOrderApi } from '../hooks/useOrderApi';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAllOrders } = useOrderApi();

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
  }, []);

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

  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error refreshing orders:", err);
    } finally {
      setLoading(false);
    }
  }, [getAllOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders,
  };
};