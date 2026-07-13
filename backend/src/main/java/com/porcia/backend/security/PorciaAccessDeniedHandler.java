package com.porcia.backend.security;

import com.porcia.backend.common.api.ApiError;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.exception.ErrorCodes;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PorciaAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public PorciaAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {

        ApiError error = new ApiError(ErrorCodes.ACCESS_DENIED, "Access denied");
        ApiResponse<Object> apiResponse = ApiResponse.error(error, "Forbidden");

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}

