import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Removed Navbar import
import Footer from '../components/layout/Footer';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState('');
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, priceRange, category]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5173/api/products?page=${currentPage}&limit=${productsPerPage}&search=${searchTerm}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&category=${category}`
      );
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / productsPerPage));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      {/* Removed Navbar */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Browse Products</h1>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-1/3 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            onChange={handlePriceFilter}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0-1000">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-1000">$500 - $1000</option>
          </select>
          <select
            onChange={handleCategoryFilter}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-indigo-600 font-bold">${product.originalPrice.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No products found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
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
      </main>

      <Footer />
    </div>
  );
};

export default ProductListing;