package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.BannersDtos;
import com.porcia.backend.cms.persistence.BannersEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BannersMapper {

    @Mapping(target = "id", ignore = true)
    BannersEntity toEntity(BannersDtos.CreateBannerRequest request);

    @Mapping(target = "id", ignore = true)
    BannersEntity toEntity(BannersDtos.UpdateBannerRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    BannersDtos.BannerResponse toResponse(BannersEntity entity);
}
