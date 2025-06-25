package org.javaweb.controller;

import org.javaweb.constant.ApiResponse;
import org.javaweb.enums.OrderStatus;
import org.javaweb.model.dto.OrderDTO;
import org.javaweb.model.dto.OrderPreviewDTO;
import org.javaweb.model.request.OrderRequestDTO;
import org.javaweb.model.request.OrderStatusDTO;
import org.javaweb.model.response.OrderResponseDTO;
import org.javaweb.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrderByRole(Authentication authentication) {
        List<OrderDTO> orderDTO = orderService.getOrderByRole(authentication);
        return ResponseEntity.ok(orderDTO);
    }
    @GetMapping("/details/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long orderId, Authentication authentication) {
        OrderDTO orderDetails = orderService.getOrderDetails(authentication, orderId);
        return ResponseEntity.ok(orderDetails);
    }

    @PostMapping("/preview")
    public ResponseEntity<OrderPreviewDTO> previewOrder(@RequestBody OrderRequestDTO request, Authentication authentication) {
        return ResponseEntity.ok(orderService.previewOrder(request, authentication));
    }

    @PostMapping("/")
    public ResponseEntity<?> createOrderByCart(@RequestBody OrderRequestDTO orderRequest, Authentication authentication) {
        OrderResponseDTO order = orderService.createOrders(orderRequest, authentication);
        return ResponseEntity.ok(order);
    }


    @GetMapping("/status")
    public ResponseEntity<?> getOrderStatus(Authentication authentication, @RequestParam("status") OrderStatus status) {
        List<OrderDTO> order = orderService.getOrderStatus(authentication, status);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/admin/status")
    public ResponseEntity<?> updateStatusOrder(@RequestBody OrderStatusDTO statusDTO, Authentication authentication) {
        String message ;
        orderService.updateStatusOrder(statusDTO, authentication);
        switch (statusDTO.getOrderStatus()){
            case CONFIRMED:
                message ="Đơn hàng đã được xác nhận";
                break;
            case SHIPPED:
                message = "Đơn hàng đang được giao";
                break;
            case DELIVERED:
                message ="Đơn hàng đã giao thành công";
                break;
            case CANCELLED:
                message = "Đơn hàng hủy thành công";
                break;
            default:
                message = "Trạng thái đã được cập nhật.";
        }
        return ResponseEntity.ok(Collections.singletonMap("message", message));
    }

}
