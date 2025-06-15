import { motion } from "framer-motion";
import { STATUS_LABELS } from "../../constants/orderConstants";
import { getStatusColor, getPaymentIcon } from "../../utils/orderUtils.jsx";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{order.id}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="text-gray-600">Ngày đặt:</span>{" "}
                                    {new Date(order.createdDate).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Trạng thái:</span>{" "}
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Phương thức thanh toán:</span>{" "}
                                    <span className="flex items-center">
                                        {getPaymentIcon(order.paymentMethod)}
                                        <span className="ml-1">{order.paymentMethod || "Chưa thanh toán"}</span>
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="text-gray-600">Họ tên:</span> {order.user?.fullname}
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Email:</span> {order.user?.email}
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Số điện thoại:</span> {order.user?.numberphone}
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-600">Địa chỉ:</span> {order.user?.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {order.items?.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-500">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-500">
                                                {item.price.toLocaleString("vi-VN")} VNĐ
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-200">
                                        <td colSpan="3" className="px-4 py-3 text-right text-sm font-semibold text-gray-500">
                                            Tổng cộng:
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                            {order.totalAmount.toLocaleString("vi-VN")} VNĐ
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OrderDetailsModal;