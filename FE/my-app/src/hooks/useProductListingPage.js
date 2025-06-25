import { useState, useEffect } from 'react';
import { addToCart, placeOrder } from '../services/productService';


export const useProductListingPage = () => {
  const [buyNowModal, setBuyNowModal] = useState(null); // { id, name, price, imageUrl }
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullname: '',
    numberphone: '',
    address: '',
  });
  const [isUserInfoValid, setIsUserInfoValid] = useState(true);

  // Load thông tin người dùng từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Đã thêm vào giỏ hàng!');
    } else {
      alert('Lỗi: ' + result.error);
    }
  };

  const handleBuyNow = (product) => {
    setBuyNowModal({
      id: product.id,
      name: product.name,
      price: product.originalPrice, // Giá đã là VNĐ
      imageUrl: product.image ? `${BASE_URL}${product.image}` : '/img/default.jpg',
    });
    setQuantity(1); // Reset số lượng
    setPaymentMethod('VNPAY'); // Reset phương thức
  };

  const validateUserInfo = () => {
    const { email, fullname, numberphone, address } = userInfo;
    return email && fullname && numberphone && address;
  };

  const handlePlaceOrder = async () => {
    if (!validateUserInfo()) {
      setIsUserInfoValid(false);
      return;
    }

    // Lưu thông tin người dùng
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    const orderData = {
      buyNow: true,
      productId: buyNowModal.id,
      quantity,
      paymentMethod,
      user: userInfo,
    };

    try {
      const response = await placeOrder(orderData);
      if (response.order) {
        if (paymentMethod === 'COD') {
          alert('Đặt hàng thành công! Chờ xác nhận.');
          setBuyNowModal(null);
        } else if (paymentMethod === 'VNPAY' && response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
      } else {
        alert('Lỗi: ' + response.error);
      }
    } catch (error) {
      alert('Lỗi khi đặt hàng: ' + error.message);
    }
  };

  return {
    buyNowModal,
    setBuyNowModal,
    quantity,
    setQuantity,
    paymentMethod,
    setPaymentMethod,
    userInfo,
    setUserInfo,
    isUserInfoValid,
    setIsUserInfoValid,
    handleAddToCart,
    handleBuyNow,
    validateUserInfo,
    handlePlaceOrder,
  };
};