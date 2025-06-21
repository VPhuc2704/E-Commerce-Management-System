package org.javaweb.service;

import org.javaweb.model.request.VNPayRequest;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;

public interface VNPayService {
    String createPayment(String totalAmount,  Long orderId) throws UnsupportedEncodingException;
    ResponseEntity<String> handlePaymentReturn(HttpServletRequest request);
}
