import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../services/cartService';
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

  useEffect(() => {
    const loadProductDetails = async () => {
      const productData = await fetchProductDetails(id, navigate);
      if (productData) {
        setProduct(productData);
        const related = await fetchRelatedProducts(id);
        setRelatedProducts(related);
        const purchased = await checkPurchaseStatus();
        setHasPurchasedAndConfirmed(purchased);
        // Cuộn lên đầu trang sau khi tải sản phẩm
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

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
      setNotification({
        message: 'Sản phẩm không tồn tại!',
        isVisible: true,
      });
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
  };
};