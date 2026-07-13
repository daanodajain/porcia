package com.porcia.backend.shipment.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import com.porcia.backend.order.persistence.OrderEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "shipments")
public class ShipmentEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Column(name = "courier_name", length = 150)
    private String courierName;

    @Column(name = "tracking_number", length = 255)
    private String trackingNumber;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "shipping_status", length = 50, columnDefinition = "varchar(50) default 'PENDING'")
    private String shippingStatus;
}