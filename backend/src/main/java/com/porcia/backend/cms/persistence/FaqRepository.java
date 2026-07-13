package com.porcia.backend.cms.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository extends JpaRepository<FaqEntities, Long> {
    List<FaqEntities> findByCategoryId(Long categoryId);
}
