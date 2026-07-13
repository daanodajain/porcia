package com.porcia.backend.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class HomeSectionsDtos {

    private HomeSectionsDtos() {
    }

    public record CreateHomeSectionRequest(
            @NotBlank @Size(max = 100) String sectionKey,
            @Size(max = 255) String title,
            String subtitle,
            Integer displayOrder,
            Boolean isVisible
    ) {
    }

    public record UpdateHomeSectionRequest(
            @NotBlank @Size(max = 100) String sectionKey,
            @Size(max = 255) String title,
            String subtitle,
            Integer displayOrder,
            Boolean isVisible
    ) {
    }

    public record HomeSectionResponse(
            String id,
            String sectionKey,
            String title,
            String subtitle,
            Integer displayOrder,
            Boolean isVisible
    ) {
    }
}

