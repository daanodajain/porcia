package com.porcia.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CollectionDtos {

    private CollectionDtos() {
    }

    public record CreateCollectionRequest(
            @NotBlank @Size(max = 150) String name,
            @NotBlank @Size(max = 180) String slug,
            String description
    ) {
    }

    public record UpdateCollectionRequest(
            @NotBlank @Size(max = 150) String name,
            @NotBlank @Size(max = 180) String slug,
            String description
    ) {
    }

    public record CollectionResponse(
            String id, String name, String slug, String description, String image, Boolean isActive
    ) {
    }
}