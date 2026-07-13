package com.porcia.backend.cms.mapper;

import com.porcia.backend.cms.dto.MediaDtos;
import com.porcia.backend.cms.persistence.MediaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface MediaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fileType", ignore = true)
    @Mapping(target = "fileExtension", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    MediaEntity toEntity(MediaDtos.CreateMediaRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fileName", ignore = true)
    @Mapping(target = "originalName", ignore = true)
    @Mapping(target = "mimeType", ignore = true)
    @Mapping(target = "fileSize", ignore = true)
    @Mapping(target = "width", ignore = true)
    @Mapping(target = "height", ignore = true)
    @Mapping(target = "storagePath", ignore = true)
    @Mapping(target = "fileType", ignore = true)
    @Mapping(target = "fileExtension", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    MediaEntity toEntity(MediaDtos.UpdateMediaRequest request);

    @Mapping(target = "id", expression = "java(entity.getId() != null ? entity.getId().toString() : null)")
    @Mapping(target = "createdAt", expression = "java(formatDateTime(entity.getCreatedAt()))")
    @Mapping(target = "updatedAt", expression = "java(formatDateTime(entity.getUpdatedAt()))")
    MediaDtos.MediaResponse toResponse(MediaEntity entity);

    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
