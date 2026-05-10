package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.HomeContentItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeContentItemRepository extends JpaRepository<HomeContentItem, Long> {
    List<HomeContentItem> findBySectionOrderByOrderIndexAsc(String section);
}
