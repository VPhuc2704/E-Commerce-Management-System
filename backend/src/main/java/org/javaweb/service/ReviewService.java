package org.javaweb.service;

import org.javaweb.model.dto.ReviewDTO;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<ReviewDTO> getReviewsByProduct_Id(Long productId);
    Optional<ReviewDTO> createReview(Long productId, Long userId, ReviewDTO review);
    void deleteReview(Long reviewId,  Long userId);
    Optional<ReviewDTO> updateReview(Long reviewId,Long userId ,ReviewDTO review);
}
