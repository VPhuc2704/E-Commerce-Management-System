package org.javaweb.model.response;

import org.javaweb.model.dto.CartItemDTO;

import java.util.List;

public class CartResponseDTO {
    private List<CartItemDTO> cartItemDTOList;
    private Double totalPrice;

    public List<CartItemDTO> getCartItemDTOList() {
        return cartItemDTOList;
    }

    public void setCartItemDTOList(List<CartItemDTO> cartItemDTOList) {
        this.cartItemDTOList = cartItemDTOList;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
