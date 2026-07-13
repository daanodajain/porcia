package com.porcia.backend.cart.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public final class CartDtos {
    private CartDtos() {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CartItemResponse(
            Long id,
            Long productId,
            String productName,
            String productSku,
            String productSlug,
            String imageUrl,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CartResponse(
            Long id,
            List<CartItemResponse> items,
            BigDecimal subtotal,
            BigDecimal shippingCharge,
            BigDecimal discountAmount,
            BigDecimal grandTotal,
            String couponCode
    ) {}

    public record AddItemRequest(
            @NotNull Long productId,
            Long variantId,
            @NotNull @Min(1) Integer quantity
    ) {}

    public record UpdateItemRequest(
            @NotNull @Min(1) Integer quantity
    ) {}
}