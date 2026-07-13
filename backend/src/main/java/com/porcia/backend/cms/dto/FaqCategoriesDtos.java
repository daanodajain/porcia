package com.porcia.backend.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class FaqCategoriesDtos {

    private FaqCategoriesDtos() {
    }

    public record CreateFaqCategoryRequest(
            @NotBlank @Size(max = 150) String name,
            Integer displayOrder,
            Boolean isActive
    ) {
    }

    public record UpdateFaqCategoryRequest(
            @NotBlank @Size(max = 150) String name,
            Integer displayOrder,
            Boolean isActive
    ) {
    }

    public record FaqCategoryResponse(
            String id,
            String name,
            Integer displayOrder,
            Boolean isActive
    ) {
    }
}

