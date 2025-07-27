package org.javaweb.service.impl;

import org.javaweb.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend-domain}")
    private String frontendDomain;

    @Override
    public void sendEmail(String toEmail, String token) {
        String subject = "Xác thực tài khoản";
        String link = frontendDomain + "/verify?token=" + token;

        String content =
                "<html>" +
                    "<body>" +
                        "<h2 style='color:#2c3e50;'>Chào bạn!</h2>" +
                        "<p>Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn:</p>" +
                        "<a href='" + link + "' style='display:inline-block;padding:10px 20px;background-color:#3498db;color:#fff;text-decoration:none;border-radius:5px;'>Xác thực ngay</a>" +
                        "<p>Nếu bạn không tạo tài khoản, hãy bỏ qua email này.</p>" +
                        "<br>" +
                        "<p>Trân trọng,<br>Đội ngũ hỗ trợ</p>" +
                    "</body>" +
                "</html>";
        try {
            MimeMessage mailMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(mailMessage);
        } catch (MessagingException ex) {
            throw new RuntimeException("Gửi email thất bại", ex);
        }
    }

    @Override
    public void sendOtpEmail(String toEmail, String otpCode) {
        String subject = "Mã xác thực đặt lại mật khẩu";
        String content = "<html><body>" +
                "<h3>Xin chào!</h3>" +
                "<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>" +
                "<p>Mã OTP của bạn là:</p>" +
                "<h2 style='color: red;'>" + otpCode + "</h2>" +
                "<p>Mã sẽ hết hạn sau 10 phút.</p>" +
                "<br><p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email.</p>" +
                "<p>Trân trọng,<br>Đội ngũ hỗ trợ</p>" +
                "</body></html>";

        try {
            MimeMessage mailMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);  // gửi HTML
            mailSender.send(mailMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email OTP", e);
        }
    }

}
