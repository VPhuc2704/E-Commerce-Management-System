import { useEffect, useState } from 'react';
import { feedbackService } from '../services/feedbackService';

export const useProductFeedbacks = (productId) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = () => {
        if (!productId) return;
        setLoading(true);
        feedbackService.getFeedbacksByProduct(productId)
            .then(setFeedbacks)
            .catch(err => console.error('Lỗi:', err))
            .finally(() => setLoading(false));
    };

    useEffect(fetchReviews, [productId]);

    return { feedbacks, loading, fetchReviews };
};