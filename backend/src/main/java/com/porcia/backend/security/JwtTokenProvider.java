package com.porcia.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final JwtProperties properties;
    private final SecretKey key;

    public JwtTokenProvider(JwtProperties properties) {
        this.properties = properties;

        // Ensure key is strong enough for HMAC-SHA (min 256 bits = 32 bytes).
        // If secret is too short/missing (common in local env), do NOT fail startup.
        // Instead generate a strong ephemeral key so public endpoints work.
        String secret = properties.secret();
        byte[] secretBytes = secret == null ? new byte[0] : secret.getBytes(StandardCharsets.UTF_8);

        if (secretBytes.length >= 32) {
            this.key = Keys.hmacShaKeyFor(secretBytes);
        } else {
            SecretKey ephemeral = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
            this.key = ephemeral;

            System.err.println(
                    "[JwtTokenProvider] JWT_SECRET is missing/too short (" +
                            secretBytes.length +
                            " bytes). Using ephemeral runtime key for dev/local so the app can start."
            );
        }
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails, properties.accessTokenTtlSeconds());
    }

    public long getRefreshTtlSeconds() {
        return properties.refreshTokenTtlSeconds();
    }

    public String generateToken(UserDetails userDetails, long ttlSeconds) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlSeconds * 1000))
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration() != null && claims.getExpiration().after(new java.util.Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getSubject(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

