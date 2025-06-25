package org.javaweb.repository;

import org.javaweb.entity.OrderEntity;
import org.javaweb.entity.UserEntity;
import org.javaweb.enums.OrderStatus;
import org.javaweb.model.dto.OrderDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity,Long> {
    List<OrderEntity> findAll();
    List<OrderEntity> findAllByUsers(UserEntity users);
    List<OrderEntity> findAllByUsersAndStatus(UserEntity users, OrderStatus status);
    List<OrderEntity> findAllByStatus(OrderStatus status);
}
