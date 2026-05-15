package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

    Optional<Course> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Course> findByTopicId(Long topicId);

    @Query("""
            SELECT c
            FROM Course c
            JOIN c.modules m
            WHERE c.topicId = :topicId
            """)
    List<Course> findWithModulesByTopicId(Long topicId);

    @Query(value = """
            SELECT COUNT(l.id)
            FROM lesson l
            JOIN module m ON l.module_id = m.id
            JOIN course c ON m.course_id = c.id
            WHERE c.topic_id = :topicId
            """, nativeQuery = true)
    long countLessonsByTopicId(Long topicId);

    @Query(value = """
            SELECT COUNT(m.id)
            FROM module m
            JOIN course c ON m.course_id = c.id
            WHERE c.topic_id = :topicId
            """, nativeQuery = true)
    long countModulesByTopicId(Long topicId);

    @Query("""
            SELECT c
            FROM Course c
            WHERE c.topicId = :topicId
            """)
    List<Course> findCoursesWithTopicId(Long topicId);
}