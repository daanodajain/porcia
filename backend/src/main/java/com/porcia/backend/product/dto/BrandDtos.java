package com.porcia.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class BrandDtos {

    private BrandDtos() {
    }

    public record CreateBrandRequest(
            @NotBlank @Size(max = 150) String name,
            @NotBlank @Size(max = 180) String slug,
            String description,
            String logo
    ) {
    }

    public record UpdateBrandRequest(
            @NotBlank @Size(max = 150) String name,
            @NotBlank @Size(max = 180) String slug,
            String description,
            String logo
    ) {
    }

    public record BrandResponse(
            String id, String name, String slug, String description, String logo, Boolean isActive
    ) {
    }
}