package com.letscrackitt.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class QuizRequest {

    private Long noteId;

    @NotNull(message = "Topic ID is required")
    private Long topicId;

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private Integer xpReward = 20;
    private Integer timeLimit = 300;

    private List<QuestionRequest> questions;

    @Data
    public static class QuestionRequest {
        @NotBlank
        private String questionText;
        @NotBlank private String optionA;
        @NotBlank private String optionB;
        private String optionC;
        private String optionD;
        @NotBlank
        @Pattern(regexp = "^[ABCD]$", message = "Correct option must be A, B, C or D")
        private String correctOption;
        private String explanation;
        private Integer orderIndex = 0;
    }
}