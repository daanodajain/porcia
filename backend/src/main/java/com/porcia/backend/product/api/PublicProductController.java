package com.porcia.backend.product.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.product.dto.ProductDtos;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Set;

@RestController
@RequestMapping(ApiVersion.V1 + "/products")
@RequiredArgsConstructor
public class PublicProductController {

    private static final Set<String> SORTABLE_FIELDS = Set.of(
            "name", "sellingPrice", "mrp", "createdAt", "displayOrder"
    );

    private final PublicProductService publicProductService;

    /**
     * Accepts sort params in the "field,direction" form used by the shop UI
     * (e.g. "sellingPrice,desc"), falls back to a sane default, and only
     * allows sorting on whitelisted fields to avoid invalid-property errors.
     */
    private Sort parseSort(String sort) {
        Sort defaultSort = Sort.by("displayOrder").ascending().and(Sort.by("name").ascending());
        if (sort == null || sort.isBlank()) {
            return defaultSort;
        }
        String[] parts = sort.split(",");
        String field = parts[0].trim();
        if (!SORTABLE_FIELDS.contains(field)) {
            return defaultSort;
        }
        Sort.Direction direction = (parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim()))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(direction, field);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductDtos.ProductResponse>>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search
    ) {
        Sort sorting = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sorting);
        var products = publicProductService.listProducts(pageable, category, brand, minPrice, maxPrice, search);
        return ResponseEntity.ok(ApiResponse.ok(products, "Products fetched successfully."));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ProductDtos.ProductResponse>> getProductBySlug(
            @PathVariable String slug
    ) {
        var product = publicProductService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(product, "Product details fetched successfully."));
    }
}