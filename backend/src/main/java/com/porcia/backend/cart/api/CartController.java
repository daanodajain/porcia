package com.porcia.backend.cart.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiVersion.V1 + "/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDtos.CartResponse>> getCart(@AuthenticationPrincipal CustomerEntity customer) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(customer), "Cart fetched successfully."));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDtos.CartResponse>> addItemToCart(
            @AuthenticationPrincipal CustomerEntity customer,
            @RequestBody @Valid CartDtos.AddItemRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.addItem(customer, request), "Item added to cart."));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDtos.CartResponse>> updateCartItem(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable Long itemId,
            @RequestBody @Valid CartDtos.UpdateItemRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.updateItem(customer, itemId, request), "Cart item updated."));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDtos.CartResponse>> removeItemFromCart(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.removeItem(customer, itemId), "Item removed from cart."));
    }
}