package org.javaweb.service;

import org.javaweb.entity.OrderEntity;
import org.javaweb.entity.PaymentEntity;
import org.javaweb.enums.PaymentMethod;

public interface PaymentService {
    PaymentEntity createPaymentForOrder(OrderEntity order, PaymentMethod paymentMethod);
}
