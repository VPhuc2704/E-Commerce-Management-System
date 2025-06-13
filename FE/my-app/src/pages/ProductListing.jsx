import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { productService } from '../services/productService';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
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
        const productData = await productService.getAllProducts();
        setProducts(productData);
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
    try {
      setLoading(true);
      setSelectedCategory(categoryId);

      if (categoryId) {
        const categoryProducts = await productService.getProductsByCategory(categoryId);
        setProducts(categoryProducts);
      } else {
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);
      }
    } catch (err) {
      setError('Không thể tải sản phẩm');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Danh sách sản phẩm</h1>

        {/* Category Pills */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
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

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
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
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-indigo-600 font-bold">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                      <div className="text-amber-400 text-sm">
                        {'★'.repeat(product.rating || 5)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;