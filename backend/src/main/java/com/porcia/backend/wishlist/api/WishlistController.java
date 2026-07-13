package com.porcia.backend.wishlist.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.product.mapper.ProductMapper;
import com.porcia.backend.product.dto.ProductDtos;
import com.porcia.backend.security.persistence.CustomerEntity;
import com.porcia.backend.wishlist.persistence.WishlistEntity;
import com.porcia.backend.wishlist.persistence.WishlistRepository;
import com.porcia.backend.product.persistence.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(ApiVersion.V1 + "/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDtos.ProductResponse>>> getWishlist(
            @AuthenticationPrincipal CustomerEntity customer) {
        List<ProductDtos.ProductResponse> items = wishlistRepository.findByCustomerId(customer.getId())
                .stream().map(w -> productMapper.toResponse(w.getProduct())).toList();
        return ResponseEntity.ok(ApiResponse.ok(items, "Wishlist fetched."));
    }

    @PostMapping("/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> add(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable Long productId) {
        if (wishlistRepository.findByCustomerIdAndProductId(customer.getId(), productId).isPresent()) {
            return ResponseEntity.ok(ApiResponse.ok(null, "Already in wishlist."));
        }
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));
        WishlistEntity w = new WishlistEntity();
        w.setCustomer(customer);
        w.setProduct(product);
        wishlistRepository.save(w);
        return new ResponseEntity<>(ApiResponse.ok(null, "Added to wishlist."), HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> remove(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable Long productId) {
        wishlistRepository.deleteByCustomerIdAndProductId(customer.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Removed from wishlist."));
    }
}
