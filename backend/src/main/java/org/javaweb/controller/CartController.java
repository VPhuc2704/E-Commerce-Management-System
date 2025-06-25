package org.javaweb.controller;

import org.javaweb.model.request.CartAddRequestDTO;
import org.javaweb.model.response.CartResponseDTO;
import org.javaweb.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/items/")
    public ResponseEntity<?> addProductToCart(@RequestBody CartAddRequestDTO request, Authentication authentication) {
        cartService.addProductToCart(request,authentication);
        return ResponseEntity.ok("Đã thêm vào giỏ hàng");
    }

    @GetMapping("/items/me/")
    public ResponseEntity<CartResponseDTO> getCurrentUserCart(Authentication authentication) {
        CartResponseDTO cart = cartService.getCurrentUserCart(authentication);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/me/")
    public ResponseEntity<?> uppdateProductToCart(@RequestBody CartAddRequestDTO request,
                                                  Authentication authentication) {
        CartResponseDTO updatedCart = cartService.updateCurrentUserCart(request, authentication);
        return ResponseEntity.ok(updatedCart);
    }
    @DeleteMapping("/items/me/")
    public ResponseEntity<?> deleteProductToCart(@RequestBody CartAddRequestDTO request,
                                                  Authentication authentication) {
        cartService.deleteCartItem(request, authentication);
        return ResponseEntity.ok("Đã xóa sản phẩm ra khoi gio hàng");
    }

}
