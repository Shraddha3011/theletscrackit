package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.Question;
import com.letscrackitt.backend.entity.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByQuizOrderByOrderIndexAsc(
            Quiz quiz
    );
}