package com.porcia.backend.order.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findByCustomerId(Long customerId, Pageable pageable);
    Optional<OrderEntity> findByOrderNumberAndCustomerId(String orderNumber, Long customerId);

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE o.paymentStatus = 'PAID' OR o.orderStatus = 'DELIVERED'")
    BigDecimal findTotalRevenue();

    @EntityGraph(attributePaths = {"customer", "items", "payments"})
    List<OrderEntity> findTop5ByOrderByCreatedAtDesc();
}
