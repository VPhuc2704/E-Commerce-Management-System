package org.javaweb.service.impl;

import org.javaweb.entity.CartEntity;
import org.javaweb.entity.CartItemEntity;
import org.javaweb.entity.ProductEntity;
import org.javaweb.entity.UserEntity;
import org.javaweb.model.dto.CartItemDTO;
import org.javaweb.model.request.CartAddRequestDTO;
import org.javaweb.model.response.CartResponseDTO;
import org.javaweb.repository.CartItemRepository;
import org.javaweb.repository.CartRepository;
import org.javaweb.repository.ProductRepository;
import org.javaweb.repository.UserRepository;
import org.javaweb.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public void addProductToCart(CartAddRequestDTO request, Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        ProductEntity product = productRepository.findById(request.getProductId()).get();

        CartEntity cart = user.getCarts();

        if (cart == null) {
            cart = new CartEntity();
            cart.setUsers(user);
            cart = cartRepository.save(cart); // lưu giỏ hàng
            user.setCarts(cart);              // gán lại vào user
            userRepository.save(user);
        }

        CartItemEntity  cartItem = cartItemRepository.findByCarts_IdAndProducts_Id(cart.getId(), product.getId());

        if (cartItem != null) {
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            cartItem.setQuantity(newQuantity);
            cartItem.setPrice(product.getPrice() * newQuantity);
        }
        else {
            cartItem = new CartItemEntity();
            cartItem.setCarts(cart);
            cartItem.setProducts(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(product.getPrice()*request.getQuantity());
        }
        cartItemRepository.save(cartItem);
    }

    @Override
    @Transactional
    public CartResponseDTO getCurrentUserCart(Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();

        CartResponseDTO cartResponseDTO = new CartResponseDTO();
        List<CartItemDTO>  cartItemDTOList = new ArrayList<>();
        Double totalPrice = 0.0;

        CartEntity cart = user.getCarts();
        if (cart != null && cart.getListCartItems() != null ) {
            for (CartItemEntity cartItem : cart.getListCartItems()) {
                ProductEntity product = cartItem.getProducts();
                if(product == null)  continue;
                CartItemDTO dto = new CartItemDTO();
                dto.setId(cartItem.getId());
                dto.setProductId(product.getId());
                dto.setProductName(product.getName());
                dto.setQuantity(cartItem.getQuantity());
                dto.setProductImage(product.getImage());
                dto.setPricePerUnit(product.getPrice());

                Double totalItem = product.getPrice() * cartItem.getQuantity();
                dto.setTotalPrice(totalItem);

                cartItemDTOList.add(dto);
                totalPrice += totalItem;
            }
        }

        cartResponseDTO.setCartItemDTOList(cartItemDTOList);
        cartResponseDTO.setTotalPrice(totalPrice);

        return cartResponseDTO;
    }

    @Transactional
    @Override
    public CartResponseDTO updateCurrentUserCart(CartAddRequestDTO request, Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        CartEntity cart = user.getCarts();

        ProductEntity product = productRepository.findById(request.getProductId()).
                orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItemEntity> cartItemEntity = cart.getListCartItems()
                .stream()
                .filter(item -> item.getProducts().getId().equals(request.getProductId()))
                .findFirst();

        if (cartItemEntity.isPresent()){
            CartItemEntity existingItem = cartItemEntity.get();

            if (request.getQuantity() <= 0 ){
                cart.getListCartItems().remove(existingItem);
                cartItemRepository.delete(existingItem);
            }else{
                existingItem.setQuantity(request.getQuantity());
                existingItem.setPrice(product.getPrice() * request.getQuantity());
            }
        }
        cartRepository.save(cart);

        return getCurrentUserCart(authentication);
    }

    @Override
    @Transactional
    public void deleteCartItem(CartAddRequestDTO request, Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        CartEntity cart = user.getCarts();

        Optional<CartItemEntity> cartItemEntity = cart.getListCartItems()
                .stream()
                .filter(item -> item.getProducts().getId().equals(request.getProductId()))
                .findFirst();

        if (cartItemEntity.isPresent()){
            CartItemEntity existingItem = cartItemEntity.get();
            cart.getListCartItems().remove(cartItemEntity.get());
            cartItemRepository.delete(existingItem);
        }
    }

}
