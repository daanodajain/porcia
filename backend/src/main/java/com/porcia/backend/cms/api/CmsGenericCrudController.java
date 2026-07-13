package com.porcia.backend.cms.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping(ApiVersion.V1)
@Tag(name = "CMS", description = "Content Management System API")
public class CmsGenericCrudController {

    private final CmsResourceRegistry registry;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public CmsGenericCrudController(
            CmsResourceRegistry registry,
            ObjectMapper objectMapper,
            Validator validator
    ) {
        this.registry = registry;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    @GetMapping("/cms/health")
    @Operation(summary = "Health check", description = "Check if CMS API is running")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "API is healthy")
    })
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("ok", "ok"));
    }

    @GetMapping("/cms/{resource}")
    @Operation(summary = "List CMS resources", description = "Get paginated list of CMS resources")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resources fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid parameters"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Resource not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<Object>>> list(
            @PathVariable @Parameter(description = "Resource type (e.g., banners, blogs, testimonials)") String resource,
            @RequestParam(defaultValue = "0") @Parameter(description = "Page number (0-indexed)") int page,
            @RequestParam(defaultValue = "20") @Parameter(description = "Page size (1-100)") int size,
            @RequestParam Map<String, String> params
    ) {
        validatePagination(page, size);
        CmsResourceRegistry.ResourceAdapter adapter = registry.adapter(CmsResource.from(resource));
        return ResponseEntity.ok(ApiResponse.ok(adapter.list(page, size), "CMS list fetched"));
    }

    @GetMapping("/cms/{resource}/{id}")
    @Operation(summary = "Get CMS resource", description = "Get a specific CMS resource by ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resource fetched successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Resource not found")
    })
    public ResponseEntity<ApiResponse<Object>> get(
            @PathVariable @Parameter(description = "Resource type") String resource,
            @PathVariable @Parameter(description = "Resource ID") Long id
    ) {
        validateId(id);
        CmsResourceRegistry.ResourceAdapter adapter = registry.adapter(CmsResource.from(resource));
        return ResponseEntity.ok(ApiResponse.ok(adapter.get(id), "CMS resource fetched"));
    }

    @PostMapping("/cms/{resource}")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @Operation(summary = "Create CMS resource", description = "Create a new CMS resource")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resource created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - insufficient permissions")
    })
    public ResponseEntity<ApiResponse<Object>> create(
            @PathVariable @Parameter(description = "Resource type") String resource,
            @RequestBody @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Resource data") JsonNode request
    ) {
        validateRequest(request);
        CmsResourceRegistry.ResourceAdapter adapter = registry.adapter(CmsResource.from(resource));
        Object body = parseAndValidate(request, adapter.createType());
        return ResponseEntity.ok(ApiResponse.ok(adapter.create(body), "CMS resource created"));
    }

    @PutMapping("/cms/{resource}/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @Operation(summary = "Update CMS resource", description = "Update an existing CMS resource")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resource updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - insufficient permissions"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Resource not found")
    })
    public ResponseEntity<ApiResponse<Object>> update(
            @PathVariable @Parameter(description = "Resource type") String resource,
            @PathVariable @Parameter(description = "Resource ID") Long id,
            @RequestBody @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated resource data") JsonNode request
    ) {
        validateId(id);
        validateRequest(request);
        CmsResourceRegistry.ResourceAdapter adapter = registry.adapter(CmsResource.from(resource));
        Object body = parseAndValidate(request, adapter.updateType());
        return ResponseEntity.ok(ApiResponse.ok(adapter.update(id, body), "CMS resource updated"));
    }

    @DeleteMapping("/cms/{resource}/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @Operation(summary = "Delete CMS resource", description = "Delete a CMS resource")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Resource deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - insufficient permissions"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Resource not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable @Parameter(description = "Resource type") String resource,
            @PathVariable @Parameter(description = "Resource ID") Long id
    ) {
        validateId(id);
        CmsResourceRegistry.ResourceAdapter adapter = registry.adapter(CmsResource.from(resource));
        adapter.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "CMS resource deleted"));
    }

    private <T> T parseAndValidate(JsonNode request, Class<T> type) {
        T body = objectMapper.convertValue(request, type);
        Set<ConstraintViolation<T>> violations = validator.validate(body);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        return body;
    }

    private void validateRequest(JsonNode request) {
        if (request == null || request.isNull()) {
            throw new IllegalArgumentException("Request body cannot be null");
        }
        if (request.isObject() && request.size() == 0) {
            throw new IllegalArgumentException("Request body cannot be empty");
        }
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID must be a positive number");
        }
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }
    }
}
