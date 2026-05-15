package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.LearningProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearningProjectRepository extends JpaRepository<LearningProject, Long> {
    Optional<LearningProject> findBySlug(String slug);
}
