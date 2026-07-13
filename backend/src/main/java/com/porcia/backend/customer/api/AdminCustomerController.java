package com.porcia.backend.customer.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.security.persistence.CustomerEntity;
import com.porcia.backend.security.persistence.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/customers")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
public class AdminCustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminCustomerDtos.CustomerSummary>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search) {

        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CustomerEntity> result = (search != null && !search.isBlank())
                ? customerRepository.searchCustomers(search.toLowerCase(), pr)
                : customerRepository.findAll(pr);

        PageResponse<AdminCustomerDtos.CustomerSummary> response = new PageResponse<>(
                result.getContent().stream().map(this::toSummary).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
        return ResponseEntity.ok(ApiResponse.ok(response, "Customers fetched."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminCustomerDtos.CustomerDetail>> getById(@PathVariable Long id) {
        CustomerEntity c = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(toDetail(c), "Customer fetched."));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminCustomerDtos.CustomerSummary>> toggleStatus(
            @PathVariable Long id,
            @RequestBody AdminCustomerDtos.ToggleStatusRequest req) {
        CustomerEntity c = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer not found: " + id));
        c.setIsActive(req.isActive());
        customerRepository.save(c);
        return ResponseEntity.ok(ApiResponse.ok(toSummary(c), "Customer status updated."));
    }

    private AdminCustomerDtos.CustomerSummary toSummary(CustomerEntity c) {
        return new AdminCustomerDtos.CustomerSummary(
                c.getId(), c.getFirstName(), c.getLastName(), c.getEmail(),
                c.getPhone(), c.getIsActive(), c.getCreatedAt());
    }

    private AdminCustomerDtos.CustomerDetail toDetail(CustomerEntity c) {
        return new AdminCustomerDtos.CustomerDetail(
                c.getId(), c.getFirstName(), c.getLastName(), c.getEmail(),
                c.getPhone(), c.getGender(), c.getDateOfBirth(),
                c.getIsActive(), c.getEmailVerified(), c.getPhoneVerified(), c.getCreatedAt());
    }
}
