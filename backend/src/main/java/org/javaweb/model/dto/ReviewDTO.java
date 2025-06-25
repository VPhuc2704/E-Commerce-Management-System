package org.javaweb.model.dto;

import org.javaweb.entity.ReviewEntity;

import java.time.LocalDateTime;

public class ReviewDTO {
    private Long id;
    private int rating;
    private String comment;
    private String imageUrl;
    private Long userId;
    private String userName;
    private LocalDateTime createdDate;

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public ReviewDTO(ReviewEntity reviewEntity) {
        this.id = reviewEntity.getId();
        this.rating = reviewEntity.getRating();
        this.comment = reviewEntity.getComment();
        this.imageUrl = reviewEntity.getImageUrl();
        if (reviewEntity.getUser() != null) {
            this.userId = reviewEntity.getUser().getId();
            this.userName = reviewEntity.getUser().getFullname();
        }
        this.createdDate = reviewEntity.getCreatedDate();
    }

    public ReviewDTO() {
    }
}
