package com.porcia.backend.order.api;

import com.porcia.backend.cart.persistence.CartEntity;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.cart.persistence.CartRepository;
import com.porcia.backend.customer.persistence.CustomerAddressRepository;
import com.porcia.backend.order.mapper.OrderMapper;
import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderItemEntity;
import com.porcia.backend.order.persistence.OrderRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import com.porcia.backend.notification.api.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CustomerAddressRepository addressRepository;
    private final OrderMapper orderMapper;
    private final EmailService emailService;

    public OrderDtos.OrderResponse createOrder(CustomerEntity customer, OrderDtos.CreateOrderRequest request) {
        CartEntity cart = cartRepository.findByCustomerIdAndStatus(customer.getId(), "ACTIVE")
                .orElseThrow(() -> new IllegalStateException("No active cart found for the customer."));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create an order from an empty cart.");
        }

        var shippingAddress = addressRepository.findById(request.shippingAddressId())
                .filter(addr -> addr.getCustomer().getId().equals(customer.getId()))
                .orElseThrow(() -> new NoSuchElementException("Shipping address not found or does not belong to the customer."));

        var billingAddress = request.billingAddressId() != null ?
                addressRepository.findById(request.billingAddressId())
                        .filter(addr -> addr.getCustomer().getId().equals(customer.getId()))
                        .orElseThrow(() -> new NoSuchElementException("Billing address not found or does not belong to the customer."))
                : shippingAddress;

        OrderEntity order = new OrderEntity();
        order.setCustomer(customer);
        order.setOrderNumber(generateOrderNumber());
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setPaymentMethod(request.paymentMethod());
        order.setCustomerNote(request.customerNote());

        // Copy financial details from cart
        order.setSubtotal(cart.getSubtotal());
        order.setShippingCharge(cart.getShippingCharge());
        order.setDiscountAmount(cart.getDiscountAmount());
        order.setGrandTotal(cart.getGrandTotal());
        order.setCouponCode(cart.getCouponCode());

        List<OrderItemEntity> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setSku(cartItem.getVariant() != null ? cartItem.getVariant().getSku() : cartItem.getProduct().getSku());
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        cart.setStatus("COMPLETED"); // Mark cart as processed
        cartRepository.save(cart);
        OrderEntity savedOrder = orderRepository.save(order);
        
        // Send order confirmation email
        try {
            emailService.sendOrderConfirmation(
                    customer.getEmail(),
                    savedOrder.getOrderNumber(),
                    customer.getFirstName()
            );
        } catch (Exception e) {
            // Log error but don't fail the order creation
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
        
        return orderMapper.toOrderResponse(savedOrder);
    }

    private String generateOrderNumber() {
        return "PORCIA-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDtos.OrderResponse> getOrderHistory(CustomerEntity customer, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<OrderEntity> orderPage = orderRepository.findByCustomerId(customer.getId(), pageRequest);

        List<OrderDtos.OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(orderMapper::toOrderResponse)
                .toList();

        return new PageResponse<>(orderResponses, orderPage.getNumber(), orderPage.getSize(), orderPage.getTotalElements(), orderPage.getTotalPages());
    }

    @Transactional(readOnly = true)
    public OrderDtos.OrderResponse getOrderByOrderNumber(CustomerEntity customer, String orderNumber) {
        OrderEntity order = orderRepository.findByOrderNumberAndCustomerId(orderNumber, customer.getId())
                .orElseThrow(() -> new NoSuchElementException("Order not found with number: " + orderNumber));
        return orderMapper.toOrderResponse(order);
    }

    public OrderDtos.CancelOrderResponse cancelOrder(CustomerEntity customer, String orderNumber) {
        OrderEntity order = orderRepository.findByOrderNumberAndCustomerId(orderNumber, customer.getId())
                .orElseThrow(() -> new NoSuchElementException("Order not found with number: " + orderNumber));

        // Only allow cancellation for PENDING or CONFIRMED orders
        if (!"PENDING".equals(order.getOrderStatus()) && !"CONFIRMED".equals(order.getOrderStatus())) {
            throw new IllegalStateException("Cannot cancel order with status: " + order.getOrderStatus());
        }

        order.setOrderStatus("CANCELLED");
        
        // If payment was made, mark as refunded
        if ("PAID".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("REFUNDED");
        }

        OrderEntity savedOrder = orderRepository.save(order);

        // Send cancellation email
        try {
            emailService.sendCancellationEmail(customer.getEmail(), orderNumber);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }

        return new OrderDtos.CancelOrderResponse(
                savedOrder.getOrderNumber(),
                savedOrder.getOrderStatus(),
                savedOrder.getPaymentStatus(),
                "Order cancelled successfully"
        );
    }
}