package com.porcia.backend.security;

public record TokenResponseDto(
        String accessToken,
        String refreshToken
) {
}

