package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Note;
import com.letscrackitt.backend.entity.Topic;
import com.letscrackitt.backend.entity.enums.Difficulty;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository
        extends JpaRepository<Note, Long> {

    Optional<Note> findBySlug(
            String slug
    );

    boolean existsBySlug(
            String slug
    );

    // ADD THIS
    List<Note> findByTopicId(
            Long topicId
    );

    Page<Note> findByIsPublishedTrue(
            Pageable pageable
    );

    Page<Note> findByTopicAndIsPublishedTrue(
            Topic topic,
            Pageable pageable
    );

    Page<Note> findByTopicAndDifficultyAndIsPublishedTrue(
            Topic topic,
            Difficulty difficulty,
            Pageable pageable
    );

    Page<Note> findByDifficultyAndIsPublishedTrue(
            Difficulty difficulty,
            Pageable pageable
    );

    long countByTopicAndIsPublishedTrue(
            Topic topic
    );

    @Query(
            "SELECT n FROM Note n " +
                    "WHERE n.isPublished = true AND " +
                    "(" +
                    "LOWER(n.title) LIKE LOWER(CONCAT('%', :q, '%')) " +
                    "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :q, '%'))" +
                    ")"
    )
    Page<Note> search(
            @Param("q") String q,
            Pageable pageable
    );

    @Modifying
    @Query(
            "UPDATE Note n " +
                    "SET n.viewCount = n.viewCount + 1 " +
                    "WHERE n.id = :id"
    )
    void incrementViewCount(
            @Param("id") Long id
    );
}