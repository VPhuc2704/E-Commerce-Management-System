import { motion } from "framer-motion"
import { CATEGORIES } from "../../../constants/productConstants"

const ProductGrid = ({ products, onEdit, onDelete }) => {
    if (!products.length) {
        return <EmptyState />
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </motion.div>
    )
}

const ProductCard = ({ product, index, onEdit, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
        <div className="relative">
            <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <StatusBadge status={product.status} />
            <StockBadge stock={product.stock} />
        </div>

        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-indigo-600">
                    {(product.price || 0).toLocaleString("vi-VN")}₫
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {CATEGORIES.find((c) => c.value === product.category)?.label}
                </span>
            </div>

            <div className="flex gap-2">
                <ActionButton
                    onClick={() => onEdit(product)}
                    icon={EditIcon}
                    text="Sửa"
                    className="from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                />
                <ActionButton
                    onClick={() => onDelete(product.id)}
                    icon={DeleteIcon}
                    text="Xóa"
                    className="from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                />
            </div>
        </div>
    </motion.div>
)

const StatusBadge = ({ status }) => (
    <div className="absolute top-3 right-3">
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${status === "Con_Hang" ? "bg-green-100 text-green-800" :
                    status === "Het_Hang" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                }`}
        >
            {status === "Con_Hang" ? "Còn hàng" :
                status === "Het_Hang" ? "Hết hàng" :
                    "Ngừng sản xuất"}
        </span>
    </div>
)

const StockBadge = ({ stock }) => (
    <div className="absolute top-3 left-3">
        <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
            Kho: {stock}
        </span>
    </div>
)

const ActionButton = ({ onClick, icon: Icon, text, className }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex-1 bg-gradient-to-r ${className} text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2`}
    >
        <Icon />
        {text}
    </motion.button>
)

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
)

const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

const EmptyState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
    </motion.div>
)

export default ProductGrid