package com.porcia.backend.dashboard.api;

import com.porcia.backend.order.api.OrderDtos;
import com.porcia.backend.order.mapper.OrderMapper;
import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderRepository;
import com.porcia.backend.product.persistence.ProductRepository;
import com.porcia.backend.security.persistence.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    public DashboardDtos.DashboardStatsResponse getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.findTotalRevenue();
        Long totalOrders = orderRepository.count();
        Long totalCustomers = customerRepository.count();
        Long totalProducts = productRepository.count();

        // Pending orders count
        Long pendingOrders = orderRepository.findAll().stream()
                .filter(o -> "PENDING".equals(o.getOrderStatus())).count();

        // Low stock (< 5)
        Long lowStock = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() < 5
                        && Boolean.TRUE.equals(p.getIsActive())).count();

        List<OrderDtos.OrderResponse> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(orderMapper::toOrderResponse).toList();

        // Orders by status
        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        List<OrderEntity> allOrders = orderRepository.findAll();
        allOrders.forEach(o -> ordersByStatus.merge(o.getOrderStatus(), 1L, Long::sum));

        // Revenue by month (last 6 months)
        Map<String, BigDecimal> revenueByMonth = new LinkedHashMap<>();
        allOrders.stream()
                .filter(o -> ("PAID".equals(o.getPaymentStatus()) || "DELIVERED".equals(o.getOrderStatus()))
                        && o.getCreatedAt() != null)
                .forEach(o -> {
                    String month = o.getCreatedAt().getYear() + "-"
                            + String.format("%02d", o.getCreatedAt().getMonthValue());
                    revenueByMonth.merge(month,
                            o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO,
                            BigDecimal::add);
                });

        return new DashboardDtos.DashboardStatsResponse(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders, totalCustomers, totalProducts,
                pendingOrders, lowStock, recentOrders, revenueByMonth, ordersByStatus);
    }
}
