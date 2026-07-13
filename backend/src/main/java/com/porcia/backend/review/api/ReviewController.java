package com.porcia.backend.review.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping(ApiVersion.V1 + "/reviews")
    public ResponseEntity<ApiResponse<ReviewDtos.ReviewResponse>> submit(
            @AuthenticationPrincipal CustomerEntity customer,
            @Valid @RequestBody ReviewDtos.CreateReviewRequest req) {
        return new ResponseEntity<>(ApiResponse.ok(reviewService.submit(customer, req), "Review submitted."), HttpStatus.CREATED);
    }

    @GetMapping(ApiVersion.V1 + "/products/{productId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDtos.ReviewResponse>>> getForProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getApprovedForProduct(productId), "Reviews fetched."));
    }

    @GetMapping(ApiVersion.V1_CMS + "/reviews")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_CONTENT_MANAGER"})
    public ResponseEntity<ApiResponse<PageResponse<ReviewDtos.ReviewResponse>>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.listAll(page, size, status), "Reviews fetched."));
    }

    @PatchMapping(ApiVersion.V1_CMS + "/reviews/{id}/moderate")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_CONTENT_MANAGER"})
    public ResponseEntity<ApiResponse<ReviewDtos.ReviewResponse>> moderate(
            @PathVariable Long id, @RequestBody ModerateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.moderate(id, req.status()), "Review moderated."));
    }

    public record ModerateRequest(String status) {}
}
