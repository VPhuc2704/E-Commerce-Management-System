package org.javaweb.controller;

import org.javaweb.entity.RefreshTokenEntity;
import org.javaweb.entity.UserEntity;
import org.javaweb.exceptions.RefreshTokenExceptions;
import org.javaweb.model.dto.ErrorDTO;
import org.javaweb.model.dto.UserDTO;
import org.javaweb.model.request.AuthRequestDTO;
import org.javaweb.model.request.RefreshTokenRequestDTO;
import org.javaweb.model.response.AuthResponseDTO;
import org.javaweb.repository.UserRepository;
import org.javaweb.security.utils.JwtTokenProvider;
import org.javaweb.service.AuthUserService;
import org.javaweb.service.RefreshTokenService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthUserService authUserService;
    @Autowired
    private ModelMapper modelMapper;
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
    public ResponseEntity<?> createUser(@Validated @RequestBody AuthRequestDTO authRequestDTO){
        UserEntity userEntity = authUserService.createUser(authRequestDTO);
        return  ResponseEntity.ok("Đăng ký thành công, hãy kiểm tra email để xác thực.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam("token") String token) {
        String result = authUserService.verify(token);
        return ResponseEntity.ok(result);
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
}
