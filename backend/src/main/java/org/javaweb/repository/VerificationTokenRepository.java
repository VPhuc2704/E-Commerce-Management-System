package org.javaweb.repository;

import org.javaweb.entity.VerificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationEntity, Long>{
    Optional<VerificationEntity> findByVerificationtoken(String token);
}
