package com.porcia.backend.cms.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.cms.dto.SectionsDtos;
import com.porcia.backend.cms.mapper.SectionsMapper;
import com.porcia.backend.cms.persistence.PagesEntity;
import com.porcia.backend.cms.persistence.PagesRepository;
import com.porcia.backend.cms.persistence.SectionsEntity;
import com.porcia.backend.cms.persistence.SectionsRepository;
import com.porcia.backend.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Public read-only endpoint that lets the website render the custom
 * sections (sec1, sec2, sec3...) an admin builds for any page - including
 * the homepage, whose page row has slug "home".
 */
@RestController
@RequestMapping(ApiVersion.V1_PUBLIC + "/pages")
@RequiredArgsConstructor
public class PublicPageSectionsController {

    private final PagesRepository pagesRepository;
    private final SectionsRepository sectionsRepository;
    private final SectionsMapper sectionsMapper;

    @GetMapping("/{slug}/sections")
    public ResponseEntity<ApiResponse<List<SectionsDtos.SectionResponse>>> getSectionsForPage(@PathVariable String slug) {
        PagesEntity page = pagesRepository.findBySlug(slug)
                .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                .orElseThrow(() -> new NoSuchElementException("Page not found: " + slug));

        List<SectionsEntity> sections = sectionsRepository
                .findByPageIdAndIsVisibleTrueAndIsDeletedFalseOrderByDisplayOrderAsc(page.getId());

        List<SectionsDtos.SectionResponse> response = sections.stream()
                .map(sectionsMapper::toResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.ok(response, "Sections fetched successfully."));
    }
}
