package org.javaweb.repository;

import org.javaweb.entity.ProductEntity;
import org.javaweb.enums.roleCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    List<ProductEntity> findByCategory_Id(Long categoryId);
    List<ProductEntity> findAll();
}
