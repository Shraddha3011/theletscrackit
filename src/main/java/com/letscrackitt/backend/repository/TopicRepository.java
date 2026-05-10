package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    Optional<Topic> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Topic> findAllByOrderByOrderIndexAsc();
}