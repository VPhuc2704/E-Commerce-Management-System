"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { CATEGORIES } from "../../constants/productConstants"
import { useProductApi } from '../../hooks/useProductApi';


const EditProduct = ({ product, onClose, onUpdate }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { updateProduct } = useProductApi();
  const [editedProduct, setEditedProduct] = useState(product)
  const [imagePreview, setImagePreview] = useState(product.image)
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {

    if (product.image) {
      const isAbsoluteUrl = product.image.startsWith("http") || product.image.startsWith("blob:")
      const imageUrl = isAbsoluteUrl ? product.image : `${BASE_URL}${product.image}`
      setImagePreview(imageUrl)
    }
    setEditedProduct(product)
  }, [product])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = fileInputRef.current.files[0];

    try {
      const result = await updateProduct(product.id, editedProduct, file);
      alert("Cập nhật sản phẩm thành công!");
      onUpdate(result.data);
      onClose();
    } catch (error) {
      alert("Cập nhật sản phẩm thất bại: " + error.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedProduct((prev) => ({
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
      setEditedProduct((prev) => ({
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chỉnh sửa sản phẩm
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ)</label>
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  value={editedProduct.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
              <div className="space-y-4">
                {/* Preview ảnh */}
                {imagePreview && (
                  <div className="w-40 h-40 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Input chọn file ẩn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Nút chọn ảnh */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Chọn ảnh từ máy tính
                  </button>

                  {/* Input URL ảnh */}
                  <input
                    type="text"
                    name="image"
                    value={editedProduct.image || ''}
                    onChange={handleChange}
                    placeholder="Hoặc nhập đường dẫn ảnh"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại món</label>
              <input
                type="text"
                name="type"
                value={editedProduct.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                <select
                  name="categoryId"
                  value={editedProduct.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  {CATEGORIES.filter((c) => c.value).map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  name="status"
                  value={editedProduct.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Con_Hang">Còn hàng</option>
                  <option value="Het_Hang">Hết hàng</option>
                  <option value="Ngung_San_Xuat">Ngừng sản xuất</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl transition-all font-medium shadow-lg"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EditProduct
