package org.javaweb.service;

import org.javaweb.entity.UserEntity;
import org.javaweb.model.request.AuthRequestDTO;

public interface AuthUserService {
    String login(AuthRequestDTO authRequestDTO) throws Exception;
    UserEntity createUser(AuthRequestDTO authRequestDTO);
    String verify(String token);
}
