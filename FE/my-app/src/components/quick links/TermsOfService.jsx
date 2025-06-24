import React from 'react';

const TermsOfService = () => {
  return (
    <section id="terms" className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl shadow-xl p-8 mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          📋 Điều Khoản Dịch Vụ
        </h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Điều Khoản Sử Dụng</h3>
            <p className="text-gray-600 leading-relaxed">
              Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và 
              điều kiện được nêu trong tài liệu này. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Đặt Hàng & Thanh Toán</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Đơn hàng được xác nhận sau khi thanh toán thành công
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Giá cả có thể thay đổi mà không cần báo trước
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Chúng tôi có quyền từ chối đơn hàng trong một số trường hợp đặc biệt
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Thanh toán có thể thực hiện qua các phương thức được hỗ trợ
              </li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Giao Hàng</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Thời Gian Giao Hàng:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Trong thành phố: 30-45 phút</li>
                  <li>• Ngoại thành: 45-60 phút</li>
                  <li>• Vùng xa: 60-90 phút</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Phí Giao Hàng:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Nhỏ hơn 3km: Miễn phí</li>
                  <li>• 3-5km: 15,000 VNĐ</li>
                  <li>• Lớn hơn 5km: 25,000 VNĐ</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Chính Sách Hoàn Trả</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              Chúng tôi cam kết đảm bảo chất lượng món ăn. Nếu có vấn đề, vui lòng liên hệ trong vòng 
              30 phút sau khi nhận hàng:
            </p>
            <ul className="text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                Món ăn không đúng với đơn đặt hàng
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                Chất lượng món ăn không đảm bảo
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                Thiếu món hoặc thiếu phụ kiện
              </li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Trách Nhiệm & Giới Hạn</h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi không chịu trách nhiệm về những thiệt hại gián tiếp hoặc hậu quả phát sinh 
              từ việc sử dụng dịch vụ. Trách nhiệm của chúng tôi được giới hạn ở giá trị đơn hàng.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Thay Đổi Điều Khoản</h3>
            <p className="text-purple-700 text-sm">
              Chúng tôi có quyền cập nhật điều khoản dịch vụ bất kỳ lúc nào. 
              Những thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;