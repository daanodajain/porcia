package com.porcia.backend.product.mapper;

import com.porcia.backend.product.dto.BrandDtos;
import com.porcia.backend.product.persistence.BrandEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    @Mapping(target = "id", ignore = true)
    BrandEntity toEntity(BrandDtos.CreateBrandRequest request);

    @Mapping(target = "id", ignore = true)
    BrandEntity toEntity(BrandDtos.UpdateBrandRequest request);

    @Mapping(target = "id", expression = "java(entity.getId() == null ? null : entity.getId().toString())")
    BrandDtos.BrandResponse toResponse(BrandEntity entity);
}