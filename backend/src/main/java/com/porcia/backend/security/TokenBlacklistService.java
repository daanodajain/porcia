package com.porcia.backend.security;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private final ConcurrentHashMap<String, Long> blacklist = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public TokenBlacklistService() {
        // Clean up expired tokens every 5 minutes
        scheduler.scheduleAtFixedRate(this::cleanupExpiredTokens, 5, 5, TimeUnit.MINUTES);
    }

    public void blacklistToken(String token, long expirationTime) {
        long expiresAt = System.currentTimeMillis() + expirationTime;
        blacklist.put(token, expiresAt);
    }

    public boolean isBlacklisted(String token) {
        Long expiresAt = blacklist.get(token);
        if (expiresAt == null) {
            return false;
        }
        if (System.currentTimeMillis() > expiresAt) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }

    private void cleanupExpiredTokens() {
        long now = System.currentTimeMillis();
        blacklist.entrySet().removeIf(entry -> entry.getValue() < now);
    }

    public void shutdown() {
        scheduler.shutdown();
    }
}
