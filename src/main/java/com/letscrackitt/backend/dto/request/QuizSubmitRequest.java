package com.letscrackitt.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmitRequest {
    // Map of questionId -> chosen option ("A"|"B"|"C"|"D")
    @NotNull
    private Map<Long, String> answers;
}