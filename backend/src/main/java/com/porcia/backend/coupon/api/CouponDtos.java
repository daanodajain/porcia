package com.porcia.backend.coupon.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class CouponDtos {
    private CouponDtos() {}

    public record CreateCouponRequest(
            @NotBlank String code,
            @NotNull String discountType,
            @NotNull @DecimalMin("0.01") BigDecimal discountValue,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscountAmount,
            Integer usageLimit,
            LocalDateTime expiresAt,
            String description
    ) {}

    public record UpdateCouponRequest(
            String discountType,
            BigDecimal discountValue,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscountAmount,
            Integer usageLimit,
            LocalDateTime expiresAt,
            String description,
            Boolean isActive
    ) {}

    public record CouponResponse(
            Long id, String code, String discountType, BigDecimal discountValue,
            BigDecimal minOrderAmount, BigDecimal maxDiscountAmount,
            Integer usageLimit, Integer usedCount, LocalDateTime expiresAt,
            String description, Boolean isActive
    ) {}

    public record ApplyCouponRequest(@NotBlank String code) {}

    public record ApplyCouponResponse(
            String code, String discountType, BigDecimal discountValue,
            BigDecimal discountAmount, BigDecimal newGrandTotal
    ) {}
}
