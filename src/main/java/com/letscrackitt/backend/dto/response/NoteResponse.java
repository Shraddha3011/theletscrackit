package com.letscrackitt.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.letscrackitt.backend.entity.Note;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoteResponse {

    private Long id;
    private Long topicId;
    private String topicSlug;
    private String topicTitle;
    private String title;
    private String slug;
    private String content;
    private String difficulty;
    private List<String> tags;
    private Integer xpReward;
    private Boolean isPublished;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NoteResponse from(Note n) {
        return NoteResponse.builder()
                .id(n.getId())
                .topicId(n.getTopic() != null ? n.getTopic().getId() : null)
                .topicSlug(n.getTopic() != null ? n.getTopic().getSlug() : null)
                .topicTitle(n.getTopic() != null ? n.getTopic().getTitle() : null)
                .title(n.getTitle())
                .slug(n.getSlug())
                .content(n.getContent())
                .difficulty(n.getDifficulty() != null ? n.getDifficulty().name() : null)
                .tags(parseTags(n.getTags()))
                .xpReward(n.getXpReward())
                .isPublished(n.getIsPublished())
                .viewCount(n.getViewCount())
                .createdAt(n.getCreatedAt())
                .updatedAt(n.getUpdatedAt())
                .build();
    }

    /** Summary version — omits content for list views */
    public static NoteResponse summary(Note n) {
        NoteResponse r = from(n);
        r.setContent(null);
        return r;
    }

    private static List<String> parseTags(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}