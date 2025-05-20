import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../features/home/home.css';

const HomePage = () => {
  // Mock data for products (flash sale)
  const flashSaleProducts = [
    {
      id: 1, 
      name: 'Smart Watch Gen 5', 
      originalPrice: 299.99, 
      salePrice: 199.99, 
      imageUrl: '/api/placeholder/150/150'
    },
    {
      id: 2, 
      name: 'Wireless Earbuds Pro', 
      originalPrice: 149.99, 
      salePrice: 99.99, 
      imageUrl: '/api/placeholder/150/150'
    },
    {
      id: 3, 
      name: 'Ultra HD Camera', 
      originalPrice: 899.99, 
      salePrice: 699.99, 
      imageUrl: '/api/placeholder/150/150'
    },
    {
      id: 4, 
      name: 'Portable Speaker XL', 
      originalPrice: 199.99, 
      salePrice: 149.99, 
      imageUrl: '/api/placeholder/150/150'
    },
    {
      id: 5, 
      name: 'Gaming Keyboard RGB', 
      originalPrice: 129.99, 
      salePrice: 79.99, 
      imageUrl: '/api/placeholder/150/150'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto p-4">
        {/* 3D Rotating Cards */}
        <section className="py-10 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          <div className="h-96 relative flex items-center justify-center">
            <div className="wrapper w-full h-full relative text-center flex items-center justify-center overflow-hidden">
              <div className="inner" style={{"--w": "100px", "--h": "150px", "--translateZ": "calc((var(--w) + var(--h)) + 0px)", "--rotateX": "-15deg", "--perspective": "1000px", "--quantity": "10"}}>
                <div className="card" style={{"--index": "0", "--color-card": "142, 249, 252"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "1", "--color-card": "142, 252, 204"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "2", "--color-card": "142, 252, 157"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "3", "--color-card": "215, 252, 142"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "4", "--color-card": "252, 252, 142"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "5", "--color-card": "252, 208, 142"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "6", "--color-card": "252, 142, 142"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "7", "--color-card": "252, 142, 239"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "8", "--color-card": "204, 142, 252"}}>
                  <div className="img"></div>
                </div>
                <div className="card" style={{"--index": "9", "--color-card": "142, 202, 252"}}>
                  <div className="img"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Flash Sale Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">Flash Sale</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Ends in:</span>
              <div className="bg-red-600 text-white px-2 py-1 rounded">05</div>:
              <div className="bg-red-600 text-white px-2 py-1 rounded">45</div>:
              <div className="bg-red-600 text-white px-2 py-1 rounded">22</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {flashSaleProducts.map(product => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-3 rounded" />
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl">
                    {Math.round((product.originalPrice - product.salePrice) / product.originalPrice * 100)}% OFF
                  </div>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-red-600 font-bold">${product.salePrice}</span>
                    <span className="text-gray-500 text-sm line-through ml-2">${product.originalPrice}</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors duration-300">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;