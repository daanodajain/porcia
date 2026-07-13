package com.porcia.backend.customer.api;

import java.time.LocalDate;
import java.time.LocalDateTime;

public final class AdminCustomerDtos {
    private AdminCustomerDtos() {}

    public record CustomerSummary(
            Long id, String firstName, String lastName,
            String email, String phone, Boolean isActive, LocalDateTime createdAt) {}

    public record CustomerDetail(
            Long id, String firstName, String lastName,
            String email, String phone, String gender, LocalDate dateOfBirth,
            Boolean isActive, Boolean emailVerified, Boolean phoneVerified, LocalDateTime createdAt) {}

    public record ToggleStatusRequest(Boolean isActive) {}
}
