import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';
import { useProductListing } from '../hooks/useProductListing';
import { useProductListingPage } from '../hooks/useProductListingPage';
import { productService } from '../services/productService.js';

const ProductListing = () => {
  const {
    products,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    category,
    setCategory,
    productsPerPage,
  } = useProductListing();


  const {
    buyNowModal,
    setBuyNowModal,
    quantity,
    setQuantity,
    paymentMethod,
    setPaymentMethod,
    userInfo,
    setUserInfo,
    isUserInfoValid,
    handleAddToCart,
    handleBuyNow,
    handlePlaceOrder,
  } = useProductListingPage();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceFilter = (e) => {
    const [min, max] = e.target.value.split('-').map(Number);
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  // Debug: Kiểm tra products
  console.log('Products:', products);


  // const [setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const categoryData = await productService.getAllCategories();
        setCategories(categoryData);

        // Fetch initial products (all products)
        // const productData = await productService.getAllProducts();
        // setProducts(productData);
      } catch (err) {
        setError('Không thể tải dữ liệu');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category selection
  const handleCategoryClick = async (categoryId) => {
    setCategory(categoryId);
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Danh sách sản phẩm</h1>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            onChange={handlePriceFilter}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0-1000">Tất cả giá</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-500">$500 - $1000</option>
          </select>
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${selectedCategory === ''
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-500 text-center py-8">
            {error}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (

              products.map((product) => {
                console.log('Rendering product:', product); // Debug mỗi sản phẩm
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <Link
                      to={`/product-details/${product.id}`}
                      key={product.id}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={product.imageUrl || '/assets/images/default.jpg'}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || 'Không có mô tả'}</p>
                      <p className="text-indigo-600 font-bold">{product.originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                    </Link>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Thêm vào giỏ
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </motion.div>
                );
              })

            ) : (
              <p className="text-center text-gray-600">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-all duration-300"
          >
            Trước
          </button>
          <span className="px-4 py-2 text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-all duration-300"
          >
            Sau
          </button>
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
                <p>{buyNowModal.price.toLocaleString('vi-VN')} VNĐ</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Số lượng</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
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

export default ProductListing;