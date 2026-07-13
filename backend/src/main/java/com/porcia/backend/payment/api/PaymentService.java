package com.porcia.backend.payment.api;

import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderRepository;
import com.porcia.backend.payment.persistence.PaymentEntity;
import com.porcia.backend.payment.persistence.PaymentRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    public PaymentDtos.PaymentResponse initiatePayment(CustomerEntity customer, String orderNumber,
                                                        PaymentDtos.InitiatePaymentRequest request) {
        OrderEntity order = orderRepository.findByOrderNumberAndCustomerId(orderNumber, customer.getId())
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + orderNumber));

        if (!"PENDING".equals(order.getPaymentStatus()))
            throw new IllegalStateException("Payment for this order has already been processed.");

        PaymentEntity payment = new PaymentEntity();
        payment.setOrder(order);
        payment.setAmount(order.getGrandTotal());
        payment.setCurrency(order.getCurrency() != null ? order.getCurrency() : "INR");
        payment.setPaymentGateway(request.paymentMethod());
        payment.setPaymentStatus("PENDING");

        // For Razorpay: store the razorpay_order_id returned from Razorpay API
        // In production you'd call Razorpay Orders API here and store the gateway_order_id
        if ("RAZORPAY".equalsIgnoreCase(request.paymentMethod()) && request.gatewayOrderId() != null) {
            payment.setGatewayOrderId(request.gatewayOrderId());
        }

        paymentRepository.save(payment);
        order.setPaymentMethod(request.paymentMethod());
        orderRepository.save(order);

        return new PaymentDtos.PaymentResponse(order.getOrderNumber(), payment.getPaymentStatus(),
                payment.getAmount(), razorpayKeyId, payment.getGatewayOrderId());
    }

    public void handleRazorpayWebhook(String razorpayOrderId, String razorpayPaymentId,
                                       String razorpaySignature) {
        // Verify signature: HMAC-SHA256 of "razorpay_order_id|razorpay_payment_id"
        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        boolean valid = verifySignature(payload, razorpaySignature, razorpayKeySecret);

        paymentRepository.findByGatewayOrderId(razorpayOrderId).ifPresent(payment -> {
            if (valid) {
                payment.setPaymentStatus("PAID");
                payment.setGatewayTransactionId(razorpayPaymentId);
                payment.setPaidAt(LocalDateTime.now());
                payment.getOrder().setPaymentStatus("PAID");
                payment.getOrder().setOrderStatus("CONFIRMED");
                orderRepository.save(payment.getOrder());
            } else {
                payment.setPaymentStatus("FAILED");
                payment.getOrder().setPaymentStatus("FAILED");
                orderRepository.save(payment.getOrder());
            }
            paymentRepository.save(payment);
        });
    }

    public void handleCodPayment(String orderNumber) {
        orderRepository.findAll().stream()
                .filter(o -> o.getOrderNumber().equals(orderNumber))
                .findFirst()
                .ifPresent(order -> {
                    order.setPaymentStatus("COD_PENDING");
                    order.setOrderStatus("CONFIRMED");
                    orderRepository.save(order);
                });
    }

    private boolean verifySignature(String payload, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = HexFormat.of().formatHex(hash);
            return computed.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    // Admin: list all payments
    public com.porcia.backend.common.api.PageResponse<PaymentDtos.AdminPaymentResponse> listAll(int page, int size) {
        var pr = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        var result = paymentRepository.findAll(pr);
        return new com.porcia.backend.common.api.PageResponse<>(
                result.getContent().stream().map(p -> new PaymentDtos.AdminPaymentResponse(
                        p.getId(), p.getOrder().getOrderNumber(), p.getPaymentGateway(),
                        p.getGatewayTransactionId(), p.getAmount(), p.getCurrency(),
                        p.getPaymentStatus(), p.getPaidAt(), p.getCreatedAt())).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }
}
