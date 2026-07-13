package com.porcia.backend.cms.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionsRepository extends JpaRepository<SectionsEntity, Long> {
    List<SectionsEntity> findByPageIdAndIsVisibleTrueAndIsDeletedFalseOrderByDisplayOrderAsc(Long pageId);
}
