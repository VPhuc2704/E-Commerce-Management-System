import { motion } from "framer-motion"

const Stats = ({ products }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
        <StatCard
            title="Tổng sản phẩm"
            value={products.length}
            color="blue"
            icon={TotalIcon}
        />
        <StatCard
            title="Đang hoạt động"
            value={products.filter((p) => p.status === "Con_Hang").length}
            color="green"
            icon={ActiveIcon}
        />
        <StatCard
            title="Tổng tồn kho"
            value={products.reduce((sum, p) => sum + p.quantity, 0)}
            color="yellow"
            icon={StockIcon}
        />
        <StatCard
            title="Giá trị kho"
            value={`${(products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0) / 1000000).toFixed(1)}M`}
            color="purple"
            icon={ValueIcon}
        />
    </motion.div>
)

const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-xl p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-${color}-100 text-sm`}>{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon />
            </div>
        </div>
    </div>
)

const TotalIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4m0 0v10" />
    </svg>
)

const ActiveIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const StockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10l1 12H6L7 4z" />
    </svg>
)

const ValueIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
)

export default Stats