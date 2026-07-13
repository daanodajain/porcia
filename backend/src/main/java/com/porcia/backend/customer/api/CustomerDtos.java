package com.porcia.backend.customer.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public final class CustomerDtos {
    private CustomerDtos() {}

    public record UpdateProfileRequest(
            String firstName,
            String lastName,
            String phone,
            String newPassword
    ) {}

    public record ProfileResponse(
            Long id,
            String firstName,
            String lastName,
            String email,
            String phone
    ) {}

    public record AddressResponse(
            Long id,
            String fullName,
            String phone,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String postalCode,
            String country,
            Boolean isDefault,
            String addressType
    ) {}

    public record CreateAddressRequest(
            String fullName,
            String phone,
            @NotBlank String addressLine1,
            String addressLine2,
            @NotBlank String city,
            String state,
            String postalCode,
            @NotBlank String country,
            Boolean isDefault,
            String addressType
    ) {}
}
