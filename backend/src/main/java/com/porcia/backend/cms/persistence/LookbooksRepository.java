package com.porcia.backend.cms.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LookbooksRepository extends JpaRepository<LookbooksEntity, Long> {
    Optional<LookbooksEntity> findBySlug(String slug);
}
