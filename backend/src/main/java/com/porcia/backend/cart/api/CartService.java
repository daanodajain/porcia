package com.porcia.backend.cart.api;

import com.porcia.backend.cart.mapper.CartMapper;
import com.porcia.backend.cart.persistence.CartEntity;
import com.porcia.backend.cart.persistence.CartItemEntity;
import com.porcia.backend.cart.persistence.CartRepository;
import com.porcia.backend.product.persistence.ProductRepository;
import com.porcia.backend.security.persistence.CustomerEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;

    public CartDtos.CartResponse getCart(CustomerEntity customer) {
        CartEntity cart = getOrCreateCart(customer);
        return cartMapper.toCartResponse(cart);
    }

    public CartDtos.CartResponse addItem(CustomerEntity customer, CartDtos.AddItemRequest request) {
        CartEntity cart = getOrCreateCart(customer);

        // Check if item already exists in cart
        Optional<CartItemEntity> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.productId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            // Update quantity if item exists
            CartItemEntity existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.quantity());
        } else {
            // Add new item if it does not exist
            var product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new NoSuchElementException("Product not found: " + request.productId()));

            CartItemEntity newItem = new CartItemEntity();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.quantity());
            newItem.setUnitPrice(product.getSellingPrice());
            cart.getItems().add(newItem);
        }

        recalculateCart(cart);
        CartEntity savedCart = cartRepository.save(cart);
        return cartMapper.toCartResponse(savedCart);
    }

    public CartDtos.CartResponse updateItem(CustomerEntity customer, Long itemId, CartDtos.UpdateItemRequest request) {
        CartEntity cart = getOrCreateCart(customer);
        CartItemEntity itemToUpdate = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Cart item not found: " + itemId));

        itemToUpdate.setQuantity(request.quantity());
        recalculateCart(cart);
        CartEntity savedCart = cartRepository.save(cart);
        return cartMapper.toCartResponse(savedCart);
    }

    public CartDtos.CartResponse removeItem(CustomerEntity customer, Long itemId) {
        CartEntity cart = getOrCreateCart(customer);
        boolean removed = cart.getItems().removeIf(item -> item.getId() != null && item.getId().equals(itemId));
        if (!removed) {
            throw new NoSuchElementException("Cart item not found: " + itemId);
        }
        recalculateCart(cart);
        CartEntity savedCart = cartRepository.save(cart);
        return cartMapper.toCartResponse(savedCart);
    }

    public CartEntity getOrCreateCart(CustomerEntity customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer is required");
        }
        return cartRepository.findByCustomerIdAndStatus(customer.getId(), "ACTIVE")
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity();
                    newCart.setCustomer(customer);
                    newCart.setStatus("ACTIVE");
                    return cartRepository.save(newCart);
                });
    }

    private void recalculateCart(CartEntity cart) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItemEntity item : cart.getItems()) {
            if (item.getUnitPrice() == null && item.getProduct() != null) {
                item.setUnitPrice(item.getProduct().getSellingPrice());
            }
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            subtotal = subtotal.add(item.getTotalPrice());
        }
        cart.setSubtotal(subtotal);

        // TODO: Implement discount, shipping, and grand total calculation
        // For now, grand total is just the subtotal plus any hardcoded shipping.
        BigDecimal shipping = cart.getShippingCharge() != null ? cart.getShippingCharge() : BigDecimal.ZERO;
        BigDecimal discount = cart.getDiscountAmount() != null ? cart.getDiscountAmount() : BigDecimal.ZERO;

        cart.setGrandTotal(subtotal.add(shipping).subtract(discount));
    }
}