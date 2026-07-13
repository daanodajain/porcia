package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.FaqDtos;
import com.porcia.backend.cms.persistence.FaqEntities;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FaqMapper {

    @Mapping(target = "id", ignore = true)
    FaqEntities toEntity(FaqDtos.CreateFaqRequest request);

    @Mapping(target = "id", ignore = true)
    FaqEntities toEntity(FaqDtos.UpdateFaqRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    FaqDtos.FaqResponse toResponse(FaqEntities entity);
}

