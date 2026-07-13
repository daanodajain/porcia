package com.porcia.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CategoryDtos {

    private CategoryDtos() {
    }

    public record CreateCategoryRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            String description
    ) {
    }

    public record UpdateCategoryRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            String description
    ) {
    }

    public record CategoryResponse(
            String id, String name, String slug, String description, String image, Boolean isActive
    ) {
    }
}