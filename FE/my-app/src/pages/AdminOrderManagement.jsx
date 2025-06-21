"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderApi } from "../hooks/useOrderApi";
import { useNotification } from "../hooks/useNotification"; // Thêm useNotification
import orderService from "../services/orderService"; // Thêm orderService
import OrderList from "../components/orders/OrderList";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import SearchFilter from "../components/orders/SearchFilter";
import StatsCards from "../components/orders/StatsCards";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { getAllOrders, getOrdersByStatus, getOrderDetails } = useOrderApi();
  const { showNotification } = useNotification(); // Sử dụng useNotification

  // Load orders
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await (filterStatus === "all"
        ? getAllOrders()
        : getOrdersByStatus(filterStatus));

      const orders = Array.isArray(response) ? response : [response].filter(Boolean);
      setOrders(orders);
      setCurrentPage(1); // Reset to first page when filter changes
    } catch (error) {
      console.error("Error loading orders:", error);
      showNotification("Không thể tải danh sách đơn hàng", "error");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  // Update order status
  const handleUpdateStatus = async (orderId) => {
    const newStatus = selectedStatuses[orderId];
    if (!newStatus) {
      showNotification("Vui lòng chọn trạng thái!", "error");
      return;
    }

    try {
      await orderService.updateOrderStatus(orderId, newStatus); // Sử dụng orderService
      await loadOrders();
      showNotification(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}`, "success");
      setSelectedStatuses((prev) => ({
        ...prev,
        [orderId]: "",
      }));
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("Không thể cập nhật trạng thái đơn hàng", "error");
    }
  };

  const handleStatusChange = (orderId, status) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [orderId]: status,
    });
  };

  // Filter orders with null check
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        if (!order) return false;
        const matchesSearch =
          order.id?.toString().includes(searchTerm.toLowerCase()) ||
          order.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
    : [];

  // View order details
  const handleViewDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const details = await getOrderDetails(orderId);
      if (details) {
        setSelectedOrder(details);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      showNotification("Không thể tải chi tiết đơn hàng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Quản lý đơn hàng
        </h1>
        <p className="text-indigo-100">Theo dõi và cập nhật trạng thái đơn hàng</p>
      </motion.div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterStatus}
      />

      {/* Stats Cards */}
      <StatsCards orders={orders} />

      {/* Orders List with Pagination */}
      <OrderList
        orders={filteredOrders}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredOrders.length}
        onPageChange={setCurrentPage}
      />

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrderManagement;