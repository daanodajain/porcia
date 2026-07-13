package com.porcia.backend.customer.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddressEntity, Long> {
    List<CustomerAddressEntity> findByCustomerIdAndIsDeletedFalse(Long customerId);
    Optional<CustomerAddressEntity> findByCustomerIdAndIsDefaultTrue(Long customerId);
}
