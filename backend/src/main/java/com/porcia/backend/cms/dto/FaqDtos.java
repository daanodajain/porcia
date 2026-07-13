package com.porcia.backend.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class FaqDtos {

    private FaqDtos() {
    }

    public record CreateFaqRequest(
            @NotNull Long categoryId,
            @NotBlank String question,
            @NotBlank String answer,
            Integer displayOrder,
            Boolean isActive
    ) {
    }

    public record UpdateFaqRequest(
            @NotNull Long categoryId,
            @NotBlank String question,
            @NotBlank String answer,
            Integer displayOrder,
            Boolean isActive
    ) {
    }

    public record FaqResponse(
            String id,
            Long categoryId,
            String question,
            String answer,
            Integer displayOrder,
            Boolean isActive
    ) {
    }
}

