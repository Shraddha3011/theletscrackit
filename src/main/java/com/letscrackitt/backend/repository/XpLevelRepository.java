package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.XpLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface XpLevelRepository extends JpaRepository<XpLevel, Long> {
    List<XpLevel> findAllByOrderByMinXpAsc();
    Optional<XpLevel> findByLevelNumber(Integer levelNumber);
}
