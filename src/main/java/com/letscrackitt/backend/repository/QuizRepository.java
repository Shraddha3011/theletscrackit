package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository
        extends JpaRepository<Quiz, Long> {

    List<Quiz> findByTopicId(
            Long topicId
    );
}