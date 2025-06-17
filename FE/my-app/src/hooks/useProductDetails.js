import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchProductDetails, fetchRelatedProducts, checkPurchaseStatus } from '../services/productService';
import { processPayment } from '../services/cartService';
import profileService from '../services/profileService';

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
  const [buyNowModal, setBuyNowModal] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullname: '',
    numberphone: '',
    address: '',
  });
  const [isUserInfoValid, setIsUserInfoValid] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');

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
    const fetchUserInfo = async () => {
      try {
        const profile = await profileService.getUserInfo();
        setUserInfo({
          email: profile.email || '',
          fullname: profile.name || '',
          numberphone: profile.phone || '',
          address: profile.address || '',
        });
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        setUserInfo({
          email: '',
          fullname: '',
          numberphone: '',
          address: '',
        });
      }
    };
    loadProductDetails();
    fetchUserInfo();
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
  };

  const validateUserInfo = () => {
    const { email, fullname, numberphone, address } = userInfo;
    return email && fullname && numberphone && address;
  };

  const handlePlaceOrder = async () => {
    if (!validateUserInfo()) {
      alert('Vui lòng cập nhật thông tin cá nhân trước khi đặt hàng!');
      navigate('/profile?redirect=/product-details/' + id);
      return;
    }
    if (!buyNowModal || !product) {
      setNotification({ message: 'Sản phẩm không hợp lệ!', isVisible: true });
      return;
    }

    const tempCartItems = [{
      productId: buyNowModal.id,
      productName: buyNowModal.name,
      productImage: buyNowModal.imageUrl,
      quantity: parseInt(quantity),
      pricePerUnit: product.price,
      totalPrice: parseInt(quantity) * product.price,
    }];

    try {
      const response = await processPayment(paymentMethod, [buyNowModal.id], tempCartItems);
      if (response.success) {
        if (paymentMethod === 'COD') {
          alert('Đặt hàng thành công! Chờ xác nhận từ cửa hàng.');
        } else if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
        setBuyNowModal(null);
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
        id: Date.now(),
        user: userInfo.fullname || 'Current User',
        comment: feedbackComment,
        rating: feedbackRating,
        imageUrl: feedbackImage ? URL.createObjectURL(feedbackImage) : null,
        date: new Date().toISOString().split('T')[0],
      };
      setProduct(prev => ({ ...prev, feedbacks: [...(prev.feedbacks || []), newFeedback] }));
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
    userInfo,
    setUserInfo,
    isUserInfoValid,
    handlePlaceOrder,
    handleBuyNow,
    paymentMethod,
    setPaymentMethod,
  };
};