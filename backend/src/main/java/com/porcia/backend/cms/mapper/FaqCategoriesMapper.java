package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.FaqCategoriesDtos;
import com.porcia.backend.cms.persistence.FaqCategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FaqCategoriesMapper {

    @Mapping(target = "id", ignore = true)
    FaqCategoryEntity toEntity(FaqCategoriesDtos.CreateFaqCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    FaqCategoryEntity toEntity(FaqCategoriesDtos.UpdateFaqCategoryRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    FaqCategoriesDtos.FaqCategoryResponse toResponse(FaqCategoryEntity entity);
}

