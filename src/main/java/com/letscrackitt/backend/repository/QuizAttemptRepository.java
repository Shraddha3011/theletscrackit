package com.letscrackitt.backend.repository;

import com.letscrackitt.backend.entity.QuizAttempt;
import com.letscrackitt.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByAttemptedAtDesc(User user);
}