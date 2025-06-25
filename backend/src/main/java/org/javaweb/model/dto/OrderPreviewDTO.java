package org.javaweb.model.dto;

import java.util.List;

public class OrderPreviewDTO {
    private Double totalAmount;
    private List<OrderItemDTO> orderItem;
    private UserDTO user;

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemDTO> getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(List<OrderItemDTO> orderItem) {
        this.orderItem = orderItem;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}