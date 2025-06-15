import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, placeOrder } from '../services/productService'; // Thêm placeOrder
import { fetchProductDetails, fetchRelatedProducts, checkPurchaseStatus } from '../services/productService';
import { mockFeedbacks } from '../mockdata/productData';

export const useProductDetails = (id, navigate) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [hasPurchasedAndConfirmed, setHasPurchasedAndConfirmed] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [buyNowModal, setBuyNowModal] = useState(null); // Thêm state cho modal
  const [paymentMethod, setPaymentMethod] = useState('VNPAY'); // Thêm state cho phương thức thanh toán
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullname: '',
    numberphone: '',
    address: '',
  });
  const [isUserInfoValid, setIsUserInfoValid] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      const productData = await fetchProductDetails(id, navigate);
      if (productData) {
        setProduct(productData);
        const related = await fetchRelatedProducts(id);
        setRelatedProducts(related);
        const purchased = await checkPurchaseStatus();
        setHasPurchasedAndConfirmed(purchased);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    // Tải thông tin người dùng từ localStorage
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
    loadProductDetails();
  }, [id, navigate]);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      setQuantity(value);
    } else {
      setQuantity("1");
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      setNotification({ message: 'Sản phẩm không tồn tại!', isVisible: true });
      return;
    }
    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id.toString(), quantity, navigate);
      if (result.success) {
        setNotification({
          message: `${product.name} (x${quantity}) đã được thêm vào giỏ hàng!`,
          isVisible: true,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      setNotification({
        message: `Không thể thêm sản phẩm: ${error.message}`,
        isVisible: true,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) {
      setNotification({ message: 'Sản phẩm không tồn tại!', isVisible: true });
      return;
    }
    setBuyNowModal({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '/img/default.jpg',
    });
    setQuantity("1");
    setPaymentMethod('VNPAY');
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
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    const orderData = {
      buyNow: true,
      productId: buyNowModal.id,
      quantity: parseInt(quantity),
      paymentMethod,
      user: userInfo,
    };
    try {
      const response = await placeOrder(orderData);
      if (response.order) {
        if (paymentMethod === 'COD') {
          setNotification({
            message: 'Đặt hàng thành công! Chờ xác nhận.',
            isVisible: true,
          });
          setBuyNowModal(null);
        } else if (paymentMethod === 'VNPAY' && response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
      } else {
        setNotification({
          message: `Lỗi: ${response.error}`,
          isVisible: true,
        });
      }
    } catch (error) {
      setNotification({
        message: `Lỗi khi đặt hàng: ${error.message}`,
        isVisible: true,
      });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackRating < 1 || feedbackRating > 5) {
      setNotification({
        message: 'Vui lòng chọn số sao từ 1 đến 5.',
        isVisible: true,
      });
      return;
    }
    if (!feedbackComment.trim()) {
      setNotification({
        message: 'Vui lòng nhập nhận xét.',
        isVisible: true,
      });
      return;
    }
    try {
      const newFeedback = {
        id: mockFeedbacks.length + 1,
        user: 'Current User',
        comment: feedbackComment,
        rating: feedbackRating,
        imageUrl: feedbackImage ? URL.createObjectURL(feedbackImage) : null,
        date: new Date().toISOString().split('T')[0],
      };
      mockFeedbacks.push(newFeedback);
      setProduct(prev => ({ ...prev, feedbacks: [...prev.feedbacks, newFeedback] }));
      setFeedbackRating(0);
      setFeedbackComment('');
      setFeedbackImage(null);
      setNotification({
        message: 'Cảm ơn bạn đã gửi đánh giá!',
        isVisible: true,
      });
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      setNotification({
        message: 'Có lỗi xảy ra khi gửi đánh giá.',
        isVisible: true,
      });
    }
  };

  return {
    product,
    relatedProducts,
    hasPurchasedAndConfirmed,
    quantity,
    handleQuantityChange,
    handleAddToCart,
    notification,
    setNotification,
    feedbackRating,
    setFeedbackRating,
    feedbackComment,
    setFeedbackComment,
    feedbackImage,
    setFeedbackImage,
    handleFeedbackSubmit,
    isAddingToCart,
    buyNowModal,
    setBuyNowModal,
    paymentMethod,
    setPaymentMethod,
    userInfo,
    setUserInfo,
    isUserInfoValid,
    handlePlaceOrder,
    handleBuyNow, // Thêm handleBuyNow
  };
};