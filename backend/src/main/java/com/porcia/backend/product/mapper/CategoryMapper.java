package com.porcia.backend.product.mapper;

import com.porcia.backend.product.dto.CategoryDtos;
import com.porcia.backend.product.persistence.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    CategoryEntity toEntity(CategoryDtos.CreateCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    CategoryEntity toEntity(CategoryDtos.UpdateCategoryRequest request);

    @Mapping(target = "id", expression = "java(entity.getId() == null ? null : entity.getId().toString())")
    CategoryDtos.CategoryResponse toResponse(CategoryEntity entity);
}