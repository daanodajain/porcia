package com.porcia.backend.cms.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.cms.dto.FaqCategoriesDtos;
import com.porcia.backend.cms.dto.FaqDtos;
import com.porcia.backend.cms.persistence.FaqCategoriesRepository;
import com.porcia.backend.cms.persistence.FaqCategoryEntity;
import com.porcia.backend.cms.persistence.FaqEntities;
import com.porcia.backend.cms.persistence.FaqRepository;
import com.porcia.backend.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(ApiVersion.V1_PUBLIC + "/faqs")
@RequiredArgsConstructor
public class PublicFaqController {

    private final FaqCategoriesRepository faqCategoriesRepository;
    private final FaqRepository faqRepository;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<FaqCategoriesDtos.FaqCategoryResponse>>> getCategories() {
        List<FaqCategoriesDtos.FaqCategoryResponse> categories = faqCategoriesRepository.findAll()
                .stream()
                .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                .map(this::toCategoryResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(categories, "FAQ categories fetched."));
    }

    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<List<FaqDtos.FaqResponse>>> getFaqsByCategory(
            @PathVariable Long categoryId) {
        FaqCategoryEntity category = faqCategoriesRepository.findById(categoryId)
                .orElseThrow(() -> new NoSuchElementException("FAQ category not found: " + categoryId));
        List<FaqDtos.FaqResponse> faqs = faqRepository.findByCategoryId(category.getId())
                .stream()
                .filter(f -> Boolean.TRUE.equals(f.getIsActive()))
                .map(this::toFaqResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(faqs, "FAQs fetched."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FaqDtos.FaqResponse>>> getAllFaqs() {
        List<FaqDtos.FaqResponse> faqs = faqRepository.findAll()
                .stream()
                .filter(f -> Boolean.TRUE.equals(f.getIsActive()))
                .map(this::toFaqResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(faqs, "FAQs fetched."));
    }

    private FaqCategoriesDtos.FaqCategoryResponse toCategoryResponse(FaqCategoryEntity c) {
        return new FaqCategoriesDtos.FaqCategoryResponse(
                c.getId() != null ? c.getId().toString() : null,
                c.getName(), c.getDisplayOrder(), c.getIsActive());
    }

    private FaqDtos.FaqResponse toFaqResponse(FaqEntities f) {
        return new FaqDtos.FaqResponse(
                f.getId() != null ? f.getId().toString() : null,
                f.getCategoryId(), f.getQuestion(), f.getAnswer(),
                f.getDisplayOrder(), f.getIsActive());
    }
}
