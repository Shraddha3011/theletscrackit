package com.letscrackitt.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {

    @NotBlank(message = "Comment body is required")
    private String body;

    private Long parentId; // null = top-level comment
}