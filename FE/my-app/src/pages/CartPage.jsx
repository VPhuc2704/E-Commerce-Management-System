"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "../components/layout/Footer"

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showPaymentCode, setShowPaymentCode] = useState(false)
  const [vnpayCode, setVnpayCode] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 4
  const [paymentMethod, setPaymentMethod] = useState("vnpay")
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)

  // Thêm vào đầu component, sau các useState khác
  useEffect(() => {
    if (showPaymentOptions || showPaymentCode) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showPaymentOptions, showPaymentCode])

  // Initialize cart from localStorage and listen for updates
  useEffect(() => {
    const fetchCartItems = () => {
      const savedCart = localStorage.getItem("cart")
      setCartItems(savedCart ? JSON.parse(savedCart) : [])
    }

    fetchCartItems()
    window.addEventListener("cartUpdated", fetchCartItems)
    return () => window.removeEventListener("cartUpdated", fetchCartItems)
  }, [])

  // Save cart to localStorage and dispatch cartUpdated event
  const saveCart = (newCart) => {
    setCartItems(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Calculate values
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalPages = Math.ceil(cartItems.length / itemsPerPage)
  const paginatedItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * (item.quantity || 0), 0)

  // Handle item selection
  const handleSelectItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  // Select all items
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item) => item.id))
    }
  }

  // Update quantity
  const handleQuantityChange = (id, delta) => {
    const newCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, (item.quantity || 0) + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    saveCart(newCart)
  }

  // Remove item with animation
  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      const newCart = cartItems.filter((item) => item.id !== id)
      saveCart(newCart)
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id))
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    }
  }

  // Handle checkout - chỉ mở modal lựa chọn phương thức
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!")
      return
    }
    setShowPaymentOptions(true)
  }

  // Handle payment after selecting method
  const handlePaymentMethod = async (method) => {
    setPaymentMethod(method)
    setShowPaymentOptions(false)
    setIsLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Xử lý theo phương thức thanh toán
    if (method === "vnpay") {
      const fakeVnpayCode = `VNPAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      setVnpayCode(fakeVnpayCode)
      setShowPaymentCode(true)
    } else if (method === "cod") {
      alert("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.")
    } else if (method === "banking") {
      alert("Đặt hàng thành công! Vui lòng chuyển khoản theo thông tin đã gửi qua email.")
    }

    setIsLoading(false)
  }

  // Handle copying VNPAY code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(vnpayCode)
      // Create success toast animation
      const toast = document.createElement("div")
      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300"
      toast.textContent = "Mã VNPAY đã được sao chép!"
      document.body.appendChild(toast)

      setTimeout(() => toast.classList.remove("translate-x-full"), 100)
      setTimeout(() => {
        toast.classList.add("translate-x-full")
        setTimeout(() => document.body.removeChild(toast), 300)
      }, 2000)
    } catch (err) {
      alert("Không thể sao chép mã. Vui lòng thử lại!")
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Giỏ Hàng Của Bạn
          </h1>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">{totalItems} sản phẩm</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">{selectedItems.length} đã chọn</span>
            </div>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tiếp Tục Mua Sắm
          </Link>
        </motion.section>

        {/* Cart Items Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          {cartItems.length > 0 ? (
            <>
              {/* Select All Control */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-white/20"
              >
                <label className="flex items-center gap-4 cursor-pointer" onClick={handleSelectAll}>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                      onChange={handleSelectAll}
                      className="sr-only"
                    />
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        selectedItems.length === cartItems.length && cartItems.length > 0
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent"
                          : "border-gray-300 bg-white hover:border-indigo-400"
                      }`}
                    >
                      {selectedItems.length === cartItems.length && cartItems.length > 0 && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">Chọn tất cả ({cartItems.length} sản phẩm)</span>
                </label>
              </motion.div>

              {/* Cart Items Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  className="grid gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {paginatedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <motion.div variants={cardHoverVariants} className="p-6">
                        <div className="flex items-center gap-6">
                          {/* Checkbox - FIXED */}
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => handleSelectItem(item.id)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                selectedItems.includes(item.id)
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent"
                                  : "border-gray-300 bg-white group-hover:border-indigo-400"
                              }`}
                            >
                              {selectedItems.includes(item.id) && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </motion.svg>
                              )}
                            </div>
                          </div>

                          {/* Product Image */}
                          <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                              <img
                                src={item.imageUrl || "/images/default.jpg"}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{item.quantity || 1}</span>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{item.name}</h3>
                            <div className="flex items-center gap-4 mb-4">
                              <span className="text-sm text-gray-500">Đơn giá:</span>
                              <span className="text-lg font-semibold text-indigo-600">
                                {item.price.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">Số lượng:</span>
                              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="px-4 py-2 hover:bg-gray-200 transition-colors duration-200 text-gray-600 font-bold"
                                >
                                  −
                                </motion.button>
                                <span className="px-4 py-2 bg-white font-semibold min-w-[3rem] text-center">
                                  {item.quantity || 1}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="px-4 py-2 hover:bg-gray-200 transition-colors duration-200 text-gray-600 font-bold"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="text-right flex-shrink-0">
                            <div className="mb-4">
                              <p className="text-sm text-gray-500 mb-1">Thành tiền:</p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {(item.price * (item.quantity || 0)).toLocaleString("vi-VN")} VNĐ
                              </p>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                            >
                              <svg
                                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-4 mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl"
                  >
                    ← Trước
                  </motion.button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                            : "bg-white/80 backdrop-blur-sm text-gray-700 hover:shadow-lg"
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl"
                  >
                    Sau →
                  </motion.button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Giỏ hàng trống</h3>
              <p className="text-gray-500 mb-8">Hãy thêm một số sản phẩm vào giỏ hàng của bạn!</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Khám phá sản phẩm
              </Link>
            </motion.div>
          )}
        </motion.section>

        {/* Checkout Section - Compact Version */}
        {cartItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sticky bottom-4 z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 mx-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.66 0-3 1.34-3 3v6h6v-6c0-1.66-1.34-3-3-3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Tổng Kết</h3>
                    <p className="text-sm text-gray-600">{selectedItems.length} sản phẩm</p>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="text-sm text-gray-500">Tổng tiền:</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {totalAmount.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Thanh Toán
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Modal lựa chọn phương thức thanh toán */}
        <AnimatePresence>
          {showPaymentOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setShowPaymentOptions(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Chọn phương thức thanh toán</h3>
                    <p className="text-gray-600">
                      Tổng tiền:{" "}
                      <span className="font-bold text-indigo-600">{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {/* Các option thanh toán giữ nguyên */}
                    {/* VNPAY Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePaymentMethod("vnpay")}
                      disabled={isLoading}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all duration-300 disabled:opacity-50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="text-left flex-grow">
                        <h4 className="font-bold text-gray-900">VNPAY</h4>
                        <p className="text-sm text-gray-600">Thanh toán qua QR code, nhanh chóng và bảo mật</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>

                    {/* COD Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePaymentMethod("cod")}
                      disabled={isLoading}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-400 transition-all duration-300 disabled:opacity-50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-left flex-grow">
                        <h4 className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</h4>
                        <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận được hàng</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>

                    {/* Banking Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePaymentMethod("banking")}
                      disabled={isLoading}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-all duration-300 disabled:opacity-50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div className="text-left flex-grow">
                        <h4 className="font-bold text-gray-900">Chuyển khoản ngân hàng</h4>
                        <p className="text-sm text-gray-600">Chuyển khoản trực tiếp qua ngân hàng</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Loading state */}
                  {isLoading && (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600">Đang xử lý thanh toán...</p>
                    </div>
                  )}

                  {/* Nút đóng */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPaymentOptions(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    Hủy
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Code Modal - VNPAY */}
        <AnimatePresence>
          {showPaymentCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setShowPaymentCode(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán VNPAY</h4>
                    <p className="text-gray-600 mb-6">Quét mã QR bên dưới để hoàn tất thanh toán</p>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg mb-6 border border-blue-100">
                      <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-blue-300 relative overflow-hidden">
                        <img
                          src="/placeholder.svg?height=200&width=200"
                          alt="VNPAY QR Code"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                          <span className="text-blue-600 font-medium">QR Code VNPAY</span>
                        </div>
                      </div>
                      <p className="text-xl font-mono font-bold text-gray-900 mb-2 bg-white py-3 px-4 rounded-xl border border-gray-200">
                        {vnpayCode}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">Mã giao dịch của bạn</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyCode}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Sao Chép Mã
                      </motion.button>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPaymentCode(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                      >
                        Hủy thanh toán
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Đã thanh toán
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default CartPage
