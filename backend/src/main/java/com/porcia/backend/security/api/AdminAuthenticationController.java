package com.porcia.backend.security.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiVersion.V1 + "/auth/admin")
@RequiredArgsConstructor
public class AdminAuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(
            @Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authenticationService.authenticateAdmin(request), "Admin authenticated successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refresh(
            @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authenticationService.refreshAdminToken(request.refreshToken()), "Token refreshed."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
        authenticationService.logout(token);
        return ResponseEntity.ok(ApiResponse.ok(null, "Logged out."));
    }

    public record RefreshTokenRequest(String refreshToken) {}
}
