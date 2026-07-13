package com.porcia.backend.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class SectionsDtos {

    private SectionsDtos() {
    }

    public record CreateSectionRequest(
            @NotNull Long pageId,
            @NotBlank @Size(max = 100) String sectionKey,
            @Size(max = 255) String title,
            String subtitle,
            String description,
            @Size(max = 150) String buttonText,
            @Size(max = 255) String buttonLink,
            String backgroundImage,
            String backgroundVideo,
            String jsonData,
            Integer displayOrder,
            Boolean isVisible
    ) {
    }

    public record UpdateSectionRequest(
            @NotNull Long pageId,
            @NotBlank @Size(max = 100) String sectionKey,
            @Size(max = 255) String title,
            String subtitle,
            String description,
            @Size(max = 150) String buttonText,
            @Size(max = 255) String buttonLink,
            String backgroundImage,
            String backgroundVideo,
            String jsonData,
            Integer displayOrder,
            Boolean isVisible
    ) {
    }

    public record SectionResponse(
            String id,
            Long pageId,
            String sectionKey,
            String title,
            String subtitle,
            String description,
            String buttonText,
            String buttonLink,
            String backgroundImage,
            String backgroundVideo,
            String jsonData,
            Integer displayOrder,
            Boolean isVisible
    ) {
    }
}

