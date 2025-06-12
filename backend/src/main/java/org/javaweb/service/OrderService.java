package org.javaweb.service;



import org.javaweb.enums.OrderStatus;
import org.javaweb.model.dto.OrderDTO;
import org.javaweb.model.dto.OrderPreviewDTO;
import org.javaweb.model.request.OrderRequestDTO;
import org.javaweb.model.request.OrderStatusDTO;
import org.javaweb.model.response.OrderResponseDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface OrderService {
    OrderPreviewDTO previewOrder(OrderRequestDTO orderRequest, Authentication authentication);
    OrderResponseDTO createOrders(OrderRequestDTO orderRequest, Authentication authentication);
    List<OrderDTO> getOrderByRole(Authentication authentication);
    OrderDTO getOrderDetails(Authentication authentication, Long orderId);
    List<OrderDTO> getOrderStatus(Authentication authentication, OrderStatus status);
    void updateStatusOrder(OrderStatusDTO orderStatusDTO, Authentication authentication);
}
