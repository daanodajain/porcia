package com.porcia.backend.admin.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public final class AdminUserDtos {
    private AdminUserDtos() {}

    public record CreateAdminUserRequest(
            @NotBlank String firstName,
            String lastName,
            @NotBlank @Email String email,
            @NotBlank String password,
            String phone,
            @NotNull Long roleId
    ) {}

    public record UpdateAdminUserRequest(
            String firstName,
            String lastName,
            String phone,
            Long roleId,
            Boolean isActive
    ) {}

    public record AdminUserResponse(
            Long id, String firstName, String lastName, String email,
            String phone, String roleName, Boolean isActive, Boolean isLocked, LocalDateTime createdAt
    ) {}

    public record RoleResponse(Long id, String name, String description) {}

    public record CreateRoleRequest(@NotBlank String name, String description) {}
}
