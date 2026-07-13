package com.porcia.backend.customer.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.customer.mapper.CustomerMapper;
import com.porcia.backend.customer.persistence.CustomerAddressEntity;
import com.porcia.backend.customer.persistence.CustomerAddressRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import com.porcia.backend.security.persistence.CustomerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(ApiVersion.V1 + "/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerAddressRepository addressRepository;
    private final CustomerMapper customerMapper;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerDtos.ProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomerEntity customer,
            @Valid @RequestBody CustomerDtos.UpdateProfileRequest request) {
        customer.setFirstName(request.firstName());
        if (request.lastName() != null) customer.setLastName(request.lastName());
        if (request.phone() != null) customer.setPhone(request.phone());
        // password change
        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            customer.setPassword(passwordEncoder.encode(request.newPassword()));
        }
        customerRepository.save(customer);
        return ResponseEntity.ok(ApiResponse.ok(
                new CustomerDtos.ProfileResponse(customer.getId(), customer.getFirstName(),
                        customer.getLastName(), customer.getEmail(), customer.getPhone()),
                "Profile updated."));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerDtos.ProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomerEntity customer) {
        return ResponseEntity.ok(ApiResponse.ok(
                new CustomerDtos.ProfileResponse(
                        customer.getId(),
                        customer.getFirstName(),
                        customer.getLastName(),
                        customer.getEmail(),
                        customer.getPhone()
                ), "Profile fetched successfully."));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<CustomerDtos.AddressResponse>>> getAddresses(
            @AuthenticationPrincipal CustomerEntity customer) {
        List<CustomerDtos.AddressResponse> addresses = addressRepository
                .findByCustomerIdAndIsDeletedFalse(customer.getId())
                .stream()
                .map(customerMapper::toAddressResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(addresses, "Addresses fetched successfully."));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<CustomerDtos.AddressResponse>> createAddress(
            @AuthenticationPrincipal CustomerEntity customer,
            @Valid @RequestBody CustomerDtos.CreateAddressRequest request) {

        if (Boolean.TRUE.equals(request.isDefault())) {
            addressRepository.findByCustomerIdAndIsDefaultTrue(customer.getId())
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        addressRepository.save(existing);
                    });
        }

        CustomerAddressEntity address = new CustomerAddressEntity();
        address.setCustomer(customer);
        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setAddressLine1(request.addressLine1());
        address.setAddressLine2(request.addressLine2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPostalCode(request.postalCode());
        address.setCountry(request.country());
        address.setIsDefault(Boolean.TRUE.equals(request.isDefault()));
        address.setAddressType(request.addressType() != null ? request.addressType() : "SHIPPING");

        CustomerAddressEntity saved = addressRepository.save(address);
        return new ResponseEntity<>(ApiResponse.ok(customerMapper.toAddressResponse(saved), "Address created successfully."), HttpStatus.CREATED);
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<CustomerDtos.AddressResponse>> updateAddress(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable Long id,
            @Valid @RequestBody CustomerDtos.CreateAddressRequest request) {

        CustomerAddressEntity address = addressRepository.findById(id)
                .filter(a -> a.getCustomer().getId().equals(customer.getId()))
                .orElseThrow(() -> new NoSuchElementException("Address not found: " + id));

        if (Boolean.TRUE.equals(request.isDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.findByCustomerIdAndIsDefaultTrue(customer.getId())
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        addressRepository.save(existing);
                    });
        }

        address.setFullName(request.fullName());
        address.setPhone(request.phone());
        address.setAddressLine1(request.addressLine1());
        address.setAddressLine2(request.addressLine2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setPostalCode(request.postalCode());
        address.setCountry(request.country());
        address.setIsDefault(Boolean.TRUE.equals(request.isDefault()));
        address.setAddressType(request.addressType() != null ? request.addressType() : "SHIPPING");

        return ResponseEntity.ok(ApiResponse.ok(customerMapper.toAddressResponse(addressRepository.save(address)), "Address updated successfully."));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable Long id) {

        CustomerAddressEntity address = addressRepository.findById(id)
                .filter(a -> a.getCustomer().getId().equals(customer.getId()))
                .orElseThrow(() -> new NoSuchElementException("Address not found: " + id));

        address.setIsDeleted(true);
        addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok(null, "Address deleted successfully."));
    }
}
