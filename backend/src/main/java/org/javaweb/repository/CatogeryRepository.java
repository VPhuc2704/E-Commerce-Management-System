package org.javaweb.repository;

import org.javaweb.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatogeryRepository extends JpaRepository<CategoryEntity, Long> {
}
