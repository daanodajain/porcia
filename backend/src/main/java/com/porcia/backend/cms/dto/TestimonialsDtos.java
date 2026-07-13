package com.porcia.backend.cms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public final class TestimonialsDtos {

    private TestimonialsDtos() {
    }

    public record CreateTestimonialRequest(
            String customerName,
            String designation,
            String company,
            String profileImage,
            Short rating,
            @NotBlank String testimonial,
            Integer displayOrder,
            Boolean isFeatured,
            Boolean isActive
    ) {
    }

    public record UpdateTestimonialRequest(
            String customerName,
            String designation,
            String company,
            String profileImage,
            Short rating,
            @NotBlank String testimonial,
            Integer displayOrder,
            Boolean isFeatured,
            Boolean isActive
    ) {
    }

    public record TestimonialResponse(
            String id,
            String customerName,
            String designation,
            String company,
            String profileImage,
            Short rating,
            String testimonial,
            Integer displayOrder,
            Boolean isFeatured,
            Boolean isActive,
            @JsonProperty("quote")
            String testimonialAlias,
            @JsonProperty("author")
            String customerNameAlias,
            @JsonProperty("role")
            String designationAlias,
            @JsonProperty("image")
            String profileImageAlias
    ) {
        public TestimonialResponse(String id, String customerName, String designation, String company,
                                   String profileImage, Short rating, String testimonial, Integer displayOrder,
                                   Boolean isFeatured, Boolean isActive) {
            this(id, customerName, designation, company, profileImage, rating, testimonial, displayOrder,
                    isFeatured, isActive, testimonial, customerName, designation, profileImage);
        }
    }
}
