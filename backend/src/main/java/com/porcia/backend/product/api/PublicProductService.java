package com.porcia.backend.product.api;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.product.dto.ProductDtos;
import com.porcia.backend.product.mapper.ProductMapper;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.product.persistence.ProductRepository;
import com.porcia.backend.product.persistence.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductSpecification productSpecification;

    public PageResponse<ProductDtos.ProductResponse> listProducts(
            Pageable pageable, String category, String brand, BigDecimal minPrice, BigDecimal maxPrice, String search
    ) {
        Specification<ProductEntity> spec = productSpecification.withFilters(category, brand, minPrice, maxPrice, search);
        Page<ProductEntity> productPage = productRepository.findAll(spec, pageable);

        var productResponses = productPage.getContent().stream()
                .map(productMapper::toResponse)
                .toList();

        return new PageResponse<>(productResponses, productPage.getNumber(), productPage.getSize(), productPage.getTotalElements(), productPage.getTotalPages());
    }

    public ProductDtos.ProductResponse getProductBySlug(String slug) {
        return productRepository.findBySlugAndIsActiveTrueAndIsDeletedFalse(slug)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Product not found with slug: " + slug));
    }
}