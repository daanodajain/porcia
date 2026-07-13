package com.porcia.backend.security;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_ATTEMPTS = 5;
    private static final long WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
    private static final ConcurrentHashMap<String, RateLimitEntry> RATE_LIMIT_STORE = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        
        // Apply rate limiting only to auth endpoints
        if (path.contains("/auth/admin/login") || path.contains("/auth/customer/login")) {
            String clientIp = getClientIp(request);
            
            if (!isAllowed(clientIp)) {
                response.setStatus(429); // Too Many Requests
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Too many login attempts. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(String clientIp) {
        long now = System.currentTimeMillis();
        RateLimitEntry entry = RATE_LIMIT_STORE.computeIfAbsent(clientIp, k -> new RateLimitEntry());

        // Reset if window has passed
        if (now - entry.windowStart > WINDOW_SIZE_MS) {
            entry.attempts.set(0);
            entry.windowStart = now;
        }

        int attempts = entry.attempts.incrementAndGet();
        return attempts <= MAX_ATTEMPTS;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RateLimitEntry {
        AtomicInteger attempts = new AtomicInteger(0);
        long windowStart = System.currentTimeMillis();
    }
}
