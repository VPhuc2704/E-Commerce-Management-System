package org.javaweb.enums;

public enum paymentStatus {
    PENDING("Đang chờ xác nhận"),
    CONFIRMED("Hoàn thành"),
    FAILD("Thất bại");

    private final String name;

    paymentStatus(String name){
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
