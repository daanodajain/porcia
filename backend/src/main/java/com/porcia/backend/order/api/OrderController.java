package com.porcia.backend.order.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiVersion.V1 + "/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDtos.OrderResponse>> createOrder(
            @AuthenticationPrincipal CustomerEntity customer,
            @Valid @RequestBody OrderDtos.CreateOrderRequest request
    ) {
        OrderDtos.OrderResponse order = orderService.createOrder(customer, request);
        return new ResponseEntity<>(ApiResponse.ok(order, "Order created successfully."), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderDtos.OrderResponse>>> getOrderHistory(
            @AuthenticationPrincipal CustomerEntity customer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderHistory(customer, page, size), "Order history fetched successfully."));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDtos.OrderResponse>> getOrderDetails(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable String orderNumber
    ) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByOrderNumber(customer, orderNumber), "Order details fetched successfully."));
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<ApiResponse<OrderDtos.CancelOrderResponse>> cancelOrder(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable String orderNumber
    ) {
        OrderDtos.CancelOrderResponse response = orderService.cancelOrder(customer, orderNumber);
        return ResponseEntity.ok(ApiResponse.ok(response, "Order cancelled successfully."));
    }
}