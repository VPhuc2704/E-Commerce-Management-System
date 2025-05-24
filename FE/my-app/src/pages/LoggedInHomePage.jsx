import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';

// Reusable component for product cards (used in both Flash Sale and Product Grid)
const ProductCard = ({ product, onAddToCart, isFlashSale = false }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
  >
    <div className="relative">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/300x200'}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      {isFlashSale && (
        <>
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full">
            {product.discountPercentage}% OFF
          </div>
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Limited Stock
          </div>
        </>
      )}
      {!isFlashSale && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
          ${product.originalPrice?.toFixed(2)}
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
      {isFlashSale ? (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-600 font-bold text-xl">${product.salePrice?.toFixed(2)}</span>
            <span className="text-gray-500 text-base line-through ml-2">${product.originalPrice?.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
          >
            Add to Cart
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || 'No description available'}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Stock: {product.stock || 'N/A'}</span>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-all duration-300">
              View Details
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

const LoggedInHomePage = ({ user }) => {
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [cart, setCart] = useState([]);
  const productsPerPage = 8;

  // Fetch products and flash sale data
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products?page=${currentPage}&limit=${productsPerPage}&search=${searchTerm}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&category=${category}`
        );
        const data = await response.json();
        if (mounted) {
          setProducts(data.products || []);
          setTotalPages(Math.ceil(data.total / productsPerPage));
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    const fetchFlashSaleProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/flash-sale/products');
        const data = await response.json();
        if (mounted) {
          setFlashSaleProducts(data.map(product => ({
            ...product,
            salePrice: product.originalPrice * (1 - product.discountPercentage / 100),
          })));
        }
      } catch (error) {
        console.error('Failed to fetch flash sale products:', error);
      }
    };

    const fetchFlashSaleEndTime = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/flash-sale/end-time');
        const data = await response.json();
        const endTime = new Date(data.endTime).getTime();
        const updateCountdown = () => {
          const now = new Date().getTime();
          const distance = endTime - now;

          if (distance < 0) {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Failed to fetch flash sale end time:', error);
      }
    };

    fetchProducts();
    fetchFlashSaleProducts();
    fetchFlashSaleEndTime();

    return () => {
      mounted = false;
    };
  }, [currentPage, searchTerm, priceRange, category]);

  // Handle filter changes
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

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        {/* Welcome Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 animate-fade-in">
            Welcome Back, {user?.name || 'User'}!
          </h1>
          <p className="text-lg text-gray-700 mb-8 animate-fade-in-delayed">
            Explore our curated selection of products below.
          </p>
          {isAdmin && (
            <Link
              to="/admin/products"
              className="inline-block bg-coral-600 text-white px-6 py-3 rounded-lg hover:bg-coral-700 transition-all duration-300 mb-8 animate-fade-in-delayed"
            >
              Manage Products
            </Link>
          )}
        </section>

        {/* Flash Sale Section */}
        <section className="bg-gradient-to-r from-indigo-200 to-coral-200 rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden glow-border">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-coral-600">Flash Sale</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-800 font-medium">Ends in:</span>
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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFlashSale={true}
              />
            ))}
          </div>
        </section>

        {/* Filters Section */}
        <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* Search Input with Icon at the End */}
            <div className="relative w-full md:w-1/3">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search products"
                className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white bg-opacity-80 backdrop-blur-md shadow-sm placeholder-gray-400"
            />
            <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-600 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleSearch({ target: { value: searchTerm } })} // Trigger search on icon click
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
            </svg>
            </div>
            <select
            onChange={handlePriceFilter}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white bg-opacity-80 backdrop-blur-md shadow-sm"
            >
            <option value="0-1000">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-1000">$500 - $1000</option>
            </select>
            <select
            onChange={handleCategoryFilter}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white bg-opacity-80 backdrop-blur-md shadow-sm"
            >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            </select>
        </div>
        </section>

        {/* Product Grid */}
        <section className="mt-8">
          {products.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {products.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    isFlashSale={false}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 animate-fade-in-delayed">No products found.</p>
          )}
        </section>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-all duration-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LoggedInHomePage;