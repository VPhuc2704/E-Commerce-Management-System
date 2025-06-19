"use client";

import { useState, useEffect } from "react";
import orderService from "../services/orderService";
import { useOrderApi } from '../hooks/useOrderApi';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { getAllOrders } = useOrderApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      setOrders(data);
      console.log("Starting to fetch orders...");
      setLoading(true);
      try {
        const orderData = await orderService.getOrders();
        console.log("Orders fetched:", orderData);
        setOrders(orderData);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Không thể tải danh sách đơn hàng");
      } finally {
        console.log("Setting loading to false...");
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

  const refreshOrders = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrders();
      setOrders(orderData);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Error refreshing orders:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("Returning useOrderHistory:", { orders, loading, error });
  return {
    orders,
    loading,
    error,
    refreshOrders,
  };
};