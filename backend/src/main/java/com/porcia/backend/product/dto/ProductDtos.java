package com.porcia.backend.product.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class ProductDtos {

    private ProductDtos() {
    }

    /** Single image URL sent from frontend */
    public record ImageUrlRequest(
            String url,
            String altText,
            String type,        // "PRIMARY", "GALLERY"
            Integer displayOrder
    ) {}

    /** Image URL returned in response */
    public record ImageUrlResponse(
            String url,
            String altText,
            String type,
            Integer displayOrder
    ) {}

    public record CreateProductRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            @NotBlank @Size(max = 100) String sku,
            @NotNull Long categoryId,
            @NotNull Long brandId,
            Long collectionId,
            String description,
            @NotNull @DecimalMin("0.0") BigDecimal mrp,
            @NotNull @DecimalMin("0.0") BigDecimal sellingPrice,
            Integer stockQuantity,
            @NotNull Boolean isActive,
            String status,
            List<ImageUrlRequest> images   // WordPress image URLs
    ) {
    }

    public record UpdateProductRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            @NotBlank @Size(max = 100) String sku,
            @NotNull Long categoryId,
            @NotNull Long brandId,
            Long collectionId,
            String description,
            @NotNull @DecimalMin("0.0") BigDecimal mrp,
            @NotNull @DecimalMin("0.0") BigDecimal sellingPrice,
            Integer stockQuantity,
            @NotNull Boolean isActive,
            String status,
            List<ImageUrlRequest> images   // WordPress image URLs
    ) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ProductResponse(
            String id,
            String name,
            String slug,
            String sku,
            String description,
            BigDecimal mrp,
            BigDecimal sellingPrice,
            Integer stockQuantity,
            Boolean isActive,
            String status,
            LocalDateTime publishedAt,
            CategoryDtos.CategoryResponse category,
            BrandDtos.BrandResponse brand,
            CollectionDtos.CollectionResponse collection,
            List<ImageUrlResponse> images  // all image URLs
    ) {
    }
}
