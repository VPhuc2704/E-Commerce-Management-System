package org.javaweb.service;

import org.javaweb.entity.UserEntity;
import org.javaweb.model.request.AuthRequestDTO;
import org.springframework.http.ResponseEntity;

public interface AuthUserService {
    String login(AuthRequestDTO authRequestDTO) throws Exception;
    UserEntity createUser(AuthRequestDTO authRequestDTO);
    String verify(String token);
    void sendVerifyToEmail(String email);
    ResponseEntity<String> resetPassword(String restToken, String newPassword);

}
