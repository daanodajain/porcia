package com.porcia.backend.settings.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<SettingEntity, Long> {
    Optional<SettingEntity> findByKey(String key);
    List<SettingEntity> findByGroup(String group);
}
