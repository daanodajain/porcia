package com.porcia.backend.security;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiError;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.exception.ErrorCodes;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class PorciaAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public PorciaAuthEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        ApiError error = new ApiError(ErrorCodes.UNAUTHORIZED, "Unauthorized");
        ApiResponse<Object> apiResponse = ApiResponse.error(error, "Authentication required");

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}

