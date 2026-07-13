package com.porcia.backend.cms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class BlogsDtos {

    private BlogsDtos() {
    }

    public record CreateBlogRequest(
            Long categoryId,
            Long authorId,
            @NotBlank @Size(max = 255) String title,
            @NotBlank @Size(max = 255) String slug,
            String shortDescription,
            String content,
            String featuredImage,
            String bannerImage,
            String metaTitle,
            String metaDescription,
            String metaKeywords,
            Long totalViews,
            Boolean isFeatured,
            String status,
            java.time.Instant publishedAt
    ) {
    }

    public record UpdateBlogRequest(
            Long categoryId,
            Long authorId,
            @NotBlank @Size(max = 255) String title,
            @NotBlank @Size(max = 255) String slug,
            String shortDescription,
            String content,
            String featuredImage,
            String bannerImage,
            String metaTitle,
            String metaDescription,
            String metaKeywords,
            Long totalViews,
            Boolean isFeatured,
            String status,
            java.time.Instant publishedAt
    ) {
    }

    public record BlogResponse(
            String id,
            Long categoryId,
            Long authorId,
            String title,
            String slug,
            String shortDescription,
            String content,
            String featuredImage,
            String bannerImage,
            String metaTitle,
            String metaDescription,
            String metaKeywords,
            Long totalViews,
            Boolean isFeatured,
            String status,
            java.time.Instant publishedAt,
            String authorName,
            java.time.Instant createdAt,
            @JsonProperty("excerpt")
            String shortDescriptionAlias,
            @JsonProperty("image")
            String featuredImageAlias,
            @JsonProperty("author")
            String authorNameAlias,
            @JsonProperty("isPublished")
            Boolean isPublishedAlias,
            @JsonProperty("createdAt")
            java.time.Instant createdAtAlias
    ) {
        public BlogResponse(String id, Long categoryId, Long authorId, String title, String slug,
                           String shortDescription, String content, String featuredImage, String bannerImage,
                           String metaTitle, String metaDescription, String metaKeywords, Long totalViews,
                           Boolean isFeatured, String status, java.time.Instant publishedAt) {
            this(id, categoryId, authorId, title, slug, shortDescription, content, featuredImage, bannerImage,
                    metaTitle, metaDescription, metaKeywords, totalViews, isFeatured, status, publishedAt,
                    "", publishedAt, shortDescription, featuredImage, "", "PUBLISHED".equals(status), publishedAt);
        }

        public BlogResponse(String id, Long categoryId, Long authorId, String title, String slug,
                           String shortDescription, String content, String featuredImage, String bannerImage,
                           String metaTitle, String metaDescription, String metaKeywords, Long totalViews,
                           Boolean isFeatured, String status, java.time.Instant publishedAt, String authorName,
                           java.time.Instant createdAt) {
            this(id, categoryId, authorId, title, slug, shortDescription, content, featuredImage, bannerImage,
                    metaTitle, metaDescription, metaKeywords, totalViews, isFeatured, status, publishedAt,
                    authorName, createdAt, shortDescription, featuredImage, authorName, "PUBLISHED".equals(status), createdAt);
        }
    }
}
