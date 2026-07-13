package com.porcia.backend.security.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
    Optional<CustomerEntity> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT c FROM CustomerEntity c WHERE LOWER(c.email) LIKE %:q% OR LOWER(c.firstName) LIKE %:q% OR LOWER(c.phone) LIKE %:q%")
    Page<CustomerEntity> searchCustomers(@Param("q") String q, Pageable pageable);
}