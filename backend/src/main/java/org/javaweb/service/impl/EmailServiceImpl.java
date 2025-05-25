package org.javaweb.service.impl;

import org.javaweb.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String toEmail, String token) {
        String subject = "Xác thực tài khoản";
        String link = "http://localhost:8080/api/auth/verify?token=" + token;
        String content = "Nhấn vào link để xác thực tài khoản: \n" + link;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(content);

        mailSender.send(mailMessage);
    }
}
