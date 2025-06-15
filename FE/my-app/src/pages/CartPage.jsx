import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/layout/Footer';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
  const {
    cartItems,
    selectedItems,
    currentPage,
    paymentMethod,
    showPaymentOptions,
    showPaymentCode,
    showUserInfoModal,
    vnpayCode,
    isLoading,
    itemsPerPage,
    totalQuantity,
    totalPages,
    paginatedItems,
    totalAmount,
    cartTotalPrice,
    userInfo,
    isUserInfoValid,
    handleSelectItem,
    handleSelectAll,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout,
    handlePaymentMethod,
    handleConfirmVnpayPayment,
    handleCopyCode,
    containerVariants,
    itemVariants,
    cardHoverVariants,
    setCurrentPage,
    setShowPaymentOptions,
    setShowPaymentCode,
    setShowUserInfoModal,
    setUserInfo,
    setIsUserInfoValid,
  } = useCart();

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      console.warn('Giá không hợp lệ:', price);
      return 'Không hợp lệ';
    }
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const validateUserInfo = () => {
    const { email, fullname, numberphone, address } = userInfo;
    return email && fullname && numberphone && address;
  };

  const handleSaveUserInfo = () => {
    if (!validateUserInfo()) {
      setIsUserInfoValid(false);
      return;
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setShowUserInfoModal(false);
    setShowPaymentOptions(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 rounded-full mix-blend-multiply blur-3xl opacity-20 top-[-160px] right-[-160px] bg-gradient-to-br from-purple-400 to-pink-500 animate-blob"></div>
        <div className="absolute w-80 h-80 rounded-full mix-blend-multiply blur-3xl opacity-20 bottom-[-160px] left-[-160px] bg-gradient-to-br from-yellow-400 to-red-500 animate-blob animation-delay-2s"></div>
        <div className="absolute w-80 h-80 rounded-full mix-blend-multiply blur-3xl opacity-20 top-[160px] left-[160px] bg-gradient-to-br from-blue-500 to-green-500 animate-blob animation-delay-4s"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Giỏ Hàng Của Bạn
          </h1>

          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span>{totalQuantity} sản phẩm</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span>{selectedItems.length} đã chọn</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <span>Tổng giỏ hàng: {formatPrice(cartTotalPrice)}</span>
            </div>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tiếp Tục Mua Sắm
          </Link>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          {cartItems.length > 0 ? (
            <>
              <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
                <label className="flex items-center gap-4 cursor-pointer text-lg font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-6 h-6 rounded-lg border-2 text-indigo-600 focus:ring-indigo-500"
                    aria-label="Chọn tất cả sản phẩm"
                  />
                  <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
                </label>
              </motion.div>

              <AnimatePresence>
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
                      key={item.productId}
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <motion.div variants={cardHoverVariants} className="p-6 flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.productId)}
                            onChange={() => handleSelectItem(item.productId)}
                            className="w-6 h-6 rounded-lg border-2 text-indigo-600 focus:ring-indigo-500"
                            aria-label={`Chọn ${item.productName}`}
                          />
                        </div>

                        <div className="relative flex-shrink-0">
                          <img
                            src={item.productImage || '/assets/images/default.jpg'}
                            alt={item.productName}
                            className="w-24 h-24 rounded-2xl object-cover shadow-md transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        <div className="flex-grow min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 truncate">{item.productName}</h3>
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-sm text-gray-500">Đơn giá:</span>
                            <span className="text-lg font-semibold text-indigo-600">{formatPrice(item.pricePerUnit)}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Số lượng:</span>
                            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuantityChange(item.productId, -1)}
                                className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-200"
                                aria-label={`Giảm số lượng ${item.productName}`}
                              >
                                −
                              </motion.button>
                              <span className="px-4 py-2 bg-white min-w-[48px] text-center font-semibold">{item.quantity}</span>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuantityChange(item.productId, 1)}
                                className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-200"
                                aria-label={`Tăng số lượng ${item.productName}`}
                              >
                                +
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div>
                            <p className="text-sm text-gray-500">Thành tiền:</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {formatPrice(item.totalPrice)}
                            </p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveItem(item.productId)}
                            className="mt-4 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                            aria-label={`Xóa ${item.productName}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center gap-4 mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-white/80 backdrop-blur-md text-gray-700 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Trang trước"
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
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white/80 backdrop-blur-md text-gray-700 hover:shadow-md'
                        }`}
                        aria-label={`Trang ${page}`}
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
                    className="px-6 py-3 bg-white/80 backdrop-blur-md text-gray-700 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    aria-label="Trang sau"
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
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Giỏ hàng trống</h3>
              <p className="text-gray-500 mb-8">Hãy thêm một số sản phẩm vào giỏ hàng của bạn!</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Khám phá sản phẩm
              </Link>
            </motion.div>
          )}
        </motion.section>

        {cartItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sticky bottom-4 z-20"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-4 mx-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.66 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tổng Kết</h3>
                  <p className="text-sm text-gray-500">{selectedItems.length} sản phẩm</p>
                </div>
              </div>

              <div className="text-right mr-4">
                <p className="text-sm text-gray-500">Tổng tiền (đã chọn):</p>
                <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(totalAmount)}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300"
                aria-label="Thanh toán"
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
          </motion.section>
        )}

        <AnimatePresence>
          {showUserInfoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setShowUserInfoModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Thông tin người dùng</h3>
                  {!isUserInfoValid && (
                    <p className="text-red-600 text-sm mb-4">Vui lòng điền đầy đủ thông tin!</p>
                  )}
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={userInfo.fullname}
                    onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })}
                    className="w-full border rounded-lg p-2 mb-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full border rounded-lg p-2 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={userInfo.numberphone}
                    onChange={(e) => setUserInfo({ ...userInfo, numberphone: e.target.value })}
                    className="w-full border rounded-lg p-2 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                    className="w-full border rounded-lg p-2 mb-4"
                  />
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUserInfoModal(false)}
                      className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-medium hover:bg-gray-200"
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveUserInfo}
                      className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-700"
                    >
                      Lưu
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    <p className="text-gray-500">
                      Tổng tiền: <span className="font-bold text-indigo-600">{formatPrice(totalAmount)}</span>
                    </p>
                  </div>

                  <div className="grid gap-4 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePaymentMethod('VNPAY')}
                      disabled={isLoading}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Thanh toán qua VNPAY"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                        <p className="text-sm text-gray-500">Thanh toán qua QR code, nhanh chóng và bảo mật</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePaymentMethod('COD')}
                      disabled={isLoading}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-lime-50 border-2 border-green-200 hover:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Thanh toán khi nhận hàng"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                        <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận được hàng</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>

                  {isLoading && (
                    <div className="text-center p-4">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500">Đang xử lý thanh toán...</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPaymentOptions(false)}
                    className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                    aria-label="Hủy chọn phương thức thanh toán"
                  >
                    Hủy
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <h4 className="font-bold text-gray-900">Thanh toán VNPAY</h4>
                    <p className="text-sm text-gray-500">Quét mã QR bên dưới để hoàn tất thanh toán</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-md border border-blue-200 mb-6">
                    <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-blue-300 relative overflow-hidden">
                      <img src="/assets/images/qr-placeholder.svg" alt="VNPAY QR Code" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm text-blue-600 font-medium">
                        QR Code VNPAY
                      </div>
                    </div>
                    <p className="text-xl font-mono font-bold text-gray-900 bg-white p-3 rounded-xl border border-gray-200 mb-2">{vnpayCode}</p>
                    <p className="text-sm text-gray-500 mb-4">Mã giao dịch của bạn</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyCode}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg flex items-center gap-2 mx-auto transition-all duration-300"
                      aria-label="Sao chép mã VNPAY"
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
                      className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                      aria-label="Hủy thanh toán"
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfirmVnpayPayment}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      aria-label="Xác nhận đã thanh toán"
                    >
                      Đã thanh toán
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;