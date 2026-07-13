package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.BlogsDtos;
import com.porcia.backend.cms.persistence.BlogsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BlogsMapper {

    @Mapping(target = "id", ignore = true)
    BlogsEntity toEntity(BlogsDtos.CreateBlogRequest request);

    @Mapping(target = "id", ignore = true)
    BlogsEntity toEntity(BlogsDtos.UpdateBlogRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    @Mapping(target = "authorName", constant = "")
    @Mapping(target = "createdAt", ignore = true)
    BlogsDtos.BlogResponse toResponse(BlogsEntity entity);
}
