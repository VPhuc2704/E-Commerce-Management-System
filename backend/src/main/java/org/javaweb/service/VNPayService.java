package org.javaweb.service;

import org.javaweb.model.request.VNPayRequest;
import org.springframework.http.ResponseEntity;

import java.io.UnsupportedEncodingException;

public interface VNPayService {
    String createPayment(String totalAmount) throws UnsupportedEncodingException;
    ResponseEntity<String> handlePaymentReturn(String responseCode);
}
