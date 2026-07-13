package com.porcia.backend.common.circuit;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class CircuitBreaker {

    private static final int FAILURE_THRESHOLD = 5;
    private static final long TIMEOUT_MS = 60000;

    private final ConcurrentHashMap<String, CircuitState> states = new ConcurrentHashMap<>();

    public <T> T execute(String key, CircuitBreakerTask<T> task) throws Exception {
        CircuitState state = states.computeIfAbsent(key, k -> new CircuitState());

        if (state.isOpen()) {
            if (state.shouldAttemptReset()) {
                state.setHalfOpen();
            } else {
                throw new CircuitBreakerOpenException("Circuit breaker is open for: " + key);
            }
        }

        try {
            T result = task.execute();
            state.recordSuccess();
            return result;
        } catch (Exception e) {
            state.recordFailure();
            if (state.getFailureCount() >= FAILURE_THRESHOLD) {
                state.setOpen();
            }
            throw e;
        }
    }

    public void reset(String key) {
        states.remove(key);
    }

    @FunctionalInterface
    public interface CircuitBreakerTask<T> {
        T execute() throws Exception;
    }

    private static class CircuitState {
        private volatile String status = "CLOSED";
        private final AtomicInteger failureCount = new AtomicInteger(0);
        private final AtomicLong lastFailureTime = new AtomicLong(0);

        boolean isOpen() {
            return "OPEN".equals(status);
        }

        boolean shouldAttemptReset() {
            return System.currentTimeMillis() - lastFailureTime.get() > TIMEOUT_MS;
        }

        void setOpen() {
            status = "OPEN";
            lastFailureTime.set(System.currentTimeMillis());
        }

        void setHalfOpen() {
            status = "HALF_OPEN";
        }

        void recordSuccess() {
            status = "CLOSED";
            failureCount.set(0);
        }

        void recordFailure() {
            failureCount.incrementAndGet();
            lastFailureTime.set(System.currentTimeMillis());
        }

        int getFailureCount() {
            return failureCount.get();
        }
    }
}

class CircuitBreakerOpenException extends RuntimeException {
    public CircuitBreakerOpenException(String message) {
        super(message);
    }
}
