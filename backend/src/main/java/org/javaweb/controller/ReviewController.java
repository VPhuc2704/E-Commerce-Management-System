package org.javaweb.controller;

import org.javaweb.constant.ApiResponse;
import org.javaweb.entity.UserEntity;
import org.javaweb.model.dto.ReviewDTO;
import org.javaweb.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProduct_Id(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long productId,
            @RequestPart(value = "reviewDTO", required = false) ReviewDTO dto,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserEntity user
    ) {
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                // Tạo thư mục uploads/img
                String uploadDir = System.getProperty("user.dir") + "/uploads/reviews/";
                File directory = new File(uploadDir);
                if (!directory.exists()) directory.mkdirs();

                // Tạo tên file ngẫu nhiên
                String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);

                // Ghi file vào hệ thống
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Gán đường dẫn để FE truy cập qua /reviews/filename
                dto.setImageUrl("/reviews/" + fileName);
            }

            Optional<ReviewDTO> reviewDTO = reviewService.createReview(productId,user.getId(), dto);
            return reviewDTO
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewDTO dto,
            @AuthenticationPrincipal UserEntity user
    ) {
        try {
            Optional<ReviewDTO> reviewDTO = reviewService.updateReview(reviewId, user.getId(), dto);
            return reviewDTO
                    .map(item -> ResponseEntity.ok(new ApiResponse<>(200, "Cập nhật thành công", dto)))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse<>(400, "Đánh giá không tồn tại hoặc bạn không có quyền sửa.", null)));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không được phép sửa đánh giá này.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật đánh giá.");
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserEntity user
    ) {
        try {
            reviewService.deleteReview(reviewId, user.getId());
            return ResponseEntity.ok("Xóa đánh giá thành công.");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa đánh giá.");
        }
    }
}
