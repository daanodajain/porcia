package com.porcia.backend.product.mapper;

import com.porcia.backend.product.dto.BrandDtos;
import com.porcia.backend.product.dto.CategoryDtos;
import com.porcia.backend.product.dto.CollectionDtos;
import com.porcia.backend.product.dto.ProductDtos;
import com.porcia.backend.product.persistence.BrandRepository;
import com.porcia.backend.product.persistence.CategoryRepository;
import com.porcia.backend.product.persistence.CollectionRepository;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.product.persistence.ProductImageEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final CollectionRepository collectionRepository;

    // ─── toResponse ──────────────────────────────────────────────────────────

    public ProductDtos.ProductResponse toResponse(ProductEntity p) {
        if (p == null) return null;

        CategoryDtos.CategoryResponse category = null;
        if (p.getCategory() != null) {
            var c = p.getCategory();
            category = new CategoryDtos.CategoryResponse(
                    String.valueOf(c.getId()), c.getName(), c.getSlug(),
                    c.getDescription(), null, c.getIsActive());
        }

        BrandDtos.BrandResponse brand = null;
        if (p.getBrand() != null) {
            var b = p.getBrand();
            brand = new BrandDtos.BrandResponse(
                    String.valueOf(b.getId()), b.getName(), b.getSlug(),
                    b.getDescription(), b.getLogo(), b.getIsActive());
        }

        CollectionDtos.CollectionResponse collection = null;
        if (p.getCollection() != null) {
            var col = p.getCollection();
            collection = new CollectionDtos.CollectionResponse(
                    String.valueOf(col.getId()), col.getName(), col.getSlug(),
                    col.getDescription(), null, col.getIsActive());
        }

        // Map images
        List<ProductDtos.ImageUrlResponse> images = new ArrayList<>();
        if (p.getImages() != null) {
            p.getImages().stream()
                    .filter(img -> img.getUrl() != null && !img.getUrl().isBlank())
                    .forEach(img -> images.add(new ProductDtos.ImageUrlResponse(
                            img.getUrl(),
                            img.getAltText(),
                            null,
                            null
                    )));
        }

        return new ProductDtos.ProductResponse(
                String.valueOf(p.getId()),
                p.getName(),
                p.getSlug(),
                p.getSku(),
                p.getDescription() != null ? p.getDescription() : p.getShortDescription(),
                p.getMrp(),
                p.getSellingPrice(),
                p.getStockQuantity(),
                p.getIsActive(),
                p.getStatus(),
                p.getPublishedAt(),
                category,
                brand,
                collection,
                images
        );
    }

    // ─── toEntity (Create) ───────────────────────────────────────────────────

    public ProductEntity toEntity(ProductDtos.CreateProductRequest r) {
        ProductEntity e = new ProductEntity();
        e.setName(r.name());
        e.setSlug(r.slug());
        e.setSku(r.sku());
        e.setDescription(r.description());
        e.setMrp(r.mrp());
        e.setSellingPrice(r.sellingPrice());
        e.setStockQuantity(r.stockQuantity() != null ? r.stockQuantity() : 0);
        e.setIsActive(r.isActive() != null ? r.isActive() : true);
        e.setStatus(r.status() != null ? r.status() : "DRAFT");

        if (r.categoryId() != null)
            e.setCategory(categoryRepository.findById(r.categoryId())
                    .orElseThrow(() -> new NoSuchElementException("Category not found: " + r.categoryId())));
        if (r.brandId() != null)
            e.setBrand(brandRepository.findById(r.brandId())
                    .orElseThrow(() -> new NoSuchElementException("Brand not found: " + r.brandId())));
        if (r.collectionId() != null)
            e.setCollection(collectionRepository.findById(r.collectionId())
                    .orElseThrow(() -> new NoSuchElementException("Collection not found: " + r.collectionId())));

        // Save image URLs
        if (r.images() != null) {
            AtomicInteger order = new AtomicInteger(0);
            r.images().stream()
                    .filter(img -> img.url() != null && !img.url().isBlank())
                    .forEach(img -> {
                        ProductImageEntity imageEntity = new ProductImageEntity();
                        imageEntity.setUrl(img.url());
                        imageEntity.setAltText(img.altText() != null ? img.altText() : e.getName());
                        imageEntity.setProduct(e);
                        e.getImages().add(imageEntity);
                        order.incrementAndGet();
                    });
        }

        return e;
    }

    // ─── updateEntityFromRequest (Update) ────────────────────────────────────

    public void updateEntityFromRequest(ProductDtos.UpdateProductRequest r, ProductEntity e) {
        e.setName(r.name());
        e.setSlug(r.slug());
        e.setSku(r.sku());
        e.setDescription(r.description());
        e.setMrp(r.mrp());
        e.setSellingPrice(r.sellingPrice());
        if (r.stockQuantity() != null) e.setStockQuantity(r.stockQuantity());
        if (r.isActive() != null) e.setIsActive(r.isActive());
        if (r.status() != null) e.setStatus(r.status());

        if (r.categoryId() != null)
            e.setCategory(categoryRepository.findById(r.categoryId())
                    .orElseThrow(() -> new NoSuchElementException("Category not found: " + r.categoryId())));
        if (r.brandId() != null)
            e.setBrand(brandRepository.findById(r.brandId())
                    .orElseThrow(() -> new NoSuchElementException("Brand not found: " + r.brandId())));
        if (r.collectionId() != null)
            e.setCollection(collectionRepository.findById(r.collectionId())
                    .orElseThrow(() -> new NoSuchElementException("Collection not found: " + r.collectionId())));

        // Replace all images with new list
        if (r.images() != null) {
            e.getImages().clear();
            r.images().stream()
                    .filter(img -> img.url() != null && !img.url().isBlank())
                    .forEach(img -> {
                        ProductImageEntity imageEntity = new ProductImageEntity();
                        imageEntity.setUrl(img.url());
                        imageEntity.setAltText(img.altText() != null ? img.altText() : e.getName());
                        imageEntity.setProduct(e);
                        e.getImages().add(imageEntity);
                    });
        }
    }
}
