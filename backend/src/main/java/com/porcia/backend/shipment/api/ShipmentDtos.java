package com.porcia.backend.shipment.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public final class ShipmentDtos {
    private ShipmentDtos() {}

    public record ShipmentResponse(
            Long id,
            String orderNumber,
            String courierName,
            String trackingNumber,
            String shippingStatus,
            LocalDateTime shippedAt,
            LocalDateTime deliveredAt
    ) {}

    public record CreateShipmentRequest(
            @NotBlank String courierName,
            @NotBlank String trackingNumber
    ) {}

    public record UpdateShipmentStatusRequest(
            @NotBlank String status
    ) {}
}
