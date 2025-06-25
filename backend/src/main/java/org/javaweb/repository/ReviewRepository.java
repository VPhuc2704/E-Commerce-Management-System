package org.javaweb.repository;

import org.javaweb.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity,Long> {
    List<ReviewEntity> findAllByProduct_Id(Long productId);

}
