package org.javaweb.converter;

import org.javaweb.entity.OrderEntity;
import org.javaweb.model.dto.OrderDTO;
import org.javaweb.model.dto.OrderItemDTO;
import org.javaweb.model.dto.OrderPreviewDTO;
import org.javaweb.model.dto.UserDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderConverter {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserConverter userConverter;

    public OrderDTO convertToOderDTO(OrderEntity orderEntity) {
        OrderDTO orderDTO = modelMapper.map(orderEntity, OrderDTO.class);

        UserDTO userDTO = userConverter.convertToUserDTO(orderEntity.getUsers());
        orderDTO.setUser(userDTO);
        List<OrderItemDTO> orderItemDTOList = orderEntity.getListOrderItems().stream()
                .map(item -> {
                    OrderItemDTO orderItemDTO = modelMapper.map(item, OrderItemDTO.class);
                    orderItemDTO.setProductId(item.getProducts().getId());
                    orderItemDTO.setProductName(item.getProducts().getName());
                    orderItemDTO.setImageUrl(item.getProducts().getImage());
                    orderItemDTO.setQuantity(item.getQuantity());
                    orderItemDTO.setPrice(item.getProducts().getPrice());
                    return orderItemDTO;
                })
                .collect(Collectors.toList());

        orderDTO.setItems(orderItemDTOList);

        return orderDTO;
    }
}
