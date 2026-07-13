package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.TestimonialsDtos;
import com.porcia.backend.cms.persistence.TestimonialsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TestimonialsMapper {

    @Mapping(target = "id", ignore = true)
    TestimonialsEntity toEntity(TestimonialsDtos.CreateTestimonialRequest request);

    @Mapping(target = "id", ignore = true)
    TestimonialsEntity toEntity(TestimonialsDtos.UpdateTestimonialRequest request);

    @Mapping(target = "id", expression = "java(entity.getId()==null?null:entity.getId().toString())")
    TestimonialsDtos.TestimonialResponse toResponse(TestimonialsEntity entity);
}

