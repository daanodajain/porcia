package com.porcia.backend.exception;

public final class ErrorCodes {

    private ErrorCodes() {
    }

    // Validation & input
    public static final String VALIDATION_FAILED = "VALIDATION_FAILED";
    public static final String BAD_REQUEST = "BAD_REQUEST";

    // Auth & access
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String ACCESS_DENIED = "ACCESS_DENIED";

    // Resource states
    public static final String NOT_FOUND = "NOT_FOUND";
    public static final String CONFLICT = "CONFLICT";

    // System
    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";

    // Feature placeholders
    public static final String AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS";
    public static final String AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED";

    // Scaffold placeholders
    public static final String NOT_IMPLEMENTED = "NOT_IMPLEMENTED";
}


