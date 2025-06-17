package org.javaweb.service.impl;

import org.javaweb.converter.ReviewsConverter;
import org.javaweb.entity.ReviewEntity;
import org.javaweb.model.dto.ReviewDTO;
import org.javaweb.repository.ProductRepository;
import org.javaweb.repository.ReviewRepository;
import org.javaweb.repository.UserRepository;
import org.javaweb.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ReviewsConverter reviewsConverter;

    @Override
    public List<ReviewDTO> getReviewsByProduct_Id(Long productId) {
        List<ReviewEntity> reviews = reviewRepository.findAllByProduct_Id(productId);
        return reviews.stream()
                .map(ReviewDTO::new) // cần constructor ReviewDTO(ReviewEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ReviewDTO> createReview(Long productId, Long userId, ReviewDTO review) {
        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
        reviewEntity.setProduct(productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("User not found")));
        reviewEntity.setRating(review.getRating());
        reviewEntity.setComment(review.getComment());
        reviewEntity.setImageUrl(review.getImageUrl()); // Đã upload và lấy link
        reviewEntity.setCreatedDate(LocalDateTime.now());
        ReviewEntity saved = reviewRepository.save(reviewEntity);
        ReviewDTO responseDto = new ReviewDTO(saved);
        return Optional.of(responseDto);
    }

    @Override
    public void deleteReview(Long reviewId,  Long userId) {
        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                .filter(review -> review.getUser().getId().equals(userId))
                .orElseThrow(() -> new AccessDeniedException("Bạn không có quyền xóa đánh giá này."));
        reviewRepository.delete(reviewEntity);
    }

    @Override
    public Optional<ReviewDTO> updateReview(Long reviewId, Long userId ,ReviewDTO review) {
        Optional<ReviewEntity> optionalReview = reviewRepository.findById(reviewId);

        if (!optionalReview.isPresent()) {
            return Optional.empty(); // Trả về empty để controller xử lý lỗi đẹp hơn
        }

        ReviewEntity reviewEntity = optionalReview.get();

        if (!reviewEntity.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Bạn không có quyền sửa đánh giá này.");
        }
        reviewsConverter.updateReview(review, reviewEntity);
        reviewEntity.setCreatedDate(LocalDateTime.now());

        ReviewEntity saved = reviewRepository.save(reviewEntity);
        return Optional.of(reviewsConverter.toDTO(saved));
    }
}
