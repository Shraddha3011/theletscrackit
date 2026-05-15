package com.letscrackitt.backend.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private List<BlockResponse> blocks;

    private Integer likes;

    private String topicSlug;
}