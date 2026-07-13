package com.porcia.backend.product.persistence;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long>, JpaSpecificationExecutor<ProductEntity> {
    @EntityGraph(attributePaths = {"variants", "images", "category", "brand", "collection"})
    Optional<ProductEntity> findBySlugAndIsActiveTrueAndIsDeletedFalse(String slug);

    @EntityGraph(attributePaths = {"variants", "images", "category", "brand"})
    Optional<ProductEntity> findById(Long id);
}
