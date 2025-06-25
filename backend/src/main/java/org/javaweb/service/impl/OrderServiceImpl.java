package org.javaweb.service.impl;

import org.javaweb.converter.OrderConverter;
import org.javaweb.entity.*;
import org.javaweb.enums.OrderStatus;
import org.javaweb.enums.PaymentStatus;
import org.javaweb.exceptions.CartEmptyException;
import org.javaweb.exceptions.NoProductSelectedException;
import org.javaweb.exceptions.OrderException;
import org.javaweb.model.dto.OrderDTO;
import org.javaweb.model.dto.OrderItemDTO;
import org.javaweb.model.dto.OrderPreviewDTO;
import org.javaweb.model.dto.UserDTO;
import org.javaweb.model.request.OrderRequestDTO;
import org.javaweb.model.request.OrderStatusDTO;
import org.javaweb.model.response.OrderResponseDTO;
import org.javaweb.repository.CartItemRepository;
import org.javaweb.repository.OrderRepository;
import org.javaweb.repository.ProductRepository;
import org.javaweb.service.CartService;
import org.javaweb.service.OrderService;
import org.javaweb.service.PaymentService;
import org.javaweb.service.VNPayService;
import org.javaweb.service.factory.OrderFactory;
import org.javaweb.utils.ChekoutRole;
import org.javaweb.utils.ValidateUserInfor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private OrderConverter orderConverter;
    @Autowired
    private OrderFactory  orderFactory;
    @Autowired
    private CartService cartService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private VNPayService vnPayService;


    //preview đơn hàng trước
    @Override
    public OrderPreviewDTO previewOrder(OrderRequestDTO orderRequest, Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        OrderPreviewDTO previewDTO = new OrderPreviewDTO();

        // Thông tin người nhận
        UserDTO userInfo = new UserDTO();
        userInfo.setFullname(user.getFullname());
        userInfo.setAddress(user.getAddress());
        userInfo.setEmail(user.getEmail());
        userInfo.setNumberphone(user.getNumberphone());
        previewDTO.setUser(userInfo);

        List<OrderItemDTO> itemPreviews = new ArrayList<>();
        double totalAmount = 0;

        if (orderRequest.isBuyNow()) {
            // Mua ngay 1 sản phẩm
            ProductEntity product = productRepository.findById(orderRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

            int quantity = orderRequest.getQuantity();
            double price = product.getPrice() * quantity;

            OrderItemDTO item = new OrderItemDTO();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setImageUrl(product.getImage());
            item.setQuantity(quantity);
            item.setPrice(price);

            itemPreviews.add(item);
            totalAmount += price;

        } else {
            // Mua từ giỏ hàng
            CartEntity cart = user.getCarts();
            validateOrder(cart);

            List<CartItemEntity> selectedItems = getSelectedCartItems(cart, orderRequest.getCartItemIds());

            if (selectedItems.isEmpty()) {
                throw new NoProductSelectedException("Hãy lựa chọn sản phẩm");
            }

            for (CartItemEntity cartItem : selectedItems) {
                ProductEntity product = cartItem.getProducts();
                int quantity = cartItem.getQuantity();
                double price = product.getPrice() * quantity;

                OrderItemDTO item = new OrderItemDTO();
                item.setProductId(product.getId());
                item.setProductName(product.getName());
                item.setImageUrl(product.getImage());
                item.setQuantity(quantity);
                item.setPrice(price);

                itemPreviews.add(item);
                totalAmount += price;
            }
        }

        previewDTO.setOrderItem(itemPreviews);
        previewDTO.setTotalAmount(totalAmount);

        return previewDTO;
    }

    @Override
    @Transactional
    public OrderResponseDTO createOrders(OrderRequestDTO orderRequest, Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();

        ValidateUserInfor.validateUserInfo(user);

        OrderEntity orderEntity;

        if(orderRequest.isBuyNow()){

            ProductEntity product = productRepository.findById(orderRequest.getProductId()).get();

            OrderItemEntity orderItemEntity = buildOrderItem(product,orderRequest.getQuantity());

            orderEntity = orderFactory.createOrderEntityBuyNow(user, new ArrayList<>(Collections.singletonList(orderItemEntity)));

            orderEntity.setTotalAmount(orderItemEntity.getPrice());
        }else{
            CartEntity cartEntity = user.getCarts();
            validateOrder(cartEntity);

            List<CartItemEntity> selectedItems = getSelectedCartItems(cartEntity, orderRequest.getCartItemIds());

            if  (selectedItems.isEmpty()) {
                throw new NoProductSelectedException("Hãy lựa chọn sản phẩm");
            }

            orderEntity = orderFactory.createOrderEntity(user, selectedItems);
            removeItemsFromCart(cartEntity, selectedItems);
        }
        OrderEntity savedOrder = orderRepository.save(orderEntity);

        PaymentEntity paymentEntity = paymentService.createPaymentForOrder(savedOrder, orderRequest.getPaymentMethod());
        savedOrder.setPayment(paymentEntity);

        String paymentUrl = null;
        switch (orderRequest.getPaymentMethod()) {
            case COD:
                orderEntity.setStatus(OrderStatus.CONFIRMED);
                paymentEntity.setPaymentStatus(PaymentStatus.CONFIRMED);
                break;

            case VNPAY:
                try {
                    long totalAmount = Math.round(orderEntity.getTotalAmount());
                    paymentUrl = vnPayService.createPayment(String.valueOf(totalAmount));

                }catch (Exception e){
                    throw new RuntimeException("khong taoj duoc URL payment");
                }
                paymentEntity.setPaymentStatus(PaymentStatus.PENDING);
                orderEntity.setStatus(OrderStatus.PENDING);
                break;
        }

        orderRepository.save(savedOrder);

        OrderResponseDTO response = new OrderResponseDTO();
        response.setOrder(orderConverter.convertToOderDTO(savedOrder));
        response.setRedirectUrl(paymentUrl);

        return response;
    }

    @Override
    @Transactional
    public List<OrderDTO> getOrderByRole(Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();

        List<OrderEntity> orderEntityList;
        if(ChekoutRole.isAdmin(authentication)){
            orderEntityList = orderRepository.findAll();
        }else{
            orderEntityList = orderRepository.findAllByUsers(user);
        }
        return orderEntityList.stream()
                .map(orderConverter::convertToOderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderDetails(Authentication authentication, Long orderId) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        OrderEntity orderEntity = orderRepository.findById(orderId).orElseThrow(()->new OrderException("Order not found"));
        boolean isOwner = orderEntity.getUsers().getId().equals(user.getId());
        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new OrderException("You are not authorized to view this order.");
        }
        return orderConverter.convertToOderDTO(orderEntity);
    }

    @Override
    public List<OrderDTO> getOrderStatus(Authentication authentication, OrderStatus status) {
        UserEntity user = (UserEntity) authentication.getPrincipal();

        List<OrderEntity> orderEntityList;
        if(ChekoutRole.isAdmin(authentication)){
            orderEntityList = orderRepository.findAllByStatus(status);
        }else{
            orderEntityList = orderRepository.findAllByUsersAndStatus(user, status);
        }
        return orderEntityList.stream()
                .map(orderConverter::convertToOderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void updateStatusOrder(OrderStatusDTO orderStatus, Authentication authentication) {
        OrderEntity orderEntity = orderRepository.findById(orderStatus.getOrderId())
                .orElseThrow(()-> new OrderException("ĐƠn hàng không tồn tại"));
        validateStatusOrder(orderEntity.getStatus(), orderStatus.getOrderStatus());
        orderEntity.setStatus(orderStatus.getOrderStatus());
        orderRepository.save(orderEntity);
    }

    private OrderItemEntity buildOrderItem(ProductEntity product, Integer quantity){
        OrderItemEntity item = new OrderItemEntity();
        item.setProducts(product);
        item.setQuantity(quantity);
        item.setPrice(product.getPrice() * quantity);
        return item;
    }

    private void validateOrder(CartEntity cart) {
        if (cart == null || cart.getListCartItems() == null || cart.getListCartItems().isEmpty() ) {
            throw new CartEmptyException("Gior hàng cua bạn đang trống");
        }
    }

    private List<CartItemEntity> getSelectedCartItems(CartEntity cartEntity, List<Long> cartItemIds) {
        List<CartItemEntity> selectedItems = cartEntity.getListCartItems()
                .stream()
                .filter(item ->cartItemIds.contains(item.getId()))
                .collect(Collectors.toList());
        return selectedItems;
    }

    private void removeItemsFromCart(CartEntity cartEntity, List<CartItemEntity> selectedItems) {
        List<CartItemEntity> currentItems = new ArrayList<>(cartEntity.getListCartItems());
        cartEntity.getListCartItems().removeAll(selectedItems);
        cartEntity.setListCartItems(currentItems);
        cartItemRepository.deleteAll(selectedItems);
    }

    private void validateStatusOrder(OrderStatus current, OrderStatus newStatus) {
        if(current == OrderStatus.DELIVERED || current == OrderStatus.CANCELLED){
            throw new OrderException("Không thể thay đổi trạng thái sau khi đã hoàn tất hoặc bị hủy");
        }
        if(current != OrderStatus.SHIPPED && newStatus == OrderStatus.DELIVERED ){
            throw new OrderException("Đơn hàng chưa được giao");
        }

    }




}
