package com.porcia.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security")
public record SecurityProperties(
        Auth auth
) {

    public record Auth(
            String publicApiPattern
    ) {

        public Auth {
            if (publicApiPattern == null || publicApiPattern.isBlank()) {
                publicApiPattern = "/api/v1/auth/**";
            }
        }
    }
}

