package com.letscrackitt.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TopicRequest {

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase with hyphens only")
    private String slug;

    @NotBlank(message = "Title is required")
    @Size(max = 100)
    private String title;

    private String description;
    private String icon;
    private String color;
    private Integer orderIndex = 0;
}