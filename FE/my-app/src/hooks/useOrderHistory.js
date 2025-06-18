import { useState, useEffect } from 'react';
import { useOrderApi } from '../hooks/useOrderApi';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { getAllOrders } = useOrderApi();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);
  return { orders };
};