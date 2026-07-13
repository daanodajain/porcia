package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.LookbooksDtos;
import com.porcia.backend.cms.persistence.LookbooksEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LookbooksMapper {

    @Mapping(target = "id", ignore = true)
    LookbooksEntity toEntity(LookbooksDtos.CreateLookbookRequest request);

    @Mapping(target = "id", ignore = true)
    LookbooksEntity toEntity(LookbooksDtos.UpdateLookbookRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    LookbooksDtos.LookbookResponse toResponse(LookbooksEntity entity);
}

