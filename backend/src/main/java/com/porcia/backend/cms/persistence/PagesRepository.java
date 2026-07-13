package com.porcia.backend.cms.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PagesRepository extends JpaRepository<PagesEntity, Long> {
    Optional<PagesEntity> findBySlug(String slug);

    List<PagesEntity> findByIsActiveTrueAndIsDeletedFalseAndStatusOrderByDisplayOrderAsc(String status);
}
