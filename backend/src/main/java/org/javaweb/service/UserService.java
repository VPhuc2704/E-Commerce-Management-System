package org.javaweb.service;

import org.javaweb.model.dto.UserDTO;

public interface UserService {
    UserDTO getUserByEmail(String email);
    UserDTO updateUser(String email, UserDTO userDTO);
}
