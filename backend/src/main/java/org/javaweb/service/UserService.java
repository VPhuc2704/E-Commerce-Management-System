package org.javaweb.service;

import org.javaweb.constant.ApiResponse;
import org.javaweb.model.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {
    UserDTO getUserByEmail(String email);
    UserDTO updateUser(String email, UserDTO userDTO);
    List<UserDTO> getAllUsers();
}
