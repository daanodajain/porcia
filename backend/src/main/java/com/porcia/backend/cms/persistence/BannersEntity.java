package com.porcia.backend.cms.persistence;

import com.porcia.backend.common.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "banners")
public class BannersEntity extends BaseEntity {

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "subtitle")
    private String subtitle;

    @Column(name = "image_id")
    private Long imageId;

    @Column(name = "mobile_image_id")
    private Long mobileImageId;

    @Column(name = "button_text", length = 150)
    private String buttonText;

    @Column(name = "button_link", length = 255)
    private String buttonLink;

    @Column(name = "banner_position", length = 100)
    private String bannerPosition;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "start_date")
    private java.time.Instant startDate;

    @Column(name = "end_date")
    private java.time.Instant endDate;

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

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public Long getMobileImageId() {
        return mobileImageId;
    }

    public void setMobileImageId(Long mobileImageId) {
        this.mobileImageId = mobileImageId;
    }

    public String getButtonText() {
        return buttonText;
    }

    public void setButtonText(String buttonText) {
        this.buttonText = buttonText;
    }

    public String getButtonLink() {
        return buttonLink;
    }

    public void setButtonLink(String buttonLink) {
        this.buttonLink = buttonLink;
    }

    public String getBannerPosition() {
        return bannerPosition;
    }

    public void setBannerPosition(String bannerPosition) {
        this.bannerPosition = bannerPosition;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public java.time.Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(java.time.Instant startDate) {
        this.startDate = startDate;
    }

    public java.time.Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(java.time.Instant endDate) {
        this.endDate = endDate;
    }
}
