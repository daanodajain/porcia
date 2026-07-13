package com.porcia.backend.security.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CustomerAuthDtos {
    private CustomerAuthDtos() {}

    public record CustomerRegistrationRequest(
            @NotBlank String firstName,
            String lastName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8) String password,
            @NotBlank String phone
    ) {}

    public record CustomerLoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record CustomerAuthResponse(String accessToken) {}
}