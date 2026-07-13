package com.porcia.backend.settings.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "app_settings")
public class SettingEntity extends BaseEntity {

    @Column(name = "setting_key", nullable = false, unique = true, length = 150)
    private String key;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String value;

    @Column(name = "setting_group", length = 100)
    private String group;

    @Column(name = "is_sensitive", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isSensitive = false;

    @Column(name = "description", length = 255)
    private String description;
}
