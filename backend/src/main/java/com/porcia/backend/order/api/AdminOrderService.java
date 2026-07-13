package com.porcia.backend.order.api;

import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.order.mapper.OrderMapper;
import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderRepository;
import com.porcia.backend.order.persistence.OrderStatusHistoryEntity;
import com.porcia.backend.security.persistence.AdminUserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public PageResponse<OrderDtos.OrderResponse> getAllOrders(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<OrderEntity> orderPage = orderRepository.findAll(pageRequest);

        List<OrderDtos.OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(orderMapper::toOrderResponse)
                .toList();

        return new PageResponse<>(orderResponses, orderPage.getNumber(), orderPage.getSize(), orderPage.getTotalElements(), orderPage.getTotalPages());
    }

    public OrderDtos.OrderResponse getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toOrderResponse)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + id));
    }

    @Transactional
    public OrderDtos.OrderResponse updateOrderStatus(Long orderId, OrderDtos.UpdateOrderStatusRequest request, AdminUserEntity adminUser) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));

        order.setOrderStatus(request.status());

        OrderStatusHistoryEntity historyEntry = new OrderStatusHistoryEntity();
        historyEntry.setOrder(order);
        historyEntry.setStatus(request.status());
        historyEntry.setRemarks(request.remarks());
        historyEntry.setChangedBy(adminUser);
        order.getStatusHistory().add(historyEntry);

        OrderEntity savedOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(savedOrder);
    }
}