package com.letscrackitt.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.letscrackitt.backend.entity.Quiz;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuizResponse {

    private Long id;

    private Long topicId;

    private String topicSlug;

    private String question;

    private String optionA;

    private String optionB;

    private String optionC;

    private String optionD;

    private String correctAnswer;

    private String explanation;

    private String difficulty;

    private Integer xpReward;

    private LocalDateTime createdAt;

    public static QuizResponse from(
            Quiz q
    ) {

        return QuizResponse.builder()

                .id(q.getId())

                .topicId(
                        q.getTopic() != null
                                ? q.getTopic().getId()
                                : null
                )

                .topicSlug(
                        q.getTopic() != null
                                ? q.getTopic().getSlug()
                                : null
                )

                .question(q.getQuestion())

                .optionA(q.getOptionA())

                .optionB(q.getOptionB())

                .optionC(q.getOptionC())

                .optionD(q.getOptionD())

                .correctAnswer(q.getCorrectAnswer())

                .explanation(q.getExplanation())

                .difficulty(
                        q.getDifficulty() != null
                                ? q.getDifficulty().name()
                                : "BEGINNER"
                )

                .xpReward(q.getXpReward())

                .createdAt(q.getCreatedAt())

                .build();
    }
}