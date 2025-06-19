import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, placeOrder, fetchProductDetails, fetchRelatedProducts, checkPurchaseStatus } from '../services/productService';
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

  const { feedbacks, loading, fetchReviews } = useProductFeedbacks(id);

  // Tải thông tin người dùng
  const fetchUserInfo = async () => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
      }
      const profile = await profileService.getUserInfo();
      const updatedUserInfo = {
        email: profile.email || '',
        fullname: profile.name || '',
        numberphone: profile.phone || '',
        address: profile.address || '',
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setIsUserInfoValid(validateUserInfo());
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      setUserInfo({ email: '', fullname: '', numberphone: '', address: '' });
      setIsUserInfoValid(false);
    }
  };

  // Tải chi tiết sản phẩm
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
      const result = await addToCart(product.id, quantity, navigate);
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
        setNotification({ message: `Lỗi: ${response.error}`, isVisible: true });
      }
    } catch (error) {
      setNotification({ message: `Lỗi khi đặt hàng: ${error.message}`, isVisible: true });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackRating < 1 || feedbackRating > 5) {
      setNotification({ message: 'Vui lòng chọn số sao từ 1 đến 5.', isVisible: true });
      return;
    }
    if (!feedbackComment.trim()) {
      setNotification({ message: 'Vui lòng nhập nhận xét.', isVisible: true });
      return;
    }
    try {
      const newFeedback = {
        id: Date.now(),
        user: userInfo.fullname || 'Current User',
      };

      await feedbackService.postFeedback(product.id, {
        rating: feedbackRating,
        comment: feedbackComment,
        imageUrl: feedbackImage ? URL.createObjectURL(feedbackImage) : null,
        date: new Date().toISOString().split('T')[0],
      });

      // Xóa URL.createObjectURL để tránh rò rỉ bộ nhớ
      if (feedbackImage) {
        URL.revokeObjectURL(URL.createObjectURL(feedbackImage));
      }

      // Cập nhật state hoặc fetch lại reviews
      setFeedbackRating(0);
      setFeedbackComment('');
      setFeedbackImage(null);
      fetchReviews();

      setNotification({ message: 'Phản hồi đã được gửi thành công!', isVisible: true });
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      setNotification({ message: 'Lỗi khi gửi phản hồi. Vui lòng thử lại!', isVisible: true });
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