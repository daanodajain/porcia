package com.porcia.backend.coupon.api;

import com.porcia.backend.cart.api.CartService;
import com.porcia.backend.cart.persistence.CartEntity;
import com.porcia.backend.cart.persistence.CartRepository;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.coupon.persistence.CouponEntity;
import com.porcia.backend.coupon.persistence.CouponRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;

    // ── Admin CRUD ──────────────────────────────────────────────────────────

    public PageResponse<CouponDtos.CouponResponse> list(int page, int size) {
        Page<CouponEntity> result = couponRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return new PageResponse<>(result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    public CouponDtos.CouponResponse getById(Long id) {
        return toResponse(find(id));
    }

    public CouponDtos.CouponResponse create(CouponDtos.CreateCouponRequest req) {
        CouponEntity e = new CouponEntity();
        e.setCode(req.code().toUpperCase());
        e.setDiscountType(req.discountType());
        e.setDiscountValue(req.discountValue());
        e.setMinOrderAmount(req.minOrderAmount());
        e.setMaxDiscountAmount(req.maxDiscountAmount());
        e.setUsageLimit(req.usageLimit());
        e.setExpiresAt(req.expiresAt());
        e.setDescription(req.description());
        e.setUsedCount(0);
        return toResponse(couponRepository.save(e));
    }

    public CouponDtos.CouponResponse update(Long id, CouponDtos.UpdateCouponRequest req) {
        CouponEntity e = find(id);
        if (req.discountType() != null) e.setDiscountType(req.discountType());
        if (req.discountValue() != null) e.setDiscountValue(req.discountValue());
        if (req.minOrderAmount() != null) e.setMinOrderAmount(req.minOrderAmount());
        if (req.maxDiscountAmount() != null) e.setMaxDiscountAmount(req.maxDiscountAmount());
        if (req.usageLimit() != null) e.setUsageLimit(req.usageLimit());
        if (req.expiresAt() != null) e.setExpiresAt(req.expiresAt());
        if (req.description() != null) e.setDescription(req.description());
        if (req.isActive() != null) e.setIsActive(req.isActive());
        return toResponse(couponRepository.save(e));
    }

    public void delete(Long id) {
        couponRepository.delete(find(id));
    }

    // ── Customer apply/remove ───────────────────────────────────────────────

    public CouponDtos.ApplyCouponResponse applyCoupon(CustomerEntity customer, String code) {
        CouponEntity coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new NoSuchElementException("Coupon not found: " + code));

        if (!Boolean.TRUE.equals(coupon.getIsActive()))
            throw new IllegalStateException("Coupon is not active.");
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new IllegalStateException("Coupon has expired.");
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit())
            throw new IllegalStateException("Coupon usage limit reached.");

        CartEntity cart = cartService.getOrCreateCart(customer);

        if (coupon.getMinOrderAmount() != null && cart.getSubtotal().compareTo(coupon.getMinOrderAmount()) < 0)
            throw new IllegalStateException("Order minimum not met for this coupon.");

        BigDecimal discount;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = cart.getSubtotal().multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0)
                discount = coupon.getMaxDiscountAmount();
        } else {
            discount = coupon.getDiscountValue().min(cart.getSubtotal());
        }

        cart.setCouponCode(coupon.getCode());
        cart.setDiscountAmount(discount);
        BigDecimal shipping = cart.getShippingCharge() != null ? cart.getShippingCharge() : BigDecimal.ZERO;
        cart.setGrandTotal(cart.getSubtotal().add(shipping).subtract(discount).max(BigDecimal.ZERO));
        cartRepository.save(cart);

        return new CouponDtos.ApplyCouponResponse(coupon.getCode(), coupon.getDiscountType(),
                coupon.getDiscountValue(), discount, cart.getGrandTotal());
    }

    public void removeCoupon(CustomerEntity customer) {
        CartEntity cart = cartService.getOrCreateCart(customer);
        cart.setCouponCode(null);
        cart.setDiscountAmount(BigDecimal.ZERO);
        BigDecimal shipping = cart.getShippingCharge() != null ? cart.getShippingCharge() : BigDecimal.ZERO;
        cart.setGrandTotal(cart.getSubtotal().add(shipping));
        cartRepository.save(cart);
    }

    private CouponEntity find(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Coupon not found: " + id));
    }

    private CouponDtos.CouponResponse toResponse(CouponEntity e) {
        return new CouponDtos.CouponResponse(e.getId(), e.getCode(), e.getDiscountType(),
                e.getDiscountValue(), e.getMinOrderAmount(), e.getMaxDiscountAmount(),
                e.getUsageLimit(), e.getUsedCount(), e.getExpiresAt(), e.getDescription(), e.getIsActive());
    }
}
