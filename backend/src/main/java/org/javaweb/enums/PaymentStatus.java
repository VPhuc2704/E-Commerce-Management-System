package org.javaweb.enums;

public enum PaymentStatus {
    PENDING("Đang chờ thanh toán"),
    CONFIRMED("Hoàn thành"),
    FAILED("Thất bại");

    private final String name;

    PaymentStatus(String name){
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
