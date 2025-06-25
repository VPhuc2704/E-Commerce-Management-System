package org.javaweb.service.factory;

import org.javaweb.entity.CartItemEntity;
import org.javaweb.entity.OrderEntity;
import org.javaweb.entity.OrderItemEntity;
import org.javaweb.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.javaweb.enums.OrderStatus.PENDING;

@Component
public class OrderFactory {
    public OrderEntity createOrderEntity(UserEntity userEntity, List<CartItemEntity> selectedItems ) {
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setUsers(userEntity);
        orderEntity.setCreatedDate(LocalDateTime.now());
        orderEntity.setStatus(PENDING);
        List<OrderItemEntity> orderItems = new ArrayList<>();
        double totalPriceOrder = 0.0;

        for (CartItemEntity cartItem : selectedItems) {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrders(orderEntity);
            orderItem.setProducts(cartItem.getProducts());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProducts().getPrice() * cartItem.getQuantity());

            totalPriceOrder += cartItem.getProducts().getPrice() * cartItem.getQuantity();
            orderItems.add(orderItem);

        }
        orderEntity.setListOrderItems(orderItems);
        orderEntity.setTotalAmount(totalPriceOrder);

        return orderEntity;
    }
    public OrderEntity createOrderEntityBuyNow(UserEntity userEntity, List<OrderItemEntity> orderItems) {
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setUsers(userEntity);
        orderEntity.setCreatedDate(LocalDateTime.now());
        orderEntity.setStatus(PENDING);

        double totalPriceOrder = 0.0;

        for (OrderItemEntity orderItem : orderItems) {
            orderItem.setOrders(orderEntity);
            totalPriceOrder += orderItem.getPrice();
        }

        orderEntity.setListOrderItems(orderItems);
        orderEntity.setTotalAmount(totalPriceOrder);

        return orderEntity;
    }
}
