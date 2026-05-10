package com.letscrackitt.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.letscrackitt.backend.entity.Topic;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TopicResponse {

    private Long id;
    private String slug;
    private String title;
    private String description;
    private String icon;
    private String color;
    private Integer orderIndex;
    private Long noteCount;
    private Long quizCount;
    private LocalDateTime createdAt;

    public static TopicResponse from(Topic t, long noteCount, long quizCount) {
        return TopicResponse.builder()
                .id(t.getId())
                .slug(t.getSlug())
                .title(t.getTitle())
                .description(t.getDescription())
                .icon(t.getIcon())
                .color(t.getColor())
                .orderIndex(t.getOrderIndex())
                .noteCount(noteCount)
                .quizCount(quizCount)
                .createdAt(t.getCreatedAt())
                .build();
    }
}