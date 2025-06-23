import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchProductDetails, fetchRelatedProducts, checkPurchaseStatus } from '../services/productService';
import { ORDER_STATUS } from '../constants/orderConstants';
import { feedbackService } from '../services/feedbackService';
import { useProductFeedbacks } from './useProductFeedbacks';
import { processPayment } from '../services/cartService';
import profileService from '../services/profileService';

export const useProductDetails = (id) => {
  const navigate = useNavigate();
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
  const [isUserInfoValid, setIsUserInfoValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');

  const { feedbacks, loading, refreshFeedbacks, error } = useProductFeedbacks(id);

  // Tính rating từ feedbacks - sử dụng useMemo để tránh tính toán lại không cần thiết
  const averageRating = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  // Product với rating được tính toán - sử dụng useMemo
  const productWithRating = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      rating: averageRating
    };
  }, [product, averageRating]);

  const fetchUserInfo = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('Chưa đăng nhập, bỏ qua gọi API lấy user info');
        return; // Không gọi API nếu chưa đăng nhập
      }

      const profile = await profileService.getUserInfo();
      const updatedUserInfo = {
        email: profile.email || '',
        fullname: profile.fullname || '',
        numberphone: profile.numberphone || '',
        address: profile.address || '',
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setIsUserInfoValid(validateUserInfo(updatedUserInfo));
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      setUserInfo({ email: '', fullname: '', numberphone: '', address: '' });
      setIsUserInfoValid(false);
    }
  }, []);

  // Validate user info function - nhận userInfo làm parameter để tránh dependency
  const validateUserInfo = useCallback((userInfoToValidate = userInfo) => {
    const { email, fullname, numberphone, address } = userInfoToValidate;
    return !!(email && fullname && numberphone && address);
  }, [userInfo]);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const productData = await fetchProductDetails(id, navigate);
        if (!productData) {
          console.error('Không lấy được chi tiết sản phẩm!');
          return;
        }
        setProduct(productData.data);

        const related = await fetchRelatedProducts(id);
        setRelatedProducts(related);

        const purchased = await checkPurchaseStatus(ORDER_STATUS.CONFIRMED);
        setHasPurchasedAndConfirmed(purchased);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Lỗi khi loadProductDetails:', error);
      }
    };

    loadProductDetails();
    fetchUserInfo();
  }, [id, navigate, fetchUserInfo]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, isVisible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  const handleQuantityChange = useCallback((e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      setQuantity(value);
    } else {
      setQuantity("1");
    }
  }, []);

  const showNotification = useCallback((message) => {
    setNotification({ message, isVisible: true });
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!productWithRating) {
      showNotification('Sản phẩm không tồn tại!');
      return;
    }
    console.log('Adding to cart:', { productId: productWithRating.id, quantity });
    setIsAddingToCart(true);
    try {
      const result = await addToCart(productWithRating, quantity);
      if (result.success) {
        showNotification(`${productWithRating.name} (x${quantity}) đã được thêm vào giỏ hàng!`);

        window.dispatchEvent(new Event('cartUpdated'));

        window.dispatchEvent(new StorageEvent('storage', {
          key: 'cart',
          newValue: Date.now().toString(),
          url: window.location.href
        }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      showNotification(`Không thể thêm sản phẩm: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setIsAddingToCart(false);
    }
  }, [productWithRating, quantity, showNotification]);

  const handleBuyNow = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showNotification('Vui lòng đăng nhập để đặt hàng!');
      return;
    }
    if (!productWithRating) {
      showNotification('Sản phẩm không tồn tại!');
      return;
    }
    setBuyNowModal({
      id: productWithRating.id,
      name: productWithRating.name,
      price: productWithRating.price,
      imageUrl: productWithRating.image || '/img/default.jpg',
    });
    setQuantity("1");
  }, [productWithRating, showNotification]);

  const handlePlaceOrder = useCallback(async () => {
    if (!validateUserInfo()) {
      showNotification('Vui lòng cập nhật thông tin cá nhân trước khi đặt hàng!');
      navigate('/profile?redirect=/product-details/' + id);
      return;
    }
    if (!buyNowModal || !productWithRating) {
      showNotification('Sản phẩm không hợp lệ!');
      return;
    }

    try {
      const response = await processPayment(paymentMethod, [], [], buyNowModal, parseInt(quantity));
      if (response.success) {
        const orderId = localStorage.getItem('lastOrderId');
        if (paymentMethod === 'COD') {
          if (orderId) {
            showNotification('Đặt hàng thành công! Chờ xác nhận từ cửa hàng.');
            setBuyNowModal(null);
            navigate(`/order-details/${orderId}`);
          } else {
            showNotification('Đặt hàng thành công nhưng không thể điều hướng đến chi tiết đơn hàng.');
          }
        } else if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        showNotification(`Lỗi: ${response.error}`);
      }
    } catch (error) {
      showNotification(`Lỗi khi đặt hàng: ${error.message}`);
    }
  }, [
    validateUserInfo,
    navigate,
    id,
    buyNowModal,
    productWithRating,
    quantity,
    paymentMethod,
    showNotification
  ]);

  const handleFeedbackSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (feedbackRating < 1 || feedbackRating > 5) {
      showNotification('Vui lòng chọn số sao từ 1 đến 5.');
      return;
    }
    if (!feedbackComment.trim()) {
      showNotification('Vui lòng nhập nhận xét.');
      return;
    }
    try {
      await feedbackService.postFeedback(productWithRating.id, {
        rating: feedbackRating,
        comment: feedbackComment,
        imageFile: feedbackImage,
      });

      if (feedbackImage) {
        URL.revokeObjectURL(URL.createObjectURL(feedbackImage));
      }

      // Reset form
      setFeedbackRating(0);
      setFeedbackComment('');
      setFeedbackImage(null);

      // Refresh feedbacks sau khi reset form để tránh conflict
      await refreshFeedbacks();

      showNotification('Phản hồi đã được gửi thành công!');
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      showNotification('Lỗi khi gửi phản hồi. Vui lòng thử lại!');
    }
  }, [
    feedbackRating,
    feedbackComment,
    feedbackImage,
    productWithRating,
    refreshFeedbacks,
    showNotification
  ]);

  return {
    product: productWithRating, // Trả về product đã có rating
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
    feedbacks,
    loading,
    error,
  };
};