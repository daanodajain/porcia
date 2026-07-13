package com.porcia.backend.product.persistence;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProductSpecification {

    public Specification<ProductEntity> withFilters(
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String searchTerm
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("isDeleted"), false),
                    criteriaBuilder.isNull(root.get("isDeleted"))
            ));
            predicates.add(criteriaBuilder.equal(root.get("isActive"), true));
            predicates.add(criteriaBuilder.equal(root.get("status"), "PUBLISHED"));

            if (categorySlug != null && !categorySlug.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("slug"), categorySlug));
            }

            if (brandSlug != null && !brandSlug.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("slug"), brandSlug));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            // Simple search on name and description
            if (searchTerm != null && !searchTerm.isEmpty()) {
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + searchTerm.toLowerCase() + "%");
                Predicate descriptionLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + searchTerm.toLowerCase() + "%");
                predicates.add(criteriaBuilder.or(nameLike, descriptionLike));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}