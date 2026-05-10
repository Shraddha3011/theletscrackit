package com.letscrackitt.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class NoteRequest {

    @NotNull(message = "Topic ID is required")
    private Long topicId;

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Slug is required")
    @Size(max = 200)
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase with hyphens only")
    private String slug;

    @NotBlank(message = "Content is required")
    private String content;

    private String difficulty = "BEGINNER";

    private List<String> tags;

    private Integer xpReward = 10;

    private Boolean isPublished = false;
}