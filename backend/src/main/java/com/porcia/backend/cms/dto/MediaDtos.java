package com.porcia.backend.cms.dto;

public class MediaDtos {
    
    public record CreateMediaRequest(
            String fileName,
            String originalName,
            String mimeType,
            long fileSize,
            Integer width,
            Integer height,
            String altText,
            String storagePath
    ) {}

    public record UpdateMediaRequest(
            String fileName,
            String altText
    ) {}
    
    public record UploadResponse(
            String id,
            String fileName,
            String originalName,
            String mimeType,
            long fileSize,
            Integer width,
            Integer height,
            String altText,
            String storagePath
    ) {}

    public record MediaResponse(
            String id,
            String fileName,
            String originalName,
            String mimeType,
            long fileSize,
            Integer width,
            Integer height,
            String altText,
            String storagePath,
            String createdAt,
            String updatedAt
    ) {}

    public record MediaDeleteResponse(
            String id,
            String message
    ) {}

    public record MediaListResponse(
            String id,
            String fileName,
            String originalName,
            String mimeType,
            long fileSize,
            String altText,
            String createdAt
    ) {}
}
