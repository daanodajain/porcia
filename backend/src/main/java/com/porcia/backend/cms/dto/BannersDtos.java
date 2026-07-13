package com.porcia.backend.cms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;

public final class BannersDtos {

    private BannersDtos() {
    }

    public record CreateBannerRequest(
            @Size(max = 255) String title,
            String subtitle,
            Long imageId,
            Long mobileImageId,
            @Size(max = 150) String buttonText,
            @Size(max = 255) String buttonLink,
            @Size(max = 100) String bannerPosition,
            Integer displayOrder,
            java.time.Instant startDate,
            java.time.Instant endDate,
            Boolean isActive
    ) {
    }

    public record UpdateBannerRequest(
            @Size(max = 255) String title,
            String subtitle,
            Long imageId,
            Long mobileImageId,
            @Size(max = 150) String buttonText,
            @Size(max = 255) String buttonLink,
            @Size(max = 100) String bannerPosition,
            Integer displayOrder,
            java.time.Instant startDate,
            java.time.Instant endDate,
            Boolean isActive
    ) {
    }

    public record BannerResponse(
            String id,
            String title,
            String subtitle,
            Long imageId,
            Long mobileImageId,
            String buttonText,
            String buttonLink,
            String bannerPosition,
            Integer displayOrder,
            java.time.Instant startDate,
            java.time.Instant endDate,
            Boolean isActive,
            @JsonProperty("image")
            String imageIdAlias,
            @JsonProperty("link")
            String buttonLinkAlias,
            @JsonProperty("isVisible")
            Boolean isActiveAlias
    ) {
        public BannerResponse(String id, String title, String subtitle, Long imageId, Long mobileImageId,
                             String buttonText, String buttonLink, String bannerPosition, Integer displayOrder,
                             java.time.Instant startDate, java.time.Instant endDate, Boolean isActive) {
            this(id, title, subtitle, imageId, mobileImageId, buttonText, buttonLink, bannerPosition,
                    displayOrder, startDate, endDate, isActive, String.valueOf(imageId), buttonLink, isActive);
        }
    }
}
