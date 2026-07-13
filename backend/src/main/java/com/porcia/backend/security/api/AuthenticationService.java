package com.porcia.backend.security.api;

import com.porcia.backend.persistence.auth.BlacklistTokenEntity;
import com.porcia.backend.persistence.auth.BlacklistTokenRepository;
import com.porcia.backend.persistence.auth.RefreshTokenEntity;
import com.porcia.backend.persistence.auth.RefreshTokenRepository;
import com.porcia.backend.security.JwtTokenProvider;
import com.porcia.backend.security.persistence.AdminUserRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import com.porcia.backend.security.persistence.CustomerRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class AuthenticationService {

    private final AdminUserRepository adminUserRepository;
    private final CustomerRepository customerRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final BlacklistTokenRepository blacklistTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserDetailsService adminUserDetailsService;
    private final UserDetailsService customerUserDetailsService;

    public AuthenticationService(
            AdminUserRepository adminUserRepository,
            CustomerRepository customerRepository,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            BlacklistTokenRepository blacklistTokenRepository,
            RefreshTokenRepository refreshTokenRepository,
            @Qualifier("adminUserDetailsService") UserDetailsService adminUserDetailsService,
            @Qualifier("customerUserDetailsService") UserDetailsService customerUserDetailsService) {
        this.adminUserRepository = adminUserRepository;
        this.customerRepository = customerRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.blacklistTokenRepository = blacklistTokenRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.adminUserDetailsService = adminUserDetailsService;
        this.customerUserDetailsService = customerUserDetailsService;
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    public AuthenticationResponse authenticateAdmin(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var user = adminUserRepository.findByEmail(request.email()).orElseThrow();
        String access = jwtTokenProvider.generateToken(user);
        String refresh = saveRefreshToken(user.getUsername(), jwtTokenProvider.getRefreshTtlSeconds());
        return new AuthenticationResponse(access, refresh);
    }

    public AuthenticationResponse refreshAdminToken(String refreshToken) {
        RefreshTokenEntity stored = refreshTokenRepository
                .findByTokenAndRevokedFalse(refreshToken)
                .orElseThrow(() -> new NoSuchElementException("Invalid or expired refresh token"));
        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new NoSuchElementException("Refresh token expired");
        }
        var user = adminUserDetailsService.loadUserByUsername(stored.getSubject());
        String newAccess = jwtTokenProvider.generateToken(user);
        return new AuthenticationResponse(newAccess, refreshToken);
    }

    // ── Customer ─────────────────────────────────────────────────────────────

    public CustomerAuthDtos.CustomerAuthResponse registerCustomer(
            CustomerAuthDtos.CustomerRegistrationRequest request) {
        if (customerRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        CustomerEntity customer = new CustomerEntity();
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setPassword(passwordEncoder.encode(request.password()));
        customerRepository.save(customer);
        String token = jwtTokenProvider.generateToken(customer);
        return new CustomerAuthDtos.CustomerAuthResponse(token);
    }

    public CustomerAuthDtos.CustomerAuthResponse authenticateCustomer(
            CustomerAuthDtos.CustomerLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var user = customerRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtTokenProvider.generateToken(user);
        return new CustomerAuthDtos.CustomerAuthResponse(token);
    }

    // ── Logout ───────────────────────────────────────────────────────────────

    public void logout(String token) {
        if (token == null || token.isBlank()) return;
        BlacklistTokenEntity bl = new BlacklistTokenEntity();
        bl.setToken(token);
        bl.setExpiresAt(LocalDateTime.now().plusDays(1));
        blacklistTokenRepository.save(bl);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String saveRefreshToken(String subject, long ttlSeconds) {
        var user = adminUserDetailsService.loadUserByUsername(subject);
        String token = jwtTokenProvider.generateToken(user, ttlSeconds);
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setSubject(subject);
        entity.setToken(token);
        entity.setExpiresAt(Instant.now().plusSeconds(ttlSeconds));
        entity.setRevoked(false);
        refreshTokenRepository.save(entity);
        return token;
    }
}
