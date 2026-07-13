package com.porcia.backend.cms.api;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class CmsRateLimitingInterceptor implements HandlerInterceptor {

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final int MAX_REQUESTS_PER_HOUR = 1000;
    private static final long MINUTE_IN_MS = 60 * 1000;
    private static final long HOUR_IN_MS = 60 * 60 * 1000;

    private final ConcurrentHashMap<String, RequestTracker> requestTrackers = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        
        // Only rate limit CMS write operations
        if (!isCmsWriteOperation(request.getMethod(), path)) {
            return true;
        }

        String clientId = getClientIdentifier(request);
        RequestTracker tracker = requestTrackers.computeIfAbsent(clientId, k -> new RequestTracker());

        long now = System.currentTimeMillis();
        tracker.cleanup(now);

        // Check minute limit
        if (tracker.getMinuteCount(now) >= MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429);
            response.getWriter().write("{\"error\": \"Rate limit exceeded: 60 requests per minute\"}");
            return false;
        }

        // Check hour limit
        if (tracker.getHourCount(now) >= MAX_REQUESTS_PER_HOUR) {
            response.setStatus(429);
            response.getWriter().write("{\"error\": \"Rate limit exceeded: 1000 requests per hour\"}");
            return false;
        }

        tracker.recordRequest(now);
        return true;
    }

    private boolean isCmsWriteOperation(String method, String path) {
        return path.contains("/cms/") && (method.equals("POST") || method.equals("PUT") || method.equals("DELETE"));
    }

    private String getClientIdentifier(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }

    private static class RequestTracker {
        private final ConcurrentHashMap<Long, AtomicInteger> minuteBuckets = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<Long, AtomicInteger> hourBuckets = new ConcurrentHashMap<>();

        void recordRequest(long now) {
            long minuteBucket = (now / MINUTE_IN_MS) * MINUTE_IN_MS;
            long hourBucket = (now / HOUR_IN_MS) * HOUR_IN_MS;

            minuteBuckets.computeIfAbsent(minuteBucket, k -> new AtomicInteger(0)).incrementAndGet();
            hourBuckets.computeIfAbsent(hourBucket, k -> new AtomicInteger(0)).incrementAndGet();
        }

        int getMinuteCount(long now) {
            long minuteBucket = (now / MINUTE_IN_MS) * MINUTE_IN_MS;
            AtomicInteger count = minuteBuckets.get(minuteBucket);
            return count != null ? count.get() : 0;
        }

        int getHourCount(long now) {
            long hourBucket = (now / HOUR_IN_MS) * HOUR_IN_MS;
            AtomicInteger count = hourBuckets.get(hourBucket);
            return count != null ? count.get() : 0;
        }

        void cleanup(long now) {
            long oldMinuteBucket = ((now - MINUTE_IN_MS * 2) / MINUTE_IN_MS) * MINUTE_IN_MS;
            long oldHourBucket = ((now - HOUR_IN_MS * 2) / HOUR_IN_MS) * HOUR_IN_MS;

            minuteBuckets.keySet().removeIf(bucket -> bucket < oldMinuteBucket);
            hourBuckets.keySet().removeIf(bucket -> bucket < oldHourBucket);
        }
    }
}
