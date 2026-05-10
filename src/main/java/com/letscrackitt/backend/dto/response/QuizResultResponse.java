package com.letscrackitt.backend.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {

    private Integer score;
    private Integer total;
    private Integer xpEarned;
    private Double percentage;
    private List<QuestionResult> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResult {
        private Long questionId;
        private String questionText;
        private String chosen;
        private String correct;
        private boolean isCorrect;
        private String explanation;
    }
}