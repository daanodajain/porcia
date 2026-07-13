package com.porcia.backend.security;

import com.porcia.backend.common.api.ApiError;
import com.porcia.backend.exception.ErrorCodes;
import com.porcia.backend.persistence.auth.BlacklistTokenEntity;
import com.porcia.backend.persistence.auth.BlacklistTokenRepository;
import com.porcia.backend.persistence.auth.RefreshTokenEntity;
import com.porcia.backend.persistence.auth.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class AuthTokenService {

    private final JwtTokenService jwtTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistTokenRepository blacklistTokenRepository;
    private final JwtProperties jwtProperties;

    public AuthTokenService(
            JwtTokenService jwtTokenService,
            RefreshTokenRepository refreshTokenRepository,
            BlacklistTokenRepository blacklistTokenRepository,
            JwtProperties jwtProperties
    ) {
        this.jwtTokenService = jwtTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.blacklistTokenRepository = blacklistTokenRepository;
        this.jwtProperties = jwtProperties;
    }

    public TokenResponseDto login(String email, String password, String roleName) {
        // foundation-only: no credential verification (no business logic)
        String subject = subjectFrom(email);

        String accessToken = jwtTokenService.createAccessToken(subject);
        String refreshToken = jwtTokenService.createRefreshToken(subject);

        RefreshTokenEntity refreshEntity = new RefreshTokenEntity();
        refreshEntity.setSubject(subject);
        refreshEntity.setToken(refreshToken);
        refreshEntity.setExpiresAt(Instant.now().plusSeconds(jwtProperties.refreshTokenTtlSeconds()));
        refreshEntity.setRevoked(false);

        refreshTokenRepository.save(refreshEntity);

        return new TokenResponseDto(accessToken, refreshToken);
    }

    @Transactional
    public TokenResponseDto refresh(String refreshToken) {
        String tokenTrimmed = requireNonBlank(refreshToken, ErrorCodes.AUTH_INVALID_CREDENTIALS, "Refresh token required");

        if (blacklistTokenRepository.existsByToken(tokenTrimmed)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is blacklisted");
        }

        RefreshTokenEntity refreshEntity = refreshTokenRepository.findByTokenAndRevokedFalse(tokenTrimmed)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or revoked refresh token"));

        // Parse claims to ensure token is structurally valid and not expired (JWT-level)
        Claims claims;
        try {
            claims = jwtTokenService.parseClaims(tokenTrimmed);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        Date exp = claims.getExpiration();
        if (exp == null || jwtTokenService.isTokenExpired(exp)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        String subject = claims.getSubject();

        // Revoke old refresh token (foundation: single-use rotation)
        refreshEntity.setRevoked(true);
        refreshTokenRepository.save(refreshEntity);

        // Issue new tokens + new refresh token entity
        String accessToken = jwtTokenService.createAccessToken(subject);
        String newRefreshToken = jwtTokenService.createRefreshToken(subject);

        RefreshTokenEntity newRefreshEntity = new RefreshTokenEntity();
        newRefreshEntity.setSubject(subject);
        newRefreshEntity.setToken(newRefreshToken);
        newRefreshEntity.setExpiresAt(Instant.now().plusSeconds(jwtProperties.refreshTokenTtlSeconds()));
        newRefreshEntity.setRevoked(false);

        refreshTokenRepository.save(newRefreshEntity);

        return new TokenResponseDto(accessToken, newRefreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        String tokenTrimmed = requireNonBlank(refreshToken, ErrorCodes.AUTH_INVALID_CREDENTIALS, "Refresh token required");

        // Revoke refresh token if present
        refreshTokenRepository.findByTokenAndRevokedFalse(tokenTrimmed).ifPresent(entity -> {
            entity.setRevoked(true);
            refreshTokenRepository.save(entity);
        });

        // Blacklist refresh token (idempotent)
        if (!blacklistTokenRepository.existsByToken(tokenTrimmed)) {
            BlacklistTokenEntity blacklist = new BlacklistTokenEntity();
            blacklist.setToken(tokenTrimmed);
            blacklist.setExpiresAt(Instant.now().plusSeconds(jwtProperties.refreshTokenTtlSeconds()).atZone(ZoneId.systemDefault()).toLocalDateTime());
            blacklistTokenRepository.save(blacklist);
        }
    }

    private String subjectFrom(String email) {
        String e = requireNonBlank(email, ErrorCodes.AUTH_INVALID_CREDENTIALS, "Email required").toLowerCase();
        // subject is email in foundation
        return e;
    }

    private String requireNonBlank(String value, String errorCode, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value;
    }
}
