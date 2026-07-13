package com.porcia.backend.marketing.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Long> {
    Optional<BlogEntity> findBySlugAndStatus(String slug, String status);
    Page<BlogEntity> findAllByStatus(String status, Pageable pageable);
}