package com.letscrackitt.backend.service;

import com.letscrackitt.backend.entity.Question;
import com.letscrackitt.backend.entity.Quiz;
import com.letscrackitt.backend.entity.Topic;

import com.letscrackitt.backend.repository.QuestionRepository;
import com.letscrackitt.backend.repository.QuizRepository;
import com.letscrackitt.backend.repository.TopicRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository repository;

    private final TopicRepository topicRepository;

    private final QuizRepository quizRepository;

    // EXISTING METHOD
    public List<Question> getQuestionsByQuiz(
            Quiz quiz
    ) {

        return repository.findByQuizOrderByOrderIndexAsc(
                quiz
        );
    }

    // ADD THIS METHOD
    public List<Question> getQuestionsByTopic(
            String slug
    ) {

        Topic topic =
                topicRepository.findBySlug(slug)
                        .orElseThrow();

        List<Quiz> quizzes =
                quizRepository.findByTopicId(
                        topic.getId()
                );

        if (quizzes.isEmpty()) {

            return List.of();
        }

        return repository.findByQuizOrderByOrderIndexAsc(
                quizzes.get(0)
        );
    }
}