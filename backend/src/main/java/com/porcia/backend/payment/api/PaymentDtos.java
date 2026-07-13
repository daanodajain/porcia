package com.porcia.backend.payment.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public final class PaymentDtos {
    private PaymentDtos() {}

    public record InitiatePaymentRequest(
            @NotBlank String paymentMethod,
            String gatewayOrderId  // razorpay_order_id from frontend
    ) {}

    public record PaymentResponse(
            String orderNumber,
            String paymentStatus,
            BigDecimal amount,
            String razorpayKeyId,
            String gatewayOrderId
    ) {}

    public record RazorpayWebhookRequest(
            String razorpay_order_id,
            String razorpay_payment_id,
            String razorpay_signature
    ) {}

    public record AdminPaymentResponse(
            Long id, String orderNumber, String paymentGateway,
            String transactionId, BigDecimal amount, String currency,
            String paymentStatus, LocalDateTime paidAt, LocalDateTime createdAt
    ) {}
}
