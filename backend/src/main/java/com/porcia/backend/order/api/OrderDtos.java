package com.porcia.backend.order.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.porcia.backend.customer.api.CustomerDtos;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class OrderDtos {
    private OrderDtos() {}

    public record CreateOrderRequest(
            @NotNull Long shippingAddressId,
            Long billingAddressId,
            @NotBlank String paymentMethod,
            String customerNote
    ) {}

    public record UpdateOrderStatusRequest(
            @NotBlank String status,
            String remarks
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record OrderItemResponse(
            Long id,
            Long productId,
            String productName,
            String sku,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record OrderResponse(
            Long id,
            String orderNumber,
            String orderStatus,
            String paymentStatus,
            String paymentMethod,
            BigDecimal subtotal,
            BigDecimal shippingCharge,
            BigDecimal discountAmount,
            BigDecimal grandTotal,
            LocalDateTime createdAt,
            CustomerDtos.AddressResponse shippingAddress,
            CustomerDtos.AddressResponse billingAddress,
            List<OrderItemResponse> items
    ) {}

    public record CancelOrderResponse(
            String orderNumber,
            String orderStatus,
            String paymentStatus,
            String message
    ) {}
}