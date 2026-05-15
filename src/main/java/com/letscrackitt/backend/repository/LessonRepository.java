package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LessonRepository
        extends JpaRepository<Lesson, Long> {

    Optional<Lesson> findFirstBySlug(String slug);
}