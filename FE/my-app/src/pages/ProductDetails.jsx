import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // Mock dữ liệu sản phẩm
  useEffect(() => {
    const mockProducts = {
      1: { id: 1, name: 'Tai nghe Bluetooth Sony', description: 'Tai nghe chất lượng cao', originalPrice: 1500000, stock: 10, category: 'Electronics', imageUrl: 'https://via.placeholder.com/150', specifications: 'Bluetooth 5.0' },
      2: { id: 2, name: 'Áo thun Unisex', description: 'Áo thun thoải mái', originalPrice: 250000, stock: 20, category: 'Clothing', imageUrl: 'https://via.placeholder.com/150', specifications: 'Cotton 100%' },
      3: { id: 3, name: 'Đồng hồ thông minh Apple', description: 'Đồng hồ thông minh cao cấp', originalPrice: 5000000, stock: 5, category: 'Electronics', imageUrl: 'https://via.placeholder.com/150', specifications: 'iOS compatible' },
    };
    const productData = mockProducts[id] || null;
    setProduct(productData || null);
    if (!productData) navigate('/products');
  }, [id, navigate]);

  if (!product) return <div>Loading...</div>;

  const [quantity, setQuantity] = useState(1);

  // Thêm vào giỏ hàng (mock)
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Thêm vào giỏ hàng thành công!');
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full md:w-1/2 h-96 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-indigo-900 mb-4">{product.name}</h1>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-indigo-600 font-bold text-2xl mb-4">${product.originalPrice.toFixed(2)}</p>
              <p className="text-gray-600 mb-2"><strong>Stock:</strong> {product.stock} units</p>
              <p className="text-gray-600 mb-2"><strong>Category:</strong> {product.category}</p>
              <p className="text-gray-600 mb-4"><strong>Specifications:</strong> {product.specifications || 'N/A'}</p>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="border p-2 mb-4 w-20"
              />
              <button
                onClick={handleAddToCart}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;