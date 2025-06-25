package org.javaweb.controller;

import org.javaweb.entity.RefreshTokenEntity;
import org.javaweb.entity.UserEntity;
import org.javaweb.exceptions.RefreshTokenExceptions;
import org.javaweb.model.dto.ErrorDTO;
import org.javaweb.model.dto.UserDTO;
import org.javaweb.model.request.AuthRequestDTO;
import org.javaweb.model.request.RefreshTokenRequestDTO;
import org.javaweb.model.request.ResetPasswordDTO;
import org.javaweb.model.response.AuthResponseDTO;
import org.javaweb.repository.UserRepository;
import org.javaweb.security.JwtAuthenticationFilter;
import org.javaweb.security.utils.JwtTokenProvider;
import org.javaweb.service.AuthUserService;
import org.javaweb.service.RefreshTokenService;
import org.javaweb.utils.TokenUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthUserService authUserService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody AuthRequestDTO authRequestDTO) throws Exception {
        String token = authUserService.login(authRequestDTO);
        AuthResponseDTO authResponseDTO = new AuthResponseDTO();
        authResponseDTO.setAccessToken(token);
        authResponseDTO.setTokenType("Bearer");
        Optional<UserEntity> optionalUser = userRepository.findByEmail(authRequestDTO.getEmail());
        RefreshTokenEntity refreshToken = refreshTokenService.createRefreshtoken(optionalUser.get().getId());
        authResponseDTO.setRefreshToken(refreshToken.getRefreshtoken());
        return new ResponseEntity<>(authResponseDTO, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> createUser(@Validated @RequestBody AuthRequestDTO authRequestDTO){
        authUserService.createUser(authRequestDTO);
        Map<String, String> response =  new HashMap<>();
        response.put("status", "success");
        response.put("message", "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
        return  ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestParam("token") String token) {
        ResponseEntity<Map<String, String>> response =  authUserService.verify(token);
        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@Validated @RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {
        String requestRefreshToken = refreshTokenRequestDTO.getRefreshToken();

        return refreshTokenService.findByRefreshtoken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshTokenEntity::getUser)
                .map(user -> {
                    String accessToken = jwtTokenProvider.generateToken(user);
                    return ResponseEntity.ok(new AuthResponseDTO(accessToken,"Bear",  requestRefreshToken));
                })
                .orElseThrow(() -> new RefreshTokenExceptions(requestRefreshToken,
                        "Refresh token is not in database!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody AuthRequestDTO authRequestDTO) {
        authUserService.sendVerifyToEmail(authRequestDTO.getEmail());
        return ResponseEntity.ok("OTP đã được gửi đến email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestHeader("Authorization") String bearerToken,
                                           @RequestBody ResetPasswordDTO resetPasswordDTO) {
        String token = bearerToken.replace("Bearer ", "");

        if (!resetPasswordDTO.getNewPassword().equals(resetPasswordDTO.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu và xác nhận mật khẩu không khớp.");
        }

        authUserService.resetPassword(token, resetPasswordDTO.getNewPassword());

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Validated
                                        HttpServletRequest request,
                                        @RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {
        String accessToken = TokenUtils.getTokenFromRequest(request);
        String requestRefreshToken = refreshTokenRequestDTO.getRefreshToken();
        authUserService.logout(accessToken, requestRefreshToken);
        return ResponseEntity.ok("Đăng Xuất thành công");
    }

}
