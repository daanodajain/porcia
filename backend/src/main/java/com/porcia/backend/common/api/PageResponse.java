package com.porcia.backend.common.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PageResponse<T> {
    @JsonProperty("content")
    private java.util.List<T> content;
    @JsonProperty("page_number")
    private int pageNumber;
    @JsonProperty("page_size")
    private int pageSize;
    @JsonProperty("total_elements")
    private long totalElements;
    @JsonProperty("total_pages")
    private int totalPages;
    @JsonProperty("is_last")
    private boolean isLast;
    @JsonProperty("is_first")
    private boolean isFirst;

    // Full constructor (7 args)
    public PageResponse(java.util.List<T> content, int pageNumber, int pageSize,
                        long totalElements, int totalPages, boolean isLast, boolean isFirst) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.isLast = isLast;
        this.isFirst = isFirst;
    }

    // Backward-compatible 5-arg constructor used throughout codebase
    public PageResponse(java.util.List<T> content, int pageNumber, int pageSize,
                        long totalElements, int totalPages) {
        this(content, pageNumber, pageSize, totalElements, totalPages,
                pageNumber >= totalPages - 1, pageNumber == 0);
    }

    // Factory from Spring Page
    public static <T> PageResponse<T> of(org.springframework.data.domain.Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    public java.util.List<T> getContent() { return content; }
    public int getPageNumber() { return pageNumber; }
    public int getPageSize() { return pageSize; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
    public boolean isLast() { return isLast; }
    public boolean isFirst() { return isFirst; }
}
