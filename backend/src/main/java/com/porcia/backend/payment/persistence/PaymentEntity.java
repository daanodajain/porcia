package com.porcia.backend.payment.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import com.porcia.backend.order.persistence.OrderEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "payments")
public class PaymentEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Column(name = "payment_gateway", length = 100)
    private String paymentGateway;

    @Column(name = "gateway_transaction_id", length = 255)
    private String gatewayTransactionId;

    @Column(name = "gateway_order_id", length = 255)
    private String gatewayOrderId;

    @Column(name = "payment_reference", length = 255)
    private String paymentReference;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(length = 10, columnDefinition = "varchar(10) default 'INR'")
    private String currency;

    @Column(name = "payment_status", length = 30, columnDefinition = "varchar(30) default 'PENDING'")
    private String paymentStatus;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}