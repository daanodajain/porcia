package com.porcia.backend.review.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class ReviewDtos {
    private ReviewDtos() {}

    public record CreateReviewRequest(
            @NotNull Long productId,
            @NotNull @Min(1) @Max(5) Integer rating,
            String comment
    ) {}

    public record ReviewResponse(
            Long id, Long productId, String customerName,
            Integer rating, String comment, String status, LocalDateTime createdAt
    ) {}
}
