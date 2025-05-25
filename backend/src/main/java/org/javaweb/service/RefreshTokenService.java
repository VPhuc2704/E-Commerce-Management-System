package org.javaweb.service;


import org.javaweb.entity.RefreshTokenEntity;

import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshTokenEntity> findByRefreshtoken(String refreshtoken);
    RefreshTokenEntity createRefreshtoken(Long userId);
    RefreshTokenEntity verifyExpiration(RefreshTokenEntity refreshToken);
}
