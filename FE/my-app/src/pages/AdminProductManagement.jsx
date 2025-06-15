"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AddProduct from "../features/products/AddProduct"
import EditProduct from "../features/products/EditProduct"
import Stats from "../features/products/components/Stats"
import ProductGrid from "../features/products/components/ProductGrid"
import { CATEGORIES } from "../constants/productConstants"
import { useProducts } from "../hooks/useProducts"
import { DEFAULT_PRODUCT } from "../types/product"

const AdminProductManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null) // Changed to null instead of DEFAULT_PRODUCT
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    setSearchTerm: setProductSearchTerm,
    setSelectedCategory: setProductCategory
  } = useProducts()

  // Sync search and category with useProducts
  const handleSearch = (value) => {
    setSearchTerm(value);
    setProductSearchTerm(value);
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setProductCategory(value);
  }

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData)
      setShowAddForm(false)
      alert("Thêm sản phẩm thành công!")
    } catch (error) {
      alert("Không thể thêm sản phẩm: " + error.message)
    }
  }

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(productData)
      setEditingProduct(null) // Changed from DEFAULT_PRODUCT to null
      alert("Cập nhật sản phẩm thành công!")
    } catch (error) {
      alert("Không thể cập nhật sản phẩm: " + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return
    try {
      await deleteProduct(id)
      alert("Xóa sản phẩm thành công!")
    } catch (error) {
      alert("Không thể xóa sản phẩm: " + error.message)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2">Quản lý sản phẩm</h1>
        <p className="text-indigo-100">
          Thêm, sửa, xóa và quản lý tất cả sản phẩm trong cửa hàng
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm sản phẩm mới
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics */}
      <Stats products={products} />

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>) : (
        <ProductGrid
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
        />
      )}

      {/* Forms */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AddProduct
                onClose={() => setShowAddForm(false)}
                onAdd={handleAddProduct}
              />
            </div>
          </motion.div>
        )}

        {editingProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <EditProduct
                product={editingProduct}
                onClose={() => setEditingProduct(null)} // Changed from DEFAULT_PRODUCT to null
                onUpdate={handleUpdateProduct}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminProductManagement
