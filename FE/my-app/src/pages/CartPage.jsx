import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';

// Dữ liệu giả lập ban đầu
const initialCartItems = [
  {
    id: 1,
    name: 'Tai nghe Bluetooth Sony',
    price: 1500000,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Áo thun Unisex',
    price: 250000,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 2,
  },
  {
    id: 3,
    name: 'Đồng hồ thông minh Apple',
    price: 5000000,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 1,
  },
  {
    id: 4,
    name: 'Quần jeans nam',
    price: 400000,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 3,
  },
  {
    id: 5,
    name: 'Giày thể thao Nike',
    price: 2000000,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 1,
  },
  {
    id: 6,
    name: 'Balô du lịch',
    price: 800000,
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 2,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPaymentCode, setShowPaymentCode] = useState(false);
  const [vnpayCode, setVnpayCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lấy dữ liệu giỏ hàng từ localStorage
  useEffect(() => {
    const fetchCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : initialCartItems;
    };
    setCartItems(fetchCartItems());
  }, []);

  // Lưu dữ liệu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Tính tổng số sản phẩm
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng số trang
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  // Lấy danh sách sản phẩm cho trang hiện tại
  const paginatedItems = cartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tính tổng tiền của các sản phẩm được chọn
  const totalAmount = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Xử lý chọn sản phẩm
  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Cập nhật số lượng
  const updateCartItem = (itemId, quantity) => {
    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = Math.max(1, item.quantity + delta);
    updateCartItem(id, newQuantity);
  };

  // Xóa sản phẩm
  const removeCartItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const handleRemoveItem = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeCartItem(id);
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    }
  };

  // Xử lý thanh toán với VNPAY
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }
    const fakeVnpayCode = `VNPAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setVnpayCode(fakeVnpayCode);
    setShowPaymentCode(true);
  };

  // Xử lý sao chép mã VNPAY
  const handleCopyCode = () => {
    navigator.clipboard.writeText(vnpayCode);
    alert('Mã VNPAY đã được sao chép!');
  };

  // Cuộn lên đầu trang khi thay đổi trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Hiệu ứng 3D cho thẻ sản phẩm
  const cardVariants = {
    hover: {
      rotateY: 10,
      rotateX: 10,
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    initial: {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        <section className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <svg
              className="w-10 h-10 text-indigo-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h18l-2 12H5L3 3zm5 12h8m-5 4h2"
              ></path>
            </svg>
            <h1 className="text-4xl font-extrabold text-indigo-900">Giỏ Hàng Của Bạn</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8 animate-fade-in-delayed">
            Tổng số sản phẩm: <span className="font-bold">{totalItems}</span>
          </p>
          <Link
            to="/shop"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 mb-8 animate-fade-in-delayed"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </section>

        <section className="mb-12">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {paginatedItems.map(item => (
                <motion.div
                  key={item.id}
                  className="flex items-center bg-white rounded-xl shadow-lg p-4 transform hover:shadow-xl transition-all duration-300"
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">Đơn giá: {item.price.toLocaleString('vi-VN')} VNĐ</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-all"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-indigo-600">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-2 relative inline-flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 animate-fade-in-delayed">
              Giỏ hàng của bạn hiện đang trống!
            </p>
          )}
        </section>

        {cartItems.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-all duration-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}

        {cartItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-600 to-coral-600 rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden mt-12"
          >
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <svg
                  className="w-8 h-8 text-white mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.2 0-4-1.8-4-4H4v2h4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h4v-2h-4c0 2.2-1.8 4-4 4zM4 6h16v2H4z"
                  ></path>
                </svg>
                <h2 className="text-3xl font-bold text-white">Tổng Kết Thanh Toán</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-4">
                  <svg
                    className="w-6 h-6 text-white mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h18l-2 12H5L3 3zm5 12h8m-5 4h2"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm text-white opacity-80">Số sản phẩm đã chọn</p>
                    <p className="text-2xl font-semibold text-white">{selectedItems.length}</p>
                  </div>
                </div>

                <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-4">
                  <svg
                    className="w-6 h-6 text-white mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.2 0-4-1.8-4-4H4v2h4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h4v-2h-4c0 2.2-1.8 4-4 4zM4 6h16v2H4z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm text-white opacity-80">Tổng số tiền</p>
                    <p className="text-2xl font-semibold text-white">
                      {totalAmount.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-white text-indigo-900 font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.1.9-2 2-2h1a2 2 0 012 2v1a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1zm-8 0c0-1.1.9-2 2-2h1a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1zm16 6H4v2h16v-2zM4 6h16v2H4V6z"
                  ></path>
                </svg>
                Thanh Toán với VNPAY
              </button>

              {showPaymentCode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 p-6 bg-white rounded-lg shadow-lg text-center"
                >
                  <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center justify-center gap-2">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                    Mã Thanh Toán VNPAY
                  </h3>
                  <div className="w-32 h-32 mx-auto mb-4 border-4 border-indigo-600 rounded-lg flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500 text-sm">QR Placeholder</p>
                  </div>
                  <p className="text-lg font-mono text-gray-700 mb-4 bg-gray-100 p-2 rounded-lg">{vnpayCode}</p>
                  <button
                    onClick={handleCopyCode}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Sao Chép Mã
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;