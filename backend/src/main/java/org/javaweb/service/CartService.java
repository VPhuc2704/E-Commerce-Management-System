package org.javaweb.service;


import org.javaweb.model.request.CartAddRequestDTO;
import org.javaweb.model.response.CartResponseDTO;
import org.springframework.security.core.Authentication;

public interface CartService {
    void addProductToCart(CartAddRequestDTO request, Authentication authentication);
    CartResponseDTO getCurrentUserCart(Authentication authentication);
    CartResponseDTO updateCurrentUserCart(CartAddRequestDTO request, Authentication authentication);
    void deleteCartItem(CartAddRequestDTO request, Authentication authentication);
}
