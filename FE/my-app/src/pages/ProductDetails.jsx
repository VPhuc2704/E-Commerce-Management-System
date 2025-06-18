import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Thêm framer-motion
import Footer from '../components/layout/Footer';
import { useProductDetails } from '../hooks/useProductDetails';
import { useProductFeedbacks } from '../hooks/useProductFeedbacks';
import { useCart } from '../hooks/useCart';



const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString('vi-VN');
  };
  const baseUrl = "http://localhost:8081";
  const imageUrl = `${baseUrl}${product.image}`;
  return (
    <Link to={`/product-details/${product.id}`} className="no-underline hover:no-underline group">
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex items-center space-x-4 hover:border-indigo-200">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={imageUrl || '/assets/images/default.jpg'}
            alt={product.name}
            className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 mb-1">{product.name}</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 font-semibold text-sm">{formatPrice(product.price)} VNĐ</p>
              <p className="text-emerald-600 text-xs font-medium">Đã bán: {product.soldCount || 0}</p>
            </div>
            <div className="text-amber-400 text-sm">
              {'★'.repeat(product.rating || 0) + '☆'.repeat(5 - (product.rating || 0))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Custom notification component
const Notification = ({ message, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 transform transition-all duration-500 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    product,
    relatedProducts,
    hasPurchasedAndConfirmed,
    quantity,
    handleQuantityChange,
    handleAddToCart,
    notification,
    setNotification,
    feedbackRating,
    setFeedbackRating,
    feedbackComment,
    setFeedbackComment,
    feedbackImage,
    setFeedbackImage,
    handleFeedbackSubmit,
    isAddingToCart,
    buyNowModal,
    setBuyNowModal,
    paymentMethod,
    setPaymentMethod,
    userInfo,
    setUserInfo,
    isUserInfoValid,
    handlePlaceOrder,
    handleBuyNow,
  } = useProductDetails(id, navigate);

  const { feedbacks, loading, fetchReviews } = useProductFeedbacks(product?.id);

  const { addItemToCart } = useCart();

  const handleStarClick = (rating) => {
    setFeedbackRating(rating);
  };

  const formatPrice = (price) => {
    const number = Number(price);
    if (isNaN(number)) return '0';
    return number.toLocaleString('vi-VN');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      <main className="flex-grow container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col xl:flex-row gap-8">
          <section className="xl:w-2/3 bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2 relative group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <img
                    src={`http://localhost:8081${product.image}` || '/assets/images/default.jpg'}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  {product.category}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  Bán chạy #{product.soldCount}
                </div>
              </div>

              <div className="lg:w-1/2 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {product.name}
                    </h1>
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-amber-400 text-2xl">
                          {'★'.repeat(product.rating)}
                        </div>
                        <div className="text-gray-300 text-2xl">
                          {'☆'.repeat(5 - product.rating)}
                        </div>
                      </div>
                      <span className="text-gray-600 font-medium">({product.rating}/5)</span>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg mb-6">
                      <div className="text-3xl font-black mb-2">
                        {formatPrice(product.price)} VNĐ
                      </div>
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <div className="text-sm line-through text-indigo-200 mb-1">
                          {formatPrice(product.originalPrice)} VNĐ
                        </div>
                      )}
                      <div className="text-indigo-100 text-sm">
                        Giá đã bao gồm VAT
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-indigo-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-2xl shadow-inner border border-gray-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="text-gray-700 font-semibold">Số lượng:</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange({ target: { value: (parseInt(quantity) - 1).toString() } })}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 transition-colors duration-200"
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="border-2 border-gray-300 focus:border-indigo-500 p-3 w-20 rounded-xl text-center font-bold focus:outline-none transition-all duration-200"
                        aria-label="Số lượng sản phẩm"
                      />
                      <button
                        onClick={() => handleQuantityChange({ target: { value: (parseInt(quantity) + 1).toString() } })}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 transition-colors duration-200"
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => addItemToCart(product, quantity)}
                      disabled={isAddingToCart}
                      className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isAddingToCart ? 'animate-pulse' : 'hover:from-indigo-700 hover:to-purple-700'}`}
                      aria-label="Thêm vào giỏ hàng"
                    >
                      {isAddingToCart ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang thêm...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                          </svg>
                          <span>Thêm vào giỏ hàng</span>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                      aria-label="Mua ngay"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 0c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" />
                        </svg>
                        <span>Mua ngay</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 bg-gray-50 p-8 rounded-3xl shadow-inner border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Phản hồi từ khách hàng ({feedbacks.length})</h2>
              {feedbacks.length > 0 ? (
                <div className="space-y-6">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="font-semibold text-gray-900">{feedback.userName}</span>
                        <div className="flex items-center space-x-1">
                          <div className="text-amber-400">
                            {'★'.repeat(feedback.rating)}
                          </div>
                          <div className="text-gray-300">
                            {'☆'.repeat(5 - feedback.rating)}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">{feedback.create}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                      {feedback.imageUrl && (
                        <img
                          src={`http://localhost:8081${feedback.imageUrl}`}
                          alt={`Feedback from ${feedback.user}`}
                          className="w-24 h-24 object-cover rounded-xl mt-3 shadow-sm hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Chưa có phản hồi nào.</p>
              )}

              {hasPurchasedAndConfirmed && (
                <div className="mt-10 bg-white p-8 rounded-3xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Gửi đánh giá của bạn</h3>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Đánh giá:</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            className={`text-3xl transition-colors duration-200 focus:outline-none ${feedbackRating >= star ? 'text-amber-400' : 'text-gray-300 hover:text-amber-200'}`}
                            aria-label={`Đánh giá ${star} sao`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Nhận xét:</label>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="w-full border-2 border-gray-300 focus:border-indigo-500 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-none"
                        rows="5"
                        placeholder="Nhập nhận xét của bạn..."
                        aria-label="Nhận xét về sản phẩm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Tải ảnh (tùy chọn):</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFeedbackImage(e.target.files[0])}
                        className="border-2 border-gray-300 p-3 rounded-xl file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all duration-200 w-full"
                        aria-label="Tải ảnh phản hồi"
                      />
                      {feedbackImage && (
                        <div className="mt-4">
                          <img
                            src={URL.createObjectURL(feedbackImage)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      aria-label="Gửi đánh giá"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

          <section className="xl:w-1/3 bg-gradient-to-b from-indigo-100/70 to-purple-100/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-indigo-200/50 hover:shadow-3xl transition-all duration-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="space-y-4">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-gray-500 italic">Không có sản phẩm liên quan.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {buyNowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đặt hàng ngay</h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={buyNowModal.imageUrl}
                alt={buyNowModal.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold">{buyNowModal.name}</p>
                <p>{formatPrice(buyNowModal.price)} VNĐ</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Số lượng</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Phương thức thanh toán</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="VNPAY">VNPAY</option>
                <option value="COD">COD</option>
              </select>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin người dùng</h4>
              {!isUserInfoValid && (
                <p className="text-red-600 text-sm mb-2">Vui lòng điền đầy đủ thông tin!</p>
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
                className="w-full border rounded-lg p-2 mb-2"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setBuyNowModal(null)}
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handlePlaceOrder}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Đặt hàng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetails;