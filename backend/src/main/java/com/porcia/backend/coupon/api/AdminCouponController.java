package com.porcia.backend.coupon.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/coupons")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CouponDtos.CouponResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.list(page, size), "Coupons fetched."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponDtos.CouponResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.getById(id), "Coupon fetched."));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CouponDtos.CouponResponse>> create(
            @Valid @RequestBody CouponDtos.CreateCouponRequest req) {
        return new ResponseEntity<>(ApiResponse.ok(couponService.create(req), "Coupon created."), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponDtos.CouponResponse>> update(
            @PathVariable Long id, @RequestBody CouponDtos.UpdateCouponRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(couponService.update(id, req), "Coupon updated."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        couponService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Coupon deleted."));
    }
}
