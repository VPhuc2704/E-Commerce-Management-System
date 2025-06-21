package org.javaweb.controller;

import org.javaweb.model.request.VNPayRequest;
import org.javaweb.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/vnpayment")
public class VNPayController {
    @Autowired
    private VNPayService vnpayService;

    @PostMapping("create")
    public ResponseEntity<String> createPayment(@RequestBody VNPayRequest paymentRequest) {
        try {
            String paymentUrl = vnpayService.createPayment(paymentRequest.getAmount(), paymentRequest.getOrderId());
            return ResponseEntity.ok(paymentUrl);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo thanh toán!");
        }
    }

    @GetMapping("/return")
    public ResponseEntity<String> returnPayment(HttpServletRequest request) {
        return vnpayService.handlePaymentReturn(request);
    }
}
