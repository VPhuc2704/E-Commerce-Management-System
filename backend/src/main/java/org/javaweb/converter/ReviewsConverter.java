package org.javaweb.converter;

import org.javaweb.entity.ReviewEntity;
import org.javaweb.model.dto.ReviewDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReviewsConverter {
    @Autowired
    private ModelMapper modelMapper;
    public void updateReview(ReviewDTO reviewDTO, ReviewEntity reviewEntity){
        modelMapper.map(reviewDTO, reviewEntity);
    }
    public ReviewDTO toDTO(ReviewEntity entity) {
        return modelMapper.map(entity,  ReviewDTO.class);
    }
}
