"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState({})
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Mock dữ liệu đơn hàng từ localStorage với thêm thông tin
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const savedOrders = localStorage.getItem("orders")
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      } else {
        const mockOrders = [
          {
            id: "ORDER-123",
            date: "2025-05-25",
            total: 2500000,
            status: "Chờ xác nhận",
            customer: {
              name: "Nguyễn Văn A",
              email: "nguyenvana@example.com",
              phone: "0901234567",
            },
            address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
            payment: "COD",
            products: [
              { id: 1, name: "Tai nghe Bluetooth Sony", quantity: 1, price: 1500000 },
              { id: 2, name: "Áo thun Unisex", quantity: 2, price: 250000 },
            ],
          },
          {
            id: "ORDER-124",
            date: "2025-05-24",
            total: 1500000,
            status: "Đang giao",
            customer: {
              name: "Trần Thị B",
              email: "tranthib@example.com",
              phone: "0912345678",
            },
            address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
            payment: "Banking",
            products: [{ id: 3, name: "Đồng hồ thông minh Apple", quantity: 1, price: 5000000 }],
          },
          {
            id: "ORDER-125",
            date: "2025-05-23",
            total: 3200000,
            status: "Đã hoàn thành",
            customer: {
              name: "Lê Văn C",
              email: "levanc@example.com",
              phone: "0923456789",
            },
            address: "789 Đường Võ Văn Tần, Quận 3, TP.HCM",
            payment: "Momo",
            products: [
              { id: 4, name: "Laptop Asus", quantity: 1, price: 15000000 },
              { id: 5, name: "Chuột không dây", quantity: 1, price: 450000 },
            ],
          },
          {
            id: "ORDER-126",
            date: "2025-05-22",
            total: 850000,
            status: "Đã hủy",
            customer: {
              name: "Phạm Thị D",
              email: "phamthid@example.com",
              phone: "0934567890",
            },
            address: "101 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
            payment: "COD",
            products: [{ id: 6, name: "Bàn phím cơ", quantity: 1, price: 850000 }],
          },
          {
            id: "ORDER-127",
            date: "2025-05-21",
            total: 1750000,
            status: "Chờ xác nhận",
            customer: {
              name: "Hoàng Văn E",
              email: "hoangvane@example.com",
              phone: "0945678901",
            },
            address: "202 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
            payment: "Banking",
            products: [
              { id: 7, name: "Máy ảnh Canon", quantity: 1, price: 12000000 },
              { id: 8, name: "Thẻ nhớ 128GB", quantity: 1, price: 450000 },
            ],
          },
        ]
        setOrders(mockOrders)
        localStorage.setItem("orders", JSON.stringify(mockOrders))
      }
      setIsLoading(false)
    }, 1000)
  }, [])

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (orderId) => {
    const newStatus = selectedStatuses[orderId]
    if (!newStatus) {
      displayNotification("Vui lòng chọn trạng thái!")
      return
    }

    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Reset selected status for this order
    setSelectedStatuses({
      ...selectedStatuses,
      [orderId]: "",
    })

    displayNotification(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}`)
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Đang giao":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800 border-green-200"
      case "Đã hủy":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Payment method icon
  const getPaymentIcon = (method) => {
    switch (method) {
      case "COD":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )
      case "Banking":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        )
      case "Momo":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        )
    }
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng đơn hàng</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Chờ xác nhận</p>
              <p className="text-3xl font-bold">{orders.filter((order) => order.status === "Chờ xác nhận").length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Đã hoàn thành</p>
              <p className="text-3xl font-bold">{orders.filter((order) => order.status === "Đã hoàn thành").length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Đã hủy</p>
              <p className="text-3xl font-bold">{orders.filter((order) => order.status === "Đã hủy").length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredOrders.length > 0 && filteredOrders.every((order) => order && order.id) ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Mã đơn</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày đặt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thanh toán</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={listItemVariants}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customer?.name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{order.customer?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{order.total.toLocaleString("vi-VN")} VNĐ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        {getPaymentIcon(order.payment)}
                        <span className="ml-1">{order.payment}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedStatuses[order.id] || ""}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Chọn trạng thái</option>
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã hoàn thành">Đã hoàn thành</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                        <button
                          onClick={() => handleUpdateStatus(order.id)}
                          className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Cập nhật
                        </button>
                        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-600">Không tìm thấy đơn hàng nào</p>
            <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </motion.div>

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
    </div>
  )
}

export default AdminOrderManagement
