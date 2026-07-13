package com.porcia.backend.common.api;

/**
 * Small helper to standardize ApiResponse creation.
 */
public final class ResponseFactory {

    private ResponseFactory() {
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return ApiResponse.ok(data, message);
    }

    public static <T> ApiResponse<T> ok(String message) {
        return ApiResponse.ok(null, message);
    }

    public static ApiResponse<Object> error(ApiError error, String message) {
        return ApiResponse.error(error, message);
    }
}

