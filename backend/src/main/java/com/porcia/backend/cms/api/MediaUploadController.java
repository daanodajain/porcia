package com.porcia.backend.cms.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.cms.dto.MediaDtos;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/media")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_CONTENT_MANAGER"})
public class MediaUploadController {

    private final MediaUploadService mediaUploadService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaDtos.UploadResponse>> uploadFile(
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam(required = false) String altText) {
        try {
            MediaDtos.UploadResponse response = mediaUploadService.uploadFile(file, altText);
            return new ResponseEntity<>(ApiResponse.ok(response, "File uploaded successfully"), HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(ApiResponse.error((com.porcia.backend.common.api.ApiError)null, "File upload failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(ApiResponse.error((com.porcia.backend.common.api.ApiError)null, e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
