package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.PagesDtos;
import com.porcia.backend.cms.persistence.PagesEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PagesMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "isDeleted", source = "isDeleted")
    PagesEntity toEntity(PagesDtos.CreatePageRequest request);

    @Mapping(target = "id", expression = "java(entity.getId() == null ? null : entity.getId().toString())")
    @Mapping(target = "isDeleted", source = "isDeleted")
    PagesDtos.PageResponse toResponse(PagesEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "isDeleted", source = "isDeleted")
    PagesEntity toEntity(PagesDtos.UpdatePageRequest request);
}
