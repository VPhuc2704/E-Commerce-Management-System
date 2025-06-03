import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import '../features/home/home.css';

// Reusable component for dish items
const DishItem = ({ name, price, rating, imageUrl, soldCount }) => (
  <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-2 hover:shadow-lg transition-shadow duration-300">
    <img src={imageUrl || 'src/assets/images/default.jpg'} alt={name} className="w-24 h-24 object-cover rounded mr-4" />
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

// Enhanced Dish Carousel Item with better fit and animations
const DishCarouselItem = ({ imageUrl, name, isActive }) => (
  <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
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
  const itemsPerPage = 5;
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

  // Dish categories and their items (placeholders for local images)
  const categories = [
    {
      name: 'Khai Vị',
      items: [
        { name: 'Gỏi cuốn tôm thịt', price: 30000, rating: 4, imageUrl: 'src/assets/images/goi_cuon_tom_thit.jpg', soldCount: 85 },
        { name: 'Chả giò chiên giòn', price: 25000, rating: 4, imageUrl: 'src/assets/images/cha_gio_chien_gion.jpg', soldCount: 72 },
        { name: 'Salad rau củ', price: 40000, rating: 5, imageUrl: 'src/assets/images/salad_rau_cu.jpg', soldCount: 45 },
        { name: 'Súp cua bắp', price: 35000, rating: 3, imageUrl: 'src/assets/images/sup_cua_bap.jpg', soldCount: 38 },
        { name: 'Súp gà nấm', price: 30000, rating: 4, imageUrl: 'src/assets/images/sup_ga_nam.jpg', soldCount: 29 },
      ],
    },
    {
      name: 'Món Chính',
      items: [
        { name: 'Phở bò tái', price: 55000, rating: 5, imageUrl: 'src/assets/images/pho_bo_tai.jpg', soldCount: 156 },
        { name: 'Bún bò Huế', price: 50000, rating: 5, imageUrl: 'src/assets/images/bun_bo_hue.jpg', soldCount: 134 },
        { name: 'Cơm chiên dương châu', price: 40000, rating: 4, imageUrl: 'src/assets/images/comtam.jpg', soldCount: 98 },
        { name: 'Lẩu Thái hải sản', price: 150000, rating: 4, imageUrl: 'src/assets/images/lau_thai_hai_san.jpg', soldCount: 67 },
        { name: 'Mì xào hải sản', price: 45000, rating: 3, imageUrl: 'src/assets/images/mi_xao_hai_san.jpg', soldCount: 43 },
      ],
    },
    {
      name: 'Đồ Ăn Nhanh',
      items: [
        { name: 'Gà rán giòn', price: 70000, rating: 5, imageUrl: 'src/assets/images/ga_ran_gion.jpg', soldCount: 201 },
        { name: 'Pizza hải sản', price: 120000, rating: 4, imageUrl: 'src/assets/images/pizza_hai_san.jpg', soldCount: 89 },
        { name: 'Hamburger bò phô mai', price: 60000, rating: 4, imageUrl: 'src/assets/images/hamburger_bo_pho_mai.jpg', soldCount: 76 },
        { name: 'Sandwich thịt nguội', price: 50000, rating: 3, imageUrl: 'src/assets/images/sandwich_thit_nguoi.jpg', soldCount: 54 },
        { name: 'Khoai tây chiên', price: 25000, rating: 4, imageUrl: 'src/assets/images/khoai_tay_chien.jpg', soldCount: 48 },
      ],
    },
    {
      name: 'Đồ Nướng',
      items: [
        { name: 'Bò nướng lá lốt', price: 80000, rating: 4, imageUrl: 'src/assets/images/bo_nuong_la_lot.jpg', soldCount: 92 },
        { name: 'Gà nướng muối ớt', price: 70000, rating: 5, imageUrl: 'src/assets/images/ga_nuong_muoi_ot.jpg', soldCount: 87 },
        { name: 'Sườn nướng BBQ', price: 100000, rating: 4, imageUrl: 'src/assets/images/suon_nuong_bbq.jpg', soldCount: 73 },
        { name: 'Tôm nướng bơ tỏi', price: 90000, rating: 4, imageUrl: 'src/assets/images/tom_nuong_bo_toi.jpg', soldCount: 61 },
        { name: 'Mực nướng sa tế', price: 85000, rating: 3, imageUrl: 'src/assets/images/muc_nuong_sa_te.jpg', soldCount: 39 },
      ],
    },
    {
      name: 'Món Chay',
      items: [
        { name: 'Cơm chay thập cẩm', price: 35000, rating: 4, imageUrl: 'src/assets/images/com_chay_thap_cam.jpg', soldCount: 63 },
        { name: 'Đậu hũ chiên sả ớt', price: 20000, rating: 5, imageUrl: 'src/assets/images/dau_hu_chien_sa_ot.jpg', soldCount: 58 },
        { name: 'Rau củ xào nấm', price: 28000, rating: 4, imageUrl: 'src/assets/images/rau_cu_xao_nam.jpg', soldCount: 41 },
        { name: 'Nấm kho tiêu', price: 25000, rating: 4, imageUrl: 'src/assets/images/nam_kho_tieu.jpg', soldCount: 37 },
        { name: 'Bún chay huế', price: 30000, rating: 3, imageUrl: 'src/assets/images/bun_chay_hue.jpg', soldCount: 24 },
      ],
    },
    {
      name: 'Đồ Uống',
      items: [
        { name: 'Trà sữa trân châu', price: 28000, rating: 4, imageUrl: 'src/assets/images/tra_sua_tran_chau.jpg', soldCount: 178 },
        { name: 'Nước ép dưa hấu', price: 25000, rating: 5, imageUrl: 'src/assets/images/nuoc_ep_dua_hau.jpg', soldCount: 112 },
        { name: 'Sinh tố bơ', price: 30000, rating: 4, imageUrl: 'src/assets/images/sinh_to_bo.jpg', soldCount: 94 },
        { name: 'Trà đào cam sả', price: 20000, rating: 4, imageUrl: 'src/assets/images/tra_dao_cam_sa.jpg', soldCount: 86 },
        { name: 'Sữa tươi đường nâu', price: 22000, rating: 3, imageUrl: 'src/assets/images/sua_tuoi_duong_nau.jpg', soldCount: 52 },
      ],
    },
    {
      name: 'Tráng Miệng',
      items: [
        { name: 'Bánh flan caramel', price: 25000, rating: 5, imageUrl: 'src/assets/images/banh_flan_caramel.jpg', soldCount: 103 },
        { name: 'Chè ba màu', price: 20000, rating: 4, imageUrl: 'src/assets/images/che_ba_mau.jpg', soldCount: 79 },
        { name: 'Kem dâu tây', price: 30000, rating: 4, imageUrl: 'src/assets/images/kem_dau_tay.jpg', soldCount: 68 },
        { name: 'Chè bưởi', price: 22000, rating: 4, imageUrl: 'src/assets/images/che_buoi.jpg', soldCount: 45 },
        { name: 'Trái cây dầm', price: 35000, rating: 3, imageUrl: 'src/assets/images/trai_cay_dam.jpg', soldCount: 33 },
      ],
    },
  ];

  useEffect(() => {
    // Auto-rotate images every 4 seconds with smooth transition
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

  // Pagination logic with sorting by soldCount
  const sortedItems = selectedCategory
    ? [...categories.find(cat => cat.name === selectedCategory).items].sort((a, b) => b.soldCount - a.soldCount)
    : [];
  
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = selectedCategory
    ? Math.ceil(sortedItems.length / itemsPerPage)
    : 0;

  const handleCategoryClick = (categoryName) => {
    console.log(`Category clicked: ${categoryName}`);
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
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
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
          <h2 className="text-3xl font-bold text-coral-600 mb-6 text-center">Danh Mục Sản Phẩm Cho Quán Ăn</h2>
          {/* Note for Backend Integration */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
            <p className="text-blue-700 text-sm">
              <strong>Lưu ý cho Backend:</strong> Dữ liệu danh mục và món ăn sẽ được lấy từ API. 
              Cấu trúc dữ liệu cần bao gồm: id, name, price, rating, imageUrl, soldCount, description.
              Hiện tại đang sử dụng dữ liệu mẫu để preview UI.
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-4 relative z-20">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`px-6 py-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300 font-medium ${
                  selectedCategory === category.name 
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-102'
                }`}
                style={{ zIndex: 20 }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Category Details with Pagination */}
        {selectedCategory && (
          <section className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12">
            {/* Note for Backend Integration */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
              <p className="text-green-700 text-sm">
                <strong>Backend Integration:</strong> API endpoint cần hỗ trợ pagination và sorting. 
                Ví dụ: GET /api/dishes?category={selectedCategory}&page={currentPage}&sort=soldCount&limit={itemsPerPage}
              </p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-coral-600">{selectedCategory}</h2>
              <p className="text-sm text-gray-600">Sắp xếp theo: Độ phổ biến</p>
            </div>
            <div className="space-y-2">
              {paginatedItems.map((item, index) => (
                <DishItem
                  key={index}
                  name={item.name}
                  price={item.price}
                  rating={item.rating}
                  imageUrl={item.imageUrl}
                  soldCount={item.soldCount}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-indigo-700 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-800 transition-all duration-300"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-indigo-700 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-800 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
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