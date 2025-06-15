"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOrderApi } from "../hooks/useOrderApi"
import OrderList from "../components/orders/OrderList"
import OrderDetailsModal from "../components/orders/OrderDetailsModal"
import SearchFilter from "../components/orders/SearchFilter"
import StatsCards from "../components/orders/StatsCards"

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState({})
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { getAllOrders, getOrdersByStatus, updateOrderStatus, getOrderDetails } = useOrderApi()

  // Load orders
  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const response = await (filterStatus === "all"
        ? getAllOrders()
        : getOrdersByStatus(filterStatus))

      const orders = Array.isArray(response) ? response : [response].filter(Boolean)
      setOrders(orders)
      setCurrentPage(1) // Reset to first page when filter changes
    } catch (error) {
      console.error("Error loading orders:", error)
      displayNotification("Không thể tải danh sách đơn hàng")
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [filterStatus])

  // Update order status
  const handleUpdateStatus = async (orderId) => {
    const newStatus = selectedStatuses[orderId]
    if (!newStatus) {
      displayNotification("Vui lòng chọn trạng thái!")
      return
    }

    try {
      const success = await updateOrderStatus(orderId, newStatus)
      if (success) {
        await loadOrders()
        displayNotification("Đã cập nhật trạng thái đơn hàng thành công")
        setSelectedStatuses((prev) => ({
          ...prev,
          [orderId]: "",
        }))
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      displayNotification("Không thể cập nhật trạng thái đơn hàng")
    }
  }

  const handleStatusChange = (orderId, status) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [orderId]: status,
    })
  }

  const displayNotification = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  // Filter orders with null check
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
      if (!order) return false
      const matchesSearch =
        order.id?.toString().includes(searchTerm.toLowerCase()) ||
        order.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
    : []

  // View order details
  const handleViewDetails = async (orderId) => {
    try {
      setIsLoading(true)
      const details = await getOrderDetails(orderId)
      if (details) {
        setSelectedOrder(details)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      displayNotification("Không thể tải chi tiết đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

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

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {notificationMessage}
        </motion.div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedOrder(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminOrderManagement
