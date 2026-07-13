package com.porcia.backend.common.security;

public final class Authorities {

    private Authorities() {
    }

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";

    // permission strings (foundation)
    public static final String PERMISSION_AUTH_LOGIN = "auth:login";
    public static final String PERMISSION_AUTH_LOGOUT = "auth:logout";
    public static final String PERMISSION_ADMIN_ACCESS = "admin:access";
}

