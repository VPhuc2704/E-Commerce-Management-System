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
} from "chart.js"

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [filterType, setFilterType] = useState("day")
  const [startDate, setStartDate] = useState("2025-05-01")
  const [endDate, setEndDate] = useState("2025-05-27")
  const [filteredData, setFilteredData] = useState({ totalRevenue: 0, orderCount: 0, topProducts: [] })

  // Lấy dữ liệu đơn hàng từ state
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORDER-123",
        date: "2025-05-25",
        total: 2500000,
        status: "Chờ xác nhận",
        products: [
          { id: 1, name: "Tai nghe Bluetooth Sony", quantity: 1, price: 1500000 },
          { id: 2, name: "Áo thun Unisex", quantity: 2, price: 250000 },
        ],
      },
      {
        id: "ORDER-124",
        date: "2025-05-24",
        total: 1500000,
        status: "Đã hoàn thành",
        products: [{ id: 3, name: "Đồng hồ thông minh Apple", quantity: 1, price: 5000000 }],
      },
      {
        id: "ORDER-125",
        date: "2025-04-15",
        total: 2000000,
        status: "Đã hoàn thành",
        products: [{ id: 1, name: "Tai nghe Bluetooth Sony", quantity: 1, price: 1500000 }],
      },
      {
        id: "ORDER-126",
        date: "2025-05-20",
        total: 3200000,
        status: "Đã hoàn thành",
        products: [
          { id: 4, name: "Laptop Gaming", quantity: 1, price: 2500000 },
          { id: 5, name: "Chuột gaming", quantity: 1, price: 700000 },
        ],
      },
      {
        id: "ORDER-127",
        date: "2025-05-18",
        total: 1800000,
        status: "Đã hoàn thành",
        products: [{ id: 6, name: "Smartphone Samsung", quantity: 1, price: 1800000 }],
      },
    ]
    setOrders(mockOrders)
  }, [])

  // Hàm lọc và tính toán dữ liệu dựa trên khoảng thời gian
  useEffect(() => {
    const filterOrders = () => {
      const start = new Date(startDate)
      const end = new Date(endDate)

      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.date)
        return orderDate >= start && orderDate <= end && order.status === "Đã hoàn thành"
      })

      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      const orderCount = filteredOrders.length

      const productMap = {}
      filteredOrders.forEach((order) => {
        order.products.forEach((product) => {
          if (!productMap[product.id]) {
            productMap[product.id] = { name: product.name, quantity: 0, revenue: 0 }
          }
          productMap[product.id].quantity += product.quantity
          productMap[product.id].revenue += product.quantity * product.price
        })
      })
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      setFilteredData({ totalRevenue, orderCount, topProducts })
    }

    filterOrders()
  }, [orders, startDate, endDate])

  // Dữ liệu cho biểu đồ doanh thu
  const chartData = {
    labels: orders.map((order) => new Date(order.date).toLocaleDateString('vi-VN')),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: orders.map((order) => order.total),
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgb(147, 51, 234)",
        pointBorderWidth: 3,
        borderWidth: 3,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top", 
        labels: { 
          color: "#1f2937", 
          font: { size: 14, weight: 'bold' },
          usePointStyle: true,
          pointStyle: 'circle'
        } 
      },
      title: { 
        display: true, 
        text: "Biểu đồ doanh thu theo thời gian", 
        color: "#1f2937", 
        font: { size: 20, weight: 'bold' },
        padding: 20
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 2,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: { 
        ticks: { color: "#374151", font: { weight: 'bold' } }, 
        grid: { color: "rgba(0, 0, 0, 0.05)" } 
      },
      y: { 
        ticks: { 
          color: "#374151", 
          font: { weight: 'bold' },
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
          }
        }, 
        grid: { color: "rgba(0, 0, 0, 0.05)" } 
      },
    },
  }

  // Dữ liệu cho biểu đồ tròn
  const doughnutData = {
    labels: filteredData.topProducts.map(product => product.name),
    datasets: [
      {
        data: filteredData.topProducts.map(product => product.quantity),
        backgroundColor: [
          '#8B5CF6',
          '#06B6D4',
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverBorderWidth: 5,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1f2937',
          font: { size: 12, weight: 'bold' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 10,
      },
    },
  }

  // Hàm xuất báo cáo CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Ngày", "Tổng doanh thu (VNĐ)", "Số đơn hàng"],
      ...orders.map((order) => [order.date, order.total, 1]),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 text-lg">Thống kê doanh thu và phân tích kinh doanh</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc với Glass Morphism */}
      <div className="mb-8 backdrop-blur-lg bg-white/30 p-6 rounded-3xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          Bộ lọc thời gian
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Loại báo cáo:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan với Cards hiện đại */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng doanh thu */}
        <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-3xl border border-purple-200/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.2 0-4-1.8-4-4H4v2h4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h4v-2h-4c0 2.2-1.8 4-4 4zM4 6h16v2H4z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">+12.5%</span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">Tổng doanh thu</h3>
            <p className="text-3xl font-bold text-gray-800">{filteredData.totalRevenue.toLocaleString("vi-VN")} VNĐ</p>
          </div>
        </div>

        {/* Số đơn hàng */}
        <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-3xl border border-blue-200/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">+8.2%</span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">Số đơn hàng</h3>
            <p className="text-3xl font-bold text-gray-800">{filteredData.orderCount}</p>
          </div>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-3xl border border-green-200/30 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">+15.3%</span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">Sản phẩm bán chạy</h3>
            <p className="text-3xl font-bold text-gray-800">{filteredData.topProducts.length}</p>
          </div>
        </div>

        {/* Doanh thu trung bình */}
        <div className="group relative overflow-hidden backdrop-blur-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-6 rounded-3xl border border-orange-200/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">+5.7%</span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">Doanh thu TB/đơn</h3>
            <p className="text-3xl font-bold text-gray-800">
              {filteredData.orderCount > 0 ? (filteredData.totalRevenue / filteredData.orderCount).toLocaleString("vi-VN") : 0} VNĐ
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Biểu đồ doanh thu */}
        <div className="backdrop-blur-lg bg-white/40 p-6 rounded-3xl shadow-xl border border-white/20">
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Biểu đồ tròn sản phẩm */}
        <div className="backdrop-blur-lg bg-white/40 p-6 rounded-3xl shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Phân bố sản phẩm bán chạy</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Bảng sản phẩm bán chạy */}
      <div className="backdrop-blur-lg bg-white/40 p-6 rounded-3xl shadow-xl border border-white/20 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Top sản phẩm bán chạy
        </h2>
        {filteredData.topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left p-4 text-gray-700 font-bold">Xếp hạng</th>
                  <th className="text-left p-4 text-gray-700 font-bold">Tên sản phẩm</th>
                  <th className="text-left p-4 text-gray-700 font-bold">Số lượng bán</th>
                  <th className="text-left p-4 text-gray-700 font-bold">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-200/30 hover:bg-white/20 transition-colors duration-200">
                    <td className="p-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4 text-gray-800 font-medium">{product.name}</td>
                    <td className="p-4 text-gray-800">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-purple-600 font-bold text-lg">
                      {product.revenue.toLocaleString("vi-VN")} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Không có dữ liệu sản phẩm bán chạy</p>
          </div>
        )}
      </div>

      {/* Nút xuất báo cáo */}
      <div className="flex justify-center">
        <button
          onClick={exportToCSV}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="relative z-10">Xuất báo cáo CSV</span>
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard