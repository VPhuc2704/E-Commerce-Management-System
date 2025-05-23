package org.javaweb.enums;

public enum orderStatus {
    PENDING("Đang chờ xác nhận"),
    CONFIRMED("Đã xác nhận"),
    SHIPPED("Chờ giao hàng"),
    DELIVERED("Đã giao hàng"),
    CANCELLED("Đã hủy");

    private final String name;

    orderStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
