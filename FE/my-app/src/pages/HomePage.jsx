import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import '../features/home/home.css';
import { productService } from '../services/productService';

// Reusable component for dish items
const DishItem = ({ id, name, price, rating, imageUrl, soldCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product-details/${id}`);
  };

  return (
    <div
      className="flex items-center bg-white rounded-lg shadow-md p-4 mb-2 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={imageUrl || 'src/assets/images/default.jpg'}
        alt={name} className="w-24 h-24 object-cover rounded mr-4"
      />
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
          {soldCount > 50 && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
              HOT 🔥
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-gray-600 font-medium">Giá: {price.toLocaleString('vi-VN')} VNĐ</p>
            <p className="text-green-600 text-sm">Đã bán: {soldCount} suất</p>
          </div>
          <div className="text-right">
            <p className="text-yellow-500 mb-1">{'★'.repeat(rating) + '☆'.repeat(5 - rating)}</p>
            <p className="text-gray-500 text-sm">({rating}/5)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Dish Carousel Item with better fit and animations
const DishCarouselItem = ({ imageUrl, name, isActive }) => (
  <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
    }`}>
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <img
        src={imageUrl || 'src/assets/images/default_carousel.jpg'}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      {/* Content overlay */}
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

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  // Quality badges that rotate with images
  const qualityBadges = ['CHẤT LƯỢNG', 'VỆ SINH', 'TƯƠI NGON'];

  // Enhanced test images for carousel with names
  const featuredDishes = [
    {
      imageUrl: 'src/assets/images/comtam.jpg',
      name: 'Cơm Tấm Đặc Biệt'
    },
    {
      imageUrl: 'src/assets/images/goicuon.jpg',
      name: 'Gỏi Cuốn Tươi Ngon'
    },
    {
      imageUrl: 'src/assets/images/traicay.jpg',
      name: 'Trái Cây Tươi Mát'
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  // Fetch products by selected category
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (selectedCategory?.id) {
        try {
          const productsData = await productService.getProductsByCategory(selectedCategory.id);
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      }
    };
    fetchProductsByCategory();
  }, [selectedCategory]);
  // Auto-rotate images every 4 seconds with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredDishes.length);
      setCurrentBadgeIndex((prevIndex) => (prevIndex + 1) % qualityBadges.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      const productCategoriesSection = document.getElementById('product-categories');
      if (productCategoriesSection) {
        const rect = productCategoriesSection.getBoundingClientRect();
        // Show button when user scrolls past the product categories section
        setShowScrollToTop(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);


  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    setSelectedCategory(category);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col animate-fade-in">
      <main className="flex-grow container mx-auto p-6">
        {/* Enhanced Super Sale Weekend Section */}
        <section className="text-center mb-12">
          {/* Header with animated text */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold mb-4 tracking-wide text-indigo-800 drop-shadow-lg">
              Ăn Cùng Chúng Tôi
            </h1>
            <p className="text-xl mb-6 text-indigo-600 font-medium">
              Nơi hương vị gặp gỡ tình yêu - Trải nghiệm ẩm thực đích thực
            </p>
          </div>

          {/* Enhanced Carousel Container */}
          <div className="relative mx-auto max-w-4xl">
            {/* Main carousel container with fixed aspect ratio */}
            <div className="relative w-full aspect-[16/9] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
              {/* Decorative border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl">
                <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                  {/* Image carousel */}
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

              {/* Navigation dots */}
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

              {/* Quality badge - rotates with images */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-all duration-500">
                  {qualityBadges[currentBadgeIndex]}
                </div>
              </div>
            </div>

            {/* Promotional text below carousel */}
            <div className="mt-6 text-center">
              <p className="text-lg text-gray-700 font-medium mb-4">
                🍽️ <span className="text-indigo-600 font-bold">Phục vụ hàng ngày</span> từ 6:00 - 22:00
              </p>

              {/* Nút ăn ngay */}
              <button
                onClick={scrollToProductCategories}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                🍴 ĂN NGAY
              </button>
            </div>
          </div>
        </section>

        {/* Danh Mục Sản Phẩm */}
        <section id="product-categories" className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <h2 className="text-3xl font-bold text-coral-600 mb-6 text-center">Danh Mục Sản Phẩm</h2>
          {/* Danh mục sản phẩm */}
          <div className="flex justify-center flex-wrap gap-4 relative z-20">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`px-6 py-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300 font-medium ${selectedCategory?.id === category.id
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-102'
                  }`}
                style={{ zIndex: 20 }}
              >
                {category.name || 'Unnamed Category'}
              </button>
            ))}
          </div>
        </section>

        {/* Category Details */}
        {selectedCategory && (
          <section className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-coral-600">{selectedCategory.name}</h2>
            </div>
            <div className="space-y-2">
              {paginatedProducts.map((item) => (
                <DishItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  rating={item.rating || 0}
                  imageUrl={`http://localhost:8081${item.image}`}
                  soldCount={item.soldCount || 0}
                />
              ))}
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${currentPage === index + 1
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-gray-800 border hover:bg-indigo-100'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Enhanced Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl z-50 border-2 border-white/20"
          aria-label="Quay lại đầu trang"
        >
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Main icon */}
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
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>

          {/* Ripple effect on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
            Quay về đầu trang
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;