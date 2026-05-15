package com.letscrackitt.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonCardResponse {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private String taskTitle;

    private String taskBrief;

    private String projectConnection;
}
