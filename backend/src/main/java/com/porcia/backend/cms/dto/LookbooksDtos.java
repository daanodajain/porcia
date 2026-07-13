package com.porcia.backend.cms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class LookbooksDtos {

    private LookbooksDtos() {
    }

    public record CreateLookbookRequest(
            @Size(max = 255) String title,
            @NotBlank @Size(max = 255) String slug,
            String description,
            String coverImage,
            String season,
            Integer year,
            String status,
            Integer displayOrder,
            Boolean isActive
    ) {
    }

    public record UpdateLookbookRequest(
            @Size(max = 255) String title,
            @NotBlank @Size(max = 255) String slug,
            String description,
            String coverImage,
            String season,
            Integer year,
            String status,
            Integer displayOrder,
            Boolean isActive
    ) {
    }

    public record LookbookResponse(
            String id,
            String title,
            String slug,
            String description,
            String coverImage,
            String season,
            Integer year,
            String status,
            Integer displayOrder,
            Boolean isActive,
            @JsonProperty("image")
            String coverImageAlias,
            @JsonProperty("isVisible")
            Boolean isActiveAlias
    ) {
        public LookbookResponse(String id, String title, String slug, String description, String coverImage,
                               String season, Integer year, String status) {
            this(id, title, slug, description, coverImage, season, year, status, 0, true, coverImage, true);
        }

        public LookbookResponse(String id, String title, String slug, String description, String coverImage,
                               String season, Integer year, String status, Integer displayOrder, Boolean isActive) {
            this(id, title, slug, description, coverImage, season, year, status, displayOrder, isActive,
                    coverImage, isActive);
        }
    }
}
