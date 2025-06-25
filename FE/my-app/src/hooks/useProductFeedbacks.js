// hooks/useProductFeedbacks.js
import { useEffect, useState } from 'react';
import { feedbackService } from '../services/feedbackService';

export const useProductFeedbacks = (productId) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchReviews = async () => {
    if (!productId) {
      setLoading(false);
      setError('Product ID không hợp lệ');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getFeedbacksByProduct(productId);
      setFeedbacks(data);
    } catch (err) {
      console.error('Lỗi khi lấy phản hồi:', err);
      setError('Không thể tải phản hồi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (productId) {
      fetchReviews();
    }
    return () => {
      mounted = false;
    };
  }, [productId, refreshTrigger]); // Thêm refreshTrigger vào dependency

  const refreshFeedbacks = () => {
    setRefreshTrigger(prev => prev + 1); // Tăng trigger để re-fetch
  };

  return { feedbacks, loading, fetchReviews, error, refreshFeedbacks };
};