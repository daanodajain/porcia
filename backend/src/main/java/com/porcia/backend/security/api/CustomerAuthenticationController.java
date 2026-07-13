package com.porcia.backend.security.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiVersion.V1 + "/auth/customer")
@RequiredArgsConstructor
public class CustomerAuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CustomerAuthDtos.CustomerAuthResponse>> register(
            @Valid @RequestBody CustomerAuthDtos.CustomerRegistrationRequest request
    ) {
        return new ResponseEntity<>(ApiResponse.ok(
                authenticationService.registerCustomer(request), "Customer registered successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<CustomerAuthDtos.CustomerAuthResponse>> login(
            @Valid @RequestBody CustomerAuthDtos.CustomerLoginRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(authenticationService.authenticateCustomer(request), "Customer authenticated successfully"));
    }
}