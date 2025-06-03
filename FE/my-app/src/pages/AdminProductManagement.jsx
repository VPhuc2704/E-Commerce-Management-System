import React, { useState, useEffect } from 'react';
import AddProduct from '../features/products/AddProduct';
import EditProduct from '../features/products/EditProduct';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Error deleting product.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">Manage Products</h1>

      {/* Add Product Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="mb-6 bg-coral-600 text-white px-6 py-3 rounded-lg hover:bg-coral-700 transition-all duration-300"
      >
        Add New Product
      </button>

      {/* Add Product Form */}
      {showAddForm && (
        <AddProduct
          onClose={() => setShowAddForm(false)}
          onAdd={(newProduct) => {
            setProducts([...products, newProduct]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={(updatedProduct) => {
            setProducts(
              products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setEditingProduct(null);
          }}
        />
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <p className="text-indigo-600 font-bold">${product.originalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductManagement;