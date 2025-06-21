import { useState, useEffect } from "react";
import { X, CreditCard, Truck, Package, MapPin, Phone, Mail, User } from "lucide-react";

// Mock hooks for demonstration
const useAuth = () => ({ user: { email: "user@example.com" } });
const useProfileData = (user) => {
  const [userInfo, setUserInfoState] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : {};
  });

  const setUserInfo = (newInfo) => {
    const updated = typeof newInfo === 'function' ? newInfo(userInfo) : newInfo;
    setUserInfoState(updated);
    localStorage.setItem('userInfo', JSON.stringify(updated));
  };

  return { userInfo, setUserInfo };
};


const CheckoutModal = ({
  isOpen = true,
  onClose = () => { },
  product = { name: "Sản phẩm mẫu", price: 299000, image: "https://via.placeholder.com/100" },
  quantity = 2,
  onSubmit = () => { }
}) => {
  const { user } = useAuth();
  const { userInfo, setUserInfo } = useProfileData(user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        email: userInfo.email || "",
        name: userInfo.fullname || "",
        phone: userInfo.numberphone || "",
        address: userInfo.address || "",
        paymentMethod: prev.paymentMethod
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const userKeyMap = {
      phone: "numberphone",
      address: "address"
    };

    if (userKeyMap[name]) {
      setUserInfo((prev) => ({ ...prev, [userKeyMap[name]]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 Gửi đi:", formData);
    onSubmit({ ...formData, product, quantity });
    onClose();
  };

  if (!isOpen) return null;

  const totalAmount = quantity * product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Xác nhận đơn hàng</h2>
              <p className="text-blue-100">Hoàn tất thông tin để đặt hàng</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
          {/* Product Summary */}
          <div className="lg:w-2/5 bg-gray-50 p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <Package className="mr-2 text-blue-600" size={20} />
              Chi tiết đơn hàng
            </h3>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="text-gray-400" size={32} />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg mb-2">{product.name}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Đơn giá:</span>
                      <span className="font-medium">{(product?.price ?? 0).toLocaleString()} VND</span>

                    </div>
                    <div className="flex justify-between">
                      <span>Số lượng:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-base font-semibold text-gray-800">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{totalAmount.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={18} />
                Phương thức thanh toán
              </h4>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={formData.paymentMethod === "VNPAY"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">VP</span>
                    </div>
                    <div>
                      <div className="font-medium">VNPAY</div>
                      <div className="text-sm text-gray-500">Thanh toán online an toàn</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center mr-3">
                      <Truck size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Thanh toán khi nhận hàng</div>
                      <div className="text-sm text-gray-500">Trả tiền mặt khi giao hàng</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="lg:w-3/5 p-6 lg:p-8 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              Thông tin khách hàng
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="0xxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">điều khoản và điều kiện</a> cũng như <a href="#" className="text-blue-600 hover:underline">chính sách bảo mật</a> của công ty.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                >
                  Xác nhận đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;