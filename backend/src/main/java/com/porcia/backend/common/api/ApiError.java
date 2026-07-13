package com.porcia.backend.common.api;

public record ApiError(
        String code,
        String detail
) {
}

