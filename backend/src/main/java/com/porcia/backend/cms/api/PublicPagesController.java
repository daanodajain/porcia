package com.porcia.backend.cms.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.cms.dto.PagesDtos;
import com.porcia.backend.cms.mapper.PagesMapper;
import com.porcia.backend.cms.persistence.PagesEntity;
import com.porcia.backend.cms.persistence.PagesRepository;
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
 * Public-facing endpoint for static/CMS pages (Contact Us, FAQ, Shipping,
 * Our Story, Sustainability, Careers, Press, Size Guide, etc).
 * Admin CRUD for these same pages lives at /api/v1/cms/pages via
 * CmsGenericCrudController.
 */
@RestController
@RequestMapping(ApiVersion.V1_PUBLIC + "/pages")
@RequiredArgsConstructor
public class PublicPagesController {

    private final PagesRepository pagesRepository;
    private final PagesMapper pagesMapper;

    @GetMapping(path = {"", "/"})
    public ResponseEntity<ApiResponse<List<PagesDtos.PageResponse>>> getPublishedPages() {
        try {
            List<PagesDtos.PageResponse> response = pagesRepository.findAll().stream()
                    .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                    .filter(p -> Boolean.FALSE.equals(p.getIsDeleted()))
                    .filter(p -> "PUBLISHED".equals(p.getStatus()))
                    .sorted((a, b) -> {
                        Integer ad = a.getDisplayOrder();
                        Integer bd = b.getDisplayOrder();
                        if (ad == null && bd == null) return 0;
                        if (ad == null) return 1;
                        if (bd == null) return -1;
                        return Integer.compare(ad, bd);
                    })
                    .map(pagesMapper::toResponse)
                    .toList();

            return ResponseEntity.ok(ApiResponse.ok(response, "Pages fetched successfully."));
        } catch (Exception ex) {
            System.err.println("GET /api/v1/public/pages failed: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.ok(ApiResponse.ok(List.of(), "Pages fetched successfully."));
        }
    }

    @GetMapping(path = "/{slug:.+}")
    public ResponseEntity<ApiResponse<PagesDtos.PageResponse>> getPageBySlug(@PathVariable String slug) {
        PagesEntity page = pagesRepository.findBySlug(slug)
                .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                .filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()))
                .filter(p -> "PUBLISHED".equals(p.getStatus()))
                .orElseThrow(() -> new NoSuchElementException("Page not found: " + slug));
        return ResponseEntity.ok(ApiResponse.ok(pagesMapper.toResponse(page), "Page fetched successfully."));
    }
}
