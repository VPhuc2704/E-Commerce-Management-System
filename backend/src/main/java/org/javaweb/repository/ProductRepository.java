package org.javaweb.repository;

import org.javaweb.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    List<ProductEntity> findByCategory_Id(Long categoryId);
    List<ProductEntity> findAll();
}
