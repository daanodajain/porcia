package com.porcia.backend.shipment.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/orders/{orderId}/shipments")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShipmentDtos.ShipmentResponse>>> getShipments(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(
                shipmentService.getShipmentsForOrder(orderId), "Shipments fetched."));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ShipmentDtos.ShipmentResponse>> createShipment(
            @PathVariable Long orderId,
            @Valid @RequestBody ShipmentDtos.CreateShipmentRequest request) {
        return new ResponseEntity<>(ApiResponse.ok(
                shipmentService.createShipment(orderId, request), "Shipment created."), HttpStatus.CREATED);
    }

    @PatchMapping("/{shipmentId}/status")
    public ResponseEntity<ApiResponse<ShipmentDtos.ShipmentResponse>> updateStatus(
            @PathVariable Long orderId,
            @PathVariable Long shipmentId,
            @Valid @RequestBody ShipmentDtos.UpdateShipmentStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                shipmentService.updateStatus(shipmentId, request), "Shipment status updated."));
    }
}
