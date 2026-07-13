package com.porcia.backend.cart.mapper;

import com.porcia.backend.cart.api.CartDtos;
import com.porcia.backend.cart.persistence.CartEntity;
import com.porcia.backend.cart.persistence.CartItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.slug", target = "productSlug")
    @Mapping(source = "product.sku", target = "productSku")
    @Mapping(target = "imageUrl", expression = "java(item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0).getUrl())")
    CartDtos.CartItemResponse toCartItemResponse(CartItemEntity item);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "items", target = "items")
    @Mapping(source = "subtotal", target = "subtotal")
    @Mapping(source = "shippingCharge", target = "shippingCharge")
    @Mapping(source = "discountAmount", target = "discountAmount")
    @Mapping(source = "grandTotal", target = "grandTotal")
    @Mapping(source = "couponCode", target = "couponCode")
    CartDtos.CartResponse toCartResponse(CartEntity cart);

}