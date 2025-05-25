import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import '../features/home/home.css';

// Reusable component for product cards
const ProductCard = ({ product, onAddToCart }) => (
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
    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
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
  </div>
);

const HomePage = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/flash-sale/products');
        const data = await response.json();
        setFlashSaleProducts(data.map(product => ({
          ...product,
          salePrice: product.originalPrice * (1 - product.discountPercentage / 100),
        })));
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

    fetchFlashSaleProducts();
    fetchFlashSaleEndTime();
  }, []);

  const addToCart = (product) => {
    const isLoggedIn = false; // Replace with actual auth check
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 flex flex-col animate-fade-in">
      <main className="flex-grow container mx-auto p-6">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-coral-600 text-white rounded-2xl shadow-2xl p-8 mb-12 overflow-hidden animate-slide-in">
          <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Super Sale Weekend!</h1>
            <p className="text-xl mb-6">Up to 50% off on all products – Don’t miss out!</p>
            <Link
              to="/shop"
              className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-100 transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
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
              />
            ))}
          </div>
        </section>

        {/* Featured Products - 3D Rotating Cards */}
        <section className="py-12 mb-16">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-indigo-900 tracking-tight">
            Featured Products
          </h2>
          <div className="h-96 relative flex items-center justify-center">
            <div className="wrapper w-full h-full relative text-center flex items-center justify-center overflow-hidden">
              <div
                className="inner"
                style={{
                  '--w': '150px',
                  '--h': '200px',
                  '--translateZ': 'calc(var(--w) + var(--h))',
                  '--rotateX': '-15deg',
                  '--perspective': '1000px',
                  '--quantity': flashSaleProducts.length || 10,
                }}
              >
                {flashSaleProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="card absolute rounded-lg shadow-lg hover:shadow-glow transition-all duration-300"
                    style={{
                      '--index': index,
                      '--color-card': `hsl(${index * 36}, 70%, 80%)`,
                      transform: `rotateY(${index * (360 / (flashSaleProducts.length || 10))}deg) translateZ(var(--translateZ))`,
                    }}
                  >
                    <div className="img relative w-full h-full">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 glass-overlay text-white text-center py-2 rounded-b-lg">
                        {product.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;