import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Users, Mail, Phone, MapPin, Edit, Trash2, Plus, Download, Upload, Eye, EyeOff } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminUserManagement = () => {
    // Mock data từ API
    useEffect(() => {
        const fetchUsers = async () => {
            const accessToken = localStorage.getItem("accessToken")
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/api/admin/userAll/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Filter và search logic
    const filteredUsers = useMemo(() => {
        let filtered = users;

        // Filter by type
        if (filterType === 'complete') {
            filtered = filtered.filter(user =>
                user.fullname && user.numberphone && user.address
            );
        } else if (filterType === 'incomplete') {
            filtered = filtered.filter(user =>
                !user.fullname || !user.numberphone || !user.address
            );
        }

        // Search
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.fullname && user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.numberphone && user.numberphone.includes(searchTerm)) ||
                (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    }, [users, searchTerm, filterType]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // Statistics
    const stats = useMemo(() => {
        const total = users.length;
        const complete = users.filter(user => user.fullname && user.numberphone && user.address).length;
        const incomplete = total - complete;
        return { total, complete, incomplete };
    }, [users]);

    // Handle functions
    const handleSelectUser = (email) => {
        setSelectedUsers(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === paginatedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(paginatedUsers.map(user => user.email));
        }
    };

    const handleDeleteSelected = () => {
        if (window.confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} user đã chọn?`)) {
            setUsers(prev => prev.filter(user => !selectedUsers.includes(user.email)));
            setSelectedUsers([]);
        }
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(filteredUsers, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users-export.json';
        link.click();
    };

    // Simulate API call
    const refreshData = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                                <p className="text-sm text-gray-500">Quản lý và theo dõi tất cả người dùng hệ thống</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={refreshData}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Đang tải...' : 'Làm mới'}
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Thêm user</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng số user</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Hồ sơ đầy đủ</p>
                                <p className="text-3xl font-bold text-green-600">{stats.complete}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Eye className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Hồ sơ thiếu</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.incomplete}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <EyeOff className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="relative flex-1 md:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo email, tên, số điện thoại..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>Bộ lọc</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-3">
                                {selectedUsers.length > 0 && (
                                    <button
                                        onClick={handleDeleteSelected}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Xóa ({selectedUsers.length})</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleExportData}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Xuất dữ liệu</span>
                                </button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-3">
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Tất cả user</option>
                                        <option value="complete">Hồ sơ đầy đủ</option>
                                        <option value="incomplete">Hồ sơ thiếu thông tin</option>
                                    </select>

                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value={5}>5 / trang</option>
                                        <option value={10}>10 / trang</option>
                                        <option value={25}>25 / trang</option>
                                        <option value={50}>50 / trang</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Họ tên
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Địa chỉ
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedUsers.map((user, index) => {
                                    const isComplete = user.fullname && user.numberphone && user.address;
                                    const isSelected = selectedUsers.includes(user.email);

                                    return (
                                        <tr key={user.email} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectUser(user.email)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-900">
                                                    {user.fullname || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {user.numberphone ? (
                                                        <>
                                                            <Phone className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">{user.numberphone}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-sm">Chưa cập nhật</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {user.address ? (
                                                        <>
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900 truncate max-w-xs" title={user.address}>
                                                                {user.address}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 italic text-sm">Chưa cập nhật</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isComplete
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {isComplete ? 'Đầy đủ' : 'Thiếu thông tin'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} của {filteredUsers.length} user
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === i + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagement;