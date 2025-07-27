package org.javaweb.service.impl;

import org.javaweb.config.VNPayConfig;
import org.javaweb.entity.OrderEntity;
import org.javaweb.entity.OrderItemEntity;
import org.javaweb.entity.PaymentEntity;
import org.javaweb.entity.ProductEntity;
import org.javaweb.enums.OrderStatus;
import org.javaweb.enums.PaymentStatus;
import org.javaweb.model.request.VNPayRequest;
import org.javaweb.repository.OrderRepository;
import org.javaweb.repository.ProductRepository;
import org.javaweb.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayServiceImpl implements VNPayService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private VNPayConfig vnPayConfig;


    @Override
    public String createPayment(String totalAmount,  Long orderId) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";

        long amount = 0;
        try {
            amount = Long.parseLong(totalAmount) * 100;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Số tiền không hợp lệ");
        }
//        String bankCode = "VNBANK";
//        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_TxnRef = String.valueOf(orderId);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

//        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.vnp_ReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

//        vnp_Params.put("vnp_IpnUrl", VNPayConfig.vnp_IpnUrl);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append('&');
                hashData.append('&');
            }
        }

        if (query.length() > 0)
            query.setLength(query.length() - 1);
        if (hashData.length() > 0)
            hashData.setLength(hashData.length() - 1);

        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        return VNPayConfig.vnp_PayUrl + "?" + query;
    }

    @Override
    public ResponseEntity<String> handlePaymentReturn(HttpServletRequest request) {
//
//        Map<String, String> vnp_Params = VNPayConfig.getVNPayResponseParams(request);
//        String vnpSecureHash = request.getParameter("vnp_SecureHash");
//
//        // Xoá secure hash ra khỏi params trước khi hash
//        vnp_Params.remove("vnp_SecureHash");
//        vnp_Params.remove("vnp_SecureHashType");

        String responseCode = request.getParameter("vnp_ResponseCode");
        String transactionStatus = request.getParameter("vnp_TransactionStatus");
        String orderIdStr = request.getParameter("vnp_TxnRef");

        Long orderId;
        try {
            orderId = Long.parseLong(orderIdStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Mã đơn hàng không hợp lệ.");
        }

        Optional<OrderEntity> optionalOrder = orderRepository.findById(orderId);
        if (!optionalOrder.isPresent()) {
            return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng.");
        }

        OrderEntity order = optionalOrder.get();
        PaymentEntity payment = order.getPayment();

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            order.setStatus(OrderStatus.CONFIRMED);
            payment.setPaymentStatus(PaymentStatus.CONFIRMED);

            for (OrderItemEntity item : order.getListOrderItems()) {
                ProductEntity product = item.getProducts();
                int currentSold = product.getSoldQuantity() != null ? product.getSoldQuantity() : 0;
                product.setSoldQuantity(currentSold + item.getQuantity());
                productRepository.save(product);
            }
        } else {
            order.setStatus(OrderStatus.CANCELLED);
            payment.setPaymentStatus(PaymentStatus.FAILED);
        }

        orderRepository.save(order);
        return ResponseEntity.ok("Trạng thái thanh toán đã được cập nhật.");
    }
}
