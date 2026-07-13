package com.porcia.backend.product.api;

import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.product.dto.ProductDtos;
import com.porcia.backend.product.mapper.ProductMapper;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.product.persistence.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PageResponse<ProductDtos.ProductResponse> listProducts(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ProductEntity> productPage = productRepository.findAll(pageRequest);
        List<ProductDtos.ProductResponse> productResponses = productPage.getContent().stream()
                .map(productMapper::toResponse)
                .toList();
        return new PageResponse<>(productResponses, productPage.getNumber(), productPage.getSize(), productPage.getTotalElements(), productPage.getTotalPages());
    }

    @Transactional(readOnly = true)
    public ProductDtos.ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));
    }

    public ProductDtos.ProductResponse createProduct(ProductDtos.CreateProductRequest request) {
        ProductEntity productEntity = productMapper.toEntity(request);
        ProductEntity savedProduct = productRepository.save(productEntity);
        return productMapper.toResponse(savedProduct);
    }

    public ProductDtos.ProductResponse updateProduct(Long id, ProductDtos.UpdateProductRequest request) {
        ProductEntity existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));

        productMapper.updateEntityFromRequest(request, existingProduct);

        ProductEntity updatedProduct = productRepository.save(existingProduct);
        return productMapper.toResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + id));

        // Soft delete
        product.setIsDeleted(true);
        product.setIsActive(false);
        product.setStatus("ARCHIVED");
        productRepository.save(product);

        // Or hard delete:
        // productRepository.delete(product);
    }
}