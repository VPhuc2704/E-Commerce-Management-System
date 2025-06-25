import React from 'react';

const AboutUs = () => {
  return (
    <section id="about" className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-2xl p-8 mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-indigo-800 mb-8 text-center">
          Về Chúng Tôi
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
              Câu Chuyện Của Chúng Tôi
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Được thành lập từ năm 2020, "Ăn Cùng Chúng Tôi" bắt đầu từ một ước mơ nhỏ - 
              mang đến những món ăn ngon, tươi ngon và an toàn đến tay khách hàng.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Với đội ngũ đầu bếp giàu kinh nghiệm và tình yêu ẩm thực, chúng tôi không ngừng 
              sáng tạo và cải tiến để đem lại trải nghiệm tuyệt vời nhất.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">5+</div>
                <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">10K+</div>
                <div className="text-sm text-gray-600">Khách hàng hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">100+</div>
                <div className="text-sm text-gray-600">Món ăn đa dạng</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <h4 className="text-xl font-semibold mb-4">Sứ Mệnh Của Chúng Tôi</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">🍽️</span>
                  <span>Cung cấp thực phẩm tươi ngon, chất lượng cao</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">❤️</span>
                  <span>Phục vụ khách hàng với tình yêu và sự tận tâm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">🌱</span>
                  <span>Bảo vệ môi trường và phát triển bền vững</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">🤝</span>
                  <span>Xây dựng cộng đồng ẩm thực khỏe mạnh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">👨‍🍳</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Đội Ngũ Chuyên Nghiệp</h4>
            <p className="text-gray-600 text-sm">
              Đầu bếp giàu kinh nghiệm với tình yêu ẩm thực
            </p>
          </div>
          
          <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🥬</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Nguyên Liệu Tươi Ngon</h4>
            <p className="text-gray-600 text-sm">
              Chọn lọc kỹ càng từ các nhà cung cấp uy tín
            </p>
          </div>
          
          <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🚚</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Giao Hàng Nhanh Chóng</h4>
            <p className="text-gray-600 text-sm">
              Đảm bảo thực phẩm được giao tới tay bạn một cách tươi ngon nhất
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;