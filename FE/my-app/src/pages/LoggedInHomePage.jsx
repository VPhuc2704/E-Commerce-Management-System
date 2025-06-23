import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import AboutUs from '../components/quick links/AboutUs';
import Contact from '../components/quick links/Contact';
import PrivacyPolicy from '../components/quick links/PrivacyPolicy';
import TermsOfService from '../components/quick links/TermsOfService';
import { productService } from '../services/productService';
import { feedbackService } from '../services/feedbackService';

import comtamImg from '../assets/images/comtam.jpg';
import goicuonImg from '../assets/images/goicuon.jpg';
import traicayImg from '../assets/images/traicay.jpg';

const DishItem = ({ name, price, feedback = {}, imageUrl, soldQuantity, id }) => {
  const rawRating = Number(feedback?.rating);
  const rating = isNaN(rawRating) ? 0 : Math.min(Math.max(rawRating, 0), 5);

  const fullStars = Math.round(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-2 hover:shadow-lg transition-shadow duration-300">
      <img src={imageUrl || 'src/assets/images/default.jpg'} alt={name} className="w-24 h-24 object-cover rounded mr-4" />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900 hover:no-underline">{name}</h4>
          {soldQuantity > 50 && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold hover:no-underline">
              HOT 🔥
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-gray-600 font-medium hover:no-underline">Giá: {price.toLocaleString('vi-VN')} VNĐ</p>
            <p className="text-green-600 text-sm hover:no-underline">Đã bán: {soldQuantity != null ? soldQuantity : 0} suất</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <div className="text-amber-400 text-sm">
                {'★'.repeat(fullStars)}
              </div>
              <div className="text-gray-300 text-sm">
                {'☆'.repeat(emptyStars)}
              </div>
            </div>
            <p className="text-gray-500 text-sm hover:no-underline">({(rating || 0).toFixed(1)}/5)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DishCarouselItem = ({ imageUrl, name, isActive }) => (
  <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
    }`}>
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <img
        src={imageUrl || 'src/assets/images/default_carousel.jpg'}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="transform transition-all duration-500 hover:translate-y-[-8px]">
          <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {name || 'Món ăn đặc biệt'}
          </h3>
          <p className="text-white/90 text-lg">
            Món ăn được chế biến tươi ngon mỗi ngày!
          </p>
        </div>
      </div>
    </div>
  </div>
);

const LoggedInHomePage = ({ user }) => {
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [cart, setCart] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const itemsPerPage = 5;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const qualityBadges = ['CHẤT LƯỢNG', 'VỆ SINH', 'TƯƠI NGON'];
  const featuredDishes = [
    { imageUrl: comtamImg, name: 'Cơm Tấm Đặc Biệt' },
    { imageUrl: goicuonImg, name: 'Gỏi Cuốn Tươi Ngon' },
    { imageUrl: traicayImg, name: 'Trái Cây Tươi Mát' },
  ];

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoryData = await productService.getAllCategories();
        const categoriesWithProducts = await Promise.all(
          categoryData.map(async (category) => {
            const products = await productService.getProductsByCategory(category.id);
            console.log('Products for category', category.name, ':', products);
            const productsWithRatings = await Promise.all(
              products.map(async (product) => {
                try {
                  const feedback = await feedbackService.getFeedbacksByProduct(product.id);
                  const ratings = feedback.map(fb => fb.rating);
                  const avgRating = ratings.length > 0
                    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                    : 0;
                  return { ...product, feedback: { rating: avgRating } };
                } catch (err) {
                  console.warn('Lỗi feedback sản phẩm:', product.id, err.message);
                  return { ...product, feedback: { rating: 0 } };
                }
              })
            );
            return {
              ...category,
              items: productsWithRatings
            };
          })
        );

        setCategories(categoriesWithProducts);
      } catch (error) {
        setError(error.message);
        console.error('Lỗi khi tải danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let mounted = true;

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredDishes.length);
      setCurrentBadgeIndex((prevIndex) => (prevIndex + 1) % qualityBadges.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const productCategoriesSection = document.getElementById('product-categories');
      if (productCategoriesSection) {
        const rect = productCategoriesSection.getBoundingClientRect();
        setShowScrollToTop(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sortedItems = selectedCategory
    ? [...categories.find(cat => cat.name === selectedCategory).items].sort((a, b) => b.soldQuantity - a.soldQuantity)
    : [];

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCategoryPages = selectedCategory
    ? Math.ceil(sortedItems.length / itemsPerPage)
    : 0;

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
    setCurrentBadgeIndex(index % qualityBadges.length);
  };

  const scrollToProductCategories = () => {
    const element = document.getElementById('product-categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col animate-fade-in">
      <main className="flex-grow container mx-auto p-6">
        <section className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold mb-4 tracking-wide text-indigo-800 drop-shadow-lg">
              Chào mừng trở lại, {user?.fullname || 'User'}!
            </h1>
            <p className="text-xl mb-6 text-indigo-600 font-medium">
              Nơi hương vị gặp gỡ tình yêu - Trải nghiệm ẩm thực đích thực
            </p>
            {isAdmin && (
              <Link
                to="/admin/products"
                className="inline-block bg-coral-600 text-white px-6 py-3 rounded-lg hover:bg-coral-700 transition-all duration-300 mb-8 animate-fade-in-delayed"
              >
                Quản lý sản phẩm
              </Link>
            )}
          </div>
          <div className="relative mx-auto max-w-4xl">
            <div className="relative w-full aspect-[16/9] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl">
                <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                  <div className="relative w-full h-full">
                    {featuredDishes.map((dish, index) => (
                      <DishCarouselItem
                        key={index}
                        imageUrl={dish.imageUrl}
                        name={dish.name}
                        isActive={index === currentImageIndex}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                {featuredDishes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                      ? 'bg-white scale-125 shadow-lg'
                      : 'bg-white/60 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-all duration-500">
                  {qualityBadges[currentBadgeIndex]}
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg text-gray-700 font-medium mb-4">
                🍽️ <span className="text-indigo-600 font-bold">Phục vụ hàng ngày</span> từ 6:00 - 22:00
              </p>
              <button
                onClick={scrollToProductCategories}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl mr-4"
              >
                🍴 XEM MENU
              </button>
            </div>
          </div>
        </section>
        {flashSaleProducts.length > 0 && (
          <section className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden glow-border">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-coral-600">Flash Sale</h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-800 font-medium">Kết thúc sau:</span>
                <div className="flex space-x-2">
                  <div className="bg-gradient-to-r from-coral-600 to-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold shadow-md animate-pulse">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <span className="text-gray-800 font-medium text-xl">:</span>
                  <div className="bg-gradient-to-r from-coral-600 to-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold shadow-md animate-pulse">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <span className="text-gray-800 font-medium text-xl">:</span>
                  <div className="bg-gradient-to-r from-coral-600 to-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full font-bold shadow-md animate-pulse">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {flashSaleProducts.map((product) => (
                <Link
                  to={`/product-details/${product.id}`}
                  key={product.id}
                  className="no-underline hover:no-underline"
                >
                  <div
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full">
                        {product.discountPercentage}% OFF
                      </div>
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Limited Stock
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:no-underline">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-green-600 font-bold text-xl">{product.salePrice?.toLocaleString('vi-VN')} VNĐ</span>
                          <span className="text-gray-500 text-base line-through ml-2">{product.originalPrice?.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        <section id="product-categories" className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <h2 className="text-3xl font-bold text-coral-600 mb-6 text-center">Danh Mục Sản Phẩm</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải danh mục...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="flex justify-center flex-wrap gap-4 relative z-20">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-6 py-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300 font-medium ${selectedCategory === category.name
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-102'
                    }`}
                  style={{ zIndex: 20 }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </section>
        {selectedCategory && (
          <section className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-coral-600">{selectedCategory}</h2>
              <p className="text-sm text-gray-600">Sắp xếp theo: Độ phổ biến</p>
            </div>
            <div className="space-y-2">
              {paginatedItems.map((item, index) => (
                <Link
                  to={`/product-details/${item.id}`}
                  key={index}
                  className="no-underline hover:no-underline block hover:bg-gray-50 rounded-lg transition-colors duration-300"
                >
                  <DishItem
                    name={item.name}
                    price={item.price}
                    feedback={item.feedback}
                    imageUrl={`${BASE_URL}/${item.image}`}
                    soldQuantity={item.soldQuantity}
                    id={item.id}
                  />
                </Link>
              ))}
            </div>
            {totalCategoryPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  Previous
                </button>
                {Array.from({ length: totalCategoryPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${currentPage === index + 1
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-100 hover:shadow-md'
                      } transition-all duration-300`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalCategoryPages))}
                  disabled={currentPage === totalCategoryPages}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}
        <AboutUs />
        <Contact />
        <PrivacyPolicy />
        <TermsOfService />
      </main>
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl z-50 border-2 border-white/20"
          aria-label="Quay lại đầu trang"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-center">
            <svg
              className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 12l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute right-full mr-3 top 1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
            Quay về đầu trang
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      )}
      <Footer />
    </div>
  );
};

export default LoggedInHomePage;