import { useState, useEffect } from "react"
import { Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"

import { useOrderApi } from "../hooks/useOrderApi"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler)

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [filterType, setFilterType] = useState("day")
  const [startDate, setStartDate] = useState("2025-05-01")
  const [endDate, setEndDate] = useState("2025-06-30")
  const [filteredData, setFilteredData] = useState({ totalRevenue: 0, orderCount: 0, topProducts: [] })
  const { getAllOrders, getOrdersByStatus, getOrderDetails } = useOrderApi();

  // Lấy dữ liệu đơn hàng từ state
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const order = await getAllOrders();
        console.log("✅ Dữ liệu đơn hàng:", order); // 👈 log dữ liệu
        setOrders(order);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  // Hàm lọc và tính toán dữ liệu dựa trên khoảng thời gian
  useEffect(() => {
    const filterOrders = () => {
      const start = new Date(startDate)
      const end = new Date(endDate)

      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdDate)
        return orderDate >= start && orderDate <= end && order.status === "SHIPPED"
      })

      console.log("✅ Đơn hàng sau lọc:", filteredOrders)

      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      const orderCount = filteredOrders.length

      const productMap = {}
      filteredOrders.forEach((order) => {
        console.log("🔍 Chi tiết đơn:", order.items)
        order.items.forEach((item) => {
          if (!productMap[item.productId]) {
            productMap[item.productId] = {
              name: item.productName,
              quantity: 0,
              revenue: 0
            }
          }
          productMap[item.productId].quantity += item.quantity
          productMap[item.productId].revenue += item.quantity * item.price
        })
      })

      const topProducts = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      console.log("📊 Top sản phẩm bán chạy:", topProducts)

      setFilteredData({ totalRevenue, orderCount, topProducts })
    }

    filterOrders()
  }, [orders, startDate, endDate, filterType]) // ← thêm filterType vào dependency

  // Dữ liệu cho biểu đồ doanh thu với UI cải thiện
  const chartData = {
    labels: orders.map((order) => new Date(order.createdDate).toLocaleDateString('vi-VN')),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: orders.map((order) => order.totalAmount),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgb(99, 102, 241)",
        pointBorderWidth: 2,
        borderWidth: 3,
        pointShadowColor: "rgba(99, 102, 241, 0.3)",
        pointShadowBlur: 10,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1f2937",
          font: { size: 14, weight: '600' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      title: {
        display: true,
        text: "📈 Biểu đồ doanh thu theo thời gian",
        color: "#1f2937",
        font: { size: 18, weight: 'bold' },
        padding: 25
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280",
          font: { weight: '500', size: 12 },
          maxTicksLimit: 10
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false
        },
        border: {
          display: false
        }
      },
      y: {
        ticks: {
          color: "#6b7280",
          font: { weight: '500', size: 12 },
          callback: function (value) {
            return new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value) + ' VNĐ';
          }
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
          drawBorder: false
        },
        border: {
          display: false
        }
      },
    },
  }

  // Dữ liệu cho biểu đồ tròn với màu sắc hiện đại
  const doughnutData = {
    labels: filteredData.topProducts.map(item => item.name),
    datasets: [
      {
        data: filteredData.topProducts.map(item => item.quantity),
        backgroundColor: [
          '#6366F1', // Indigo
          '#8B5CF6', // Violet  
          '#06B6D4', // Cyan
          '#10B981', // Emerald
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#EC4899', // Pink
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 12, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                return {
                  text: `${label} (${value})`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      },
    },
  }

  // Hàm xuất báo cáo CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Ngày", "Tổng doanh thu (VNĐ)", "Số đơn hàng"],
      ...orders.map((order) => [
        new Date(order.createdDate).toLocaleDateString('vi-VN'),
        order.totalAmount,
        1
      ]),
      ["Tổng", filteredData.totalRevenue, filteredData.orderCount],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "revenue_report.csv")
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Dashboard Admin
                  </h1>
                  <p className="text-gray-600 text-lg font-medium mt-1">Thống kê doanh thu và phân tích kinh doanh</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/20">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">Cập nhật lần cuối</p>
                  <p className="text-sm font-semibold text-gray-700">{new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="mb-8 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Bộ lọc thời gian</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">📅 Từ ngày:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-sm text-gray-900 border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">📅 Đến ngày:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-sm text-gray-900 border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-sm">📊 Loại báo cáo:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/70 backdrop-blur-sm text-gray-900 border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/80"
              >
                <option value="day">Theo ngày</option>
                <option value="month">Theo tháng</option>
                <option value="quarter">Theo quý</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tổng doanh thu */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/80">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.2 0-4-1.8-4-4H4v2h4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h4v-2h-4c0 2.2-1.8 4-4 4zM4 6h16v2H4z" />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                  +12.5%
                </div>
              </div>
              <h3 className="text-gray-600 font-semibold mb-2 text-sm">💰 Tổng doanh thu</h3>
              <p className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                {filteredData.totalRevenue.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>

          {/* Số đơn hàng */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/80">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                  +8.2%
                </div>
              </div>
              <h3 className="text-gray-600 font-semibold mb-2 text-sm">📦 Số đơn hàng</h3>
              <p className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                {filteredData.orderCount}
              </p>
            </div>
          </div>

          {/* Sản phẩm bán chạy */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/80">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                  +15.3%
                </div>
              </div>
              <h3 className="text-gray-600 font-semibold mb-2 text-sm">🔥 Sản phẩm bán chạy</h3>
              <p className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                {filteredData.topProducts.length}
              </p>
            </div>
          </div>

          {/* Doanh thu trung bình */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/80">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-bold">
                  +5.7%
                </div>
              </div>
              <h3 className="text-gray-600 font-semibold mb-2 text-sm">📊 Doanh thu TB/đơn</h3>
              <p className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                {filteredData.orderCount > 0 ? (filteredData.totalRevenue / filteredData.orderCount).toLocaleString("vi-VN") : 0} VNĐ
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Biểu đồ doanh thu */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Biểu đồ tròn sản phẩm */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <span>🥧</span>
              Phân bố sản phẩm bán chạy
            </h3>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Enhanced Products Table */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">🏆 Top sản phẩm bán chạy</h2>
          </div>
          {filteredData.topProducts.length > 0 ? (
            <div className="overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left p-6 text-gray-700 font-bold text-sm">🏅 Xếp hạng</th>
                      <th className="text-left p-6 text-gray-700 font-bold text-sm">📦 Tên sản phẩm</th>
                      <th className="text-left p-6 text-gray-700 font-bold text-sm">📊 Số lượng bán</th>
                      <th className="text-left p-6 text-gray-700 font-bold text-sm">💰 Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.topProducts.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200">
                        <td className="p-6">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                              index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                                'bg-gradient-to-r from-indigo-500 to-purple-500'
                            }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="font-semibold text-gray-800 text-base">{item.name}</div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-indigo-600">{item.quantity}</span>
                            <span className="text-sm text-gray-500">sp</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-600">
                              {item.revenue.toLocaleString("vi-VN")}
                            </span>
                            <span className="text-sm text-gray-500">VNĐ</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Không có dữ liệu sản phẩm</p>
              <p className="text-gray-400 text-sm mt-2">Thử điều chỉnh bộ lọc thời gian</p>
            </div>
          )}
        </div>

        {/* Enhanced Export Section */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">📊 Xuất báo cáo</h3>
                <p className="text-gray-600 text-sm mt-1">Tải xuống dữ liệu doanh thu dạng CSV</p>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Tải xuống CSV</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              © 2025 Admin Dashboard - Được tạo với ❤️ bởi Team Development
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard