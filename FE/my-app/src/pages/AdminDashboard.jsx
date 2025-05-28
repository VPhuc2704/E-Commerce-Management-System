import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState('day');
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState('2025-05-27');
  const [filteredData, setFilteredData] = useState({ totalRevenue: 0, orderCount: 0, topProducts: [] });

  // Kiểm tra vai trò Admin (mock)
  const isAdmin = true;
  if (!isAdmin) return <p className="text-center text-red-500">Bạn không có quyền truy cập trang này!</p>;

  // Lấy dữ liệu đơn hàng từ localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const mockOrders = [
        { id: 'ORDER-123', date: '2025-05-25', total: 2500000, status: 'Chờ xác nhận', products: [{ id: 1, name: 'Tai nghe Bluetooth Sony', quantity: 1, price: 1500000 }, { id: 2, name: 'Áo thun Unisex', quantity: 2, price: 250000 }] },
        { id: 'ORDER-124', date: '2025-05-24', total: 1500000, status: 'Đã hoàn thành', products: [{ id: 3, name: 'Đồng hồ thông minh Apple', quantity: 1, price: 5000000 }] },
        { id: 'ORDER-125', date: '2025-04-15', total: 2000000, status: 'Đã hoàn thành', products: [{ id: 1, name: 'Tai nghe Bluetooth Sony', quantity: 1, price: 1500000 }] },
      ];
      setOrders(mockOrders);
      localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
  }, []);

  // Hàm lọc và tính toán dữ liệu dựa trên khoảng thời gian
  useEffect(() => {
    const filterOrders = () => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end && order.status === 'Đã hoàn thành';
      });

      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
      const orderCount = filteredOrders.length;

      const productMap = {};
      filteredOrders.forEach(order => {
        order.products.forEach(product => {
          if (!productMap[product.id]) {
            productMap[product.id] = { name: product.name, quantity: 0, revenue: 0 };
          }
          productMap[product.id].quantity += product.quantity;
          productMap[product.id].revenue += product.quantity * product.price;
        });
      });
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);

      setFilteredData({ totalRevenue, orderCount, topProducts });
    };

    filterOrders();
  }, [orders, startDate, endDate]);

  // Dữ liệu cho biểu đồ doanh thu
  const chartData = {
    labels: orders.map(order => order.date),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: orders.map(order => order.total),
        borderColor: '#4f46e5', // indigo-600
        backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo-600 với opacity
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#1e293b', font: { size: 14 } } },
      title: { display: true, text: 'Biểu đồ doanh thu theo thời gian', color: '#1e293b', font: { size: 18 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#fff', borderColor: '#4f46e5', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#1e293b' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      y: { ticks: { color: '#1e293b' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
    },
  };

  // Hàm xuất báo cáo CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Ngày', 'Tổng doanh thu (VNĐ)', 'Số đơn hàng'],
      ...orders.map(order => [order.date, order.total, 1]),
      ['Tổng', filteredData.totalRevenue, filteredData.orderCount],
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'revenue_report.csv');
    link.click();
  };

  // Hiệu ứng 3D nhẹ cho card
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -5, transition: { duration: 0.3 } },
  };

  // Hiệu ứng fade-in
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-coral-100 p-6">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="text-4xl font-extrabold text-indigo-900 mb-8 text-center flex items-center justify-center gap-3"
      >
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h6v6H3V3zm0 8h6v10H3V11zm8 0h10v10H11V11zm0-8h10v6H11V3z" />
        </svg>
        Dashboard Admin - Thống Kê Doanh Thu
      </motion.h1>

      {/* Bộ lọc */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-indigo-200"
      >
        <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Bộ lọc
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Loại báo cáo:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Thống kê tổng quan */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 transform transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.2 0-4-1.8-4-4H4v2h4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h4v-2h-4c0 2.2-1.8 4-4 4zM4 6h16v2H4z" />
            </svg>
            Tổng doanh thu
          </h2>
          <p className="text-3xl font-bold text-indigo-600">{filteredData.totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 transform transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-2 12H5L3 3zm5 12h8m-5 4h2" />
            </svg>
            Số đơn hàng
          </h2>
          <p className="text-3xl font-bold text-indigo-600">{filteredData.orderCount}</p>
        </motion.div>
      </motion.div>

      {/* Biểu đồ doanh thu */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 mb-8"
      >
        <Line data={chartData} options={chartOptions} />
      </motion.div>

      {/* Sản phẩm bán chạy */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200 mb-8"
      >
        <h2 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Sản phẩm bán chạy
        </h2>
        {filteredData.topProducts.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-gray-700">Tên sản phẩm</th>
                <th className="p-3 text-gray-700">Số lượng bán</th>
                <th className="p-3 text-gray-700">Doanh thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.topProducts.map((product, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="p-3 text-gray-900">{product.name}</td>
                  <td className="p-3 text-gray-900">{product.quantity}</td>
                  <td className="p-3 text-indigo-600 font-semibold">{product.revenue.toLocaleString('vi-VN')}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Không có dữ liệu sản phẩm bán chạy.</p>
        )}
      </motion.div>

      {/* Nút xuất báo cáo */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(79, 70, 229, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        onClick={exportToCSV}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Xuất báo cáo (CSV)
      </motion.button>
    </div>
  );
};

export default AdminDashboard;