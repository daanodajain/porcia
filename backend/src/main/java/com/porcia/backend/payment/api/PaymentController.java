package com.porcia.backend.payment.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.security.persistence.CustomerEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping(ApiVersion.V1 + "/orders/{orderNumber}/payment")
    public ResponseEntity<ApiResponse<PaymentDtos.PaymentResponse>> initiatePayment(
            @AuthenticationPrincipal CustomerEntity customer,
            @PathVariable String orderNumber,
            @Valid @RequestBody PaymentDtos.InitiatePaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                paymentService.initiatePayment(customer, orderNumber, request), "Payment initiated."));
    }

    @PostMapping(ApiVersion.V1 + "/payments/razorpay/webhook")
    public ResponseEntity<Void> razorpayWebhook(@RequestBody PaymentDtos.RazorpayWebhookRequest req) {
        paymentService.handleRazorpayWebhook(
                req.razorpay_order_id(), req.razorpay_payment_id(), req.razorpay_signature());
        return ResponseEntity.ok().build();
    }

    @GetMapping(ApiVersion.V1_CMS + "/payments")
    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    public ResponseEntity<ApiResponse<PageResponse<PaymentDtos.AdminPaymentResponse>>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.listAll(page, size), "Payments fetched."));
    }
}
