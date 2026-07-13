package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.HomeSectionsDtos;
import com.porcia.backend.cms.persistence.HomeSectionsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HomeSectionsMapper {

    @Mapping(target = "id", ignore = true)
    HomeSectionsEntity toEntity(HomeSectionsDtos.CreateHomeSectionRequest request);

    @Mapping(target = "id", ignore = true)
    HomeSectionsEntity toEntity(HomeSectionsDtos.UpdateHomeSectionRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    HomeSectionsDtos.HomeSectionResponse toResponse(HomeSectionsEntity entity);
}
