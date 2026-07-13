package com.porcia.backend.payment.api;

import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderRepository;
import com.porcia.backend.payment.persistence.PaymentEntity;
import com.porcia.backend.payment.persistence.PaymentRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import com.porcia.backend.security.persistence.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RazorpayWebhookIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JavaMailSender javaMailSender;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private OrderEntity testOrder;
    private PaymentEntity testPayment;

    @BeforeEach
    public void setup() {
        CustomerEntity customer = new CustomerEntity();
        customer.setFirstName("Test");
        customer.setLastName("Customer");
        customer.setEmail("test@example.com");
        customer.setPhone("+919876543210");
        customer.setPassword("hashed_password");
        customer.setIsActive(true);
        customer.setIsDeleted(false);
        customerRepository.save(customer);

        testOrder = new OrderEntity();
        testOrder.setOrderNumber("PORCIA-" + UUID.randomUUID().toString().substring(0, 10));
        testOrder.setCustomer(customer);
        testOrder.setGrandTotal(BigDecimal.valueOf(1000));
        testOrder.setCurrency("INR");
        testOrder.setPaymentStatus("PENDING");
        testOrder.setOrderStatus("PENDING");
        testOrder.setIsActive(true);
        testOrder.setIsDeleted(false);
        orderRepository.save(testOrder);

        testPayment = new PaymentEntity();
        testPayment.setOrder(testOrder);
        testPayment.setAmount(BigDecimal.valueOf(1000));
        testPayment.setCurrency("INR");
        testPayment.setPaymentGateway("RAZORPAY");
        testPayment.setPaymentStatus("PENDING");
        testPayment.setGatewayOrderId("order_test_123");
        testPayment.setIsActive(true);
        testPayment.setIsDeleted(false);
        paymentRepository.save(testPayment);
    }

    @Test
    public void testRazorpayWebhookEndpointExists() throws Exception {
        String webhookPayload = """
                {
                    "razorpay_order_id": "order_test_123",
                    "razorpay_payment_id": "pay_test_456",
                    "razorpay_signature": "test_signature"
                }
                """;

        mockMvc.perform(post("/api/v1/payments/razorpay/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .content(webhookPayload))
                .andExpect(status().isOk());
    }
}
