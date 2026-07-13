package com.porcia.backend.order.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.security.persistence.AdminUserEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/orders")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_ORDER_MANAGER"})
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderDtos.OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var orders = adminOrderService.getAllOrders(page, size);
        return ResponseEntity.ok(ApiResponse.ok(orders, "Orders fetched successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDtos.OrderResponse>> getOrderById(
            @PathVariable Long id
    ) {
        var order = adminOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order, "Order details fetched successfully."));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDtos.OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderDtos.UpdateOrderStatusRequest request,
            @AuthenticationPrincipal AdminUserEntity adminUser
    ) {
        var updatedOrder = adminOrderService.updateOrderStatus(id, request, adminUser);
        return ResponseEntity.ok(ApiResponse.ok(updatedOrder, "Order status updated successfully."));
    }
}