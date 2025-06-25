"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { CATEGORIES } from "../../constants/productConstants"
import { DEFAULT_PRODUCT } from "../../types/product"
import { useProductApi } from '../../hooks/useProductApi';

const AddProduct = ({ onClose, onAdd }) => {
  const { addProduct } = useProductApi();
  const [product, setProduct] = useState(DEFAULT_PRODUCT)
  const [imagePreview, setImagePreview] = useState(product.image)
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = fileInputRef.current.files[0];

    try {
      const result = await addProduct(product, file);
      alert("Thêm sản phẩm thành công!");
      onAdd(result.data);
      onClose();
    } catch (error) {
      alert("Thêm sản phẩm thất bại: " + error.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "categoryId"
          ? Number(value)
          : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      const relativePath = `/img/${file.name}`
      setProduct((prev) => ({
        ...prev,
        image: relativePath,
      }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Thêm sản phẩm mới
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors group"
            >
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập tên"
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-700">Loại món *</label>
                <input
                  type="text"
                  name="type"
                  value={product.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="VD: Đồ nướng, Món chay"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Mô tả sản phẩm *</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả ngắn gọn về món ăn"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Giá bán (VNĐ) *</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  name="price"
                  value={product.price ?? ''}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      price: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Tồn kho *</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  name="quantity"
                  value={product.quantity ?? ''}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      quantity: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Danh mục *</label>
                <select
                  name="categoryId"
                  value={product.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {CATEGORIES.filter(c => c.value).map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
                {imagePreview && (
                  <div className="w-40 h-40 mx-auto rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview.startsWith("blob:") || imagePreview.startsWith("http")
                        ? imagePreview
                        : `${BASE_URL}${imagePreview}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                  >
                    Chọn ảnh từ máy tính
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="text"
                    name="image"
                    value={product.image}
                    onChange={(e) => {
                      handleChange(e)
                      setImagePreview(e.target.value)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Hoặc dán link ảnh"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Thêm sản phẩm
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AddProduct
