package org.javaweb.repository;

import org.javaweb.enums.RoleCode;
import org.javaweb.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity,Long> {
    Optional<RoleEntity> findByCode(RoleCode name);
}
