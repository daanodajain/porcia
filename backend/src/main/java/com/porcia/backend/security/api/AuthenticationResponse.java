package com.porcia.backend.security.api;

public record AuthenticationResponse(String accessToken, String refreshToken) {
}
