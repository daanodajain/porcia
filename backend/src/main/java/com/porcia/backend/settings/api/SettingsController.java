package com.porcia.backend.settings.api;

import com.porcia.backend.api.ApiVersion;
import com.porcia.backend.common.api.ApiResponse;
import com.porcia.backend.settings.persistence.SettingEntity;
import com.porcia.backend.settings.persistence.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiVersion.V1_CMS + "/settings")
@RequiredArgsConstructor
@Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
public class SettingsController {

    private final SettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SettingDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(
                settingRepository.findAll().stream().map(this::toDto).toList(), "Settings fetched."));
    }

    @GetMapping("/group/{group}")
    public ResponseEntity<ApiResponse<List<SettingDto>>> getByGroup(@PathVariable String group) {
        return ResponseEntity.ok(ApiResponse.ok(
                settingRepository.findByGroup(group).stream().map(this::toDto).toList(), "Settings fetched."));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Void>> updateBulk(@RequestBody Map<String, String> updates) {
        updates.forEach((key, value) -> {
            SettingEntity s = settingRepository.findByKey(key).orElseGet(() -> {
                SettingEntity n = new SettingEntity();
                n.setKey(key);
                n.setGroup(inferGroup(key));
                return n;
            });
            s.setValue(value);
            settingRepository.save(s);
        });
        return ResponseEntity.ok(ApiResponse.ok(null, "Settings updated."));
    }

    private String inferGroup(String key) {
        if (key.startsWith("razorpay")) return "payment";
        if (key.startsWith("store")) return "general";
        if (key.startsWith("smtp") || key.startsWith("email")) return "email";
        return "general";
    }

    private SettingDto toDto(SettingEntity s) {
        // Mask sensitive values
        String val = Boolean.TRUE.equals(s.getIsSensitive()) && s.getValue() != null
                ? "••••••••" : s.getValue();
        return new SettingDto(s.getKey(), val, s.getGroup(), s.getIsSensitive(), s.getDescription());
    }

    public record SettingDto(String key, String value, String group, Boolean isSensitive, String description) {}
}
