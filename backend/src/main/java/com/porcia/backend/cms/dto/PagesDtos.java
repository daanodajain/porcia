package com.porcia.backend.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class PagesDtos {

    private PagesDtos() {
    }

    public record CreatePageRequest(
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 200) String slug,
            @Size(max = 255) String metaTitle,
            String metaDescription,
            String metaKeywords,
            String content,
            @NotBlank @Size(max = 50) String pageType,
            Boolean isHomepage,
            String status,
            Integer displayOrder,
            Boolean isActive,
            Boolean isDeleted
    ) {
    }

    public record UpdatePageRequest(
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 200) String slug,
            @Size(max = 255) String metaTitle,
            String metaDescription,
            String metaKeywords,
            String content,
            @NotBlank @Size(max = 50) String pageType,
            Boolean isHomepage,
            String status,
            Integer displayOrder,
            Boolean isActive,
            Boolean isDeleted
    ) {
    }

    public record PageResponse(
            String id,
            String title,
            String slug,
            String metaTitle,
            String metaDescription,
            String metaKeywords,
            String content,
            String pageType,
            Boolean isHomepage,
            String status,
            Integer displayOrder,
            Boolean isActive,
            Boolean isDeleted
    ) {
    }
}

