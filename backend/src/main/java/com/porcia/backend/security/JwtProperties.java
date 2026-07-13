package com.porcia.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.jwt")
public record JwtProperties(
        String issuer,
        String secret,
        long accessTokenTtlSeconds,
        long refreshTokenTtlSeconds
) {
}

