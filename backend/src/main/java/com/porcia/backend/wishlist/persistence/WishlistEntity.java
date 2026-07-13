package com.porcia.backend.wishlist.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "wishlists", uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "product_id"}))
public class WishlistEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;
}
