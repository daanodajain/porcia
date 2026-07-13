package com.porcia.backend.cms.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BannersRepository extends JpaRepository<BannersEntity, Long> {
    Page<BannersEntity> findByIsActiveTrueOrderByDisplayOrderAsc(Pageable pageable);
    
    @Query("SELECT b FROM BannersEntity b WHERE b.isActive = true ORDER BY b.displayOrder ASC")
    Page<BannersEntity> findAllActive(Pageable pageable);
}
