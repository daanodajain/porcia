package com.porcia.backend.dashboard.api;

import com.porcia.backend.order.api.OrderDtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class DashboardDtos {
    private DashboardDtos() {}

    public record DashboardStatsResponse(
            BigDecimal totalRevenue,
            Long totalOrders,
            Long totalCustomers,
            Long totalProducts,
            Long pendingOrders,
            Long lowStockProducts,
            List<OrderDtos.OrderResponse> recentOrders,
            Map<String, BigDecimal> revenueByMonth,
            Map<String, Long> ordersByStatus
    ) {}
}
