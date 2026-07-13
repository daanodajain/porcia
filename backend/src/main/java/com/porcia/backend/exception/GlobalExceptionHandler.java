package com.porcia.backend.exception;

import com.porcia.backend.common.api.ApiError;
import com.porcia.backend.common.api.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String NEWLINE_REPLACEMENT = " ";

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

        String detail = fieldErrors.stream()
                .map(fe -> sanitizeMessage(fe.getField()) + ":" + sanitizeMessage(fe.getDefaultMessage()))
                .reduce((a, b) -> a + ", " + b)
                .orElse("Validation failed");

        ApiError error = new ApiError(ErrorCodes.VALIDATION_FAILED, detail);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(error, "Request validation failed"));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolations(ConstraintViolationException ex) {
        String sanitizedMessage = sanitizeMessage(ex.getMessage());
        ApiError error = new ApiError(ErrorCodes.VALIDATION_FAILED, sanitizedMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(error, "Validation failed"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        String sanitizedMessage = sanitizeMessage(ex.getMessage());
        ApiError error = new ApiError(ErrorCodes.VALIDATION_FAILED, sanitizedMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(error, "Invalid request"));
    }

    @ExceptionHandler(org.springframework.web.servlet.NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNoHandler(org.springframework.web.servlet.NoHandlerFoundException ex) {
        ApiError error = new ApiError(ErrorCodes.NOT_FOUND, "Resource not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(error, "Not found"));
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Object>> handleNoSuchElement(java.util.NoSuchElementException ex) {
        String message = ex.getMessage() == null ? "Resource not found" : sanitizeMessage(ex.getMessage());
        ApiError error = new ApiError(ErrorCodes.NOT_FOUND, message);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(error, "Not found"));
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex) {
        ApiError error = new ApiError(ErrorCodes.CONFLICT, "Data integrity violation");
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(error, "Conflict"));
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
        ApiError error = new ApiError(ErrorCodes.ACCESS_DENIED, "Access denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(error, "Forbidden"));
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthentication(org.springframework.security.core.AuthenticationException ex) {
        ApiError error = new ApiError(ErrorCodes.UNAUTHORIZED, "Unauthorized");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error, "Unauthorized"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleUnknown(Exception ex) {
        ApiError error = new ApiError(ErrorCodes.INTERNAL_ERROR, "Unexpected error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(error, "Internal server error"));
    }

    /**
     * Sanitizes exception messages to prevent log injection attacks (CWE-117, CWE-93).
     * Removes newlines and carriage returns that could be used to inject fake log entries.
     */
    private String sanitizeMessage(String message) {
        if (message == null) {
            return "";
        }
        return message.replaceAll("[\r\n]", NEWLINE_REPLACEMENT);
    }
}
