package com.porcia.backend.admin.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.persistence.auth.RoleEntity;
import com.porcia.backend.persistence.auth.RoleRepository;
import com.porcia.backend.security.persistence.AdminUserEntity;
import com.porcia.backend.security.persistence.AdminUserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(ApiVersion.V1_CMS)
@RequiredArgsConstructor
@Secured({"ROLE_SUPER_ADMIN"})
public class AdminUserManagementController {

    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Admin Users ─────────────────────────────────────────────────────────

    @GetMapping("/admin-users")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserDtos.AdminUserResponse>>> listAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AdminUserEntity> result = adminUserRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(ApiResponse.ok(new PageResponse<>(
                result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()),
                "Admin users fetched."));
    }

    @GetMapping("/admin-users/{id}")
    public ResponseEntity<ApiResponse<AdminUserDtos.AdminUserResponse>> getAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(toResponse(findAdmin(id)), "Admin user fetched."));
    }

    @PostMapping("/admin-users")
    public ResponseEntity<ApiResponse<AdminUserDtos.AdminUserResponse>> createAdmin(
            @Valid @RequestBody AdminUserDtos.CreateAdminUserRequest req) {
        RoleEntity role = roleRepository.findById(req.roleId())
                .orElseThrow(() -> new NoSuchElementException("Role not found: " + req.roleId()));
        AdminUserEntity user = new AdminUserEntity();
        user.setFirstName(req.firstName());
        user.setLastName(req.lastName());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(role);
        user.setIsActive(true);
        user.setIsDeleted(false);
        return new ResponseEntity<>(ApiResponse.ok(toResponse(adminUserRepository.save(user)), "Admin user created."), HttpStatus.CREATED);
    }

    @PutMapping("/admin-users/{id}")
    public ResponseEntity<ApiResponse<AdminUserDtos.AdminUserResponse>> updateAdmin(
            @PathVariable Long id, @RequestBody AdminUserDtos.UpdateAdminUserRequest req) {
        AdminUserEntity user = findAdmin(id);
        if (req.firstName() != null) user.setFirstName(req.firstName());
        if (req.lastName() != null) user.setLastName(req.lastName());
        if (req.phone() != null) user.setPhone(req.phone());
        if (req.isActive() != null) user.setIsActive(req.isActive());
        if (req.roleId() != null) {
            RoleEntity role = roleRepository.findById(req.roleId())
                    .orElseThrow(() -> new NoSuchElementException("Role not found: " + req.roleId()));
            user.setRole(role);
        }
        return ResponseEntity.ok(ApiResponse.ok(toResponse(adminUserRepository.save(user)), "Admin user updated."));
    }

    @PatchMapping("/admin-users/{id}/lock")
    public ResponseEntity<ApiResponse<AdminUserDtos.AdminUserResponse>> toggleLock(
            @PathVariable Long id, @RequestBody LockRequest req) {
        AdminUserEntity user = findAdmin(id);
        user.setLocked(req.locked());
        return ResponseEntity.ok(ApiResponse.ok(toResponse(adminUserRepository.save(user)), "Lock status updated."));
    }

    @DeleteMapping("/admin-users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable Long id) {
        AdminUserEntity user = findAdmin(id);
        user.setIsDeleted(true);
        user.setIsActive(false);
        adminUserRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok(null, "Admin user deleted."));
    }

    // ── Roles ────────────────────────────────────────────────────────────────

    @GetMapping("/roles")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    public ResponseEntity<ApiResponse<List<AdminUserDtos.RoleResponse>>> listRoles() {
        List<AdminUserDtos.RoleResponse> roles = roleRepository.findAll().stream()
                .map(r -> new AdminUserDtos.RoleResponse(r.getId(), r.getName(), r.getDescription()))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(roles, "Roles fetched."));
    }

    @PostMapping("/roles")
    public ResponseEntity<ApiResponse<AdminUserDtos.RoleResponse>> createRole(
            @Valid @RequestBody AdminUserDtos.CreateRoleRequest req) {
        RoleEntity r = new RoleEntity();
        r.setName(req.name().toUpperCase());
        r.setDescription(req.description());
        roleRepository.save(r);
        return new ResponseEntity<>(ApiResponse.ok(
                new AdminUserDtos.RoleResponse(r.getId(), r.getName(), r.getDescription()), "Role created."), HttpStatus.CREATED);
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Role deleted."));
    }

    private AdminUserEntity findAdmin(Long id) {
        return adminUserRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Admin user not found: " + id));
    }

    private AdminUserDtos.AdminUserResponse toResponse(AdminUserEntity u) {
        return new AdminUserDtos.AdminUserResponse(u.getId(), u.getFirstName(), u.getLastName(),
                u.getEmail(), u.getPhone(), u.getRole().getName(), u.getIsActive(), u.isLocked(), u.getCreatedAt());
    }

    public record LockRequest(boolean locked) {}
}
