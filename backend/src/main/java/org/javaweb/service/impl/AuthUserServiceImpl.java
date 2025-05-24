package org.javaweb.service.impl;

import org.javaweb.enums.roleCode;
import org.javaweb.converter.UserConverter;
import org.javaweb.entity.RoleEntity;
import org.javaweb.entity.UserEntity;
import org.javaweb.model.request.AuthRequestDTO;
import org.javaweb.repository.RoleRepository;
import org.javaweb.repository.UserRepository;
import org.javaweb.security.utils.JwtTokenProvider;
import org.javaweb.service.AuthUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.zip.DataFormatException;


@Service
public class AuthUserServiceImpl implements AuthUserService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserConverter userConverter;

    @Override
    public String login(AuthRequestDTO authRequestDTO) throws Exception {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(authRequestDTO.getEmail());
        if (!optionalUser.isPresent()) {
            throw new DataFormatException("Invalid phone email / password");
        }
        UserEntity existingUser = optionalUser.get();
        if(!passwordEncoder.matches(authRequestDTO.getPassword(), existingUser.getPassword())){
            throw new BadCredentialsException("Invalid phone email / password");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                authRequestDTO.getEmail(),
                authRequestDTO.getPassword(),
                existingUser.getAuthorities()
        );

        //authenticate with Java Spring security
        authenticationManager.authenticate(authenticationToken);

        return jwtTokenProvider.generateToken(existingUser);
    }

    @Override
    public UserEntity createUser(AuthRequestDTO authRequestDTO) {
        String email = authRequestDTO.getEmail();
        if (userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email already exists");
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(email);
        userEntity.setPassword(passwordEncoder.encode(authRequestDTO.getPassword()));

        RoleEntity userRole = roleRepository.findByCode(roleCode.USER)
                .orElseThrow(()-> new DataIntegrityViolationException("Role not exists"));
        userEntity.setRoles(Collections.singletonList(userRole));
        return userRepository.save(userEntity);
    }
}
