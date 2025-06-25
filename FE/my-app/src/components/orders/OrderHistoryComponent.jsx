import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, Package, Truck } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const OrderHistoryComponent = ({ orders = [] }) => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const statusConfig = {
        all: { label: 'Tất cả', color: 'bg-gray-100 text-gray-800', icon: null },
        PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        CONFIRMED: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: Package },
        SHIPPED: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: Truck },
        DELIVERED: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle }
    };

    // Đếm số lượng đơn hàng theo trạng thái
    const getStatusCount = (status) => {
        if (!Array.isArray(orders)) return 0;
        if (status === 'all') return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.address?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }) : [];

    return (
        <motion.div
            key="orders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <h3 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(statusConfig).map(([key, config]) => {
                    const IconComponent = config.icon;
                    const count = getStatusCount(key);
                    return (
                        <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedStatus(key)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedStatus === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                {IconComponent && <IconComponent className="w-4 h-4 text-gray-600" />}
                                <span className="text-lg font-bold text-gray-900">{count}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-600">{config.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã đơn hàng hoặc địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-36"
                        >
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <option key={key} value={key}>
                                    {config.label} ({getStatusCount(key)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                    Hiển thị {filteredOrders.length} / {Array.isArray(orders) ? orders.length : 0} đơn hàng
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
                        <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const statusInfo = statusConfig[order.status];
                        const StatusIcon = statusInfo?.icon;

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-gray-900">Đơn hàng #{order.id}</h4>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color || 'bg-gray-100 text-gray-700'}`}>
                                                {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                                                {statusInfo?.label || order.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Sản phẩm:</span>{' '}
                                                {order.items?.[0]?.productName || 'Không có thông tin'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Tổng số món:</span>{' '}
                                                {order.items?.length || 0} món
                                            </div>
                                            <div>
                                                <span className="font-medium">Ngày đặt:</span>{' '}
                                                {new Date(order.createdDate).toLocaleString('vi-VN', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </div>
                                            <div>
                                                <span className="font-medium">Giao đến:</span> {order.user?.address || 'N/A'}
                                            </div>

                                        </div>
                                    </div>

                                    {/* Nút hành động */}
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/order-details/${order.id}`)}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-md transition-all duration-300 text-sm"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Xem chi tiết
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>

                        );
                    })
                )}
            </div>
        </motion.div>
    );
};

export default OrderHistoryComponent;