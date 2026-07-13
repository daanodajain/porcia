package com.porcia.backend.customer.mapper;

import com.porcia.backend.customer.api.CustomerDtos;
import com.porcia.backend.customer.persistence.CustomerAddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CustomerMapper {
    CustomerDtos.AddressResponse toAddressResponse(CustomerAddressEntity entity);
}
