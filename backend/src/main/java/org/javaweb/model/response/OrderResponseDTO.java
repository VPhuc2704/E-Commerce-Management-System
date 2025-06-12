package org.javaweb.model.response;

import org.javaweb.model.dto.OrderDTO;

public class OrderResponseDTO {
    private OrderDTO order;
    private String redirectUrl; // null nếu COD

    public OrderDTO getOrder() {
        return order;
    }

    public void setOrder(OrderDTO order) {
        this.order = order;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
