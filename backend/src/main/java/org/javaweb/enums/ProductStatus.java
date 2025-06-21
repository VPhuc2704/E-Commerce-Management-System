package org.javaweb.enums;

public enum ProductStatus {
    Con_Hang("Còn Hàng"),
    Het_Hang("Hết Hàng"),
    Ngung_San_Xuat ("Ngưng sản xuất");
    private final String name;

    ProductStatus(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
}
