package org.javaweb.service.impl;

import org.javaweb.entity.OrderEntity;
import org.javaweb.entity.PaymentEntity;
import org.javaweb.enums.PaymentMethod;
import org.javaweb.enums.PaymentStatus;
import org.javaweb.repository.PaymentRepository;
import org.javaweb.service.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public PaymentEntity createPaymentForOrder(OrderEntity order, PaymentMethod paymentMethod) {
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setOrders(order);
        paymentEntity.setAmount(order.getTotalAmount());
        paymentEntity.setPaymentMethod(paymentMethod);
        paymentEntity.setPaymentStatus(PaymentStatus.PENDING);
        return paymentRepository.save(paymentEntity);
    }
}
