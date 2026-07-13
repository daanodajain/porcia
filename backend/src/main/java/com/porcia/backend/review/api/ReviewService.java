package com.porcia.backend.review.api;

import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.product.persistence.ProductRepository;
import com.porcia.backend.review.persistence.ReviewEntity;
import com.porcia.backend.review.persistence.ReviewRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewDtos.ReviewResponse submit(CustomerEntity customer, ReviewDtos.CreateReviewRequest req) {
        ProductEntity product = productRepository.findById(req.productId())
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + req.productId()));
        ReviewEntity r = new ReviewEntity();
        r.setProduct(product);
        r.setCustomer(customer);
        r.setRating(req.rating());
        r.setComment(req.comment());
        r.setStatus("PENDING");
        return toResponse(reviewRepository.save(r));
    }

    @Transactional(readOnly = true)
    public List<ReviewDtos.ReviewResponse> getApprovedForProduct(Long productId) {
        return reviewRepository.findByProductIdAndStatus(productId, "APPROVED")
                .stream().map(this::toResponse).toList();
    }

    // Admin
    @Transactional(readOnly = true)
    public PageResponse<ReviewDtos.ReviewResponse> listAll(int page, int size, String status) {
        Page<ReviewEntity> result = status != null
                ? reviewRepository.findByStatus(status, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                : reviewRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return new PageResponse<>(result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    public ReviewDtos.ReviewResponse moderate(Long id, String status) {
        ReviewEntity r = reviewRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Review not found: " + id));
        r.setStatus(status);
        reviewRepository.save(r);
        // Recalculate product rating
        if ("APPROVED".equals(status) || "REJECTED".equals(status)) {
            recalcProductRating(r.getProduct().getId());
        }
        return toResponse(r);
    }

    private void recalcProductRating(Long productId) {
        Double avg = reviewRepository.avgRatingByProduct(productId);
        Long count = reviewRepository.countApprovedByProduct(productId);
        productRepository.findById(productId).ifPresent(p -> {
            p.setAverageRating(avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : null);
            p.setTotalReviews(count != null ? count.intValue() : 0);
            productRepository.save(p);
        });
    }

    private ReviewDtos.ReviewResponse toResponse(ReviewEntity r) {
        String name = r.getCustomer().getFirstName() + " " +
                (r.getCustomer().getLastName() != null ? r.getCustomer().getLastName() : "");
        return new ReviewDtos.ReviewResponse(r.getId(), r.getProduct().getId(),
                name.trim(), r.getRating(), r.getComment(), r.getStatus(), r.getCreatedAt());
    }
}
