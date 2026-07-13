package com.porcia.backend.product.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import com.porcia.backend.security.persistence.AdminUserEntity;
import com.porcia.backend.product.persistence.BrandEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "products")
public class ProductEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private BrandEntity brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private CollectionEntity collection;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(length = 100)
    private String barcode;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "mrp", nullable = false, precision = 12, scale = 2)
    private BigDecimal mrp;

    @Column(name = "selling_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "cost_price", precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "tax_percentage", precision = 5, scale = 2)
    private BigDecimal taxPercentage;

    @Column(name = "stock_quantity", columnDefinition = "INTEGER DEFAULT 0")
    private Integer stockQuantity;

    @Column(name = "min_stock")
    private Integer minStock;

    @Column(name = "max_order_quantity")
    private Integer maxOrderQuantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal weight;

    @Column(precision = 10, scale = 2)
    private BigDecimal length;

    @Column(precision = 10, scale = 2)
    private BigDecimal width;

    @Column(precision = 10, scale = 2)
    private BigDecimal height;

    @Column(length = 150)
    private String material;

    @Column(length = 150)
    private String fabric;

    @Column(length = 100)
    private String fit;

    @Column(length = 100)
    private String sleeve;

    @Column(length = 100)
    private String neck;

    @Column(length = 100)
    private String pattern;

    @Column(length = 100)
    private String occasion;

    @Column(name = "country_of_origin", length = 150)
    private String countryOfOrigin;

    @Column(name = "hsn_code", length = 50)
    private String hsnCode;

    @Column(name = "gst_code", length = 50)
    private String gstCode;

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "seo_keywords", columnDefinition = "TEXT")
    private String seoKeywords;

    @Column(name = "is_featured", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isFeatured;

    @Column(name = "is_best_seller", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBestSeller;

    @Column(name = "is_new_arrival", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isNewArrival;

    @Column(name = "is_trending", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isTrending;

    @Column(name = "is_sale", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isSale;

    @Column(name = "is_recommended", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRecommended;

    @Column(name = "is_luxury", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isLuxury;

    @Column(name = "is_returnable", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isReturnable;

    @Column(name = "is_exchangeable", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isExchangeable;

    @Column(name = "is_cod_available", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isCodAvailable;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "total_views")
    private Long totalViews;

    @Column(name = "total_sales")
    private Long totalSales;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantEntity> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImageEntity> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private AdminUserEntity createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private AdminUserEntity updatedBy;

}