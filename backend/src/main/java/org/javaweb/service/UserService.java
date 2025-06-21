package org.javaweb.service;

import org.javaweb.constant.ApiResponse;
import org.javaweb.model.dto.UserDTO;
import org.springframework.security.core.Authentication;

public interface UserService {
    UserDTO getUserByEmail(String email);
    UserDTO updateUser(String email, UserDTO userDTO);
}
