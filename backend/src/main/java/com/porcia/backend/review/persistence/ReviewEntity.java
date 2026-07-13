package com.porcia.backend.review.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "reviews")
public class ReviewEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(length = 30, columnDefinition = "varchar(30) default 'PENDING'")
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
}
