import { motion } from "framer-motion"
import { ORDER_STATUS, STATUS_OPTIONS, STATUS_LABELS } from "../../constants/orderConstants"
import { getStatusColor, getPaymentIcon } from "../../utils/orderUtils.jsx"
import Pagination from "../common/Pagination"

const OrderList = ({
    orders,
    isLoading,
    onViewDetails,
    onUpdateStatus,
    selectedStatuses,
    onStatusChange,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);

    const listItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
            }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : currentOrders.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Mã đơn</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày đặt</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Liên hệ</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thanh toán</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentOrders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        variants={listItemVariants}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-indigo-600">#{order.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(order.createdDate).toLocaleDateString("vi-VN", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{order.user?.fullname || "N/A"}</div>
                                            <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{order.user?.numberphone || "N/A"}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs" title={order.user?.address}>
                                                {order.user?.address || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                {getPaymentIcon(order.paymentMethod)}
                                                <span className="ml-1">{order.paymentMethod || "Chưa thanh toán"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {STATUS_LABELS[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={selectedStatuses[order.id] || ""}
                                                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                                                    className="text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="">Chọn trạng thái</option>
                                                    {STATUS_OPTIONS.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => onUpdateStatus(order.id)}
                                                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Cập nhật
                                                </button>
                                                <button
                                                    onClick={() => onViewDetails(order.id)}
                                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                        onPageChange={onPageChange}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-12">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xl font-semibold text-gray-600">Không tìm thấy đơn hàng nào</p>
                    <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            )}
        </motion.div>
    );
};

export default OrderList;