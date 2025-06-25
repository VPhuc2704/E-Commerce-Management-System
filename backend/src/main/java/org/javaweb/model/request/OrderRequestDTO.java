package org.javaweb.model.request;

import org.javaweb.enums.PaymentMethod;

import java.util.List;

public class OrderRequestDTO {
    private boolean buyNow;
    private Long productId;
    private Integer quantity;
    private List<Long> cartItemIds;
    private PaymentMethod paymentMethod;

    public boolean isBuyNow() {
        return buyNow;
    }

    public void setBuyNow(boolean buyNow) {
        this.buyNow = buyNow;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public List<Long> getCartItemIds() {
        return cartItemIds;
    }

    public void setCartItemIds(List<Long> cartItemIds) {
        this.cartItemIds = cartItemIds;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
