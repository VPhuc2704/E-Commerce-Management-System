package org.javaweb.enums;

public enum OrderStatus {
    PENDING("Đang chờ xác nhận"),
    CONFIRMED("Đã xác nhận"),
    SHIPPED("Chờ giao hàng"),
    DELIVERED("Đã giao hàng"),
    CANCELLED("Đã hủy");

    private final String name;

    OrderStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
