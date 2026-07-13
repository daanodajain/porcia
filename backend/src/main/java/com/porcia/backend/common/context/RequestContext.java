package com.porcia.backend.common.context;

import org.springframework.stereotype.Component;

@Component
public class RequestContext {

    private static final ThreadLocal<String> requestIdHolder = new ThreadLocal<>();
    private static final ThreadLocal<String> userIdHolder = new ThreadLocal<>();
    private static final ThreadLocal<String> userEmailHolder = new ThreadLocal<>();

    public static void setRequestId(String requestId) {
        requestIdHolder.set(requestId);
    }

    public static String getRequestId() {
        return requestIdHolder.get();
    }

    public static void setUserId(String userId) {
        userIdHolder.set(userId);
    }

    public static String getUserId() {
        return userIdHolder.get();
    }

    public static void setUserEmail(String email) {
        userEmailHolder.set(email);
    }

    public static String getUserEmail() {
        return userEmailHolder.get();
    }

    public static void clear() {
        requestIdHolder.remove();
        userIdHolder.remove();
        userEmailHolder.remove();
    }
}
