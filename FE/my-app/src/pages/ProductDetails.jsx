import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Removed Navbar import
import Footer from '../components/layout/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        if (data) {
          setProduct(data);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/products');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col">
      {/* Removed Navbar */}
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
              <button
                onClick={() => alert('Added to cart!')}
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