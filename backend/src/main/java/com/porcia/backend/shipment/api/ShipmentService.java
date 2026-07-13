package com.porcia.backend.shipment.api;

import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderRepository;
import com.porcia.backend.shipment.persistence.ShipmentEntity;
import com.porcia.backend.shipment.persistence.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    public ShipmentDtos.ShipmentResponse createShipment(Long orderId, ShipmentDtos.CreateShipmentRequest request) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + orderId));

        ShipmentEntity shipment = new ShipmentEntity();
        shipment.setOrder(order);
        shipment.setCourierName(request.courierName());
        shipment.setTrackingNumber(request.trackingNumber());
        shipment.setShippingStatus("SHIPPED");
        shipment.setShippedAt(LocalDateTime.now());

        order.setOrderStatus("SHIPPED");
        orderRepository.save(order);

        return toResponse(shipmentRepository.save(shipment));
    }

    public ShipmentDtos.ShipmentResponse updateStatus(Long shipmentId, ShipmentDtos.UpdateShipmentStatusRequest request) {
        ShipmentEntity shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new NoSuchElementException("Shipment not found: " + shipmentId));

        shipment.setShippingStatus(request.status());
        if ("DELIVERED".equals(request.status())) {
            shipment.setDeliveredAt(LocalDateTime.now());
            shipment.getOrder().setOrderStatus("DELIVERED");
            orderRepository.save(shipment.getOrder());
        }

        return toResponse(shipmentRepository.save(shipment));
    }

    @Transactional(readOnly = true)
    public List<ShipmentDtos.ShipmentResponse> getShipmentsForOrder(Long orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .stream().map(this::toResponse).toList();
    }

    private ShipmentDtos.ShipmentResponse toResponse(ShipmentEntity s) {
        return new ShipmentDtos.ShipmentResponse(
                s.getId(),
                s.getOrder().getOrderNumber(),
                s.getCourierName(),
                s.getTrackingNumber(),
                s.getShippingStatus(),
                s.getShippedAt(),
                s.getDeliveredAt()
        );
    }
}
