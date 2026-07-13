package com.porcia.backend.cms.api;

import com.porcia.backend.cms.dto.MediaDtos;
import com.porcia.backend.cms.persistence.MediaEntity;
import com.porcia.backend.cms.persistence.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MediaUploadService {

    private final MediaRepository mediaRepository;

    @Value("${app.upload.dir:/opt/porcia/uploads}")
    private String uploadDir;

    @Value("${app.upload.max-size:10485760}")
    private long maxFileSize;

    private static final String[] ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"};

    public MediaDtos.UploadResponse uploadFile(MultipartFile file, String altText) throws IOException {
        validateFile(file);

        String fileName = generateFileName(file.getOriginalFilename());
        String storagePath = saveFile(file, fileName);

        MediaEntity media = new MediaEntity();
        media.setFileName(fileName);
        media.setOriginalName(file.getOriginalFilename());
        media.setMimeType(file.getContentType());
        media.setFileSize(file.getSize());
        media.setStoragePath(storagePath);
        media.setAltText(altText);
        media.setFileExtension(getFileExtension(file.getOriginalFilename()));

        // For images, extract dimensions
        if (file.getContentType() != null && file.getContentType().startsWith("image/")) {
            try {
                // In production, use image library to get dimensions
                // For now, set placeholder
                media.setWidth(1200);
                media.setHeight(800);
            } catch (Exception e) {
                // Ignore dimension extraction errors
            }
        }

        MediaEntity saved = mediaRepository.save(media);
        return toResponse(saved);
    }

    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed: " + maxFileSize);
        }

        String contentType = file.getContentType();
        boolean isAllowed = false;
        for (String allowed : ALLOWED_TYPES) {
            if (allowed.equals(contentType)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed: " + contentType);
        }
    }

    private String generateFileName(String originalName) {
        String extension = getFileExtension(originalName);
        return UUID.randomUUID().toString() + "." + extension;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "bin";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    private String saveFile(MultipartFile file, String fileName) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        return filePath.toString();
    }

    private MediaDtos.UploadResponse toResponse(MediaEntity media) {
        return new MediaDtos.UploadResponse(
                media.getId().toString(),
                media.getFileName(),
                media.getOriginalName(),
                media.getMimeType(),
                media.getFileSize(),
                media.getWidth(),
                media.getHeight(),
                media.getAltText(),
                media.getStoragePath()
        );
    }
}
