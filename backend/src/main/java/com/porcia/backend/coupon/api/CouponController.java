package com.porcia.backend.coupon.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiVersion.V1 + "/cart/coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<CouponDtos.ApplyCouponResponse>> apply(
            @AuthenticationPrincipal CustomerEntity customer,
            @Valid @RequestBody CouponDtos.ApplyCouponRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.applyCoupon(customer, req.code()), "Coupon applied."));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<Void>> remove(@AuthenticationPrincipal CustomerEntity customer) {
        couponService.removeCoupon(customer);
        return ResponseEntity.ok(ApiResponse.ok(null, "Coupon removed."));
    }
}
