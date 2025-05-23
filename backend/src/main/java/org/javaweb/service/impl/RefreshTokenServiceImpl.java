package org.javaweb.service.impl;

import org.javaweb.entity.RefreshTokenEntity;
import org.javaweb.exceptions.RefreshTokenExceptions;
import org.javaweb.repository.RefreshTokenRepository;
import org.javaweb.repository.UserRepository;
import org.javaweb.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    @Value(value = "${app.jwt-Refresh-ExpirationMs}")
    private Long jwtRefreshExpirationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private UserRepository userRepository;


    @Override
    public Optional<RefreshTokenEntity> findByRefreshtoken(String refreshToken) {
        return refreshTokenRepository.findByRefreshtoken(refreshToken);
    }


    @Override
    public RefreshTokenEntity createRefreshtoken(Long userId) {
        RefreshTokenEntity refreshToken = new RefreshTokenEntity();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtRefreshExpirationMs));
        refreshToken.setRefreshtoken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    @Override
    public RefreshTokenEntity verifyExpiration(RefreshTokenEntity refreshToken) {
       if (refreshToken.getExpiryDate().compareTo(Instant.now()) < 0){
          refreshTokenRepository.delete(refreshToken);
           throw new RefreshTokenExceptions(refreshToken.getRefreshtoken(), "Refresh token was expired. Please make a new signin request");
       }
       return refreshToken;
    }
}
