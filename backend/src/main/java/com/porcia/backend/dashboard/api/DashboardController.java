package com.porcia.backend.dashboard.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/dashboard")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_ORDER_MANAGER", "ROLE_PRODUCT_MANAGER"})
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDtos.DashboardStatsResponse>> getDashboardStats() {
        var stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats, "Dashboard statistics fetched successfully."));
    }
}