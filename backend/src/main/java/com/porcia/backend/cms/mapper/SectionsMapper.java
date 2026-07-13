package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.SectionsDtos;
import com.porcia.backend.cms.persistence.SectionsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SectionsMapper {

    @Mapping(target = "id", ignore = true)
    SectionsEntity toEntity(SectionsDtos.CreateSectionRequest request);

    @Mapping(target = "id", ignore = true)
    SectionsEntity toEntity(SectionsDtos.UpdateSectionRequest request);

    @Mapping(target = "id", expression = "java(entity.getId() == null ? null : entity.getId().toString())")
    SectionsDtos.SectionResponse toResponse(SectionsEntity entity);
}
