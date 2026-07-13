package com.porcia.backend.product.mapper;

import com.porcia.backend.product.dto.CollectionDtos;
import com.porcia.backend.product.persistence.CollectionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CollectionMapper {

    @Mapping(target = "id", ignore = true)
    CollectionEntity toEntity(CollectionDtos.CreateCollectionRequest request);

    @Mapping(target = "id", ignore = true)
    CollectionEntity toEntity(CollectionDtos.UpdateCollectionRequest request);

    @Mapping(target = "id", expression = "java(entity.getId() == null ? null : entity.getId().toString())")
    CollectionDtos.CollectionResponse toResponse(CollectionEntity entity);
}