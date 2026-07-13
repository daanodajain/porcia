package com.porcia.backend.product.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class ProductDtos {

    private ProductDtos() {
    }

    public record CreateProductRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            @NotBlank @Size(max = 100) String sku,
            @NotNull Long categoryId,
            @NotNull Long brandId,
            Long collectionId,
            String description, // short_description
            @NotNull @DecimalMin("0.0") BigDecimal mrp,
            @NotNull @DecimalMin("0.0") BigDecimal sellingPrice,
            Integer stockQuantity,
            @NotNull Boolean isActive,
            String status
    ) {
    }

    public record UpdateProductRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            @NotBlank @Size(max = 100) String sku,
            @NotNull Long categoryId,
            @NotNull Long brandId,
            Long collectionId,
            String description, // short_description
            @NotNull @DecimalMin("0.0") BigDecimal mrp,
            @NotNull @DecimalMin("0.0") BigDecimal sellingPrice,
            Integer stockQuantity,
            @NotNull Boolean isActive,
            String status
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
            CollectionDtos.CollectionResponse collection
    ) {
    }
}