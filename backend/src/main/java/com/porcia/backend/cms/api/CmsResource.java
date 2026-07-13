package com.porcia.backend.cms.api;

import java.util.Locale;

public enum CmsResource {
    pages,
    sections,
    banners,
    home_sections,
    faqs,
    testimonials,
    blogs,
    media,
    lookbooks,
    faq_categories,
    products,
    categories,
    brands,
    collections;

    public static CmsResource from(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("CMS resource name cannot be null or empty");
        }
        // Convert hyphens to underscores for enum matching (frontend uses hyphens, enum uses underscores)
        String normalized = raw.toLowerCase(Locale.ROOT).replace("-", "_");
        try {
            return CmsResource.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown CMS resource: " + raw);
        }
    }
}
