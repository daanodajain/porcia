package com.porcia.backend.marketing.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import com.porcia.backend.security.persistence.AdminUserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "blogs")
public class BlogEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private BlogCategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private AdminUserEntity author;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "featured_image")
    private String featuredImage;

    @Column(length = 30)
    private String status = "DRAFT";

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}