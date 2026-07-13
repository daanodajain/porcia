package com.porcia.backend.marketing.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.common.api.PageResponse;
import com.porcia.backend.marketing.dto.BlogDtos;
import com.porcia.backend.marketing.persistence.BlogEntity;
import com.porcia.backend.marketing.persistence.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping(ApiVersion.V1 + "/journal")
@RequiredArgsConstructor
public class PublicBlogController {

    private final BlogRepository blogRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BlogDtos.BlogListResponse>>> listPublishedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Page<BlogEntity> blogPage = blogRepository.findAllByStatus(
                "PUBLISHED", PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt")));

        PageResponse<BlogDtos.BlogListResponse> response = new PageResponse<>(
                blogPage.getContent().stream().map(this::toListResponse).toList(),
                blogPage.getNumber(), blogPage.getSize(),
                blogPage.getTotalElements(), blogPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.ok(response, "Journal entries fetched successfully."));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<BlogDtos.BlogResponse>> getBlogBySlug(@PathVariable String slug) {
        BlogEntity blog = blogRepository.findBySlugAndStatus(slug, "PUBLISHED")
                .orElseThrow(() -> new NoSuchElementException("Blog post not found: " + slug));
        return ResponseEntity.ok(ApiResponse.ok(toResponse(blog), "Journal entry fetched successfully."));
    }

    private BlogDtos.BlogListResponse toListResponse(BlogEntity b) {
        return new BlogDtos.BlogListResponse(
                b.getId(), b.getTitle(), b.getSlug(), b.getShortDescription(),
                b.getFeaturedImage(), b.getStatus(),
                b.getCategory() != null ? b.getCategory().getName() : null,
                b.getPublishedAt());
    }

    private BlogDtos.BlogResponse toResponse(BlogEntity b) {
        return new BlogDtos.BlogResponse(
                b.getId(), b.getTitle(), b.getSlug(), b.getShortDescription(),
                b.getContent(), b.getFeaturedImage(), b.getStatus(),
                b.getCategory() != null ? b.getCategory().getName() : null,
                b.getPublishedAt(), b.getCreatedAt());
    }
}
