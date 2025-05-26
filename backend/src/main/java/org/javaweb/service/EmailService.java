package org.javaweb.service;

public interface EmailService {
    void sendEmail(String email, String token);
    void sendOtpEmail(String toEmail, String otpCode);
}
