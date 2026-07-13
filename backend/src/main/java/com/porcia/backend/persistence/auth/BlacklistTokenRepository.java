package com.porcia.backend.persistence.auth;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistTokenRepository extends JpaRepository<BlacklistTokenEntity, Long> {
    boolean existsByToken(String token);
}
