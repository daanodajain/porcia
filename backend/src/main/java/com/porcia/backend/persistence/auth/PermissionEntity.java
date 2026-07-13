package com.porcia.backend.persistence.auth;

import com.porcia.backend.persistence.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "permissions")
public class PermissionEntity extends AuditEntity {

    @Column(name = "permission_key", nullable = false, unique = true, length = 150)
    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}

