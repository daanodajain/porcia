package com.porcia.backend.order.mapper;

import com.porcia.backend.customer.mapper.CustomerMapper;
import com.porcia.backend.order.api.OrderDtos;
import com.porcia.backend.order.persistence.OrderEntity;
import com.porcia.backend.order.persistence.OrderItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CustomerMapper.class})
public interface OrderMapper {

    @Mapping(source = "product.id", target = "productId")
    OrderDtos.OrderItemResponse toOrderItemResponse(OrderItemEntity item);

    @Mapping(source = "createdAt", target = "createdAt")
    OrderDtos.OrderResponse toOrderResponse(OrderEntity order);

}