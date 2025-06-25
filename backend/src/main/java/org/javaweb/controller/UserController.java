package org.javaweb.controller;

import org.javaweb.entity.UserEntity;
import org.javaweb.model.dto.UserDTO;
import org.javaweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("user/")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal UserDetails user) {
        UserDTO userDTO = userService.getUserByEmail(user.getUsername());
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("user/")
    public ResponseEntity<?> updateUser(@Validated @AuthenticationPrincipal UserDetails user, @RequestBody UserDTO userDTO) {
        String email = user.getUsername();
        UserDTO updateUser = userService.updateUser(email, userDTO);
        return ResponseEntity.ok(updateUser);
    }
}

