package com.porcia.backend.common.cache;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CacheManager {

    private static final long DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
    private final ConcurrentHashMap<String, CacheEntry<?>> cache = new ConcurrentHashMap<>();

    public <T> T get(String key, Class<T> type) {
        CacheEntry<?> entry = cache.get(key);
        if (entry != null && !entry.isExpired()) {
            return type.cast(entry.value);
        }
        cache.remove(key);
        return null;
    }

    public <T> void put(String key, T value) {
        put(key, value, DEFAULT_TTL_MS);
    }

    public <T> void put(String key, T value, long ttlMs) {
        cache.put(key, new CacheEntry<>(value, ttlMs));
    }

    public void invalidate(String key) {
        cache.remove(key);
    }

    public void invalidatePattern(String pattern) {
        cache.keySet().removeIf(key -> key.matches(pattern));
    }

    public void clear() {
        cache.clear();
    }

    public long size() {
        return cache.size();
    }

    private static class CacheEntry<T> {
        private final T value;
        private final long expiresAt;

        CacheEntry(T value, long ttlMs) {
            this.value = value;
            this.expiresAt = System.currentTimeMillis() + ttlMs;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}
