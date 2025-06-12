package org.javaweb.repository;

import org.javaweb.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItemEntity,Long> {
    CartItemEntity findByCarts_IdAndProducts_Id(Long cartsId, Long productsId);
}
