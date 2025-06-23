import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section id="privacy" className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          🛡️ Chính Sách Bảo Mật
        </h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Thu Thập Thông Tin</h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi thu thập các thông tin cá nhân như tên, email, số điện thoại và địa chỉ 
              khi bạn đăng ký tài khoản hoặc đặt hàng. Các thông tin này được sử dụng để xử lý 
              đơn hàng và cải thiện dịch vụ của chúng tôi.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Sử Dụng Thông Tin</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Xử lý và giao hàng đơn đặt hàng của bạn
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Gửi thông báo về trạng thái đơn hàng
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Cải thiện chất lượng dịch vụ và trải nghiệm người dùng
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Gửi thông tin khuyến mãi (chỉ khi bạn đồng ý)
              </li>
            </ul>
          </div>

          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Bảo Vệ Thông Tin</h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ 
              thông tin cá nhân của bạn khỏi việc truy cập, sử dụng hoặc tiết lộ trái phép. 
              Dữ liệu được mã hóa và lưu trữ trên máy chủ an toàn.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Chia Sẻ Thông Tin</h3>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi cam kết không bán, thuê hoặc chia sẻ thông tin cá nhân của bạn với 
              bên thứ ba, trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Quyền Của Bạn</h3>
            <p className="text-indigo-700 text-sm">
              Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào. 
              Vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;