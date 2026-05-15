package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.LearningProject;
import com.letscrackitt.backend.entity.ProjectStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectStepRepository extends JpaRepository<ProjectStep, Long> {
    List<ProjectStep> findByProjectOrderByDisplayOrderAsc(LearningProject project);
}
