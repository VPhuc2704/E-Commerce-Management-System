package org.javaweb.enums;

public enum productStatus {
    Co_San ("Có-sẵn"),
    Het_Hang("Hết Hàng"),
    Ngung_San_Xuat ("Ngưng sản xuất");
    private final String name;

    productStatus(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
}
