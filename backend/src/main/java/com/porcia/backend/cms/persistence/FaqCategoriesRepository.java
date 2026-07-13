package com.porcia.backend.cms.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FaqCategoriesRepository extends JpaRepository<FaqCategoryEntity, Long> {
    Optional<FaqCategoryEntity> findByName(String name);
}
