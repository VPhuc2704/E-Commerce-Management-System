package org.javaweb.security.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.javaweb.entity.RoleEntity;
import org.javaweb.entity.UserEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Component
public class JwtTokenProvider {
    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private Long jwtExpiration;

    private  SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }



    public String generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
//        claims.put("id", user.getId());
        claims.put("email", user.getEmail());
        claims.put("fullname", user.getFullname());
        claims.put("roles", user.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toList()));

        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + jwtExpiration * 1000);

        String token = Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
        return token;
    }

    public List<String> getRoles(String token){
        Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        return claims.get("roles", List.class);
    }
    // Lấy email từ token
    public String getEmail(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }
    
    // validate JWT token
    public boolean validateToken(String token){
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            System.out.println("Token không hợp lệ: " + ex.getMessage());
        }
        return false;
    }

// sử dụng cho việc forgot password

    public String generateResetToken(String email) {
        Date now = new Date();
        Date expiryDate = Date.from(Instant.now().plus(10, ChronoUnit.MINUTES)); // hết hạn sau 10 phút

        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "reset"); // xác định token này dành cho reset password
        claims.put("email", email);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    // Kiểm tra token có hợp lệ và là reset token không
    public boolean validateResetToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String type = claims.get("type", String.class);
            return "reset".equals(type);
        } catch (JwtException | IllegalArgumentException ex) {
            System.out.println("Reset token không hợp lệ: " + ex.getMessage());
            return false;
        }
    }
    public boolean isResetToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return "reset".equals(claims.get("type", String.class));
        } catch (Exception e) {
            return false;
        }
    }
}
