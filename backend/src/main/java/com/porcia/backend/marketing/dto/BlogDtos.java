package com.porcia.backend.marketing.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public final class BlogDtos {
    private BlogDtos() {}

    public record BlogResponse(
            Long id,
            String title,
            String slug,
            String shortDescription,
            String content,
            String featuredImage,
            String status,
            String categoryName,
            LocalDateTime publishedAt,
            LocalDateTime createdAt
    ) {}

    public record BlogListResponse(
            Long id,
            String title,
            String slug,
            String shortDescription,
            String featuredImage,
            String status,
            String categoryName,
            LocalDateTime publishedAt
    ) {}

    public record CreateBlogRequest(
            @NotBlank String title,
            @NotBlank String slug,
            String excerpt,
            @NotBlank String content,
            String coverImage,
            Long categoryId,
            String status
    ) {}

    public record UpdateBlogRequest(
            String title,
            String slug,
            String excerpt,
            String content,
            String coverImage,
            Long categoryId,
            String status
    ) {}
}
