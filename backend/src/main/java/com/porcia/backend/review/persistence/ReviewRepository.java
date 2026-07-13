package com.porcia.backend.review.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByProductIdAndStatus(Long productId, String status);
    Page<ReviewEntity> findByStatus(String status, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM ReviewEntity r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Double avgRatingByProduct(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM ReviewEntity r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Long countApprovedByProduct(@Param("productId") Long productId);
}
