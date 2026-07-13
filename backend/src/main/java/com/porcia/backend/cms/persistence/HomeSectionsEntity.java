package com.porcia.backend.cms.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "home_sections")
public class HomeSectionsEntity extends BaseEntity {

    @Column(name = "section_key", nullable = false, unique = true, length = 100)
    private String sectionKey;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "subtitle")
    private String subtitle;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_visible")
    private Boolean isVisible;

    public String getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(String sectionKey) {
        this.sectionKey = sectionKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getIsVisible() {
        return isVisible;
    }

    public void setIsVisible(Boolean visible) {
        isVisible = visible;
    }
}
