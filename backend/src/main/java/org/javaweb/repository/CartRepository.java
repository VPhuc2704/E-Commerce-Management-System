package org.javaweb.repository;

import org.javaweb.entity.CartEntity;
import org.javaweb.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity,Long> {
    CartEntity findByUsers(UserEntity user);
}
